import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
        Dashboard
      </NavLink>
      <NavLink to="/add-expense" className={({ isActive }) => isActive ? 'active' : ''}>
        Add Expense
      </NavLink>
      <NavLink to="/budget-limit" className={({ isActive }) => isActive ? 'active' : ''}>
        Budget Limit
      </NavLink>
      <NavLink to="/expense-breakdown" className={({ isActive }) => isActive ? 'active' : ''}>
        Breakdown
      </NavLink>
      <NavLink to="/progress" className={({ isActive }) => isActive ? 'active' : ''}>
        Progress
      </NavLink>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
