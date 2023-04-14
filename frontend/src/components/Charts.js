import React from "react";
import { useState ,useEffect} from "react";
import { Bar,Line } from "react-chartjs-2";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import moment from 'moment';
import selectedDates from '../App'

const Chart = (props) => {
    const {commitData}=props;
    const {dates}=props;
    const { selectedContributor } = props;
    const chartStart = new Date(dates[0].startDate.toISOString().slice(0, 10));
    const chartEnd = new Date(dates[0].endDate.toISOString().slice(0, 10));
    const dateRange = [];
    while(chartStart <= chartEnd){
      dateRange.push(moment(chartStart).format('YYYY-MM-DD'));
      chartStart.setDate(chartStart.getDate() + 1);
    }
    const chartCommitMap = dateRange.map((date) => {
      const obj = commitData.find((d) => moment(d.date).format('YYYY-MM-DD') === date);
      return { date, count: obj ? obj.commit_count : 0 };
    });
    const [userData, setUserData] = useState({
      labels: chartCommitMap.map((d) => d.date),
      datasets: [
        {
          label: "Commits",
          data: chartCommitMap.map((d) => d.count),
          backgroundColor: [
            "rgba(75,192,192,1)",
          ],
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    });

    useEffect(()=>{
      setUserData({labels: chartCommitMap.map((d) => d.date),
        datasets: [
          {
            label: "Commits",
            data: chartCommitMap.map((d) => d.count),
            backgroundColor: [
              "rgba(75,192,192,1)",
            ],
            borderColor: "black",
            borderWidth: 2,
          },
        ],
      })
    },[commitData])

    // pie chart for comparing contributor's contributions
    const result = commitData.reduce((acc, item) => {
      const commitDetails = item.commit_details;
      commitDetails.forEach(detail => {
        const loginId = detail.author;
        const total = detail.additions + detail.deletions;
        if (!acc[loginId]) {
          acc[loginId] = total;
        } else {
          acc[loginId] += total;
        }
      });
      return acc;
    }, {});
  
    const pieCommitDataLabels = Object.keys(result);
    let pieCommitData = [];
    let i = 0;
    while (i < pieCommitDataLabels.length) {
      pieCommitData.push(result[pieCommitDataLabels[i]]);
      i = i + 1;
    }

    const pieChartData = {
      "labels": pieCommitDataLabels,
      "datasets": [
        {
          "label": "Total Contributions",
          "data": pieCommitData,
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
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#6C757D',
            '#28A745',
            '#007BFF',
            '#DC3545',
            '#F0AD4E',
          ],
          "borderColor": "white",
          "borderWidth": 2
        }
      ]
    }
  
  return (
    <div>
      {commitData.length == 0 ? (
        <>
        </>
      ) :
      (
      <div>
        <BarChart chartData={userData} />
        {/* when 'All contributors' is selected, the selectedContributor is set to 0:0. The Pie Chart is only displayed when 'all contributors' are selected */}
        {selectedContributor === '0:0' && <PieChart chartData={pieChartData} />}
      </div>
      )
      }
    </div>
  );
}
export default Chart;