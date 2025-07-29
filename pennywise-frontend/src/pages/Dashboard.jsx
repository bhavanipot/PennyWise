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
  const [chatResponse, setChatResponse] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false); // ✅ new

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const categoryTotals = {}; // Moved outside so it's accessible in catch
  
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/expenses`,
        getAuthHeaders()
      );
      const data = response.data;
  
      setExpenses(data);
  
      const total = data.reduce(
        (sum, expense) => sum + parseFloat(expense.amount),
        0
      );
      setTotalSpending(total);
  
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
      console.warn('AI suggestion failed, using dynamic fallback.');
  
      const topCategory = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'a high-spending category';
  
      setSuggestion(`💡 Try to reduce spending in ${topCategory}, where you spent the most.`);
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
      setChatResponse(response.data.response);
    } catch (err) {
      console.error('AI query error:', err);
      setChatResponse('❌ AI failed to respond.');
    } finally {
      setLoadingAI(false);
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
          <p>{suggestion || 'Loading suggestions...'}</p>
          <button className="ask-button" onClick={() => setShowChatModal(true)}>
            Ask PennyWise 💬
          </button>
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
      

      {/* ✅ AI Chat Modal */}
      {showChatModal && (
        <div className="ai-modal-overlay">
          <div className="ai-modal">
            <h3>Ask PennyWise 💬</h3>
            <input
              type="text"
              placeholder="e.g. How can I reduce my grocery spending?"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleQuerySubmit}>Submit</button>
              <button onClick={() => setShowChatModal(false)}>Back</button>
            </div>
            {loadingAI && <p>Thinking...</p>}
            {chatResponse && <p className="chat-response">{chatResponse}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
