import cv2
import numpy as np
from keras.models import load_model

# Load pre-trained facial expression recognition model
model = load_model('emotion_model.h5')

# Define emotion labels
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# Load input image
img_path = 'trial.jpg'
img = cv2.imread(img_path)

# Crop the image to the nearest 1x1 pixel
img = img[0:img.shape[0]//2*2, 0:img.shape[1]//2*2]

# Convert image to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Detect faces using Haar Cascade classifier
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
faces = face_cascade.detectMultiScale(gray, 1.3, 5)

# Loop over all detected faces
for (x,y,w,h) in faces:
    # Extract face region of interest (ROI)
    roi_gray = gray[y:y+h, x:x+w]

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

    # Print the predicted emotion label in the terminal
    print('Emotion:', emotion_label)

    # Draw a rectangle around the detected face and label with predicted emotion
    cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 2)
    cv2.putText(img, emotion_label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

# Display the resulting image
cv2.imshow('image', img)
cv2.waitKey(0)
cv2.destroyAllWindows()
