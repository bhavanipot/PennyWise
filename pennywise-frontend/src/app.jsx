// File: src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Login from './pages/Login';           // ← now includes logo + login
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import BudgetLimit from './pages/BudgetLimit';
import ExpenseBreakdown from './pages/ExpenseBreakdown';
import ProgressTracker from './pages/ProgressTracker';

// Styles
import './pages/Login.css';                  // ← combined login+landing styling
import './pages/Signup.css';                 // ← optional: signup styling

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/budget-limit" element={<BudgetLimit />} />
        <Route path="/expense-breakdown" element={<ExpenseBreakdown />} />
        <Route path="/progress" element={<ProgressTracker />} />
      </Routes>
    </Router>
  );
}

export default App;
