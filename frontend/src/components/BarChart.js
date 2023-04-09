import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function BarChart({ chartData }) {
  return (
    <div
      style={{
        position: "relative",
        margin: "auto",
        width: "80vw",
        height: "40vh",
      }}
    >
      <Bar data={chartData} />
    </div>
  );
}

export default BarChart;