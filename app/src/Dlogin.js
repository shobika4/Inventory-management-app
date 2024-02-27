import React, { useState } from 'react';
import './Dlogin.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = () => {
    navigate('/Deliverytable');
  }

  return (
    <div className='indexpage'>
      <div className='index'>
        <h1 className='head'>LOGIN HERE</h1>
        <div className='input-container'>
          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className='login-button' onClick={handleLogin}>LOGIN</button>
      </div>
    </div>
  );
};

export default Login;