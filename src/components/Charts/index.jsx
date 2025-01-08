import React from 'react';
import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

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
    const data = {
        labels: sortedTransactions.map((item) => item.date),//x value
        datasets: [
            {
                label: 'My Transaction History',
                data: sortedTransactions.map((item) => item.amount),//y value
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
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

    const spendingData = sortedTransactions.filter(item => item.type === "expense");
    let spendingArray = [];
    spendingData.forEach(item => {
        if (spendingArray.find(e => e.tag == item.tag)) {
            spendingArray.find(e => e.tag === item.tag).amount += item.amount
        }
        else {
            spendingArray.push({ tag: item.tag, amount: item.amount })
        }
    })
    console.log("spending", spendingArray)
    const pieData = {
        labels: spendingArray.map(item => item.tag), // Labels for each segment
        datasets: [
            {
                label: 'My Spending',
                data: spendingArray.map(item => item.amount), // The data values for each segment
                backgroundColor: ['red', 'blue', 'yellow', 'green'], // Colors for the segments
                hoverOffset: 4, // Optional: Adds an effect when hovering over segments
            },
        ],
    };

    const pieOptions = {
        responsive: true, // Makes the chart responsive
        plugins: {
            legend: {
                position: 'top', // Positions the legend at the top
            },
            tooltip: {
                enabled: true, // Enables tooltips when hovering over a segment
            },
        },
    };
    return (
        <div className='chart-wrapper'>
            <div className='lineGraph'>
                <h2 style={{marginBottom:"1.5rem"}}>My Analytics</h2>
                <Line  data={data} options={options} />

            </div>
            <div className='pieGraph'>
                <h2 style={{marginBottom:"1.5rem"}}>My Spending</h2>
                <Pie  data={pieData} options={pieOptions} />
            </div>
        </div>

    );
};

export default ChartComponent;
