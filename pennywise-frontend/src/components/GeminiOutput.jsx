
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';
import './GeminiOutput.css';

const GeminiOutput = () => {
  const [suggestion, setSuggestion] = useState('Loading...');

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        // 1. Fetch expenses from backend with auth
        const expenseRes = await axios.get(
          'http://localhost:5000/expenses',
          getAuthHeaders()
        );
        const expenses = expenseRes.data;

        // 2. Group and total expenses by category
        const categoryTotals = {};
        expenses.forEach((expense) => {
          const category = expense.category;
          const amount = parseFloat(expense.amount);
          if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
          }
          categoryTotals[category] += amount;
        });

        // 3. Send to AI suggestion endpoint with auth
        const aiRes = await axios.post(
          'http://localhost:5000/spending-insights',
          { categories: categoryTotals },
          getAuthHeaders()
        );

        setSuggestion(aiRes.data.response);
      } catch (error) {
        console.error('Error loading AI suggestions:', error);
        setSuggestion('Unable to load suggestion.');
      }
    };

    fetchSuggestion();
  }, []);

  return (
    <div className="gemini-output">
      <h3>💡 AI Budget Suggestion</h3>
      <p>{suggestion}</p>
    </div>
  );
};

export default GeminiOutput;
