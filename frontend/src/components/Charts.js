import React from "react";
import { useState ,useEffect} from "react";
import { Bar,Line } from "react-chartjs-2";
import BarChart from "./BarChart";
import moment from 'moment';
import selectedDates from '../App'

const Chart = (props) => {
    const {commitData}=props;
    const {dates}=props;
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
      },[commitData]
      )
  return (
    <div>
      {commitData.length == 0 ? (
        <>
        </>
      ) :
      (
      <div>
        <BarChart chartData={userData} />
      </div>
      )
      }
    </div>
  );
}
export default Chart;