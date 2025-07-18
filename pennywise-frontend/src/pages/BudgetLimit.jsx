import React from 'react';
import './Form.css';

const BudgetLimit = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Budget set');
  };

  return (
    <div className="form-container">
      <h2>Set Monthly Budget</h2>
      <form onSubmit={handleSubmit} className="form">
        <input type="number" placeholder="Enter budget" required />
        <button type="submit">Save Budget</button>
      </form>
    </div>
  );
};

export default BudgetLimit;
