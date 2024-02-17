import { Button, TextField } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import SendIcon from '@mui/icons-material/Send';

let fire = 0;
export default function Compose({ no , handleNo }) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const [to,setTo] = useState("")
  const [subject,setSubject] = useState("")
  const [body,setBody] = useState("")
  const [transcriptText,setTranscriptText] = useState("")
  const email = localStorage.getItem("email")
  const nav = useNavigate()

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

  const manageYesorNo = ()=>{
    return new Promise((res,rej)=>{
      if(no === 0){
        const value = document.getElementsByClassName("dummy")[0].value
        handleNo(-1)
        say(`is recivers Email Id ${value}? Say yes or no`,8000)
        .then(()=>{
          listen(5000)
          .then((text)=>{
            setTimeout(()=>{
              if(text === "Yes." || text === "Yes" || text === "yes"){
                console.log(`accepted : ${text}`)
                handleNo(0)
                res('')
              }
              else{
                console.log(`rejected :${text}`)
                rej('')
              }
            },1000)
          })
        })
      }
      else if(no === 1){
        const value = document.getElementsByClassName("dummy")[0].value
        handleNo(-1)
        say(`is your subject : ${value} say yes or no`,10000)
        .then(()=>{
          listen(5000)
          .then((text)=>{
            setTimeout(()=>{
              if(text === "Yes." || text === "Yes" || text === "yes"){
                console.log(`accepted : ${text}`)
                handleNo(0)
                res('')
              }
              else{
                console.log(`rejected :${text}`)
                rej('')
              }
            },1000)
          })
        })
      }
      else if(no === 2){
        const value = document.getElementsByClassName("dummy")[0].value
        handleNo(-1)
        say(`Is your body:${value}? Say yes or no`,12000)
        .then(()=>{
          listen(5000)
          .then((text)=>{
            setTimeout(()=>{
              if(text === "Yes." || text === "Yes" || text === "yes"){
                console.log(`accepted : ${text}`)
                handleNo(0)
                res('')
              }
              else{
                console.log(`rejected :${text}`)
                rej('')
              }
            },1000)
          })
        })
      }
    })
  }

  const manageTo = ()=>{
    return new Promise((res,rej)=>{
      say("Enter the email id of the receiver",5000)
      .then(()=>{
        listen(10000)
        .then(()=>{
          manageYesorNo()
          .then(()=>{
            setTo((to)=>{
                let text = to
                if(text[text.length - 1] === "."){
                  text = text.slice(0,text.length - 1)
                }
                text = text.replace("at the rate","@")
                text = text.replace("at the date","@")
                text = text.replace("@ the rate","@")
                text = text.replace(" ","")
                text = text.toLowerCase()
                return text
            })
            handleNo(1)
            fire++
            res('')
          })
          .catch(()=>{
            handleNo(0)
            fire++
          })
        })
      })
    })
  }

  const manageSubject = ()=>{
    return new Promise((res,rej)=>{
      say('enter the subject',5000)
      .then(()=>{
        listen(10000)
        .then(()=>{
          manageYesorNo()
          .then(()=>{
            handleNo(2)
            fire++
            res('')
          })
          .catch(()=>{
            handleNo(1)
            fire++
          })
        })
      })
    })
  }
  
  const manageBody = ()=>{
    return new Promise((res,rej)=>{
      say('enter the body',5000)
      .then(()=>{
        listen(10000)
        .then(()=>{
          manageYesorNo()
          .then(()=>{
            handleNo(3)
            fire++
            res('')
          })
          .catch(()=>{
            handleNo(2)
            fire++
          })
        })
      })
    })
  }
  
  const send = ()=>{
    let data = {
      "user_id":localStorage.getItem("user_id"),
      "subject":subject,
      "text":body,
      "receiver_email":to,
    }
    axios.post("http://localhost:8000/sendEmail/",data)
    .then((data)=>{
      console.log(data)
      say("message has been sent successfully",5000)
      .then(()=>{
        say("navigating you back to the homepage",5000)
        .then(()=>{
          handleNo(-1)
          nav("../homepage")
        })
      })
    })
  }

  useEffect(()=>{
    if(no === -1){
      synth.cancel()
      say("You are on the compose page",5000)
    }
    else if(no === 0){
      manageTo()
    }
    else if(no === 1){
      manageSubject()
    }
    else if(no === 2){
      manageBody()
    }
    else if(no === 3){
      send()
    }
  },[fire])

  useEffect(()=>{
    console.log(`transcript:${transcript}`)
    setTranscriptText(transcript)
    if(no === 0){
      setTo(transcript)
    }
    else if(no === 1){
      setSubject(transcript)
    }
    else if(no === 2){
      setBody(transcript)
    }
  },[transcript])


  if (!browserSupportsSpeechRecognition) {
    return (
      <div>Speech Recognition is not supported in this browser</div>
    )
  }

  return (
    <div className="compose">
      <input className='dummy' value={transcriptText} onChange={setTranscriptText}/>
      <p className="composeText">Compose</p>
      <div className="composeContainer">
        <div className="innerComposeContainer">
          <p className="composeInnerText">To:</p>
          <TextField id="standard-basic" variant="standard" className='composeTo' value={to} />
        </div>
          <div className="innerComposeContainer">
          <p className="composeInnerText">Subject:</p>
        <TextField id="standard-basic" variant="standard" className='composeSubject' value={subject} />
        </div>
        <div className="innerComposeContainer">
          <p className="composeInnerText">Body:</p>
          <TextField id="outlined-multiline-static" multiline rows={5} className='composeBody' value={body} />
        </div>
        <Button variant="contained" endIcon={<SendIcon />} className='composeButton'>Send</Button>
      </div>
    </div>
  )
}
