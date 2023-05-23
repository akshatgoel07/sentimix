from flask import Flask, jsonify, request
import cv2
import numpy as np
from keras.models import load_model

app = Flask(__name__)

# Load pre-trained facial expression recognition model
model = load_model('./models/model.h5')

# Define emotion labels
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# Load age and gender prediction models
faceProto = "./models/opencv_face_detector.pbtxt"
faceModel = "./models/opencv_face_detector_uint8.pb"
ageProto = "./models/age_deploy.prototxt"
ageModel = "./models/age_net.caffemodel"
genderProto = "./models/gender_deploy.prototxt"
genderModel = "./models/gender_net.caffemodel"

MODEL_MEAN_VALUES = (78.4263377603, 87.7689143744, 114.895847746)
ageList = ['(0-2)', '(4-6)', '(8-12)', '(15-20)', '(25-32)', '(38-43)', '(48-53)', '(60-100)']
genderList = ['Male', 'Female']
padding = 20
faceNet = cv2.dnn.readNet(faceModel, faceProto)
ageNet = cv2.dnn.readNet(ageModel, ageProto)
genderNet = cv2.dnn.readNet(genderModel, genderProto)

@app.route('/demo', methods=['POST'])
def predict():
    # Get the image file from the POST request
    file = request.files['image']

    # Read image as numpy array
    npimg = np.fromfile(file, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    # Convert image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Detect faces using Haar Cascade classifier
    face_cascade = cv2.CascadeClassifier('./models/haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    # Loop over all detected faces
    results = []
    for (x, y, w, h) in faces:
        # Extract face region of interest (ROI)
        roi_gray = gray[y:y + h, x:x + w]

        # Resize ROI to match input size of the model
        roi_gray = cv2.resize(roi_gray, (64, 64))

        # Normalize pixel values to be in range [0, 1]
        roi_gray = roi_gray / 255.0

        # Reshape ROI to match input shape of the model
        roi_gray = np.reshape(roi_gray, (1, 64, 64, 1))

        # Make prediction using the model
        predictions = model.predict(roi_gray)

        # Get the emotion label with highest predicted probability
        emotion_label = emotion_labels[np.argmax(predictions)]

        # Age and gender prediction
        face = img[max(0, y - padding):min(y + h + padding, img.shape[0] - 1), 
                   max(0, x - padding):min(x + w + padding, img.shape[1] - 1)]
        blob = cv2.dnn.blobFromImage(face, 1.0, (227, 227), MODEL_MEAN_VALUES, swapRB=False)
        genderNet.setInput(blob)
        genderPreds = genderNet.forward()
        gender = genderList[genderPreds[0].argmax()]
        ageNet.setInput(blob)
        agePreds = ageNet.forward()
        age = ageList[agePreds[0].argmax()]
        print(f'Emotion: {emotion_label}, Gender: {gender}')
if __name__ == '__main__':
    app.run(debug=True)