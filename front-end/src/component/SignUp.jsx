import { Button, IconButton, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import VoiceRec from './voiceRec'
import SpeechRecognition,{useSpeechRecognition} from 'react-speech-recognition';
import Speech from 'react-text-to-speech'

export default function SignUp({signUpNo,handelSignUpNo}) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();


  const [email,setEmail] = useState("")
  const [pass,setPass] = useState("")
  const [text,setText] = useState(transcript)
  // const synth = window.speechSynthesis;
  // const u = new SpeechSynthesisUtterance(text)
  // synth.speak(u)
  
  const say = (text)=>{
    return new Promise((res,rej)=>{
      console.log(text)
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(text)
      synth.speak(u)
      setTimeout(()=>{
        // synth.cancel()
        res('')
      },3000)

    })
  }


  const listen = ()=>{
    console.log("listening")
    return new Promise((res,rej)=>{
      resetTranscript()
      say("now")
      .then(SpeechRecognition.startListening({continuous:true}))
      setTimeout(()=>{
        SpeechRecognition.stopListening()
        res(transcript)
      },5000)
    })
  }
  

  const manageEmail = ()=>{
    return new Promise((res,rej)=>{
      say("please Say your Email")
      .then(()=>{
        listen()
        .then(()=>{
          res('')
        })
      })
    })
  }

  const managePass = ()=>{
    return new Promise((res,rej)=>{
      say("please Say your Password")
      .then(()=>{
        listen()
        .then(()=>{
          res('')
        })
      })
    })
  }



  useEffect(()=>{
      say("Hello welcome to the Sign-Up page")
      .then(()=>{
        manageEmail()
        .then(()=>{
          handelSignUpNo(1)
          managePass()
        })
      })
  },[])

  useEffect(()=>{
    console.log(transcript)
    if(signUpNo === 0){
      setEmail(transcript)
    }
    else if(signUpNo === 1){
      setPass(transcript.toLowerCase())
    }
  },[transcript])
  
  
if (!browserSupportsSpeechRecognition) {
  return (
    <div>Speech Recognition is not supported in this browser</div>
  )
} 

  return (
    <div className='loginTab'>
        <p className="loginText">Sign-Up</p>
        <TextField id="standard-basic" label="Email-Id" variant="standard" className='loginEmail' value={email}/>
        <TextField id="standard-basic" label="Password" variant="standard" className='loginPassword' value={pass}/>
        <VoiceRec/>
        <VoiceRec/>
        <VoiceRec/>
        <Button variant="contained" className='loginBtn'
        onClick={()=>console.log(`Email: ${email} Password: ${pass} transcript:${transcript}`)}>Sign Up</Button>
        <p className="loginSignupText">Already have an Account?<span className='toSignUp'>Log In</span></p>
    </div>
  )
}
