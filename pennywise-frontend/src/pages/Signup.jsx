import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';
import logo from '../assets/pennywise-logo.png';

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("❌ Passwords don't match.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/signup`, {
        email,
        password
      });

      setSuccess(response.data.message);
      setTimeout(() => navigate('/'), 1500); // brief pause before redirect
    } catch (error) {
      setError(error.response?.data?.error || 'Signup failed.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <img src={logo} alt="Pennywise Logo" className="signup-big-logo" />
      </div>
      <div className="signup-right">
        <h1 className="signup-title">Sign Up</h1>
        <form className="signup-form" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* Inline error or success messages */}
          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <button className="signup-button" type="submit">
            Create Account
          </button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
