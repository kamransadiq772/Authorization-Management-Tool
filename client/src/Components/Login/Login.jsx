import React, { useState } from 'react'
import './login.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios'
import {json, useNavigate} from 'react-router-dom'
import VpnLockIcon from '@mui/icons-material/VpnLock';
import logo from '../assets/logo.png'



const Login = () => {

  const navigate = useNavigate()

  const [loginData, setloginData] = useState({
    email: '',
    password: ""
  })
  const setInitialState = () => {
    setloginData({
      email: '',
      password: ""
    })
  }

  const logIn = async () => {
    if (!loginData.email || !loginData.password) {
      return alert("Email and Password are required");
    }
    try {
      const response = await axios.post('/api/users/login', loginData);
      // console.log(response.data);
      setInitialState()
      localStorage.setItem('user',JSON.stringify(response.data))
      navigate('/main')
    } catch (error) {
      if (error.response.status === 400) {
        console.log(error, error.response.status);
        alert(error.response.data.message)
      }else{
        console.log(error);
      }
    }
  }

  return (
    <div className="loginContainer">
      <div className="loginupperHeaderContainer">
        <h1><img src={logo} alt="" /></h1>
        <VpnLockIcon sx={{color:'red'}} />
      </div>
      <div className="loginbox">
        <div className="loginBoxInner">
          <div className="loginBoxHeader">
            <div className="loginBoxAvatar"><AccountCircleIcon sx={{ width: '80px', height: '80px' }} /></div>
            <div className="loginBoxHeading">Login</div>
          </div>
          <div className="loginForm">
            <form action="">
              <label htmlFor="">Email<span >*</span></label>
              <input type="text" value={loginData.email} placeholder="Email" onChange={e => setloginData(ps => ({ ...ps, email: e.target.value }))} />
              <label htmlFor="">Password<span >*</span></label>
              <input type="password" value={loginData.password} placeholder="Password" onChange={e => setloginData(ps => ({ ...ps, password: e.target.value }))} />
            </form>
            <button onClick={logIn}>Log In</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login