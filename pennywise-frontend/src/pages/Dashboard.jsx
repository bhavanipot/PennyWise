import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/pennywise-logo.png';
import { getAuthHeaders } from '../utils/auth';

const Dashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [totalSpending, setTotalSpending] = useState(0);
  const [suggestion, setSuggestion] = useState('');
  const [customQuery, setCustomQuery] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/expenses`,
        getAuthHeaders()
      );
      const data = response.data;

      setExpenses(data);

      // Calculate total spending
      const total = data.reduce(
        (sum, expense) => sum + parseFloat(expense.amount),
        0
      );
      setTotalSpending(total);

      // Default AI suggestion (from category data)
      const categoryTotals = {};
      data.forEach((e) => {
        categoryTotals[e.category] =
          (categoryTotals[e.category] || 0) + parseFloat(e.amount);
      });

      const aiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/spending-insights`,
        { categories: categoryTotals },
        getAuthHeaders()
      );

      setSuggestion(aiResponse.data.response);
    } catch (err) {
      console.error('Error fetching expenses or AI insight:', err);
      setSuggestion('Unable to load AI suggestions.');
    }
  };

  const handleQuerySubmit = async () => {
    if (!customQuery.trim()) return;

    try {
      setLoadingAI(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/ask-ai`,
        { query: customQuery },
        getAuthHeaders()
      );
      setSuggestion(response.data.response);
    } catch (err) {
      console.error('AI query error:', err);
      setSuggestion('❌ AI failed to respond.');
    } finally {
      setLoadingAI(false);
      setCustomQuery('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo-title">
          <img src={logo} alt="Logo" className="dashboard-logo" />
          <h1 className="dashboard-title">PennyWise</h1>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          LOG OUT
        </button>
      </header>

      <section className="welcome-section">
        <h2 className="welcome-heading">Welcome Back!</h2>
        <p className="welcome-subtext">
          Track your expenses and manage your budget
        </p>
      </section>

      <div className="dashboard-grid">
        <div className="card spending-card">
          <h3>Monthly Spending</h3>
          <div className="donut-chart">
            <div className="donut-center">${totalSpending.toFixed(2)}</div>
          </div>
        </div>

        <div className="card suggestion-card">
          <h3>💡 AI Suggestions</h3>
          <p>{loadingAI ? 'Thinking...' : suggestion || 'No suggestions yet.'}</p>

          <div className="ai-query-box">
            <input
              type="text"
              placeholder="Ask PennyWise anything..."
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
            />
            <button onClick={handleQuerySubmit}>Ask</button>
          </div>
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
              {expenses
                .slice()
                .reverse()
                .slice(0, 5)
                .map((e) => (
                  <tr key={e.id}>
                    <td>{e.date || 'N/A'}</td>
                    <td>{e.category}</td>
                    <td>${parseFloat(e.amount).toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="add-button" onClick={() => navigate('/add-expense')}>
          Add Expense
        </button>
        <button className="report-button" onClick={() => navigate('/expense-breakdown')}>
          View Reports
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
