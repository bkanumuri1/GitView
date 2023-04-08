import React from "react";
import { useState ,useEffect} from "react";
import { Bar,Line } from "react-chartjs-2";
import BarChart from "./BarChart";
import PieChart from "./PieChart";

const Chart = (props) => {
  const { commitData } = props;
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

  useEffect(() => {
    setUserData({
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
    })
    console.log("z")
  }, [commitData]
  )

  // const logins = [...new Set(commitData.flatMap((item) => item.commit_details.map((detail) => detail.author.login)))];
  // const statsData = [...new Set(commitData.flatMap((item) => item.commit_details.map((detail) => detail.stats.total)))];
  // console.log("ids", logins)
  // console.log("stats",statsData);

  const result = commitData.reduce((acc, item) => {
    const commitDetails = item.commit_details;
    commitDetails.forEach(detail => {
      const loginId = detail.author.login;
      const total = detail.stats.total;

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
  return (
    <>{console.log("ccccccc", commitData)}
      <BarChart chartData={userData} />
    </>
  );
};

export default Chart;