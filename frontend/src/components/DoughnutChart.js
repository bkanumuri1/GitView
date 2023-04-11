import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import './DoughnutChart.css';

const DoughnutChart = () => {
  const [chartData, setChartData] = useState({
    labels: ['Red', 'Green', 'Blue'],
    datasets: [
      {
        label: 'My Doughnut Chart',
        data: [12, 19, 3],
        // backgroundColor: ['purple', 'pink', 'yellow']
      }
    ]
  });


  const handleMetricChange = (metric) => {
    switch (metric) {
      case 'data1':
        setChartData({
          ...chartData,
          datasets: [
            {
              ...chartData.datasets[0],
              data: [12, 19, 3]
            }
          ]
        });
        break;
      case 'data2':
        setChartData({
          ...chartData,
          datasets: [
            {
              ...chartData.datasets[0],
              data: [5, 23, 12]
            }
          ]
        });
        break;
      case 'data3':
        setChartData({
          ...chartData,
          datasets: [
            {
              ...chartData.datasets[0],
              data: [8, 10, 15]
            }
          ]
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="widget">
      <div className="widget-title">All contributors</div>
      <div className="widget-chart-container">
        <div className="widget-dropdown">
          <select onChange={(event) => handleMetricChange(event.target.value)}>
            <option value="data1">Data 1</option>
            <option value="data2">Data 2</option>
            <option value="data3">Data 3</option>
          </select>
        </div>
            <Doughnut data={chartData} options={{
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
          }} />
      </div>
    </div>
  );
};

export default DoughnutChart;
