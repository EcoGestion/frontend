import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const baseData = {
  labels: [''],
  datasets: [
    {
      label: 'Label',
      data: [0],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
};

const BarChart = ({ data = baseData, displayTitle = false }) => {
  const [chartData, setChartData] = useState(baseData);

  useEffect(() => {
    if (data) {
      setChartData(data);
    }
  }, [data]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: displayTitle,
        text: 'Cantidad de solicitudes por mes',
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className='h-full'>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;