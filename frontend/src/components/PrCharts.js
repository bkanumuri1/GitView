import React from "react";
import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import BarChart from "./BarChart";

const Charts = (props) => {
  const { prData } = props;

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
