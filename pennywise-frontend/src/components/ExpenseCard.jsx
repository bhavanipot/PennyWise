// File: src/components/ExpenseList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExpenseCard from './ExpenseCard';
import { getAuthHeaders } from '../utils/auth';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/expenses`,
          getAuthHeaders()  // ✅ Centralized auth header
        );
        setExpenses(res.data);
      } catch (error) {
        console.error('Failed to fetch expenses', error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      {expenses.length > 0 ? (
        expenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            description={expense.description}
            category={expense.category}  // Optional
            amount={expense.amount}
            date={expense.date}
          />
        ))
      ) : (
        <p>No expenses found.</p>
      )}
    </div>
  );
};

export default ExpenseList;
