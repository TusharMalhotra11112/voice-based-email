import React from 'react'
import Background from './Background';
import { Outlet } from 'react-router-dom'


export default function LandingPage({no,handleNo}) {
  return (
    <div className='loginPage'>
        {/* <img src="loginbg.jpg" alt="loginbg" className='loginBg'/> */}
        <Background />
        <Outlet no={no} handleNo={handleNo} />
    </div>
  )
}
