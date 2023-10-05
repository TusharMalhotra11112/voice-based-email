import { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function Testing() {
    const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();


  // console.log(useSpeechRecognition())

  useEffect(()=>{
    const synth = window.speechSynthesis;
    console.log(synth)
    const u = new SpeechSynthesisUtterance("helllo world")
    synth.speak(u)
  },[])

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={()=>{SpeechRecognition.startListening({continuous:true})}}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>
    </div>
  );

}
