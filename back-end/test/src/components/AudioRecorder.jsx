import { useState, useRef } from "react";
import { Buffer } from "buffer";
import fs from "fs";

const mimeType = "audio/wav";

const AudioRecorder = () => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);

  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    setRecordingStatus("recording");
    //create new Media recorder instance using the stream
    const media = new MediaRecorder(stream, { type: mimeType });
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();
    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);

      console.log(audioChunks);
      console.log(audioUrl);
      console.log(audioBlob);

      // getBuffer(audioBlob);

      let formData = new FormData();
      formData.append("email", "hello@gmail.com");
      formData.append("file", audioBlob, "file1.wav");
      // formData.append("password", "password123");
      // formData.append("files", audioBlob, "file1.wav");
      // formData.append("files", audioBlob, "file2.wav");
      // formData.append("files", audioBlob, "file3.wav");

      fetch("http://localhost:8000/login", {
        method: "POST",
        body: formData,
      })
        .then((data) => data.json())
        .then((res) => console.log(res));

      setAudioChunks([]);
    };
  };

  return (
    <div>
      <h2>Audio Recorder</h2>
      <main>
        <div className="audio-controls">
          {!permission ? (
            <button onClick={getMicrophonePermission} type="button">
              Get Microphone
            </button>
          ) : null}
          {permission && recordingStatus == "inactive" ? (
            <button type="button" onClick={startRecording}>
              Start recording
            </button>
          ) : null}

          {permission && recordingStatus == "recording" ? (
            <button type="button" onClick={stopRecording}>
              Stop recording
            </button>
          ) : null}
        </div>
      </main>
    </div>
  );
};
export default AudioRecorder;
