import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({
  data = {},
  width = '100%',
  height = '100%',
  options = {},
  label = ''
}) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: label,
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    if (data) {
      const labels = Object.keys(data);
      const values = Object.values(data);
      const backgroundColors = labels.map((_, index) => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`);
      const borderColors = labels.map((_, index) => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`);

      setChartData({
        labels,
        datasets: [
          {
            label: label,
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      });
    }
  }, [data]);

  return <Pie data={chartData} width={width} height={height} options={options} />;
};

export default PieChart;