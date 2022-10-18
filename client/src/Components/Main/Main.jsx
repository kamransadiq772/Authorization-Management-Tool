import React,{useEffect} from 'react'
import Nav from '../Nav/Nav'
import Other from '../Other/Other'
import Footer from '../Footer/Footer'
import {useNavigate} from 'react-router-dom'

const Main = () => {

  const navigate = useNavigate()

  // if(localStorage.getItem('user') == null){
  //   return navigate('/')
  // }



  useEffect(()=>{
    if(localStorage.getItem('user') == null){
      navigate('/')
    }
  },[])

  return (
    <div style={{width:'100%',height:'100%'}}>
    <Nav />
    <Other />
    <Footer />
    </div>
  )
}

export default Main