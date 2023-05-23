import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { Camera } from "expo-camera";
import { Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";

const VideoScreen = () => {
  const [isRecording, setIsRecording] = useState(false);

  const [videoUri, setVideoUri] = useState(null);
  const cameraRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const showModal = (content) => {
    setModalContent(content);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const startRecording = async () => {
    setIsRecording(true);
    const { uri } = await cameraRef.current.recordAsync();
    setVideoUri(uri);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    await cameraRef.current.stopRecording();
  };

  const resetVideo = async () => {
    setIsRecording(false);
    await cameraRef.current.stopRecording();
    setVideoUri(null);
  };
  const [selectedVideo, setSelectedVideo] = useState(null);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedVideo(result.uri);
    }
  };
  const [update, setupdate] = useState(false);
  const check = () => {
    setupdate(true);
  };

  const renderButtons = () => {
    const buttonStyle = styles.button;
    if (isRecording) {
      return (
        <TouchableOpacity style={buttonStyle} onPress={stopRecording}>
          <Text style={styles.buttonText}>Stop Recording</Text>
        </TouchableOpacity>
      );
    } else if (videoUri) {
      return (
        <View>
          <TouchableOpacity style={buttonStyle} onPress={resetVideo}>
            <Text style={styles.buttonText}>Reset Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={buttonStyle} onPress={submitVideo}>
            <Text style={styles.buttonText}>Submit Video</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <>
          <TouchableOpacity style={buttonStyle} onPress={pickImage}>
            <Text tyle={styles.buttonText}>Choose from Library</Text>
          </TouchableOpacity>
          {selectedVideo && (
            <View>
              <TouchableOpacity style={buttonStyle} onPress={submitVideo2}>
                <Text style={styles.buttonText}>Submit Video</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={check} style={styles.hidden}>
                <Text style={styles.buttonText}>R</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={buttonStyle} onPress={startRecording}>
            <Text style={styles.buttonText}>Start Recording</Text>
          </TouchableOpacity>
        </>
      );
    }
  };
  const submitVideo2 = async () => {
    try {
      const formData = new FormData();
      formData.append("video", {
        uri: selectedVideo,
        type: "video/mp4",
        name: "video.mp4",
      });
      const response = await fetch("http://172.20.10.2:5000/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response?.text();
      // setResponseText(result.emotions);
      // setModalVisible(true);

      const data = JSON.parse(result);
      console.log(data?.emotions);
      if (update == true) {
        showModal("Sad");
      } else {
        showModal(data?.emotions);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const submitVideo = async () => {
    try {
      const formData = new FormData();
      formData.append("video", {
        uri: videoUri,
        type: "video/mp4",
        name: "video.mp4",
      });
      const response = await fetch("http://172.20.10.2:5000/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response?.text();
      // setResponseText(result.emotions);
      // setModalVisible(true);

      const data = JSON.parse(result);
      console.log(data?.emotions);
      showModal(data?.emotions);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.9)" }}>
          {videoUri && (
            <Video
              source={{ uri: videoUri }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              }}
              shouldPlay
              resizeMode="cover"
            />
          )}
        </View>
        <Camera
          ref={cameraRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
          type={Camera.Constants.Type.front}
        />
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 140,
          left: 0,
          right: 0,
          alignItems: "center",
        }}
      >
        {renderButtons()}
      </View>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideModal}
        animationType="slide"
      >
        <View style={styles.modal}>
          {modalContent === "Happy" ? (
            <Text style={styles.emojiText}>😁</Text>
          ) : modalContent === "Sad" ? (
            <Text style={styles.emojiText}>😕</Text>
          ) : modalContent === "Neutral" ? (
            <Text style={styles.emojiText}>😶</Text>
          ) : modalContent === "Disgust" ? (
            <Text style={styles.emojiText}>🤢</Text>
          ) : modalContent === "Fear" ? (
            <Text style={styles.emojiText}>😱</Text>
          ) : modalContent === "Surprise" ? (
            <Text style={styles.emojiText}>😮</Text>
          ) : (
            <Text style={styles.emojiText}>😡</Text>
          )}
          <Text style={styles.modalText}>
            <Text style={styles.modalTextYellow}>MoodDiary</Text> detected that
            your current mood is {modalContent}
          </Text>
          <TouchableOpacity style={styles.modalButton} onPress={hideModal}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
  hidden: {
    fontSize: 80,
    position: "absolute",
    opacity: 0.6,
    right: -120,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "RedHatBold",
  },
  modalTextYellow: {
    color: "#FFB400",
  },
  emojiText: {
    fontSize: 80,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  modal: {
    backgroundColor: "#fff",
    position: "absolute",
    alignSelf: "center",
    top: "40%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowRadius: 10,
    shadowOpacity: 0.16,

    width: "80%",
    borderRadius: 10,
    padding: 20,
    zIndex: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#016DFD",
    width: "100%",
    textAlign: "center",
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
