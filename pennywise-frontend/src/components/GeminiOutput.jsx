// File: src/components/GeminiOutput.jsx
import React from 'react';
import './GeminiOutput.css';

const GeminiOutput = ({ suggestion }) => {
  return (
    <div className="gemini-output">
      <h3>AI Budget Suggestion</h3>
      <p>{suggestion || 'Waiting for response...'}</p>
    </div>
  );
};

export default GeminiOutput;
