import { Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MailTab from './MailTab'

let fire =0;
export default function Inbox({ no , handleNo }) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const nav = useNavigate()

  const [transcriptText, setTranscriptText] = useState("")
  const [mails,setMalis] = useState([])
  const synth = window.speechSynthesis;
  const say = (text,duration)=>{
    return new Promise((res,rej)=>{
      if(no === -1){
        handleNo(0)
        fire++;
      }
      console.log(`saying: ${text}`)
      const u = new SpeechSynthesisUtterance(text)
      synth.speak(u)
      setTimeout(()=>{
        resetTranscript()
        res('')
      },duration)

    })
  }

  const listen = (duration)=>{
    resetTranscript()
    console.log("listening")
    return new Promise((res,rej)=>{
      resetTranscript()
      say("now",0)
      .then(()=>{
        SpeechRecognition.startListening({continuous:true})
      })
      setTimeout(()=>{
        const value = document.getElementsByClassName("dummy")[0].value
        SpeechRecognition.stopListening()
        res(value)
      },duration)
    })
  }


  const fetchMail = ()=>{
    return new Promise((res,rej)=>{
      axios.get(`http://localhost:8000/getEmails/${localStorage.getItem("user_id")}/primary/5`)
      .then((data)=>{
        setMalis(data.data.emails)
        console.log(data.data.emails)
        handleNo(1)
        fire++
        res('')
      })
    })
  }

  const sayMail = ()=>{
    return new Promise((res,rej)=>{
      
    })
  }

  useEffect(()=>{
    if(no === -1){
      say("you are on the inbox page",5000)
    }
    else if(no === 0){
      say("fetching your recent mails",5000)
      .then(()=>{
        fetchMail()
      })
    }
    else if(no === 1){
      sayMail()
    }
  },[fire])

  useEffect(()=>{
    console.log(`Transcript:${transcript}`)
    setTranscriptText(transcript)
  },[transcript])

  return (
    <div className='inbox'>
      <input className='dummy' value={transcriptText} onChange={setTranscriptText} />
      <p className='inboxText'>Inbox</p>
      <div className="inboxContainer">
        {
          mails.map((mail,index)=>{
            return(
              <MailTab from={mail.sender} subject={mail.subject} body={mail.body} key={index}></MailTab>
            )
          })
        }
      </div>
    </div>
  )
}
