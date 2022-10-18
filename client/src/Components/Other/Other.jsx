import React, { useState } from 'react'
import './other.css'
import { NavLink } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Outlet } from 'react-router-dom';


const Other = () => {

  const [detalisView, setdetalisView] = useState(false)
  const [formView, setformView] = useState(false)
  const [tdata, settdata] = useState('')

  

  return (
    <div className="otherContainer">
      {/* <div className="othernavContianer">
        <div className="otherNav">
          <button >EXPOERT TO EXCEL</button>
        </div>
      </div> */}
      <div className="otherBottomContainer">
        <div className="otherDrawerContainer">
          <div className="otherDrawerInner">
            <div className="otherDrawerHeader">
              All Items
            </div>
            <div className="otherDrawerList">
              <ul>
                <NavLink className='navlink' style={{ textDecoration: 'none',display:'block', color: 'white', width: '100%', height: '100%' }} to='/main/users'>Users</NavLink>
                <NavLink className='navlink' style={{ textDecoration: 'none',display:'block', color: 'white', width: '100%', height: '100%' }} to='/main'>Passwords</NavLink>
              </ul>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default Other