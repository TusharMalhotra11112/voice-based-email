import { Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useNavigate } from 'react-router-dom';

let fire = 0
export default function HomePage({ no, handleNo }) {
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

  const manageCompose = ()=>{
    console.log(`navigating to compose`);
    handleNo(-1)
    nav('../compose')
  }
  
  const manageInbox = ()=>{
    console.log(`navigating to inbox`);
    handleNo(-1)
    nav('../inbox')
    
  }
  
  const manageLogOut = ()=>{
    console.log(`Logging out`);
    say("logging out")
    .then(()=>{
      localStorage.clear("user_id")
      localStorage.clear("email_id")
      handleNo(-1)
      nav('../')
    })

  }

  const manageInput = (text)=>{
    return new Promise((res,rej)=>{
      if(text === 'Compose' || text === 'Compose.' || text === 'compose'){
        manageCompose()
      }
      else if(text === 'Inbox' || text === 'Inbox.' || text === 'inbox'){
        manageInbox()
      }
      else if(text === 'Logout' || text === 'Logout.' || text === 'logout' || text === 'Log out' || text === 'Log out.' || text === 'log out'){
        manageLogOut()
      }
      else{
        fire++;
      }
    })
  }


  const manageHomepage = ()=>{
    return new Promise((ers,rej)=>{
      say("option 1 : Compose",4000)
      .then(()=>{
        say("option 2 : Inbox",4000)
        .then(()=>{
          say("option 3 : LogOut",4000)
          .then(()=>{
            listen(3000)
            .then((text)=>{
              manageInput(text)
            })
          })
        })
      })
    })
  }
  

  useEffect(() => {
    if (no === -1) {
      synth.cancel()
      say("you are on the HomePage please select one of the options", 5000)
    }
    else if (no === 0) {
      manageHomepage()
    }
  }, [fire])

  useEffect(()=>{
    console.log(`Transcript:${transcript}`)
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

  if (!browserSupportsSpeechRecognition) {
    return (
      <div>Speech Recognition is not supported in this browser</div>
    )
  }

  return (
    <div className='homePage'>
      <input className='dummy' value={transcriptText} onChange={setTranscriptText} />
      <p className='homePageText'>HomePage</p>
      <div className="homePageContainer">
        <Button variant="contained" size='large' className='homepageBtn' onClick={manageInbox}>Inbox</Button>
        <Button variant="contained" size='large' className='homepageBtn' onClick={manageCompose}>Compose</Button>
        <Button variant="contained" size='large' className='homepageBtn' onClick={manageLogOut} >LogOut</Button>
      </div>
    </div>
  )
}
