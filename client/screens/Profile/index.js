import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import Button from "../../components/Button";
const Profile = () => {
  const [hasPermission, sethasPermission] = useState(null);
  const [image, setimage] = useState(null);
  const [type, settype] = useState(Camera.Constants.Type.front);
  const [flash, setflash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      sethasPermission(cameraStatus.status === "granted");
    })();
  }, []);
  if (hasPermission === false) {
    return (
      <View>
        <Text>No access to camera</Text>
      </View>
    );
  }
  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync({});
        setimage(data.uri);
        MediaLibrary.saveToLibraryAsync(data.uri);
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("No camera ref");
    }
  }; 
  const handleUsePhoto = async () => {
    // console.log("Sending request");
    const formData = new FormData();
    formData.append("file", {
      uri: image,
      type: "image/jpeg",
      name: "image.jpg",
    });
    try {
      // console.log("Sending request");
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }); 
      const responseData = await response.json();
      console.log(responseData?.emotions); 
    } catch (error) {
      console.error(error);
    }
    setimage(null);
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {!image ? (
        <Camera
          style={styles.camera}
          pictureSize="1080x1080"
          type={type}
          flashMode={flash}
          ref={cameraRef} 
        ></Camera>
      ) : (
        <Image source={{ uri: image }} style={{ flex: 1 }} />
      )}
      <View
        style={{
          position: "absolute",
          bottom: 50,
          width: "100%",
        }}
      >
        {image ? (
          <View
            style={{
              flexDirection: "column",
              gap: 10,
              paddingHorizontal: 20,
            }}
          >
            <Button
              title="Recapture"
              icon="retweet"
              color="#fff"
              onPress={() => setimage(null)}
            />
            <Button
              title="Use this photo"
              icon="check"
              color="#fff"
              onPress={handleUsePhoto}
            />
          </View>
        ) : (
          <Button
            title="Capture"
            icon="camera"
            color="#fff"
            onPress={takePicture}
          />
        )}
      </View>
    </View>
  );
};

export default Profile;
const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
});
