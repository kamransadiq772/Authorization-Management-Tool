import React, { useState, useEffect } from 'react'
import '../Other/other.css'
import { NavLink } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import writeXlsxFile from 'write-excel-file'

const User = () => {
  const config = {
    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
  };
  const [detalisView, setdetalisView] = useState(false)
  const [formView, setformView] = useState(false)
  const [details, setdetails] = useState('')
  const [data, setdata] = useState({
    name: '',
    email: '',
    password: '',
    type: '',
  })
  const [tdata, settdata] = useState([])
  const [loading, setloading] = useState(false)
  const [toastView, settoastView] = useState(false)
  const setInitialState = () => {
    setdata({
      name: '',
      email: '',
      password: '',
      type: '',
    })
  }

  const closeClick = () => {
    setInitialState()
    setformView(false)
    document.getElementById('submit').style.display = 'block'
    document.getElementById('clear').style.display = 'block'
    document.getElementById('update').style.display = 'none'
    document.getElementById('cancel').style.display = 'none'
  }

  const fetchtdata = async () => {
    try {
      setloading(true)
      const response = await axios.get('/api/users', config);
      settdata(response.data)
      setloading(false)
    } catch (error) {
      if (error.response.status === 400) {
        console.log(error, error.response.status);
        alert(error.response.data.message)
      } else {
        console.log(error);
      }
      setloading(false)
    }
  }

  const onClearClick = (e) => {
    e.preventDefault()
    setInitialState()
  }

  const onEditeClick = (item) => {
    document.getElementById('submit').style.display = 'none'
    document.getElementById('clear').style.display = 'none'
    document.getElementById('update').style.display = 'block'
    document.getElementById('cancel').style.display = 'block'
    setformView(true)
    setdata(item)
  }
  const detailsClick = (item) => {
    setdetails(item)
    setdetalisView(true)
  }
  const cancelClick = (e) => {
    e.preventDefault()
    document.getElementById('submit').style.display = 'block'
    document.getElementById('clear').style.display = 'block'
    document.getElementById('update').style.display = 'none'
    document.getElementById('cancel').style.display = 'none'
    setformView(false)
    setInitialState()
  }
  const updateClick = async (e) => {
    e.preventDefault()
    if (!data.email || !data.name || !data.password || !data.type) {
      return alert('Some Required Fields are missing');
    }
    setloading(true)
    try {
      const response = await axios.put('/api/users', data, config)
      setInitialState()
      alert('updated Successfully');
      fetchtdata()
      setformView(false)
      setloading(false)
    } catch (error) {
      if (error.response.status === 400) {
        console.log(error, error.response.status);
        alert(error.response.data.message)
      } else {
        console.log(error);
      }
      setloading(false)
    }
  }
  const submit = async (e) => {
    e.preventDefault()
    if (!data.email || !data.name || !data.password || !data.type) {
      return alert('Some Required Fields are missing');
    }
    setloading(true)
    try {
      const response = await axios.post('/api/users', data, config)
      setInitialState()
      alert('Added Successfully');
      fetchtdata()
      setformView(false)
      setloading(false)
    } catch (error) {
      if (error.response.status === 400) {
        console.log(error, error.response.status);
        alert(error.response.data.message)
      } else {
        console.log(error);
      }
      setloading(false)
    }
  }
  const deleteClick = async (item) => {
    if (window.confirm("Deleted record would not be backup")) {
      setloading(true)
      try {
        const response = await axios.delete(`/api/users/${item._id}`, config)
        setInitialState()
        alert('deleted Successfully');
        fetchtdata()
        setformView(false)
        setloading(false)
      } catch (error) {
        if (error.response.status === 400) {
          console.log(error, error.response.status);
          alert(error.response.data.message)
        } else {
          console.log(error);
        }
        setloading(false)
      }
    }
  }

  document.querySelectorAll('p').forEach((item, index) => {
    item.onclick = (e) => {
      if (navigator.clipboard.writeText(e.currentTarget.innerText)) {
        settoastView(true)
        setTimeout(() => {
          settoastView(false)
        }, 2000);
      }
    }
  })

  const exportExcel = async () => {
    if (!tdata) {
      alert('No data is provided')
    } else {

      const schema = [
        {
          column: 'name',
          type: String,
          value: student => student.name
        },
        {
          column: 'email',
          type: String,
          value: student => student.email
        },
        {
          column: 'password',
          type: String,
          value: student => student.password
        },
        {
          column: 'type',
          type: String,
          value: student => student.type
        }
      ]

      await writeXlsxFile(tdata, {
        schema,
        fileName: 'file.xlsx'
      })
    }
  }

  useEffect(() => {
    fetchtdata()
  }, [])

  return (
    <>
      <div className="otherRightContainer">
        <div className="otherRightInner">
          <div className="otherRightUpper">
            <div className="otherRightUpperInner">
              <div className="rightHeader">Users</div>
              <div className="rightbutton" >
                <SimCardDownloadIcon onClick={exportExcel} sx={{ color: 'white' }} />
                <AddIcon onClick={() => { setformView(true) }} sx={{ color: 'white' }} />
              </div>
            </div>
          </div>
          <div className="otherTableContainer">
            <div className="otherTableContainerInner">
              <div className="table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Update</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      tdata.map((item, index) => (
                        <tr key={index} onClick={() => { detailsClick(item) }}>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td><EditIcon sx={{ color: 'white' }} onClick={() => { onEditeClick(item) }} /></td>
                          <td><DeleteIcon sx={{ color: 'white' }} onClick={() => { deleteClick(item) }} /></td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* details Part */}
      <div className="detailsContainer" style={{ display: `${detalisView ? "flex" : "none"}` }}>
        <div className="detailsInner">
          <div className="detailsHeader">
            <div className="detailsHeaderInner">
              <div className="detailsTitle">Details</div>
              <div className="detailsCross" onClick={() => { setdetalisView(false) }}><CloseIcon sx={{ color: 'white' }} /></div>
            </div>
          </div>
          <div className="detailsInfoContainer">
            <div className="detailsInfoHeader">
              <div className="detailsInfoTitle">Information</div>
              <div className="detailsInfoDropDown"><ArrowDropDownIcon sx={{ color: 'white' }} /></div>
            </div>
            <div className="detailsFullInfo">
              <div className="detailsFullInfoInner">
                <div className="infoItems"><span>name</span> <p>{details !== '' && details.name}</p></div>
                <div className="infoItems"><span>email</span> <p>{details !== '' && details.email}</p></div>
                <div className="infoItems"><span>password</span> <p>{details !== '' && details.password}</p></div>
                <div className="infoItems"><span>type</span> <p>{details !== '' && details.type}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Form Part */}
      <div className="detailsContainer" style={{ display: `${formView ? "flex" : "none"}` }}>
        <div className="detailsInner">
          <div className="detailsHeader">
            <div className="detailsHeaderInner">
              <div className="detailsTitle">Add User</div>
              <div className="detailsCross" onClick={closeClick}><CloseIcon sx={{ color: 'white' }} /></div>
            </div>
          </div>
          {/* formPart */}
          <div className="formContainer">
            <form action="">
              <label htmlFor="">Name<span>*</span></label>
              <input value={data.name} type="text" name="" id="" placeholder='name' onChange={e => setdata(ps => ({ ...ps, name: e.target.value }))} />
              <label htmlFor="">Email<span>*</span></label>
              <input value={data.email} type="text" name="" id="" placeholder='email' onChange={e => setdata(ps => ({ ...ps, email: e.target.value }))} />
              <label htmlFor="">Password<span>*</span></label>
              <input value={data.password} type="text" name="" id="" placeholder='password' onChange={e => setdata(ps => ({ ...ps, password: e.target.value }))} />
              <label htmlFor="">Type<span>*</span></label>
              <select value={data.type} name="" id="" onChange={e => setdata(ps => ({ ...ps, type: e.target.value }))}>
                <option value="">Select User Type</option>
                <option value="admin" style={{color:'white'}}>Admin</option>
                <option value="local" style={{color:'white'}}>Local</option>
              </select>
              <div className="buttonContaier">
                <button className='btn' id='submit' onClick={submit}>Submit</button>
                <button className='btn' id='clear' onClick={onClearClick}>Clear</button>
                <button className='btn' id='update' style={{ display: 'none' }} onClick={updateClick}>Update</button>
                <button className='btn' id='cancel' style={{ display: 'none' }} onClick={cancelClick}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="loadingConatiner" style={{ display: `${loading ? '' : 'none'}` }}>
        <CircularProgress />
      </div>
      <div className="toast" style={{ display: `${toastView ? "" : 'none'}` }}>
        <p>Copy to ClipBoarid</p>
        <span onClick={() => { settoastView(false) }} ><CloseIcon sx={{ color: 'white' }} /></span>
      </div>
    </>
  )
}

export default User
