import librosa
import soundfile
import numpy as np
import tensorflow as tf

# Load the audio file using librosa
audio_path = "audio.mp3"
x , sr = librosa.load(audio_path, sr=22050)

# Extract audio features using librosa
mfccs = librosa.feature.mfcc(y=x, sr=sr, n_mfcc=40)
mfccs_processed = np.mean(mfccs.T,axis=0)

# Reshape the features to match the input shape of the model
mfccs_processed = np.expand_dims(mfccs_processed, axis=0)
mfccs_processed = np.expand_dims(mfccs_processed, axis=-1)
mfccs_processed = np.reshape(mfccs_processed, (1, mfccs_processed.shape[1], mfccs_processed.shape[2]))



# Load the pre-trained speech emotion recognition model
model = tf.keras.models.load_model("modal.h5")

# Make a prediction on the audio file
emotion = np.argmax(model.predict(mfccs_processed), axis=1)


# Print the predicted emotion
if emotion == 0:
    print("The audio expresses the emotion of neutral.")
elif emotion == 1:
    print("The audio expresses the emotion of calm.")
elif emotion == 2:
    print("The audio expresses the emotion of happy.")
elif emotion == 3:
    print("The audio expresses the emotion of sad.")
elif emotion == 4:
    print("The audio expresses the emotion of angry.")
elif emotion == 5:
    print("The audio expresses the emotion of fearful.")
elif emotion == 6:
    print("The audio expresses the emotion of disgust.")
elif emotion == 7:
    print("The audio expresses the emotion of surprised.")
