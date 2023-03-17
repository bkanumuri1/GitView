import React from "react";
import { useState } from "react";
import BarChart from "./BarChart";
import { Line } from "react-chartjs-2";

const Chart = (props) => {
    const {commitData}=props;

     const UserData = [
        {
          id: 1,
          year: 2016,
          userGain: 80000,
          userLost: 823,
        },
        {
          id: 2,
          year: 2017,
          userGain: 45677,
          userLost: 345,
        },
        {
          id: 3,
          year: 2018,
          userGain: 78888,
          userLost: 555,
        },
        {
          id: 4,
          year: 2019,
          userGain: 90000,
          userLost: 4555,
        },
        {
          id: 5,
          year: 2020,
          userGain: 4300,
          userLost: 234,
        },
      ];
      const [userData, setUserData] = useState({
        labels: commitData.map((data) => data.date),
        datasets: [
          {
            label: "Commits",
            data: commitData.map((data) => data.commit_count),
            backgroundColor: [
              "rgba(75,192,192,1)",
              
            ],
            borderColor: "black",
            borderWidth: 2,
          },
        ],
      });

  return (
    <>{console.log("ccccccc",commitData)}
    <BarChart chartData={userData} commitsData={commitData}/>
    </>
  );
};
export default Chart;