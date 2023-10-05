import { Button, IconButton, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import VoiceRec from './voiceRec'
import SpeechRecognition,{useSpeechRecognition} from 'react-speech-recognition';

export default function SignUp() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();


  const [email,setEmail] = useState("")
  const [pass,setPass] = useState("")
  const [text,setText] = useState(transcript)
  var num = -1
  var change = 0


  const synth = window.speechSynthesis;


  const say = (text)=>{
    resetTranscript()
    const u = new SpeechSynthesisUtterance(text)
    synth.speak(u)
    console.log(text)
  }

  const startListen = ()=>{
    resetTranscript()
    SpeechRecognition.startListening({continuous:true})
  }

  const stopListen = ()=>{
    SpeechRecognition.stopListening()
    return transcript
  }


  // console.log("Listening")
  // if (browserSupportsSpeechRecognition) { 
    //   SpeechRecognition.startListening()
    //   setTimeout(() => {
    //     SpeechRecognition.stopListening()
    //   }, 3000);
    //   console.log(transcript)
    // }
    // else{
    //   console.log("not supported")
    // }
    // console.log(transcript)
  // const listen = async()=>{
  //   return new Promise(async(res,rej)=>{
  //     console.log("Listening")
  //     if (browserSupportsSpeechRecognition) { 
  //       await SpeechRecognition.startListening({continuous:true})
  //       setTimeout(async() => {
  //         await SpeechRecognition.stopListening()
  //         console.log(transcript)
  //         // console.log(SpeechRecognition)
  //         res(transcript)
  //       }, 5000);
  //     }
  //     else if(transcript === null){
  //       rej("rejected")
  //     }
  //     else{
  //       console.log("not supported")
  //       rej("rejected")
  //     }

  //   })
  // }

  const handelYesNo = ()=>{
    if(transcript === 'yes' || 'Yes' || 'Yes.'){
      console.log("yes...")
      return true
    }
    else if(transcript === 'no' || 'No' || "No."){
      console.log("no...")
      return false
    }
    else{
      if(num === 0){
        checkEmail()
      }
      else if(num === 1){
        checkPass()
      }
    }
  }

  const checkEmail = ()=>{
    num = -1
    say(`Is your email id ${email} ? say yes or no`)
    startListen()
    setTimeout(()=>{
      stopListen()
      setTimeout(()=>{
        if(handelYesNo()){
          change = 1
          num = 1
          managePass()
        }
        else{
          manageEmail()
        }
      },2000)
    },5000)
    
  }

  const manageEmail = ()=>{
    say("please Enter your Email id")
    num = 0
    startListen()
    setTimeout(()=>{
      stopListen()
      setTimeout(()=>{
        checkEmail()
      },2000)
    },5000)

  }
  const checkPass = ()=>{
    say(`Is your password ${pass} ? say yes or no`)
    startListen()
    setTimeout(()=>{
      stopListen()
      setTimeout(()=>{
        if(handelYesNo()){
          change = 2
        }
        else{
          managePass()
        }
      },2000)
    },5000)
  }

  const managePass=()=>{
  say("please Enter your password")
      startListen()
      setTimeout(()=>{
        stopListen()
        setTimeout(()=>{
          checkPass()
        },2000)
      },5000)
    }
    
    useEffect(()=>{
      setText(transcript)
  
      if(num === 0){
        setEmail(transcript)
      }
      else if(num === 1){
        setPass(transcript)
      }
    },[transcript])
    
  useEffect(()=>{
    say("Hello Welcome to the sign-Up page")
    setTimeout(()=>{
      if(change === 0){
        manageEmail()
      }
      else if(change === 1){
        managePass()
      }
    },1000)
  },[change])



  return (
    <div className='loginTab'>
        <p className="loginText">Sign-Up</p>
        <TextField id="standard-basic" label="Email-Id" variant="standard" className='loginEmail' value={email}/>
        <TextField id="standard-basic" label="Password" variant="standard" type='password' className='loginPassword' value={pass}/>
        <VoiceRec/>
        <VoiceRec/>
        <VoiceRec/>
        <Button variant="contained" className='loginBtn' onClick={()=>console.log(`Email: ${email} Password: ${pass} transcript:${transcript}`)}>Sign Up</Button>
        <p className="loginSignupText">Already have an Account?<span className='toSignUp'>Log In</span></p>
    </div>
  )
}
