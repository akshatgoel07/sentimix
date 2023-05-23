import cv2
import numpy as np
from keras.models import load_model 
model = load_model('model.h5') 
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'] 
cap = cv2.VideoCapture(0) 
while True: 
    ret, frame = cap.read() 
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) 
    face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, 1.3, 5) 
    for (x,y,w,h) in faces: 
        roi_gray = gray[y:y+h, x:x+w] 
        roi_gray = cv2.resize(roi_gray, (64, 64)) 
        roi_gray = roi_gray / 255.0 
        roi_gray = np.reshape(roi_gray, (1, 64, 64, 1))  
        predictions = model.predict(roi_gray) 
        emotion_label = emotion_labels[np.argmax(predictions)] 
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        cv2.putText(frame, emotion_label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    cv2.imshow('frame', frame)

    # Exit if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the camera capture and close all windows
cap.release()
cv2.destroyAllWindows()
