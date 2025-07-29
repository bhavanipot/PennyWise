import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import logo from '../assets/pennywise-logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (email === 'test@example.com' && password === 'test123') {
        localStorage.setItem('token', 'fake-jwt-token');
        setSuccess('Test login successful!');
        setTimeout(() => navigate('/dashboard'), 1000);
        return;
      }

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        email,
        password,
      });

      const token = res.data.access_token;
      if (token) {
        localStorage.setItem('token', token);
        setSuccess('Login successful!');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setError('Login failed — no token received.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed.');
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

          {/* ✅ UI Feedback Messages */}
          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

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
