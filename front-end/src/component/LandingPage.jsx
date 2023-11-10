import React, { useState } from 'react'
import Login from './Login'
import SignUp from './SignUp'
import VoiceRec from './voiceRec'
import HomePage from './HomePage'
import { Outlet } from 'react-router-dom'
export default function LandingPage({no,handleNo}) {
  return (
    <div className='loginPage'>
        <img src="loginbg.jpg" alt="loginbg" className='loginBg'/>
        <Outlet no={no} handleNo={handleNo} />
    </div>
  )
}
