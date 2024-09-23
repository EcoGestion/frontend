import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const baseData = {
  labels: [''],
  datasets: [
    {
      label: 'Label',
      data: [0],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const PieChart = ({
  data = baseData,
  width = '100%',
  height = '100%',
  options = {}
}) => {
  const [chartData, setChartData] = useState(baseData);

  useEffect(() => {
    if (data) {
      setChartData(data);
    }
  }, [data]);

  const defaultOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    maintainAspectRatio: false,
    ...options, // Merge custom options with default options
  };

  return (
    <div style={{ width, height }}>
      <Pie data={chartData} options={defaultOptions} />
    </div>
  );
};

export default PieChart;