// File: src/pages/AddExpense.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AddExpense = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/expenses', {
        description,
        amount: parseFloat(amount),
        date,
        category
      });

      alert(response.data.message);
      // Clear form after submission
      setDescription('');
      setAmount('');
      setDate('');
      setCategory('');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add expense');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <br />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <br />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddExpense;
