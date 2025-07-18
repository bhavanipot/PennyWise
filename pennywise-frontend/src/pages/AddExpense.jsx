import React from 'react';

const AddExpense = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Expense added');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Description" required />
        <br />
        <input type="number" placeholder="Amount" required />
        <br />
        <input type="date" required />
        <br />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddExpense;
