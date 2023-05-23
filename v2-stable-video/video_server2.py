from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import subprocess
import cv2
import numpy as np
from keras.models import load_model

app = Flask(__name__)
CORS(app)

model = load_model('./models/model.h5')
face_cascade = cv2.CascadeClassifier('./models/haarcascade_frontalface_default.xml')
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

@app.route('/')
def hello():
    return 'Hello Geeks!! from Google Colab'

@app.route('/upload', methods=['POST'])
def upload():
    video_file = request.files.get('video')
    if video_file is None:
        return jsonify({'error': 'No video file uploaded.'}), 400
    
    video_filename = video_file.filename
    video_save_path = os.path.join('uploads', video_filename)
    video_file.save(video_save_path) 

    audio_save_path = os.path.join('uploads', os.path.splitext(video_filename)[0] + '.mp3')
    try:
        subprocess.check_output(['ffmpeg', '-i', video_save_path, '-vn', '-acodec', 'libmp3lame', audio_save_path], stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        return jsonify({'error': 'Failed to extract audio from the video.'}), 500

    return emotion(video_save_path)

def emotion(video_save_path):
    detected_emotions = []
    cap = cv2.VideoCapture(video_save_path)
    if not cap.isOpened():
        return jsonify({'error': 'Failed to open video file.'}), 500

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

    if len(detected_emotions) == 0:
        return jsonify({'error': 'No faces detected in the video.'}), 400

    most_frequent_emotion = max(set(detected_emotions), key=detected_emotions.count)
    return jsonify({'emotions': most_frequent_emotion})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
