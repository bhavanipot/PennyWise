// File: src/components/ExpenseCard.jsx
import React from 'react';
import './ExpenseCard.css';

const ExpenseCard = ({ description, amount, date }) => {
  return (
    <div className="expense-card">
      <div className="expense-description">{description}</div>
      <div className="expense-meta">
        <span className="expense-amount">${amount}</span>
        <span className="expense-date">{date}</span>
      </div>
    </div>
  );
};

export default ExpenseCard;
