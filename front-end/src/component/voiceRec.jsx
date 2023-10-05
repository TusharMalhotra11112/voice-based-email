import React from 'react'
import { AudioRecorder } from "react-audio-voice-recorder";

export default function voiceRec() {
    const addAudioElement = (blob)=>{
        const url = URL.createObjectURL(blob)
        const audio = document.createElement("audio")
        audio.src = url
        audio.controls = true
        document.body.appendChild(audio)
        console.log(audio.src)
    }


    return (
        <div>
            <AudioRecorder
                onRecordingComplete={addAudioElement}
                audioTrackConstraints={{
                    noiseSuppression:true,
                    echoCancellation:true,
                    sampleRate:1000,
                }}
                onNotAllowedOrFound={(err)=>console.log(err)}
                // downloadOnSavePress={true}
                downloadFileExtension='wav'
            />
        </div>
    )
}
