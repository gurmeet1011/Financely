import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ sortedTransactions }) => {
  // Expense Line Chart Data
  const expenseData = sortedTransactions.filter((item) => item.type === 'expense');
  const expenseLineData = {
    labels: expenseData.map((item) => item.date),
    datasets: [
      {
        label: 'Expense Over Time',
        data: expenseData.map((item) => item.amount),
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  // Income Line Chart Data
  const incomeData = sortedTransactions.filter((item) => item.type === 'income');
  const incomeLineData = {
    labels: incomeData.map((item) => item.date),
    datasets: [
      {
        label: 'Income Over Time',
        data: incomeData.map((item) => item.amount),
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
      },
    ],
  };

  // Pie Chart Data for Spending
  let spendingArray = [];
  expenseData.forEach((item) => {
    const existing = spendingArray.find((e) => e.tag === item.tag);
    if (existing) {
      existing.amount += item.amount;
    } else {
      spendingArray.push({ tag: item.tag, amount: item.amount });
    }
  });

  const pieDataExpense = {
    labels: spendingArray.map((item) => item.tag),
    datasets: [
      {
        label: 'My Spending',
        data: spendingArray.map((item) => item.amount),
        backgroundColor: ['red', 'blue', 'yellow', 'green'],
        hoverOffset: 4,
      },
    ],
  };

  // Pie Chart Data for Income
  let incomeArray = [];
  incomeData.forEach((item) => {
    const existing = incomeArray.find((e) => e.tag === item.tag);
    if (existing) {
      existing.amount += item.amount;
    } else {
      incomeArray.push({ tag: item.tag, amount: item.amount });
    }
  });

  const pieDataIncome = {
    labels: incomeArray.map((item) => item.tag),
    datasets: [
      {
        label: 'My Income',
        data: incomeArray.map((item) => item.amount),
        backgroundColor: ['orange', 'purple', 'cyan', 'lime'],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="chart-wrapper">
      {/* Expense Line Chart and Pie Chart */}
      <div className="chart-row">
        <div className="lineGraph">
          <h2 style={{ marginBottom: '1.5rem' }}>Expense Over Time</h2>
          <Line data={expenseLineData} options={options} />
        </div>
        <div className="pieGraph">
          <h2 style={{ marginBottom: '1.5rem' }}>My Spending</h2>
          <Pie data={pieDataExpense} options={pieOptions} />
        </div>
      </div>

      {/* Income Line Chart and Pie Chart */}
      <div className="chart-row">
        <div className="lineGraph">
          <h2 style={{ marginBottom: '1.5rem' }}>Income Over Time</h2>
          <Line data={incomeLineData} options={options} />
        </div>
        <div className="pieGraph">
          <h2 style={{ marginBottom: '1.5rem' }}>My Income</h2>
          <Pie data={pieDataIncome} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;


