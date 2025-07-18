import React from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/pennywise-logo.png';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo-title">
          <img src={logo} alt="Logo" className="dashboard-logo" />
          <h1 className="dashboard-title">PennyWise</h1>
        </div>
        <button className="logout-button" onClick={handleLogout}>LOG OUT</button>
      </header>

      <section className="welcome-section">
        <h2 className="welcome-heading">Welcome User</h2>
        <p className="welcome-subtext">Track your expenses and manage your budget</p>
      </section>

      <div className="dashboard-grid">
        <div className="card spending-card">
          <h3>Monthly Spending</h3>
          <div className="donut-chart">
            <div className="donut-center">$1,250</div>
          </div>
        </div>

        <div className="card suggestion-card">
          <h3>💡 AI Suggestions</h3>
          <p>Consider reducing your dining out expenses to save more</p>
        </div>

        <div className="card recent-card">
          <h3>Recent Expenses</h3>
          <table className="expenses-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>CATEGORY</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>APR 20</td><td>Groceries</td><td>$200</td></tr>
              <tr><td>APR 18</td><td>Rent</td><td>$900</td></tr>
              <tr><td>APR 15</td><td>Utilities</td><td>$150</td></tr>
              <tr><td>APR 10</td><td>Entertainment</td><td>$100</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="add-button">Add Expense</button>
        <button className="report-button">View Reports</button>
      </div>
    </div>
  );
};

export default Dashboard;
