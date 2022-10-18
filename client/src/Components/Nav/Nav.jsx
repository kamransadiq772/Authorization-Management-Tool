import React, { useState } from 'react'
import './nav.css'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import profilepic from '../assets/scope.jpg'
import logo from '../assets/logo.png'
import VpnLockIcon from '@mui/icons-material/VpnLock';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios';



const Nav = () => {

    const navigate = useNavigate()
    const [ddview, setddview] = useState(false)
    const [profileView, setprofileView] = useState(false)
    const [editPass, seteditPass] = useState({
        oldPass: '',
        password: ''
    })
    const [loading, setloading] = useState(false)
    const setInitialPasswordState = () => {
        seteditPass({
            oldPass: '',
            password: ''
        })
    }

    const logout = () => {
        localStorage.removeItem('user')
        navigate('/')
    }

    const config = {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
      };

    const closeClick = () => {
        setInitialPasswordState()
        setprofileView(false)
    }

    const updatePassword = async () => {
        if (!editPass.oldPass || !editPass.password) {
            return alert('Both Fields Are Required')
        }
        setloading(true)
        try {
            await axios.put('/api/profile', editPass, config)
            setInitialPasswordState()   
            setloading(false)
            alert("SuccessFully Changed")
            closeClick()
        } catch (error) {
            if (error.response.status === 400) {
                console.log(error, error.response.status);
                setInitialPasswordState()
                alert(error.response.data.message)
              } else {
                console.log(error);
              }
              setloading(false)            
        }
    }

    return (
        <div className='container' >
            <div className="containerInner">
                <div className="logoTextContainer">
                    <div className='logoText'><img src={logo} alt="Logo" /></div>
                    <div className="logoside"><VpnLockIcon sx={{ color: 'red' }} /></div>
                </div>
                <div className="rightNav">
                    <div className="leftContainer">
                        {/* <div className="circle"><img width={40} height={40} src={profilepic} alt="" /></div> */}
                        <div className="circle"><AccountCircleIcon sx={{ fontSize: '47px' }} /></div>
                        <div className="data">
                            <div className="userName">{JSON.parse(localStorage.getItem('user')).name}</div>
                            <div className="userType">{JSON.parse(localStorage.getItem('user')).email}</div>
                        </div>
                    </div>
                    <div className="iconContainer"><ArrowDropDownIcon sx={{ color: 'white', cursor: 'pointer' }} onClick={() => { setddview(true) }} /></div>
                </div>
                <div className="ddContainer" style={{ display: `${ddview ? "" : 'none'}` }}>
                    <div className="ddInner">
                        <div className="ddheaderContainer">
                            <div className="ddTitle">Settings</div>
                            <CloseIcon sx={{ cursor: 'pointer' }} onClick={() => { setddview(false) }} />
                        </div>
                        <div className="ddInfoContainer">
                            <div className="ddInfoItem">
                                <div className="valuename">{JSON.parse(localStorage.getItem('user')).name}</div>
                            </div>
                            <div className="ddInfoItem">
                                <div className="valueEmail">{JSON.parse(localStorage.getItem('user')).email}</div>
                            </div>
                            <div className="ddInfoItem">
                                <div className="valueType">{JSON.parse(localStorage.getItem('user')).type}</div>
                            </div>
                        </div>
                        <div className="ddBottomContainer">
                            <button onClick={logout} >Sign Out</button>
                            <button onClick={() => { setprofileView(true); setddview(false) }} >Edit</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="editProfileModal" style={{ display: `${profileView ? "" : "none"}` }} >
                <div className="editProfileInner">
                    <div className="editProfileHeader">
                        <div className="editProfileHeaderInner">
                            <div className="editProfileTitle">Edit Profile</div>
                            <CloseIcon className='closeIcon' onClick={closeClick} />
                        </div>
                    </div>
                    <div className="editProfileForm">
                        <div className="editProfileInputContainer">
                            <label htmlFor="">Old Password<span style={{ color: 'red', fontSize: '20px', fontWeight: 'bolder' }}>*</span></label>
                            <input value={editPass.oldPass} type="text" placeholder='Old Password*' onChange={e => seteditPass(ps => ({ ...ps, oldPass: e.target.value }))} />
                        </div>
                        <div className="editProfileInputContainer">
                            <label htmlFor="">New Password<span style={{ color: 'red', fontSize: '20px', fontWeight: 'bolder' }}>*</span></label>
                            <input value={editPass.password} type="text" placeholder='New Password*' onChange={e => seteditPass(ps => ({ ...ps, password: e.target.value }))} />
                        </div>
                    </div>
                    <div className="editProfileBottom">
                        <div className="editProfileBottomInner">
                            <button onClick={updatePassword} >Edit</button>
                            <button onClick={closeClick}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Nav
