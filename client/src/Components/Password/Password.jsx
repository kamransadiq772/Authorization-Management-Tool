import React, { useState, useEffect } from 'react'
import '../Other/other.css'
import { NavLink } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import writeXlsxFile from 'write-excel-file'
import axios from 'axios';
const User = () => {
  const config = {
    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
  };
  const [detalisView, setdetalisView] = useState(false)
  const [formView, setformView] = useState(false)
  const [details, setdetails] = useState('')
  const [data, setdata] = useState({
    clientName: "",
    anydeskID: "",
    anydeskPassword: "",
    serverUser: "",
    serverPassword: "",
    databaseServerName: "",
    databaseServerUser: "",
    databaseServerPassword: "",
  })
  const [tdata, settdata] = useState([])
  const [loading, setloading] = useState(false)
  const [toastView, settoastView] = useState(false)
  const setInitialState = () => {
    setdata({
      clientName: "",
      anydeskID: "",
      anydeskPassword: "",
      serverUser: "",
      serverPassword: "",
      databaseServerName: "",
      databaseServerUser: "",
      databaseServerPassword: "",
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
      const response = await axios.get('/api/passwords', config);
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

  const exportExcel = async () => {
    if (!tdata) {
      alert('No data is provided')
    } else {

      const schema = [
        {
          column: 'Client',
          type: String,
          value: student => student.clientName
        },
        {
          column: 'anydeskID',
          type: String,
          value: student => student.anydeskID
        },
        {
          column: 'anydeskPassword',
          type: String,
          value: student => student.anydeskPassword
        },
        {
          column: 'serverUser',
          type: String,
          value: student => student.serverUser
        },
        {
          column: 'serverPassword',
          type: String,
          value: student => student.serverPassword
        },
        {
          column: 'databaseServerName',
          type: String,
          value: student => student.databaseServerName
        },
        {
          column: 'databaseServerUser',
          type: String,
          value: student => student.databaseServerUser
        },
        {
          column: 'databaseServerPassword',
          type: String,
          value: student => student.databaseServerPassword
        }
      ]

      await writeXlsxFile(tdata, {
        schema,
        fileName: 'file.xlsx'
      })
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
    if (!data.clientName || !data.anydeskID || !data.anydeskPassword || !data.serverUser || !data.serverPassword || !data.databaseServerName || !data.databaseServerUser || !data.databaseServerPassword) {
      return alert('Some Required Fields are missing');
    }
    setloading(true)
    try {
      const response = await axios.put('/api/passwords', data, config)
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
    if (!data.clientName || !data.anydeskID || !data.anydeskPassword || !data.serverUser || !data.serverPassword || !data.databaseServerName || !data.databaseServerUser || !data.databaseServerPassword) {
      return alert('Some Required Fields are missing');
    }
    setloading(true)
    try {
      const response = await axios.post('/api/passwords', data, config)
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
        const response = await axios.delete(`/api/passwords/${item._id}`, config)
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

  useEffect(() => {
    fetchtdata()
  }, [])

  return (
    <>
      <div className="otherRightContainer">
        <div className="otherRightInner">
          <div className="otherRightUpper">
            <div className="otherRightUpperInner">
              <div className="rightHeader">Passwords</div>
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
                      <th>ClientName</th>
                      <th>AnydeskID</th>
                      <th>ServerUser</th>
                      <th>Update</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      tdata.map((item, index) => (
                        <tr key={index} onClick={() => { detailsClick(item) }}>
                          <td>{item.clientName}</td>
                          <td>{item.anydeskID}</td>
                          <td>{item.serverUser}</td>
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
              <div className="detailsCross" onClick={() => { setdetalisView(false); setInitialState() }}><CloseIcon sx={{ color: 'white' }} /></div>
            </div>
          </div>
          <div className="detailsInfoContainer">
            <div className="detailsInfoHeader">
              <div className="detailsInfoTitle">Information</div>
              <div className="detailsInfoDropDown"><ArrowDropDownIcon sx={{ color: 'white' }} /></div>
            </div>
            <div className="detailsFullInfo">
              <div className="detailsFullInfoInner">
                <div className="infoItems"><span>Client</span> <p>{details !== '' && details.clientName}</p></div>
                <div className="infoItems"><span>AnyDeskID</span> <p>{details !== '' && details.anydeskID}</p></div>
                <div className="infoItems"><span>AnydeskPassword</span> <p>{details !== '' && details.anydeskPassword}</p></div>
                <div className="infoItems"><span>Server User</span> <p>{details !== '' && details.serverUser}</p></div>
                <div className="infoItems"><span>Server Password</span> <p>{details !== '' && details.serverPassword}</p></div>
                <div className="infoItems"><span>Database Name</span> <p>{details !== '' && details.databaseServerName}</p></div>
                <div className="infoItems"><span>Database User</span> <p>{details !== '' && details.databaseServerUser}</p></div>
                <div className="infoItems"><span>Database Password</span> <p>{details !== '' && details.databaseServerPassword}</p></div>
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
              <div className="detailsTitle">Add Password</div>
              <div className="detailsCross" onClick={closeClick}><CloseIcon sx={{ color: 'white' }} /></div>
            </div>
          </div>
          {/* formPart */}
          <div className="formContainer">
            <form action="">
              <label htmlFor="">Client Name<span>*</span></label>
              <input value={data.clientName} type="text" name="" id="" placeholder='Clinet Name' onChange={e => setdata(ps => ({ ...ps, clientName: e.target.value }))} />
              <label htmlFor="">AnyDesk ID<span>*</span></label>
              <input value={data.anydeskID} type="text" name="" id="" placeholder='Anydesk ID' onChange={e => setdata(ps => ({ ...ps, anydeskID: e.target.value }))} />
              <label htmlFor="">AnyDest Password<span>*</span></label>
              <input value={data.anydeskPassword} type="text" name="" id="" placeholder='anydeskPassword' onChange={e => setdata(ps => ({ ...ps, anydeskPassword: e.target.value }))} />
              <label htmlFor="">Server User<span>*</span></label>
              <input value={data.serverUser} type="text" name="" id="" placeholder='.serverUser' onChange={e => setdata(ps => ({ ...ps, serverUser: e.target.value }))} />
              <label htmlFor="">Server Password<span>*</span></label>
              <input value={data.serverPassword} type="text" name="" id="" placeholder='serverPassword' onChange={e => setdata(ps => ({ ...ps, serverPassword: e.target.value }))} />
              <label htmlFor="">Database Server<span>*</span></label>
              <input value={data.databaseServerName} type="text" name="" id="" placeholder='databaseServerName' onChange={e => setdata(ps => ({ ...ps, databaseServerName: e.target.value }))} />
              <label htmlFor="">Database User<span>*</span></label>
              <input value={data.databaseServerUser} type="text" name="" id="" placeholder='databaseServerUser' onChange={e => setdata(ps => ({ ...ps, databaseServerUser: e.target.value }))} />
              <label htmlFor="">Database Password<span>*</span></label>
              <input value={data.databaseServerPassword} type="text" name="" id="" placeholder='databaseServerPassword' onChange={e => setdata(ps => ({ ...ps, databaseServerPassword: e.target.value }))} />
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
      {/* loding */}
      <div className="loadingConatiner" style={{ display: `${loading ? '' : 'none'}` }}>
        <CircularProgress />
      </div>
      {/* toast */}
      <div className="toast" style={{ display: `${toastView ? "" : 'none'}` }}>
        <p>Copy to ClipBoarid</p>
        <span onClick={() => { settoastView(false) }} ><CloseIcon sx={{ color: 'white' }} /></span>
      </div>
    </>
  )
}

export default User
