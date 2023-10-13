import React, { useEffect } from 'react'
import { AudioRecorder, useAudioRecorder} from "react-audio-voice-recorder";

export default function VoiceRec({ voiceSample, setVoiceSample, number,setNumber,voiceNumber,setVoiceNumber}) {
    const addAudioElement = (blob)=>{
        // const url = URL.createObjectURL(blob)
        // const audio = document.createElement("audio")
        // audio.src = url
        // audio.controls = true
        // document.body.appendChild(audio)]

        if(voiceNumber === 1){
            let newVoiceSample = [...voiceSample]
            newVoiceSample.push(blob)
            setVoiceSample(newVoiceSample)
            setVoiceNumber(0)
        }
    }
    
    const recorderControls = useAudioRecorder()

    useEffect(()=>{
        console.log("VoiceRec")
    },[])


    if(number === 1 ||number === 2 ||number === 3){
        recorderControls.startRecording()
        setTimeout(()=>{
            setNumber(0)
            recorderControls.stopRecording()
            addAudioElement(recorderControls.recordingBlob)
        },5000)
    }

    return (
        <div>
            <AudioRecorder
                recorderControls={recorderControls}
                // onRecordingComplete={(blob)=>addAudioElement(blob)}
                audioTrackConstraints={{
                    noiseSuppression:true,
                    echoCancellation:true,
                    sampleRate:1000,
                }}
                onNotAllowedOrFound={(err)=>console.log(err)}
                // downloadOnSavePress={true}
                downloadFileExtension='wav'
                // showVisualizer = 'true'
            />
        </div>
    )
}
