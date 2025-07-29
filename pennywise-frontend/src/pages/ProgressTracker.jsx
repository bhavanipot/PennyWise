import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';
import './ProgressTracker.css';

const ProgressTracker = () => {
  const [budget, setBudget] = useState(null);
  const [spending, setSpending] = useState(0);
  const [loading, setLoading] = useState(true);

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const month = getCurrentMonth();

      try {
        const budgetRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/get-budget`,
          {
            params: { month },
            headers: getAuthHeaders().headers,
          }
        );

        const expenseRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/expenses`,
          getAuthHeaders()
        );

        const expenses = expenseRes.data;
        const currentMonthExpenses = expenses.filter((e) => e.date?.startsWith(month));
        const totalSpent = currentMonthExpenses.reduce(
          (sum, e) => sum + parseFloat(e.amount || 0),
          0
        );

        setBudget(parseFloat(budgetRes.data.amount));
        setSpending(totalSpent);
      } catch (err) {
        console.error('Failed to fetch budget or expenses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const usagePercent = budget ? Math.min((spending / budget) * 100, 100) : 0;

  return (
    <div className="progress-container">
      <h2 className="progress-title">Progress Tracker</h2>
      <p className="progress-subtext">
        Track how well you’re staying within your monthly budget
      </p>

      <div className="progress-box">
        {loading ? (
          <p>Loading progress...</p>
        ) : budget ? (
          <>
            <p><strong>Monthly Budget:</strong> ${budget.toFixed(2)}</p>
            <p><strong>Spent so far:</strong> ${spending.toFixed(2)}</p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${usagePercent}%` }}
              ></div>
            </div>

            <p className="progress-percent">{usagePercent.toFixed(0)}% used</p>

            {usagePercent >= 90 && (
              <p className="warning">⚠️ You’re nearing your budget limit!</p>
            )}
          </>
        ) : (
          <p>No budget set for this month yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;
