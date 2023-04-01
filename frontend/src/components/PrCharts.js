import React from "react";
import { useState ,useEffect} from "react";
import { Bar,Line } from "react-chartjs-2";
import BarChart from "./BarChart";



const Charts = (props) => {
    const {prData}=props;

    
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
        labels: prData.map((data) => data.date),
        datasets: [
          {
            label: "Commits",
            data: prData.map((data) => data.pr_count),
            backgroundColor: [
              "rgba(75,192,192,1)",
              
            ],
            borderColor: "black",
            borderWidth: 2,
          },
        ],
      });
  return (
    <>{console.log("ppppppp",userData)}
    <BarChart chartData={userData} />
    
    </>
  );
};
export default Charts;