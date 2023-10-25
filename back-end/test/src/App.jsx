import { useState } from "react";
import "./App.css";
import AudioRecorder from "./components/AudioRecorder";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AudioRecorder />
    </>
  );
}

export default App;
