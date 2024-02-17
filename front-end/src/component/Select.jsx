import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

let fire =0;
export default function Select({ no, handleNo }) {
    const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const nav = useNavigate()
  const [transcriptText, setTranscriptText] = useState("")
  const synth = window.speechSynthesis;

  const say = (text, duration) => {
    return new Promise((res, rej) => {
      if (no === -1) {
        handleNo(0)
        fire++;
      }
      console.log(`saying: ${text}`)
      const u = new SpeechSynthesisUtterance(text)
      synth.speak(u)
      setTimeout(() => {
        resetTranscript()
        res('')
      }, duration)
    })
  }

  const listen = (duration) => {
    resetTranscript()
    console.log("listening")
    return new Promise((res, rej) => {
      resetTranscript()
      say("now", 0)
        .then(() => {
          SpeechRecognition.startListening({ continuous: true })
        })
      setTimeout(() => {
        const value = document.getElementsByClassName("dummy")[0].value
        SpeechRecognition.stopListening()
        res(value)
      }, duration)
    })
  }

  const manageChoose = ()=>{
    return new Promise((res,rej)=>{
        say("choose whether to login or signup?",5000)
        .then(()=>{
            listen(5000)
            .then((text)=>{
                if(text === 'Login.' || text === 'Login' || text === 'login' || text === 'log in' || text === 'log In' || text === 'Log In.' || text === 'Log in.' ){
                    handleNo(-1)
                    nav("./login")
                }
                else if(text === 'Signup.' || text === 'Signup' || text === 'signup' || text === 'Sign up.' || text === 'Sign Up.' || text === 'Sign up' || text === 'Sign Up' || text === 'sign up'){
                    handleNo(-1)
                    nav("./signup")
                }
                else{
                    fire++
                }
            })
        })
    })
  }

  useEffect(()=>{
    if(no === -1){
      synth.cancel()
      say("Welcome to the application",5000)
    }
    else if(no===0){
        manageChoose()
    }
  },[fire])

  useEffect(()=>{
    console.log(`transcript:${transcript}`)
    setTranscriptText(transcript)
  },[transcript])

  useEffect(()=>{
    const ele = document.querySelectorAll(".stroke");
    if(listening){
      for (var index=0 ; index < ele.length; index++) {
        ele[index].style.opacity = "0.7";
      }
    }
    else{
      for (var index=0 ; index < ele.length; index++) {
        ele[index].style.opacity = "0";
      }
    }
  },[listening])

  return (
    <div className='select'>
      <input className='dummy' value={transcriptText} onChange={setTranscriptText} />
      <p className="homePageText">SELECT</p>
        <div className="selectContainer">
          <button className="selectButton" onClick={()=>{
              handleNo(-1)
              nav("./login")
            }}>Login</button>
          <button className="selectButton" onClick={()=>{
              handleNo(-1)
              nav("./signup")
            }}>Sign Up</button>

            {/* <Button variant="contained" size='large' className="selectButton" onClick={()=>{
              handleNo(-1)
              nav("./login")
            }}>Login</Button> 
            <Button variant="contained" size='large' onClick={()=>{
              handleNo(-1)
              nav("./signup")
            }}>Signup</Button>  */}
        </div>
    </div>
  )
}
