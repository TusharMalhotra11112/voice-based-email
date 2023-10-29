import { Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SpeechRecognition,{useSpeechRecognition} from 'react-speech-recognition';
import axios from 'axios'
import { AudioRecorder, useAudioRecorder} from "react-audio-voice-recorder";


let fire = 0;
export default function SignUp({signUpNo,handelSignUpNo}) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  
  
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

  const say = (text,duration)=>{
    return new Promise((res,rej)=>{
      if(signUpNo === -1){
        handelSignUpNo(0)
        fire++;
      }
      const synth = window.speechSynthesis;
      // const voices = synth.getVoices()
      // const voice = ()=>{
      //     for(let i= 0;i<voices.length;i++){
      //       if(voices[i].name === 'Microsoft David - English (United States)')
      //       return voices[i];
      //     }
      //     return voices[0];
      // }
      // const corrvoice = voice()
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
        if(signUpNo === 2){
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
      if(signUpNo === 0){
        const value = document.getElementsByClassName("dummy")[0].value
        handelSignUpNo(-1)
        say(`is your Email Id ${value}? Say yes or no`,6000)
        .then(()=>{
          listen(5000)
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
        say(`is your Password ${value}? Say yes or no`,6000)
        .then(()=>{
          listen(5000)
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
      else if(signUpNo === 2){
        handelSignUpNo(-1)
        say(`would you like to repeate the sentence-1? say yes or No`,6000)
        .then(()=>{
          listen(5000)
          .then((text)=>{
            setTimeout(()=>{
              if(text === "No." || text === "no" || text === "No"){
                console.log(`accepted : ${text}`)
                handelSignUpNo(2)
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
      else if(signUpNo === 3){
        handelSignUpNo(-1)
        say(`would you like to repeate the sentence-2? say yes or No`,6000)
        .then(()=>{
          listen(5000)
          .then((text)=>{
            setTimeout(()=>{
              if(text === "No." || text === "No" || text === "no"){
                console.log(`accepted : ${text}`)
                handelSignUpNo(3)
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
      else if(signUpNo === 4){
        handelSignUpNo(-1)
        say(`would you like to repeate the sentence-3? say yes or No`,6000)
        .then(()=>{
          listen(5000)
          .then((text)=>{
            setTimeout(()=>{
              if(text === "No." || text === "No" || text === "no"){
                console.log(`accepted : ${text}`)
                handelSignUpNo(4)
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
        say("please Say your Email Id",6000)
        .then(()=>{
          listen(6000)
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
        say("please Say your password",6000)
        .then(()=>{
          listen(6000)
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

  const manageSentence1 =()=>{
    return new Promise((res,rej)=>{
      if(signUpNo===2){
        say(sentence1,6000)
        .then(()=>{
          setNumber(1)
          listen(5000)
          .then(()=>{
            setNumber(0)
            manageYesorNo()
            .then(()=>{
              setVoiceNumber(1)
              handelSignUpNo(3)
              fire++
              res('')
            })
            .catch(()=>{
              handelSignUpNo(2)
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
      if(signUpNo===3){
        say(sentence2,6000)
        .then(()=>{
          setNumber(1)
          listen(5000)
          .then(()=>{
            setNumber(0)
            manageYesorNo()
            .then(()=>{
              setVoiceNumber(1)
              handelSignUpNo(4)
              fire++
              res('')
            })
            .catch(()=>{
              handelSignUpNo(3)
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
      if(signUpNo===4){
        say(sentence3,6000)
        .then(()=>{
          setNumber(1)
          listen(5000)
          .then(()=>{
            setNumber(0)
            manageYesorNo()
            .then(()=>{
              setVoiceNumber(1)
              handelSignUpNo(5)
              fire++
              res('')
            })
            .catch(()=>{
              handelSignUpNo(4)
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
    if(signUpNo === -1){
      say("Hello welcome to the Sign-Up page",5000)
    }
    else if(signUpNo === 0){
      manageEmail()
    }
    else if(signUpNo === 1){
      managePass()
    }
    else if(signUpNo === 2){
      manageSentence1()
    }
    else if(signUpNo === 3){
      manageSentence2()
    }
    else if(signUpNo === 4){
      manageSentence3()
    }
    else if(signUpNo === 5){
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
  

  const addAudioElement = (blob)=>{
      // const url = URL.createObjectURL(blob)
      // const audio = document.createElement("audio")
      // audio.src = url
      // audio.controls = true
      // document.body.appendChild(audio)]

      let newVoiceSample = [...voiceSample]
      newVoiceSample.push(blob)
      setVoiceSample(newVoiceSample)
      setVoiceNumber(0)
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

    var formData = new FormData()
    let text = email
    text = text.replace("at the rate","@")
    text = text.replace("at the date","@")
    text = text.replace("@ the rate","@")
    text = text.replace(" ","")
    setEmail(text)
    text = pass
    text = text.replace(" ","")
    text = text.replace(".","")
    setPass(text)

    console.log(`email:${email} password:${pass} file1${voiceSample[0]} file2${voiceSample[1]} file3${voiceSample[2]}`)
    try{
      formData.append("email",email)
      formData.append("password",pass)
      formData.append("files", voiceSample[0], "file1.wav")
      formData.append("files", voiceSample[1], "file2.wav")
      formData.append("files", voiceSample[2], "file3.wav")
    }
    catch{
      console.log("data error happened")
    }
    axios.post("http://localhost:8000/register/",formData)
    .then((data)=>console.log(data))
    .catch((err)=>console.log(err))
  }

  
  if (!browserSupportsSpeechRecognition) {
    return (
      <div>Speech Recognition is not supported in this browser</div>
    )
  }

  return (
    <div className='loginTab'>
      <input className='dummy' value={transcriptText} onChange={setTranscriptText}/>
        <p className="loginText">Sign-Up</p>
        <TextField id="standard-basic loginEmail" label="Email-Id" variant="standard" className='loginEmail' value={email}/>
        <TextField id="standard-basic" label="Password" variant="standard" className='loginPassword' value={pass}/>
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
