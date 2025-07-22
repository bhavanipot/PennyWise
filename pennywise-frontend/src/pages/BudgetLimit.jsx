// File: src/pages/BudgetLimit.jsx
import React, { useState } from 'react';
import axios from 'axios';
import {getAuthHeaders} from '../utils/auth';


const BudgetLimit = () => {
  const [month, setMonth] = useState('');
  const [amount, setAmount] = useState('');
  const [currentBudget, setCurrentBudget] = useState(null);
  const [message, setMessage] = useState('');

  const handleSetBudget = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/set-budget',{
        month,
        amount: parseFloat(amount)
      },
      getAuthHeaders()
    );

      setMessage(response.data.message);
      setCurrentBudget(amount);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to set budget');
    }
  };

  const handleFetchBudget = async () => {
    if (!month) {
      setMessage('Please select a month');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/get-budget', {
        params: { month }
      },
      getAuthHeaders()
    );

      setCurrentBudget(response.data.amount);
      setMessage('');
    } catch (error) {
      setCurrentBudget(null);
      setMessage(error.response?.data?.message || 'Failed to fetch budget');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Set Monthly Budget</h2>
      <form onSubmit={handleSetBudget}>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        />
        <br />
        <input
          type="number"
          placeholder="Enter budget amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <br />
        <button type="submit">Set Budget</button>
      </form>

      <br />
      <button onClick={handleFetchBudget}>Check Current Budget</button>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
      {currentBudget !== null && (
        <p>Budget for {month}: ${currentBudget}</p>
      )}
    </div>
  );
};

export default BudgetLimit;
