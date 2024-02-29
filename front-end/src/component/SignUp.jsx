import { Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SpeechRecognition,{useSpeechRecognition} from 'react-speech-recognition';
import axios from 'axios'
import { AudioRecorder, useAudioRecorder} from "react-audio-voice-recorder";
import { useNavigate } from 'react-router-dom';
import audioBufferToWav from "audiobuffer-to-wav";
import { Buffer } from "buffer";



let fire = 0;
export default function SignUp({no,handleNo}) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const nav = useNavigate()
  
  const recorderControls = useAudioRecorder()
  
  const [number,setNumber] = useState(0)

  const [email,setEmail] = useState("")
  const [pass,setPass] = useState("")
  const [transcriptText,setTranscriptText] = useState("")
  const [voiceSample,setVoiceSample] = useState([])
  const [voiceNumber,setVoiceNumber] = useState(0)
  const [voiceData,setVoiceData] = useState(recorderControls.recordingBlob)
  
  const sentence1 = 'Please say HI GMAIL, THIS IS MY RECORDING'
  const sentence2 = 'Please say this email system is voice-based'
  const sentence3 = 'Please say I am signing in this system'

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
        if(no === 2){
          console.log(document.getElementsByClassName("firstsentence")[0])
          
        }
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
      if(no === 0){
        const value = document.getElementsByClassName("dummy")[0].value
        handleNo(-1)
        say(`is your Email Id ${value}? Say yes or no`,6000)
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
        const value = document.getElementsByClassName("loginPassword")[0].children[1].firstChild.value
        handleNo(-1)
        say(`is your Password ${value}? Say yes or no`,6000)
        .then(()=>{
          listen(5000)
          .then((text)=>{
            setTimeout(()=>{
              if(text === "Yes." || text === "Yes" || text === "yes"){
                console.log(`accepted : ${text}`)
                handleNo(1)
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
        handleNo(-1)
        say(`would you like to repeate the sentence-1? say yes or No`,6000)
        .then(()=>{
          listen(5000)
          .then((text)=>{
            setTimeout(()=>{
              if(text === "No." || text === "no" || text === "No"){
                console.log(`accepted : ${text}`)
                handleNo(2)
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
      else if(no === 3){
        handleNo(-1)
        say(`would you like to repeate the sentence-2? say yes or No`,6000)
        .then(()=>{
          listen(5000)
          .then((text)=>{
            setTimeout(()=>{
              if(text === "No." || text === "No" || text === "no"){
                console.log(`accepted : ${text}`)
                handleNo(3)
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
      else if(no === 4){
        handleNo(-1)
        say(`would you like to repeate the sentence-3? say yes or No`,6000)
        .then(()=>{
          listen(5000)
          .then((text)=>{
            setTimeout(()=>{
              if(text === "No." || text === "No" || text === "no"){
                console.log(`accepted : ${text}`)
                handleNo(4)
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
      if(no===0){
        say("please Say your Email Id",6000)
        .then(()=>{
          listen(8000)
          .then(()=>{
            manageYesorNo()
            .then(()=>{
              setEmail((email)=>{
                let text = email
                text = text.replace("at the rate","@")
                text = text.replace("at the date","@")
                text = text.replace("@ the rate","@")
                text = text.replace(" ","")
                return text
            })
              handleNo(1)
              fire++
              res('')
            })
            .catch(()=>{
              handleNo(0)
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
      if(no===1){
        say("please Say your password",6000)
        .then(()=>{
          listen(15000)
          .then(()=>{
            manageYesorNo()
            .then(()=>{
              fire++
              handleNo(2)
              res('')
            })
            .catch(()=>{
              handleNo(1)
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

  const manageSentence1 =()=>{
    return new Promise((res,rej)=>{
      if(no===2){
        say(sentence1,6000)
        .then(()=>{
          setNumber(1)
          listen(5000)
          .then(()=>{
            setNumber(0)
            manageYesorNo()
            .then(()=>{
              setVoiceNumber(1)
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
      }
      else{
        res('')
      }
    })
  }
  const manageSentence2 =()=>{
    return new Promise((res,rej)=>{
      if(no===3){
        say(sentence2,6000)
        .then(()=>{
          setNumber(1)
          listen(5000)
          .then(()=>{
            setNumber(0)
            manageYesorNo()
            .then(()=>{
              setVoiceNumber(1)
              handleNo(4)
              fire++
              res('')
            })
            .catch(()=>{
              handleNo(3)
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
  const manageSentence3 =()=>{
    return new Promise((res,rej)=>{
      if(no===4){
        say(sentence3,6000)
        .then(()=>{
          setNumber(1)
          listen(5000)
          .then(()=>{
            setNumber(0)
            manageYesorNo()
            .then(()=>{
              setVoiceNumber(1)
              handleNo(5)
              fire++
              res('')
            })
            .catch(()=>{
              handleNo(4)
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

  const mangeSignup = ()=>{
    return new Promise((res,rej)=>{
      sendData()
    })
  }

  useEffect(()=>{
    if(no === -1){
      synth.cancel()
      say("You are on the Sign-Up page",5000)
    }
    else if(no === 0){
      manageEmail()
    }
    else if(no === 1){
      managePass()
    }
    else if(no === 2){
      manageSentence1()
    }
    else if(no === 3){
      manageSentence2()
    }
    else if(no === 4){
      manageSentence3()
    }
    else if(no === 5){
      if(voiceNumber===0){
        say("signing you in the website",5000)
        .then(()=>{
          mangeSignup()
        })
      }
      else{
        fire++
      }
    }
    else if(no === 6){
      send()
    }
  },[fire])

  useEffect(()=>{
    console.log(`transcript:${transcript}`)
    setTranscriptText(transcript)
    if(no === 0){
      setEmail(transcript)
    }
    else if(no === 1){
      setPass(transcript)
    }
  },[transcript])
  

  const addAudioElement = (blob)=>{
    
    const reader = new window.FileReader();
    reader.readAsDataURL(blob);


    reader.onload = ()=>{
      let base64 = reader.result + "";
      base64 = base64.split(",")[1];
      const ab = new ArrayBuffer(base64.length);
      const buff = new Buffer.from(base64, "base64");
      const view = new Uint8Array(ab);

      for (let i = 0; i < buff.length; ++i) {
        view[i] = buff[i];
      }
      const context = new AudioContext();
      context.decodeAudioData(ab, (Buffer)=>{
        const wavfile = audioBufferToWav(Buffer)
        const blob2 = new window.Blob([new DataView(wavfile)],{
          type:"audio/wav",
        })
        let newVoiceSample = [...voiceSample]
        newVoiceSample.push(blob2)
        setVoiceSample(newVoiceSample)
        setVoiceNumber(0)
      })
    }

  }

  useEffect(()=>{
    if(number === 1){
      recorderControls.startRecording()
    }
    if(number === 0){
      recorderControls.stopRecording()
    }
  },[number])

  useEffect(()=>{
    if(voiceNumber === 1){
      addAudioElement(voiceData)
    }
  },[voiceNumber])

  useEffect(()=>{
    setVoiceData(recorderControls.recordingBlob)
  },[recorderControls.recordingBlob])

  const sendData =()=>{
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
      setEmail(text)
      text = pass
      text = text.replace(" ","")
      text = text.replace(".","")
      text = text.toLowerCase()
      setPass(text)
      handleNo(6)
      fire++
      res('')
  })

    
  }
  
  const send = ()=>{
    console.log(`email:${email} password:${pass} file1${voiceSample[0]} file2${voiceSample[1]} file3${voiceSample[2]}`)
    var formData = new FormData()
    formData.append("email",email)
    formData.append("password",pass)
    formData.append("files", voiceSample[0], "file1.wav")
    formData.append("files", voiceSample[1], "file2.wav")
    formData.append("files", voiceSample[2], "file3.wav")
    axios.post("http://localhost:8000/register/",formData)
    .then((data)=>{
      console.log(data)
      localStorage.setItem("email",email)
      handleNo(-1)
      nav('../homepage')
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  
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
    <div className='loginTab'>
      <input className='dummy' value={transcriptText} onChange={setTranscriptText}/>
        <p className="loginText">Sign-Up</p>
        <TextField id="standard-basic" label="Email-Id" variant="standard" className='loginEmail' value={email} InputProps={{ disableUnderline: true }}/>
        <TextField id="standard-basic" label="Password" variant="standard" className='loginPassword' value={pass} type='Password' InputProps={{ disableUnderline: true }}/>
        <AudioRecorder
                recorderControls={recorderControls}
                audioTrackConstraints={{noiseSuppression:true,echoCancellation:true,sampleRate:1000,}}
                onNotAllowedOrFound={(err)=>console.log(err)}
                downloadFileExtension='wav'
        />
        <Button variant="contained" className='loginBtn'
        onClick={()=>{sendData()}}
        >Sign Up</Button>
        <p className="loginSignupText">Already have an Account?<span className='toSignUp'>Log In</span></p>
    </div>
  )
}
