import speech_recognition as sr
import librosa
import soundfile as sf
import numpy as np
from tensorflow.keras.models import load_model

# Load pre-trained speech emotion recognition model
model_path = 'Emotion_Voice_Detection_Model.h5'
model = load_model(model_path)

# Define emotion labels
emotion_labels = ['Angry', 'Neutral', 'Happy', 'Sad']

# Read audio file
audio_file = 'myaudio.mp3'
audio, sr = librosa.load(audio_file, sr=16000, mono=True)

# Extract features from audio
mfccs = librosa.feature.mfcc(audio, sr=sr, n_mfcc=40)
mfccs_scaled = np.mean(mfccs.T, axis=0)

# Reshape features to match input shape of the model
mfccs_scaled = np.reshape(mfccs_scaled, (1, 40, 1))

# Make prediction using the model
predictions = model.predict(mfccs_scaled)

# Get the emotion label with highest predicted probability
emotion_label = emotion_labels[np.argmax(predictions)]

# Print the predicted emotion label in the terminal
print('Emotion:', emotion_label)
