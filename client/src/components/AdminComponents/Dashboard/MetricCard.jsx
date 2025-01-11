import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

const MetricCard = ({ title, value, percentage, data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'category',
        display: false,
      },
      y: {
        type: 'linear',
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <span className="text-emerald-600 text-sm">+{percentage}%</span>
      </div>
      <div className="h-[100px]">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default MetricCard;

