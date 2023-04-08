import React from "react";
import { Bar,Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function BarChart({ chartData }) {
  return <div style={{ position: "relative", margin: "auto", width: "80vw", height: '40vh' }}> <Bar data={chartData}   />
  <Line data={chartData}/>
  
  </div>;
}

export default BarChart;