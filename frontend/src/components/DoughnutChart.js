import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import "./DoughnutChart.css";

const DoughnutChart = (props) => {
  const { prData } = props;

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const result = prData.reduce((acc, item) => {
    const prDetails = item.pr_details;
    prDetails.forEach((detail) => {
      const loginId = detail.author;
      if (!acc[loginId]) {
        acc[loginId] = 1;
      } else {
        acc[loginId] += 1;
      }
    });
    return acc;
  }, {});

  const result2 = prData.reduce((acc, item) => {
    const prDetails = item.pr_details;
    prDetails.forEach((detail) => {
      const reviews = detail.reviews;
      reviews.forEach((rdetail) => {
        const loginId = rdetail.author;
        if (!acc[loginId]) {
          acc[loginId] = 1;
        } else {
          acc[loginId] += 1;
        }
      });
    });
    return acc;
  }, {});

  const piePRDataLabels = Object.keys(result);
  const piePRDataLabels2 = Object.keys(result2);

  let piePRData = [];
  let i = 0;
  while (i < piePRDataLabels.length) {
    piePRData.push(result[piePRDataLabels[i]]);
    i = i + 1;
  }

  let reviewPRData = [];
  let j = 0;
  while (j < piePRDataLabels2.length) {
    reviewPRData.push(result[piePRDataLabels2[j]]);
    j = j + 1;
  }

  const handleMetricChange = (metric) => {
    if (metric == null) {
      metric = "data1";
    }
    switch (metric) {
      case "data1":
        setChartData({
          ...chartData,
          labels: piePRDataLabels,
          datasets: [
            {
              ...chartData.datasets[0],
              data: piePRData,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#6C757D",
                "#28A745",
                "#007BFF",
                "#DC3545",
                "#F0AD4E",
              ],
            },
          ],
        });
        break;
      case "data2":
        setChartData({
          ...chartData,
          labels: piePRDataLabels2,
          datasets: [
            {
              ...chartData.datasets[0],
              data: reviewPRData,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#6C757D",
                "#28A745",
                "#007BFF",
                "#DC3545",
                "#F0AD4E",
              ],
            },
          ],
        });
        break;
      case "data3":
        setChartData({
          ...chartData,
          datasets: [
            {
              ...chartData.datasets[0],
              data: [8, 10, 15],
            },
          ],
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    handleMetricChange("data1");
  }, [prData]);

  return (
    <div className="widget">
      <div className="widget-title">All contributors</div>
      <div className="widget-chart-container">
        <div className="widget-dropdown">
          <select onChange={(event) => handleMetricChange(event.target.value)}>
            <option value="data1">PR count</option>
            <option value="data2">Reviews count</option>
          </select>
        </div>
        <Doughnut
          data={chartData}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }}
        />
      </div>
    </div>
  );
};

export default DoughnutChart;
