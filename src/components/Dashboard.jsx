import React from 'react';
    import { Chart } from 'chart.js/auto';
    import { useRef, useEffect } from 'react';
    import formatIndianNumber from '../utils/formatIndianNumber';

    function Dashboard({ expenses }) {
      const chartRef = useRef(null);

      useEffect(() => {
        if (expenses.length > 0) {
          const descriptionTotals = expenses.reduce((acc, expense) => {
            acc[expense.description] = (acc[expense.description] || 0) + expense.amount;
            return acc;
          }, {});

          const labels = Object.keys(descriptionTotals);
          const data = Object.values(descriptionTotals);

          const ctx = chartRef.current.getContext('2d');

          if (window.myChart) {
            window.myChart.destroy();
          }

          window.myChart = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'Expenses by Description',
                  data: data,
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            },
          });
        }
      }, [expenses]);

      return (
        <div className="dashboard">
          <h2>Expense Dashboard</h2>
          {expenses.length === 0 ? (
            <p>No expenses added yet.</p>
          ) : (
            <div className="chart-container">
              <canvas ref={chartRef}></canvas>
            </div>
          )}
        </div>
      );
    }

    export default Dashboard;
