import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import './DoughnutChart.css';

const DoughnutChart = (props) => {

  const { prData } = props
  console.log(JSON.stringify(prData))

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

  const result = prData.reduce((acc, item) => {
    const prDetails = item.pr_details;
    // const count = item.pr_count;
    // while(count > 0) {
      
    // }

    prDetails.forEach(detail => {
      console.log("Detail"+ JSON.stringify(detail))
      const loginId = detail.author;
      const total = item.pr_count
      console.log("PR contr total", total);
      if (!acc[loginId]) {
        acc[loginId] = total;
      } else {
        acc[loginId] += total;
      }
    });
    return acc;
  }, {});

  console.log("Result"+ JSON.stringify(result))
  const piePRDataLabels = Object.keys(result);
  console.log("pieprDataLabels"+ JSON.stringify(piePRDataLabels))
  console.log("Result"+ JSON.stringify(result))

  let piePRData = [];
    let i = 0;
    while (i < piePRDataLabels.length) {
      piePRData.push(result[piePRDataLabels[i]]);
      i = i + 1;
    }

    console.log("piePRData"+ JSON.stringify(piePRData))
  const handleMetricChange = (metric) => {
    switch (metric) {
      case 'data1':
        setChartData({
          ...chartData,
          "labels": piePRDataLabels,
          datasets: [
            {
              ...chartData.datasets[0],
              data: piePRData,
              "backgroundColor": [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#6C757D',
                '#28A745',
                '#007BFF',
                '#DC3545',
                '#F0AD4E',
              ],
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
            <option value="data1">PR count</option>
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
