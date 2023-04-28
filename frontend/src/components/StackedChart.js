import React from "react";
import { Bar } from "react-chartjs-2";
import "./PullRequestsBarChart.css";

function StackedChart({ chartData }) {
  const dataset = {
    labels: chartData.labels,
    datasets: chartData.authors.map((author, i) => ({
      label: author.name,
      data: author.commits,
    })),
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    opacity: 1,
    scales: {
      xAxes: [
        {
          stacked: true,
        },
      ],
      yAxes: [
        {
          stacked: true,
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <Bar data={dataset} options={options} />
      </div>
    </div>
  );
}

export default StackedChart;
