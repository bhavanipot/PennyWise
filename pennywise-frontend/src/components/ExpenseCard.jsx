// File: src/components/ExpenseList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExpenseCard from './ExpenseCard';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/expenses');
        setExpenses(res.data);
      } catch (error) {
        console.error("Failed to fetch expenses", error);
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
