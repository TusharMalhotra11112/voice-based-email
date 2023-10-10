import React from 'react'
import { AudioRecorder} from "react-audio-voice-recorder";

export default function voiceRec({ voiceSample, setVoiceSample }) {
    const addAudioElement = (blob)=>{
        const url = URL.createObjectURL(blob)
        const audio = document.createElement("audio")
        audio.src = url
        audio.controls = true
        // document.body.appendChild(audio)]
        let newVoiceSample = [...voiceSample]
        newVoiceSample.push(blob)
        setVoiceSample([...voiceSample,blob])
    }

    return (
        <div>
            <AudioRecorder
                onRecordingComplete={(blob)=>addAudioElement(blob)}
                audioTrackConstraints={{
                    noiseSuppression:true,
                    echoCancellation:true,
                    sampleRate:1000,
                }}
                onNotAllowedOrFound={(err)=>console.log(err)}
                // downloadOnSavePress={true}
                downloadFileExtension='wav'
                showVisualizer = 'true'
            />
        </div>
    )
}
