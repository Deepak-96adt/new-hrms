import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const generateColors = (numColors) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    colors.push(`rgba(${r},${g},${b},0.4)`);
    colors.push(`rgba(${r},${g},${b},1)`);
  }
  return colors;
};

const prepareGraphData = (data) => {
  const employees = Array.from(new Set(data.map((entry) => entry.employeeName)));
  console.log(employees);
  const dates = Array.from(new Set(data.map((entry) => entry.date)));
  console.log(dates);

  const colors = generateColors(employees.length);
  
  const datasets = employees.map((employee, index) => {
    const employeeData = data.filter(entry => entry.employeeName === employee);
  console.log(employeeData);

    const workingHours = dates.map(date => {
      const entry = employeeData.find(d => d.date === date);
      console.log(entry);
         
      if (entry && entry.totalWorkingHours) {
         console.log(entry.totalWorkingHours);
        const [hours, minutes, seconds] = entry.totalWorkingHours.split(':').map(Number);
        const totalHours = hours + (minutes / 60) + (seconds / 3600);
        return parseFloat(totalHours.toFixed(2));
      } else {
        return null;
      }
    });

    return {
      label: employee,
      data: workingHours,
      fill: true,
      backgroundColor: colors[index * 2],
      borderColor: colors[index * 2 + 1],
      pointBackgroundColor: colors[index * 2 + 1],
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: colors[index * 2 + 1],
      pointRadius: 5,
      pointHoverRadius: 7,
    };
  });

  return {
    labels: dates,
    datasets,
  };
};

const Graph = ({ data }) => {
  const chartData = prepareGraphData(data);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#333',
        },
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: {
          size: 16,
          weight: 'bold',
        },
        bodyFont: {
          size: 14,
        },
        footerFont: {
          size: 12,
        },
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value} hours`;
          },
        },
      },
      title: {
        display: true,
        text: 'Employee Attendance Graph',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#333',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#666',
        },
      },
      y: {
        grid: {
          color: 'rgba(200,200,200,0.2)',
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#666',
          beginAtZero: true,
        },
        title: {
          display: true,
          text: 'Working Hours',
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#666',
        },
      },
    },
    spanGaps: true, // Ensure lines span over null data points
  };

  return <Line data={chartData} options={options} />;
};

export default Graph;




