import React from "react";
import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import BarChart from "./BarChart";
import moment from 'moment';
import './PullRequestsBarChart.css';

const Charts = (props) => {
  const { prData } = props;
  const { dates } = props;
  const chartStart = new Date(dates[0].startDate.toISOString().slice(0, 10));
  const chartEnd = new Date(dates[0].endDate.toISOString().slice(0, 10));
  const dateRange = [];
  while (chartStart <= chartEnd) {
    dateRange.push(moment(chartStart).format('YYYY-MM-DD'));
    chartStart.setDate(chartStart.getDate() + 1);
  }
  const chartPRMap = dateRange.map((date) => {
    const obj = prData.find((d) => moment(d.date).format('YYYY-MM-DD') === date);
    return { date, count: obj ? obj.pr_count : 0 };
  });

  console.log(JSON.stringify(chartPRMap))
  const [userData, setUserData] = useState({
    labels: chartPRMap.map((data) => data.date),
    datasets: [
      {
        label: "Pull Requests",
        data: chartPRMap.map((data) => data.count),
        backgroundColor: ["rgba(75,192,192,1)"],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  useEffect(() => {

    setUserData({
      labels: chartPRMap.map((d) => d.date),
      datasets: [
        {
          label: "Pull Requests",
          data: chartPRMap.map((d) => d.count),
          backgroundColor: [
            "rgba(75,192,192,1)",
          ],
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    })
  }, [prData])

  return (
    <BarChart chartData={userData} />
  );
};
export default Charts;