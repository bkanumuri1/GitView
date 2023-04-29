import React from "react";
import { useState, useEffect } from "react";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import moment from "moment";
import StackedChart from "./StackedChart";

const Chart = (props) => {
  const { commitData } = props;
  const { dates } = props;
  const { selectedContributor } = props;
  const chartStart = new Date(dates[0].startDate.toISOString().slice(0, 10));
  const chartEnd = new Date(dates[0].endDate.toISOString().slice(0, 10));
  const dateRange = [];
  while (chartStart <= chartEnd) {
    dateRange.push(moment(chartStart).format("YYYY-MM-DD"));
    chartStart.setDate(chartStart.getDate() + 1);
  }
  const chartCommitMap = dateRange.map((date) => {
    const obj = commitData.find(
      (d) => moment(d.date).format("YYYY-MM-DD") === date
    );
    return { date, count: obj ? obj.commit_count : 0 };
  });
  const [userData, setUserData] = useState({
    labels: chartCommitMap.map((d) => d.date),
    datasets: [
      {
        label: "Commits",
        data: chartCommitMap.map((d) => d.count),
        backgroundColor: ["rgba(75,192,192,1)"],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  const parseForStackedChartData = () => {
    let data = {
      labels: [],
      authors: [],
    };

    for (let i = 0; i < commitData.length; i++) {
      let commitDetails = commitData[i].commit_details;
      for (let j = 0; j < commitDetails.length; j++) {
        let author = commitDetails[j].author;
        if (!data.authors.some((a) => a.name === author)) {
          data.authors.push({ name: author, commits: [] });
        }
      }
    }

    commitData.forEach((obj) => {
      const date = obj.date;
      data.labels.push(date);

      let byDate = {};
      obj.commit_details.forEach((detail) => {
        let key = detail.author;
        if (key in byDate) {
          byDate[key] += 1;
        } else {
          byDate[key] = 1;
        }
      });

      for (let i = 0; i < data.authors.length; i++) {
        let authorName = data.authors[i].name;
        if (authorName in byDate) {
          data.authors[i].commits.push(byDate[authorName]);
        } else {
          data.authors[i].commits.push(0);
        }
      }
    });
    return data;
  };

  useEffect(() => {
    setUserData({
      labels: chartCommitMap.map((d) => d.date),
      datasets: [
        {
          label: "Commits",
          data: chartCommitMap.map((d) => d.count),
          backgroundColor: ["rgba(75,192,192,1)"],
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    });
  }, [commitData]);

  // pie chart for comparing contributor's contributions
  const result = commitData.reduce((acc, item) => {
    const commitDetails = item.commit_details;
    commitDetails.forEach((detail) => {
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
    labels: pieCommitDataLabels,
    datasets: [
      {
        label: "Total Contributions",
        data: pieCommitData,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#6C757D",
          "#28A745",
          "#007BFF",
          "#DC3545",
          "#F0AD4E",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#6C757D",
          "#28A745",
          "#007BFF",
          "#DC3545",
          "#F0AD4E",
        ],
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div>
      {commitData.length == 0 ? (
        <></>
      ) : (
        <div>
          {selectedContributor === "0:0" ? (
            <StackedChart chartData={parseForStackedChartData()} />
          ) : (
            <BarChart chartData={userData} />
          )}

          {/* when 'All contributors' is selected, the selectedContributor is set to 0:0. The Pie Chart is only displayed when 'all contributors' are selected */}
          {selectedContributor === "0:0" && (
            <PieChart chartData={pieChartData} />
          )}
        </div>
      )}
    </div>
  );
};
export default Chart;
