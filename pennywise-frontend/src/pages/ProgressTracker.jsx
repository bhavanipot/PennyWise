// File: src/pages/ProgressTracker.jsx
import React from 'react';
import './ProgressTracker.css';

const ProgressTracker = () => {
  return (
    <div className="progress-container">
      <h2 className="progress-title">Progress Tracker</h2>
      <p className="progress-subtext">Track how well you’re staying within your budget</p>

      <div className="progress-box">
        <p>🎯 Goal progress and budget usage visualizations will appear here!</p>
      </div>
    </div>
  );
};

export default ProgressTracker;
