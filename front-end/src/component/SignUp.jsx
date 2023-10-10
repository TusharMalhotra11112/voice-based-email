import { Button, IconButton, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import VoiceRec from './voiceRec'
import SpeechRecognition,{useSpeechRecognition} from 'react-speech-recognition';
import Speech from 'react-text-to-speech'
import axios from 'axios'

let fire = 0;
export default function SignUp({signUpNo,handelSignUpNo}) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();


  const [email,setEmail] = useState("")
  const [pass,setPass] = useState("")
  const [transcriptText,setTranscriptText] = useState("")
  const [voiceSample,setVoiceSample] = useState([])
  
  const sentence1 = 'Please say HI GMAIL, THIS IS MY RECORDING'
  const sentence2 = 'Please say this email system is voice-based'
  const sentence3 = 'Please say I am signing in this system'



  const say = (text,duration)=>{
    return new Promise((res,rej)=>{
      if(signUpNo === -1){
        handelSignUpNo(0)
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
      .then(SpeechRecognition.startListening({continuous:true}))
      setTimeout(()=>{
        const value = document.getElementsByClassName("dummy")[0].value
        SpeechRecognition.stopListening()
        res(value)
      },duration)
    })
  }
  const manageYesorNo=()=>{
    return new Promise((res,rej)=>{
      if(signUpNo === 0){
        const value = document.getElementsByClassName("dummy")[0].value
        handelSignUpNo(-1)
        say(`is your Email Id ${value}? Say yes or no`,4000)
        .then(()=>{
          listen(3000)
          .then((text)=>{
            setTimeout(()=>{
              if(text === "Yes." || text === "Yes" || text === "yes"){
                console.log(`accepted : ${text}`)
                handelSignUpNo(0)
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
      else if(signUpNo === 1){
        const value = document.getElementsByClassName("loginPassword")[0].children[1].firstChild.value
        handelSignUpNo(-1)
        say(`is your Password ${value}? Say yes or no`,4000)
        .then(()=>{
          listen(3000)
          .then((text)=>{
            setTimeout(()=>{
              if(text === "Yes." || text === "Yes" || text === "yes"){
                console.log(`accepted : ${text}`)
                handelSignUpNo(1)
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
      if(signUpNo===0){
        say("please Say your Email Id",4000)
        .then(()=>{
          listen(5000)
          .then(()=>{
            manageYesorNo()
            .then(()=>{
              handelSignUpNo(1)
              fire++
              res('')
            })
            .catch(()=>{
              handelSignUpNo(0)
              fire++;
            })
          })
        })
      }
      else{
        res('')
      }
    })
  }


  const managePass = ()=>{
    return new Promise((res,rej)=>{
      if(signUpNo===1){
        say("please Say your password",4000)
        .then(()=>{
          listen(5000)
          .then(()=>{
            manageYesorNo()
            .then(()=>{
              fire++
              handelSignUpNo(2)
              res('')
            })
            .catch(()=>{
              handelSignUpNo(1)
              fire++
            })
          })
        })
      }
      else{
        res('')
      }
    })
  }


  useEffect(()=>{
    if(signUpNo === -1){
      say("Hello welcome to the Sign-Up page",3000)
    }
    else if(signUpNo === 0){
      manageEmail()
    }
    else if(signUpNo === 1){
      managePass()
    }
  },[fire])

  useEffect(()=>{
    console.log(`transcript:${transcript}`)
    setTranscriptText(transcript)
    if(signUpNo === 0){
      setEmail(transcript)
    }
    else if(signUpNo === 1){
      setPass(transcript)
    }
  },[transcript])
  
  const sendData =()=>{
    const data = {
      "email":email,
      "password":pass,
      "blob":voiceSample
    }
    axios.post("http://localhost:8000/register/",data)
  }
  
if (!browserSupportsSpeechRecognition) {
  return (
    <div>Speech Recognition is not supported in this browser</div>
  )
} 

  return (
    <div className='loginTab'>
      <input className='dummy' value={transcriptText}/>
        <p className="loginText">Sign-Up</p>
        <TextField id="standard-basic loginEmail" label="Email-Id" variant="standard" className='loginEmail' value={email}/>
        <TextField id="standard-basic" label="Password" variant="standard" className='loginPassword' value={pass}/>
        <VoiceRec voiceSample={voiceSample} setVoiceSample={setVoiceSample} />
        <VoiceRec voiceSample={voiceSample} setVoiceSample={setVoiceSample} />
        <VoiceRec voiceSample={voiceSample} setVoiceSample={setVoiceSample} />
        <Button variant="contained" className='loginBtn'
        onClick={()=>{sendData()}}
        >Sign Up</Button>
        <p className="loginSignupText">Already have an Account?<span className='toSignUp'>Log In</span></p>
    </div>
  )
}
