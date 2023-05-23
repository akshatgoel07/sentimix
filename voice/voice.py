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

# Initialize speech recognition library
r = sr.Recognizer()

# Start recording audio
with sr.Microphone() as source:
    print("Speak now...")
    audio = r.listen(source)

# Get the original sampling rate of the audio recording
sr_orig = audio.sample_rate

# Convert audio to numpy array
audio_data = np.frombuffer(audio.frame_data, dtype=np.int16)

# Resample audio to 16kHz
audio_data_resampled = librosa.resample(audio_data, sr_orig, 16000)

# Save resampled audio to a file
sf.write('myideo.mp3', audio_data_resampled, 16000)

# Load audio file and extract features
audio, sr = librosa.load('myideo.mp3', sr=16000, mono=True)
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
