import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RNCamera } from 'react-native-camera';
import * as faceapi from 'face-api.js';

// Load the Face-API.js models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]);

export default function App() {
  const [results, setResults] = useState(null);
  const cameraRef = useRef(null);

  // Detect emotions in the video stream from the camera
  const detectEmotions = async (faces) => {
    const detectionOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 512 });
    const video = cameraRef.current.getCameraStream();
    const detections = await faceapi.detectAllFaces(video, detectionOptions).withExpressions();
    setResults(detections);
  };
  

  // Process each frame of the video stream from the camera
  const processFrame = async ({ width, height, base64 }) => {
    const image = await faceapi.fetchImage(`data:image/jpg;base64,${base64}`);
    const faces = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions());
    detectEmotions(faces);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        ref={cameraRef}
        type={RNCamera.Constants.Type.front}
        captureAudio={false}
        onFacesDetected={({ faces }) => {
          detectEmotions(faces);
        }}
        onGoogleVisionBarcodesDetected={() => {}}
        onTextRecognized={() => {}}
        onPictureTaken={() => {}}
        onRecordingStart={() => {}}
        onRecordingEnd={() => {}}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />
      {results && (
        <View style={styles.results}>
          {results.map((result, i) => (
            <View key={i} style={styles.result}>
              <Text style={styles.label}>Face {i + 1}</Text>
              <Text style={styles.label}>Expression: {result.expressions.asSortedArray()[0].expression}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  results: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  result: {
    marginBottom: 10,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
