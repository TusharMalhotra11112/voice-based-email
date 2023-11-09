import { Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SpeechRecognition,{useSpeechRecognition} from 'react-speech-recognition';
import axios from 'axios'
import { AudioRecorder, useAudioRecorder} from "react-audio-voice-recorder";

let fire = 0;
export default function Login({logInNo,handleLoginNo}) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const recorderControls = useAudioRecorder()
  
  const [transcriptText,setTranscriptText] = useState("")
  const [voiceData,setVoiceData] = useState(recorderControls.recordingBlob)
  const [email,setEmail] = useState("")
  const [blob,setBlob] = useState()
  const [number,setNumber] = useState(0)
  const [voiceNumber,setVoiceNumber] = useState(0)

  const nouns = ['cat', 'dog', 'house', 'car', 'tree']
  const verbs = ['runs', 'jumps', 'sleeps', 'eats', 'drives']
  const adjectives = ['happy', 'quick', 'lazy', 'big', 'red']
  const adverbs = ['slowly', 'loudly', 'always', 'soon', 'never']

  const fetchSentence = ()=>{
    const noun = nouns[Math.floor(Math.random() * 5)]
    const verb = verbs[Math.floor(Math.random() * 5)]
    const adjective = adjectives[Math.floor(Math.random() * 5)]
    const adverb = adverbs[Math.floor(Math.random() * 5)]
    return `The ${adjective} ${noun} ${verb} ${adverb}`
  }


  const say = (text,duration)=>{
    return new Promise((res,rej)=>{
      if(logInNo === -1){
        handleLoginNo(0)
        fire++;
      }
      console.log(`saying: ${text}`)
      const synth = window.speechSynthesis;
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

  const manageYesorNo=()=>{
    return new Promise((res,rej)=>{
      if(logInNo === 0){
        const value = document.getElementsByClassName("dummy")[0].value
        handleLoginNo(-1)
        say(`is your Email Id ${value}? Say yes or no`,5000)
        .then(()=>{
          listen(3000)
          .then((text)=>{
            setTimeout(()=>{
              if(text === "Yes." || text === "Yes" || text === "yes"){
                console.log(`accepted : ${text}`)
                handleLoginNo(0)
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
      else if(logInNo === 1){
        handleLoginNo(-1)
        say(`would you like to repeate the sentence? say yes or No`,5000)
        .then(()=>{
          listen(3000)
          .then((text)=>{
            setTimeout(()=>{
              if(text === "No." || text === "no" || text === "No"){
                console.log(`accepted : ${text}`)
                handleLoginNo(1)
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

  const manageEmail = ()=>{
    return new Promise((res,rej)=>{
      if(logInNo===0){
        say("Please,Enter Your Email Id",5000)
        .then(()=>{
          listen(5000)
          .then(()=>{
            manageYesorNo()
            .then(()=>{
              handleLoginNo(1)
              fire++
              res('')
            })
            .catch(()=>{
              handleLoginNo(0)
              fire++
            })
          })
        })
      }
    })
  }

  const manageVoice = ()=>{
    return new Promise((res,rej)=>{
      if(logInNo===1){
        say(`Please Say,${fetchSentence()}`,4000)
        .then(()=>{
          setNumber(1)
          listen(5000)
          .then(()=>{
            setNumber(0)
            manageYesorNo()
            .then(()=>{
              setVoiceNumber(1)
              handleLoginNo(2)
              fire++
              res('')
            })
            .catch(()=>{
              handleLoginNo(1)
              fire++
            })
          })
        })
      }
    })
  }

  const manageLogIn = ()=>{
    return new Promise((res,rej)=>{
      let text = email
      if(text[text.length - 1] === "."){
        text = text.slice(0,text.length - 1)
      }
      text = text.replace("at the rate","@")
      text = text.replace("at the date","@")
      text = text.replace("@ the rate","@")
      text = text.replace(" ","")
      text = text.toLowerCase()
      
      console.log(text)
      setEmail(text)
      handleLoginNo(3)
      fire++
      res('')
    })
  }
  
  const send = ()=>{
    var formData = new FormData()
    formData.append("email",email)
    formData.append("file",voiceData)
    console.log(`Email:${email} Voice: ${voiceData}`)
    axios.post("http://localhost:8000/login/",formData)
    .then((data)=>{console.log(data)})
  }
  const addAudioElement = (blob)=>{
    setBlob(blob)
  }

  useEffect(()=>{
    if(logInNo === -1){
      say("hello welcome to the login Page",4000)
    }
    else if(logInNo === 0){
      manageEmail()
    }
    else if(logInNo === 1){
      manageVoice()
    }
    else if(logInNo === 2){
      manageLogIn()
    }
    else if(logInNo === 3){
      send()
    }
  },[fire])

  useEffect(()=>{
    console.log(`transcript:${transcript}`)
    setTranscriptText(transcript)
    if(logInNo === 0){
      setEmail(transcript)
    }
  },[transcript])  


  useEffect(()=>{
    setVoiceData(recorderControls.recordingBlob)
  },[recorderControls.recordingBlob])

  useEffect(()=>{
    if(number === 1){
      recorderControls.startRecording()
    }
    if(number === 0){
      recorderControls.stopRecording()
    }
  },[number])

  useEffect(()=>{
    if(voiceNumber===1){
      addAudioElement(voiceData)
    }
  },[voiceNumber])

  if (!browserSupportsSpeechRecognition) {
    return (
      <div>Speech Recognition is not supported in this browser</div>
    )
  }

  return (
    <div className='loginTab'>
      <input className='dummy' value={transcriptText} onChange={setTranscriptText}/>
        <p className="loginText">Login</p>
        <TextField id="standard-basic" label="Email-Id" variant="standard" className='loginEmail' value={email}/>
        <AudioRecorder
                recorderControls={recorderControls}
                audioTrackConstraints={{noiseSuppression:true,echoCancellation:true,sampleRate:1000,}}
                onNotAllowedOrFound={(err)=>console.log(err)}
                downloadFileExtension='wav'
        />
        <Button variant="contained" className='loginBtn' onClick={()=>{manageLogIn()}}>Login</Button>
        <p className="loginSignupText">Dont have an Account?<span className='toSignUp'>Sign Up</span></p>
    </div>
  )
}
