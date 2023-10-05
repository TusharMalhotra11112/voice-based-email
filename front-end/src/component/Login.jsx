import React, { useEffect } from 'react'
import {Button, TextField} from '@mui/material'
import VoiceRec from './voiceRec'
import SpeechRecognition,{useSpeechRecognition} from 'react-speech-recognition';

export default function Login() {
  const synth = window.speechSynthesis;

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();


  const say = (text)=>{
    const u = new SpeechSynthesisUtterance(text)
    synth.speak(u)
    console.log(text)
  }

  const listen = ()=>{
    console.log("Listening")
    if (browserSupportsSpeechRecognition) { 
      SpeechRecognition.startListening()
      setTimeout(() => {
        SpeechRecognition.stopListening()
      }, 5000);
    }
    else{
      console.log("not supported")
    }
  }

  // console.log(transcript)
  // say(transcript)

  const email = ()=>{
    say("enter Your Email")
    listen()
    // console.log(transcript)
    // say(transcript)

  }


  return (
    <div className='loginTab'>
        <p className="loginText">Login</p>
        <TextField id="standard-basic" label="Email-Id" variant="standard" className='loginEmail' onClick={email}/>
        <VoiceRec/>
        <Button variant="contained" className='loginBtn' onClick={()=>{say(transcript)}}>Login</Button>
        <p className="loginSignupText">Dont have an Account?<span className='toSignUp'>Sign Up</span></p>
    </div>
  )
}
