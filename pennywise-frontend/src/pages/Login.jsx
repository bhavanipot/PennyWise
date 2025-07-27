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

      if (email === "test@example.com" && password === "test123") {
        localStorage.setItem('token', 'fake-jwt-token');
        navigate('/dashboard');
      } else {
        alert('Invalid test credentials');
      }

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        email,
        password,
      });

      const token = res.data.access_token;
      if (token) {
        localStorage.setItem('token', token); //  Store token
        console.log("Token stored:", token);   //  Confirm in console
        navigate('/dashboard');               // Redirect after login
      } else {
        throw new Error("No token received");
      }
    } catch (err) {
      console.error("Login error:", err);
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
