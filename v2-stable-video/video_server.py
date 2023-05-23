from flask import Flask, request,jsonify
from flask_cors import CORS
import os
import base64
import json
from datetime import datetime
import subprocess
import mimetypes
import cv2
import numpy as np
from keras.models import load_model

model = load_model('./models/model.h5')
app = Flask(__name__)
CORS(app)
users = []
@app.route("/")
def hello():
	return "Hello Geeks!! from Google Colab"

@app.route('/upload', methods=['POST'])
def upload():
    video_file = request.files.get('video')
    if video_file:
        video_filename = video_file.filename
        video_save_path = os.path.join('uploads', video_filename)
        video_file.save(video_save_path) 

        audio_save_path = os.path.join('uploads', os.path.splitext(video_filename)[0] + '.mp3')
        subprocess.call(['ffmpeg', '-i', video_save_path, '-vn', '-acodec', 'libmp3lame', '-y', audio_save_path])
        
        return emotion(video_save_path)
def emotion(video_save_path):
    emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
    face_cascade = cv2.CascadeClassifier('./models/haarcascade_frontalface_default.xml') 
    detected_emotions = [] 
    cap =cv2.VideoCapture(video_save_path) 
    while True: 
        ret, frame = cap.read()
        if not ret:
            break 
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) 
        faces = face_cascade.detectMultiScale(gray, 1.3, 5) 
        for (x, y, w, h) in faces:
            roi_gray = gray[y:y+h, x:x+w]
            roi_gray = cv2.resize(roi_gray, (64, 64))
            roi_gray = roi_gray / 255.0
            roi_gray = np.reshape(roi_gray, (1, 64, 64, 1))
            predictions = model.predict(roi_gray)
            emotion_label = emotion_labels[np.argmax(predictions)]
            detected_emotions.append(emotion_label) 
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
            cv2.putText(frame, emotion_label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2) 
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break 
    cap.release()
    cv2.destroyAllWindows() 
    if len(detected_emotions) > 0:
        most_frequent_emotion = max(set(detected_emotions), key=detected_emotions.count) 
        print("emotions",most_frequent_emotion)
        
        # Update JSON file with detected emotion
        now = datetime.now()
        date = now.strftime("%d")
        month = now.strftime("%m")
        if len(detected_emotions) > 0:
                    most_frequent_emotion = max(set(detected_emotions), key=detected_emotions.count) 
                    print("emotions",most_frequent_emotion)

                    # Update JSON file with detected emotion
                    now = datetime.now()
                    date = now.strftime("%d")
                    month = now.strftime("%m")
                    with open('users.json', 'r+') as f:
                        data = json.load(f)
                        for user in data:
                            if user['name'] == 'Dhairya Marwah':
                                for mood in user['moods']:
                                    if mood['date'] == date and mood.get('month', '') == month:
                                        mood['mood'] = most_frequent_emotion
                                        f.seek(0)
                                        json.dump(data, f, indent=4)
                                        f.truncate()
                                        return jsonify({'emotions': most_frequent_emotion})
                                user['moods'].insert(0, {'mood': most_frequent_emotion, 'date': date, 'month': month})

                                f.seek(0)
                                json.dump(data, f, indent=4)
                                f.truncate()
                                return jsonify({'emotions': most_frequent_emotion})

                    return jsonify({'error': 'User not found'})

    else: 
        return jsonify({'emotions': "No faces detected in the video."})
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
face_cascade = cv2.CascadeClassifier('./models/haarcascade_frontalface_default.xml')
faceProto = "./models/opencv_face_detector.pbtxt"
faceModel = "./models/opencv_face_detector_uint8.pb"
ageProto = "./models/age_deploy.prototxt"
ageModel = "./models/age_net.caffemodel"
genderProto = "./models/gender_deploy.prototxt"
genderModel = "./models/gender_net.caffemodel"
MODEL_MEAN_VALUES = (78.4263377603, 87.7689143744, 114.895847746)
ageList = ['(0-2)', '(4-6)', '(8-12)', '(15-20)', '(25-32)', '(38-43)', '(48-53)', '(60-100)']
genderList = ['Male', 'Female']
padding = 50
faceNet = cv2.dnn.readNet(faceModel, faceProto)
ageNet = cv2.dnn.readNet(ageModel, ageProto)
genderNet = cv2.dnn.readNet(genderModel, genderProto)
@app.route('/demo', methods=['POST'])
def classify():
    data_url = request.json.get('photo')
    img_data = base64.b64decode(data_url[22:])
    img_np = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    emotion_label = "Neutral"  # set initial value to "Unknown"
    for (x, y, w, h) in faces:
        roi_gray = gray[y:y + h, x:x + w]
        roi_gray = cv2.resize(roi_gray, (64, 64))
        roi_gray = roi_gray / 255.0
        roi_gray = np.reshape(roi_gray, (1, 64, 64, 1))
        predictions = model.predict(roi_gray)
        emotion_label = emotion_labels[np.argmax(predictions)]
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(img, emotion_label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
        faceBoxes = highlightFace(faceNet, img)
        for faceBox in faceBoxes:
            face = img[max(0, faceBox[1] - padding):min(faceBox[3] + padding, img.shape[0] - 1),
                   max(0, faceBox[0] - padding):min(faceBox[2] + padding, img.shape[1] - 1)]
            blob = cv2.dnn.blobFromImage(face, 1.0, (227, 227), MODEL_MEAN_VALUES, swapRB=False)
            genderNet.setInput(blob)
            genderPreds = genderNet.forward()
            gender = genderList[genderPreds[0].argmax()]
            ageNet.setInput(blob)
            agePreds = ageNet.forward()
            age = ageList[agePreds[0].argmax()]
            print("Predicted age: " + age)
            print("Predicted gender: " + gender)
            print("Predicted emotion: " + emotion_label)

    retval, buffer = cv2.imencode('.jpg', img)
    img_base64 = base64.b64encode(buffer).decode('ascii')
    return jsonify({'image': f'data:image/jpg;base64,{img_base64}', 'emotions': emotion_label})

def highlightFace(net, frame, conf_threshold=0.9):
    frameOpencvDnn = frame.copy()
    frameHeight = frameOpencvDnn.shape[0]
    frameWidth = frameOpencvDnn.shape[1]
    blob = cv2.dnn.blobFromImage(frameOpencvDnn, 1.0, (300, 300), [104, 117, 123], True, False)

    net.setInput(blob)
    detections = net.forward()
    faceBoxes = []
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > conf_threshold:
            x1 = int(detections[0, 0, i, 3] * frameWidth)
            y1 = int(detections[0, 0, i, 4] * frameHeight)
            x2 = int(detections[0, 0, i, 5] * frameWidth)
            y2 = int(detections[0, 0, i, 6] * frameHeight)
            faceBoxes.append([x1, y1, x2, y2])
    return faceBoxes
@app.route('/users', methods=['GET'])
def get_users():
    users_file_path = 'users.json'
    with open(users_file_path, 'r') as f:
        users_data = json.load(f)
    return jsonify(users_data)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
