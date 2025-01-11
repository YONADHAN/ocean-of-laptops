import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CategorySales = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Category-wise Sales",
      },
    },
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Laptop Categories",
        },
      },
      y: {
        type: "linear",
        title: {
          display: true,
          text: "Sales ($)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <Bar options={options} data={data} />
    </div>
  );
};

export default CategorySales;
