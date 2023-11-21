import './App.css';
import LandingPage from './component/LandingPage'
import { Routes,Route } from 'react-router-dom';
import Login from './component/Login';
import SignUp from './component/SignUp';
import HomePage from './component/HomePage';
import Compose from './component/Compose'
import Inbox from './component/Inbox';
import Select from './component/Select';
import { useState } from 'react';

function App() {
  let [no,setNo] = useState(-1)

    const handleNo = (num)=>{
    setNo(num)
  }


  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage no={no} handleNo={handleNo}/>}>
          <Route path='' element={<Select no={no} handleNo={handleNo}/>} ></Route>
          <Route path='login' element={<Login no={no} handleNo={handleNo}/>} ></Route>
          <Route path='signup' element={<SignUp no={no} handleNo={handleNo}/>} ></Route>
          <Route path='homepage' element={<HomePage no={no} handleNo={handleNo}/>}></Route>
          <Route path='compose' element={<Compose no={no} handleNo={handleNo}/>}></Route>
          <Route path='inbox' element={<Inbox no={no} handleNo={handleNo}/>}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
