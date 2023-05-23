import React, { useState, useRef } from "react";

function VideoRecorder() {
  const [recording, setRecording] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [videoBlob, setVideoBlob] = useState(null);

  const startRecording = () => {
    const constraints = { audio: true, video: true };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      setRecording(true);
      videoRef.current.srcObject = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.start();
    });
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const handleDataAvailable = (e) => {
    if (e.data.size > 0) {
      const blob = new Blob([e.data], { type: "video/webm" });
      setVideoBlob(blob);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("video", videoBlob, "myvideo.webm");
    fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        console.log("Video submitted successfully!");
      })
      .catch((error) => {
        console.error("Error submitting video:", error);
      });
  };
  return (
    <div>
      <video ref={videoRef} autoPlay muted />
      {!recording && <button onClick={startRecording}>Start Recording</button>}
      {recording && <button onClick={stopRecording}>Stop Recording</button>}
      {videoBlob && <button onClick={handleSubmit}>Submit Video</button>}
    </div>
  );
}

export default VideoRecorder;
