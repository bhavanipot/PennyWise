// File: src/pages/Signup.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import logo from '../assets/pennywise-logo.png';

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <img src={logo} alt="Pennywise Logo" className="signup-big-logo" />
      </div>
      <div className="signup-right">
        <h1 className="signup-title">Sign Up</h1>
        <form className="signup-form" onSubmit={handleSignup}>
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />
        </form>
        <button className="signup-button" type="submit">
            Create Account
        </button>
        <p className="login-link">
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
