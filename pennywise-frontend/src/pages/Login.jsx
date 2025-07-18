import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import logo from '../assets/pennywise-logo.png';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <img src={logo} alt="PennyWise Logo" className="login-logo" />
      </div>
      <div className="login-right">
        <h1 className="login-title">Login</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <input type="text" placeholder="username" required />
          <input type="password" placeholder="password" required />
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