import React, { useState } from 'react'
import Login from './Login'
import SignUp from './SignUp'
import VoiceRec from './voiceRec'
import HomePage from './HomePage'
export default function LandingPage() {
  let [signUpNo,setSignUpNo] = useState(-1)
  let [logInNo,setLoginNo] = useState(-1)
  let [homePageno,setHomePageno] = useState(-1)
  
  const handelSignUpNo =(num)=>{
    setSignUpNo(num)
  }

  const handleLoginNo =(num)=>{
    setLoginNo(num)
  }
  const handleHomePageNo = (num)=>{
    setHomePageno(num)
  }
  return (
    <div className='loginPage'>
        <img src="loginbg.jpg" alt="loginbg" className='loginBg'/>
        {/* <Login logInNo={logInNo} handleLoginNo={handleLoginNo} /> */}
        {/* <SignUp signUpNo={signUpNo} handelSignUpNo={handelSignUpNo} /> */}
        <HomePage homePageno={homePageno} handleHomePageNo={handleHomePageNo} />
        {/* <VoiceRec/> */}
    </div>
  )
}
