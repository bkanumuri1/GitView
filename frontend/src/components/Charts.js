import React from "react";
import { useState ,useEffect} from "react";
import { Bar,Line } from "react-chartjs-2";
import BarChart from "./BarChart";


const Chart = (props) => {
    const {commitData}=props;
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
      // const [stats, setStats] = useState({
      //   labels : commitData.map((data) => data.date), 
      //   datasets:[
      //     {
      //     label: "Stats", 
      //     data: commitData.map((data) =>data.commit_details.stats.total)
      //     }
      //   ]
      // })

      useEffect(()=>{
        setUserData({labels: commitData.map((data) => data.date),
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
      })
        console.log("z")
      },[commitData]
      )
  return (
    <>{console.log("ccccccc",commitData)}
    <BarChart chartData={userData} />
    
    </>
  );
};
export default Chart;