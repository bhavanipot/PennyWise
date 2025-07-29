import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';
import './GeminiOutput.css';

const GeminiOutput = ({ expenses }) => {
  const [suggestion, setSuggestion] = useState('Loading...');

  useEffect(() => {
    const fetchSuggestion = async () => {
      if (!expenses || expenses.length === 0) {
        setSuggestion('No expenses yet to analyze.');
        return;
      }

      try {
        const categoryTotals = {};
        expenses.forEach(({ category, amount }) => {
          if (!category) return;
          categoryTotals[category] =
            (categoryTotals[category] || 0) + parseFloat(amount);
        });

        const aiRes = await axios.post(
          `${process.env.REACT_APP_API_URL}/spending-insights`,
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
  }, [expenses]);

  return (
    <div className="gemini-output">
      <h3>💡 AI Budget Suggestion</h3>
      <p>{suggestion}</p>
    </div>
  );
};

export default GeminiOutput;
