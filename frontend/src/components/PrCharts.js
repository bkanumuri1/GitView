import React from "react";
import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import moment from 'moment';
import BarChart from "./BarChart";

const Charts = (props) => {
  const { prData } = props;
  const {dates}=props;
  const chartStart = new Date(dates[0].startDate.toISOString().slice(0, 10));
  const chartEnd = new Date(dates[0].endDate.toISOString().slice(0, 10));
  const dateRange = [];
  while(chartStart <= chartEnd){
    dateRange.push(moment(chartStart).format('YYYY-MM-DD'));
    chartStart.setDate(chartStart.getDate() + 1);
  }
  const chartCommitMap = dateRange.map((date) => {
    const obj = prData.find((d) => moment(d.date).format('YYYY-MM-DD') === date);
    return { date, count: obj ? obj.commit_count : 0 };
  });

  const [userData, setUserData] = useState({
    labels: prData.map((data) => data.date),
    datasets: [
      {
        label: "Pull Requests",
        data: prData.map((data) => data.pr_count),
        backgroundColor: ["rgba(75,192,192,1)"],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  return (
    <>
      {console.log("ppppppp", userData)}
      <BarChart chartData={userData} />
    </>
  );
};
export default Charts;
