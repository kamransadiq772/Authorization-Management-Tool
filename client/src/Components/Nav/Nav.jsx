import React from 'react'
import './nav.css'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import profilepic from '../assets/scope.jpg'
import logo from '../assets/logo.png'
import VpnLockIcon from '@mui/icons-material/VpnLock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const Nav = () => {
    return (
        <div className='container' >
            <div className="containerInner">
                <div className="logoTextContainer">
                    <div className='logoText'><img src={logo} alt="Logo" /></div>
                    <div className="logoside"><VpnLockIcon sx={{color:'red'}}/></div>
                </div>
                <div className="rightNav">
                    <div className="leftContainer">
                        {/* <div className="circle"><img width={40} height={40} src={profilepic} alt="" /></div> */}
                        <div className="circle"><AccountCircleIcon sx={{fontSize:'47px'}} /></div>
                        <div className="data">
                            <div className="userName">{JSON.parse(localStorage.getItem('user')).name}</div>
                            <div className="userType">{JSON.parse(localStorage.getItem('user')).email}</div>
                        </div>
                    </div>
                    <div className="iconContainer"><ArrowDropDownIcon sx={{color:'white'}} /></div>
                </div>
            </div>
        </div>
    )
}

export default Nav
