import { Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios'
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { useNavigate } from 'react-router-dom';
import audioBufferToWav from "audiobuffer-to-wav";
import { Buffer } from "buffer";


let fire = 0;
export default function Login({ no, handleNo }) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const recorderControls = useAudioRecorder()

  const [transcriptText, setTranscriptText] = useState("")
  const [voiceData, setVoiceData] = useState(recorderControls.recordingBlob)
  const [email, setEmail] = useState("")
  const [voiceSample, setVoiceSample] = useState([])
  const [number, setNumber] = useState(0)
  const [voiceNumber, setVoiceNumber] = useState(0)

  const nav = useNavigate()

  const adjectives = ["beautiful", "lazy", "professional", "lovely", "dumb", "kind", "curious", "brave", "better", "calm"]
  const nouns = ["bird", "clock", "boy", "child", "duck", "teacher", "old lady", "man", "hamster", "dog"]
  const verbs = ["kicked", "ran", "flew", "dodged", "sliced", "rolled", "sang", "gave", "said", "felt"]
  const adverbs = ["slowly", "elegantly", "precisely", "quickly", "sadly", "humbly", "proudly", "shockingly", "calmly", "eagerly"]

  const fetchSentence = () => {
    const noun = nouns[Math.floor(Math.random() * 10)]
    const verb = verbs[Math.floor(Math.random() * 10)]
    const adjective = adjectives[Math.floor(Math.random() * 10)]
    const adverb = adverbs[Math.floor(Math.random() * 10)]
    return `The ${adjective} ${noun} ${verb} ${adverb}`
  }


  const synth = window.speechSynthesis;
  const say = (text, duration) => {
    return new Promise((res, rej) => {
      if (no === -1) {
        handleNo(0)
        fire++;
      }
      console.log(`saying: ${text}`)
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

  const manageYesorNo = () => {
    return new Promise((res, rej) => {
      if (no === 0) {
        const value = document.getElementsByClassName("dummy")[0].value
        handleNo(-1)
        say(`is your Email Id ${value}? Say yes or no`, 7000)
          .then(() => {
            listen(3000)
              .then((text) => {
                setTimeout(() => {
                  if (text === "Yes." || text === "Yes" || text === "yes") {
                    console.log(`accepted : ${text}`)
                    handleNo(0)
                    res('')
                  }
                  else {
                    console.log(`rejected :${text}`)
                    rej('')
                  }
                }, 1000)
              })
          })
      }
      else if (no === 1) {
        handleNo(-1)
        say(`would you like to repeate the sentence? say yes or No`, 5000)
          .then(() => {
            listen(3000)
              .then((text) => {
                setTimeout(() => {
                  if (text === "No." || text === "no" || text === "No") {
                    console.log(`accepted : ${text}`)
                    handleNo(1)
                    res('')
                  }
                  else {
                    console.log(`rejected :${text}`)
                    rej('')
                  }
                }, 1000)
              })
          })
      }

    })
  }

  const manageEmail = () => {
    return new Promise((res, rej) => {
      if (no === 0) {
        // const elem = document.getElementsByClassName("MuiInputBase-input")[0];
        // elem.style.boxShadow = "var(--acent) 0px 2px 4px 0px, var(--acent) 0px 2px 16px 0px"
        say("Please,Enter Your Email Id", 5000)
          .then(() => {
            listen(7000)
              .then(() => {
                manageYesorNo()
                  .then(() => {
                    // elem.style.boxShadow = ""
                    handleNo(1)
                    fire++
                    res('')
                  })
                  .catch(() => {
                    handleNo(0)
                    fire++
                  })
              })
          })
      }
    })
  }

  const manageVoice = () => {
    return new Promise((res, rej) => {
      if (no === 1) {
        // const elem = document.getElementsByClassName("audio-recorder")[0];
        // elem.style.boxShadow = "var(--acent) 0px 2px 4px 0px, var(--acent) 0px 2px 16px 0px !important"
        say(`Please Say,${fetchSentence()}`, 4000)
          .then(() => {
            setNumber(1)
            listen(5000)
              .then(() => {
                setNumber(0)
                manageYesorNo()
                  .then(() => {
                    // elem.style.boxShadow = ""
                    setVoiceNumber(1)
                    handleNo(2)
                    fire++
                    res('')
                  })
                  .catch(() => {
                    handleNo(1)
                    fire++
                  })
              })
          })
      }
    })
  }

  const manageLogin = () => {
    return new Promise((res, rej) => {
      sendData()
    })
  }

  const addAudioElement = (blob) => {

    const reader = new window.FileReader();
    reader.readAsDataURL(blob);


    reader.onload = () => {
      let base64 = reader.result + "";
      base64 = base64.split(",")[1];
      const ab = new ArrayBuffer(base64.length);
      const buff = new Buffer.from(base64, "base64");
      const view = new Uint8Array(ab);

      for (let i = 0; i < buff.length; ++i) {
        view[i] = buff[i];
      }
      const context = new AudioContext();
      context.decodeAudioData(ab, (Buffer) => {
        const wavfile = audioBufferToWav(Buffer)
        const blob2 = new window.Blob([new DataView(wavfile)], {
          type: "audio/wav",
        })
        let newVoiceSample = []
        newVoiceSample.push(blob2)
        setVoiceSample(newVoiceSample)
        setVoiceNumber(0)
      })
    }

  }

  const sendData = () => {
    return new Promise((res, rej) => {
      let text = email
      if (text[text.length - 1] === ".") {
        text = text.slice(0, text.length - 1)
      }
      text = text.replace("at the rate", "@")
      text = text.replace("at the date", "@")
      text = text.replace("@ the rate", "@")
      text = text.replace(" ", "")
      text = text.toLowerCase()

      setEmail(text)
      handleNo(3)
      fire++
      res('')
    })
  }

  const send = () => {
    console.log(`Email:${email} file: ${voiceSample[0]}`)
    var formData = new FormData()
    formData.append("email", email)
    formData.append("file", voiceSample[0])
    axios.post("http://localhost:8000/login/", formData)
      .then((data) => {
        console.log(data.data.user_id)
        localStorage.setItem("email", email)
        localStorage.setItem("user_id", data.data.user_id)

        console.log(data)
        handleNo(-1)
        nav('../homepage')
      })
      .catch((err) => {
        console.log(err)
        say(`${err.response.data.message}`, 5000)
          .then(() => {
            setEmail("")
            handleNo(0)
            fire++
          })
      })
  }


  useEffect(() => {
    if (voiceNumber === 1) {
      addAudioElement(voiceData)
    }
  }, [voiceNumber])


  useEffect(() => {
    if (no === -1) {
      synth.cancel()
      say("You are on the login Page", 4000)
    }
    else if (no === 0) {
      manageEmail()
    }
    else if (no === 1) {
      manageVoice()
    }
    else if (no === 2) {
      if (voiceNumber === 0) {
        say("login you in the website", 5000)
          .then(() => {
            manageLogin()
          })
      }
      else {
        fire++
      }
    }
    else if (no === 3) {
      send()
    }
  }, [fire])

  useEffect(() => {
    console.log(`transcript:${transcript}`)
    setTranscriptText(transcript)
    if (no === 0) {
      setEmail(transcript)
    }
  }, [transcript])


  useEffect(() => {
    setVoiceData(recorderControls.recordingBlob)
  }, [recorderControls.recordingBlob])

  useEffect(() => {
    if (number === 1) {
      recorderControls.startRecording()
    }
    if (number === 0) {
      recorderControls.stopRecording()
    }
  }, [number])

  useEffect(() => {
    const ele = document.querySelectorAll(".stroke");
    if (listening) {
      for (var index = 0; index < ele.length; index++) {
        ele[index].style.opacity = "0.7";
      }
    }
    else {
      for (var index = 0; index < ele.length; index++) {
        ele[index].style.opacity = "0";
      }
    }
  }, [listening])

  if (!browserSupportsSpeechRecognition) {
    return (
      <div>Speech Recognition is not supported in this browser</div>
    )
  }

  return (
    <div className='loginTab'>
      <input className='dummy' value={transcriptText} onChange={setTranscriptText} />
      <p className="loginText">Login</p>
      <TextField id="standard-basic" label="Email-Id" variant="standard" className='loginEmail' value={email} InputProps={{ disableUnderline: true }}/>
      <AudioRecorder
        recorderControls={recorderControls}
        audioTrackConstraints={{ noiseSuppression: true, echoCancellation: true, sampleRate: 1000, }}
        onNotAllowedOrFound={(err) => console.log(err)}
        downloadFileExtension='wav'
        className="loginVoice"
      />
      <Button variant="contained" className='loginBtn' onClick={() => { send() }}>Login</Button>
      <p className="loginSignupText">Dont have an Account?<span className='toSignUp'>Sign Up</span></p>
    </div>
  )
}
