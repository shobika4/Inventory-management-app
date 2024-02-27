import React from 'react'
//import './Ilogin.css'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate();
  const handleDT = () =>{
    navigate('/Dlogin')
  }
  const handleIT = () =>{
    navigate('/Upload')
  }
  return (
    <div className='indexpage'>
        <div className='index'>
            <h1 className='head'>LOGIN HERE</h1>
            <button className='IT' onClick={handleIT}>INVENTORY TEAM</button>
            <button className='DT' onClick={handleDT}>DELIVERY TEAM</button>
        </div>
    </div>
  )
}

export default Login