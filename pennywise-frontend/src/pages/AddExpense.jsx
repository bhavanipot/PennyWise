import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- needed for redirect
import './AddExpense.css';
import logo from '../assets/pennywise-logo.png';

const AddExpense = () => {
  const navigate = useNavigate(); // ✅

  const [form, setForm] = useState({
    amount: '',
    date: '',
    category: '',
    description: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/expenses`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Expense added!");
      setForm({ amount: '', date: '', category: '', description: '' });

      // ✅ Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      alert("❌ Failed to add expense.");
      console.error(err);
    }
  };

  return (
    <div className="expense-container">
      <form className="expense-form" onSubmit={handleSubmit}>
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="expense-title">Add Expense</h2>

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <button type="submit">ADD EXPENSE</button>

        {/* Optional cancel/back button */}
        <button
          type="button"
          style={{ marginTop: '10px', backgroundColor: '#ccc' }}
          onClick={() => navigate('/dashboard')}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
