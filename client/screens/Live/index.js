import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  TouchableOpacity,
} from "react-native";
import { Camera } from "expo-camera";
import { FaceDetector } from "expo-face-detector";
import axios from "axios";
import WebSocket from "react-native-websocket";
import Svg, { Rect } from "react-native-svg";
import { Text as TextSvg } from "react-native-svg";
import { log } from "@tensorflow/tfjs";

const { width, height } = Dimensions.get("window");

export default function Live() {
  const [hasPermission, setHasPermission] = useState(null);
  const [emotion, setEmotion] = useState("");
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [faceBounds, setFaceBounds] = useState(null);
  const cameraRef = useRef(null);
  const [faceDetected, setFaceDetected] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleFacesDetected = (event) => {
    const { faces } = event;
    if (faces.length > 0) {
      const boundsArray = faces.map((face) => face.bounds);
      setFaceBounds(boundsArray);
      setFaceDetected(true);
      sendFrameToBackend(event);
    }
  };
  useEffect(() => {
    let timer;
    if (faceDetected) {
      timer = setInterval(() => {
        sendFrameToBackend();
      }, 100);
    }
    return () => clearInterval(timer);
  }, [faceDetected, type]);

  const [processingPhoto, setProcessingPhoto] = useState(false);

  const sendFrameToBackend = async (event) => {
    if (cameraRef.current && !processingPhoto) {
      setProcessingPhoto(true);

      try {
        let photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: true,
        });
        let base64Img = `data:image/jpg;base64,${photo.base64}`;
        const response = await fetch("http://172.20.10.2:5000/demo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ photo: base64Img }),
        });

        const result = await response.text();
        const data = JSON.parse(result);
        console.log(data?.emotions);
        setEmotion(data?.emotions);
      } catch (error) {
        console.error(error);
      } finally {
        setProcessingPhoto(false);
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const toggleCameraType = () => {
    setType(
      type === Camera.Constants.Type.front
        ? Camera.Constants.Type.back
        : Camera.Constants.Type.front
    );
  };
  return (
    <>
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          type={type}
          onFacesDetected={handleFacesDetected}
          ref={cameraRef}
        >
          <View style={styles.overlay}>
          <Svg style={styles.svg}>
  {faceBounds?.map((face, index) => (
    <React.Fragment key={index}>
      <Rect
        x={face.origin.x}
        y={face.origin.y}
        width={face.size.width}
        height={face.size.height}
        stroke="red"
        strokeWidth="2"
        fill="none"
      />
      <Text
        // x={face.origin.x + 10}
        // y={face.origin.y + face.size.height + 320}
        style={styles.emotionText}
      >
        {emotion}
      </Text>
    </React.Fragment>
  ))}
</Svg>
          </View>
        </Camera>
        <View>
          <TouchableOpacity onPress={toggleCameraType}  style={styles.buttonStyle}>
            <Text style={styles.describeCardText}>Toggle Camera</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: "#3498db",
    padding: 10,
    bottom: 120,
    position: "absolute",
    left: "35%",
    borderRadius: 5,
    marginBottom: 10,
  },
  describeCardText: {
    fontSize: 15,
    marginLeft: 10, 
    margin: 0,
    marginLeft: "auto",
    marginRight: "auto", 
    wordWrap: "wrap",
    color: "#fff",
    fontFamily: "RedHatBold",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
  },
  svg: {
    position: "relative",
    top: 0,
    left: 0,
    width,
    height,
  },
  emotionText: {
    fontSize: 60,
    top: 170,
    position: 'absolute',
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    zIndex: 1,
  },
});
