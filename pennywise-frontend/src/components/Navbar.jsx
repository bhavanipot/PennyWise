// File: src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/add-expense">Add Expense</Link>
      <Link to="/budget-limit">Budget Limit</Link>
      <Link to="/expense-breakdown">Breakdown</Link>
      <Link to="/progress">Progress</Link>
      <Link to="/">Logout</Link>
    </nav>
  );
};

export default Navbar;
