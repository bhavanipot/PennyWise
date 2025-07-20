import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import logo from '../assets/pennywise-logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <img src={logo} alt="PennyWise Logo" className="login-logo" />
      </div>
      <div className="login-right">
        <h1 className="login-title">Login</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">ENTER</button>
        </form>
        <p className="signup-link">
          Don’t have an account? <Link to="/signup">CLICK HERE</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
