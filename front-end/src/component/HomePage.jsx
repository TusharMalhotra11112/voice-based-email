import { Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios'

let fire = 0
export default function HomePage({ homePageno, handleHomePageNo }) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const [transcriptText, setTranscriptText] = useState("")


  const say = (text, duration) => {
    return new Promise((res, rej) => {
      if (homePageno === -1) {
        handleHomePageNo(0)
        fire++;
      }
      console.log(`saying: ${text}`)
      const synth = window.speechSynthesis;
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
  }
  
  const manageInbox = ()=>{
    console.log(`navigating to inbox`);
    
  }
  
  const manageLogOut = ()=>{
    console.log(`navigating to logout`);

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
    if (homePageno === -1) {
      say("you are on the HomePage please select one of the options", 5000)
    }
    else if (homePageno === 0) {
      manageHomepage()
    }
  }, [fire])

  useEffect(()=>{
    console.log(`Transcript:${transcript}`)
    setTranscriptText(transcript)
  },[transcript])


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
        <Button variant="contained" size='large'>Compose</Button>
        <Button variant="contained" size='large'>Inbox</Button>
        <Button variant="contained" size='large'>LogOut</Button>
      </div>
    </div>
  )
}
