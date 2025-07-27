// File: src/components/DonutChart.jsx
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import './DonutChart.css';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/expenses`);
        const expenses = res.data;

        const totals = {};
        expenses.forEach(e => {
          totals[e.category] = (totals[e.category] || 0) + parseFloat(e.amount);
        });

        setChartData({
          labels: Object.keys(totals),
          datasets: [
            {
              data: Object.values(totals),
              backgroundColor: ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#6f42c1'],
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div className="donut-chart">
      {chartData ? <Doughnut data={chartData} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default DonutChart;
