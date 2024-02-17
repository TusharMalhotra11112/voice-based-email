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
  const [mailNo,setMailNo] = useState(0)

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
      // },duration)
      },(text.length)*100)
    })
  }

  const listen = (duration)=>{
    resetTranscript()
    console.log("listening")
    return new Promise((res,rej)=>{
      resetTranscript()
      say("now",400)
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
        setMalis(data.data.emails.reverse())
        console.log(data.data.emails)
        handleNo(1)
        fire++
        res('')
      })
    })
  }

  const sayBody = ()=>{
    return new Promise((res,rej)=>{
      say(`${mails[mailNo].body}`,10000)
      .then(()=>{
        res('')
      })
    })
  }

  const manageYesorNo = ()=>{
    return new Promise((res,rej)=>{
      say(`would you like to listen to the content of the mail? say yes or no`,5000)
      .then(()=>{
        listen(3000)
        .then((text)=>{
          setTimeout(()=>{
            if(text === "Yes." || text === "yes" || text === "Yes"){
              console.log(`accepted : ${text}`)
              res('')
            }
            else if(text === "No." || text === "no" || text === "No"){
              console.log(`rejected :${text}`)
              rej('')
            }
            else{
              fire++
            }
          },1000)
        })
      })
    })
  }

  const sayMail = ()=>{
    return new Promise((res,rej)=>{
      if(mailNo === 5){
        handleNo(2)
        fire++
        res('')
      }
      say(`${mails[mailNo].subject}`,8000)
      .then(()=>{
        say(` from ${mails[mailNo].sender} `,5000)
        .then(()=>{
        manageYesorNo()
        .then(()=>{
          sayBody()
          .then(()=>{
            setMailNo((prev)=>{
            return(prev+1)
            })
            fire++
          })
        })
        .catch(()=>{
          setMailNo((prev)=>{
            return(prev+1)
          })
          fire++
        })
      })
      })
    })
  }

  useEffect(()=>{
    if(no === -1){
      synth.cancel()
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
    else if(no === 2){
      handleNo(-1)
      say('navigating to homepage',5000)
      .then(()=>{
        nav('../homepage')
      })
    }
  },[fire])

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
