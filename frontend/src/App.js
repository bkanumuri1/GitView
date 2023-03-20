import "./App.css";
import "./components/LoginButton.css";
import { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route,useNavigate } from "react-router-dom";
import { AboutUs } from "./pages/AboutUs";
import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";
import AccountCircle from "@mui/icons-material/AccountCircle";
import * as XLSX from "xlsx";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import { DateRangePicker } from "react-date-range";
import { addDays, subDays } from "date-fns";
import format from "date-fns/format";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import * as React from "react";
import { BrowserRouter } from 'react-router-dom'

import FullWidthTabs from "./FullWidthTabs";
import Chart from "./components/Charts";
import { Line } from "react-chartjs-2";
import BarChart from "./components/BarChart";

const CLIENT_ID = "e7231ef0e449bce7d695";
function App() {
  
  const lineChartData = {
    labels: ["October", "November", "December"],
    datasets: [
      {
        data: [8137119, 9431691, 10266674],
        label: "Infected",
        borderColor: "#3333ff",
        fill: true,
        lineTension: 0.5
      },
      {
        data: [1216410, 1371390, 1477380],
        label: "Deaths",
        borderColor: "#ff3333",
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        fill: true,
        lineTension: 0.5
      }
    ]
  };
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});
  const [repositories, setRepositories] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [commits, setCommits] = useState([]);
  const [PRs, setPRs] = useState([]);
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [selectedContributor, setSelectedContributor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [excelData, setExcelData] = useState([]);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [selectedDates, setDateRange] = useState([
    {
      startDate: subDays(new Date(), 30),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleDateChange = (selectedDates) => {
    setDateRange([selectedDates.selection]);
    var start =
      selectedDates.selection.startDate.toISOString().slice(0, -5) + "Z";
    var end = selectedDates.selection.endDate.toISOString().slice(0, -5) + "Z";
    getCommits(selectedContributor, start, end);
    getPRs(selectedContributor, start, end);
    // console.log(selectedDates);
  };
  const [open, setOpen] = useState(false);

  const refOne = useRef(null);
  // Forward the user to the github login screen (pass clientID)
  // user is now on the github side ang logs in
  // when user decides to login .. they get forwaded back to localhost
  // get code
  // use code to get access token ( code can be only used once)
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    // using local storage to store access_token, help persists through login in with Github
    if (codeParam && localStorage.getItem("access_token") === null) {
      async function getAccessToken() {
        await fetch("http://localhost:9000/getAccessToken?code=" + codeParam, {
          method: "GET",
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.access_token) {
              localStorage.setItem("access_token", data.access_token);
              getUserData();
              setRerender(!rerender); // to force rerender on success
            }
          });
      }
      getAccessToken();
    }
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
  }, []); // [] is used to run once

  function loginWithGithub() {
    const scope = "repo,user";
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${scope}`
    );
  }

  async function getUserData() {
    await fetch("http://localhost:9000/getUserData", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUserData(data);
      });
  }

  async function getUserRepos() {
    await fetch("http://localhost:9000/getUserRepos", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let commonElements = new Map();
        Object.keys(data).forEach((key) => {
          if (excelData.includes(data[key])) {
            commonElements[key] = data[key];
          }
        });
        setRepositories(commonElements);
      });
  }

  async function getRepoContributors(selectedValue) {
    console.log("Repo: " + selectedValue);
    await fetch(
      "http://localhost:9000/getRepoContributors?repo=" + selectedValue,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setContributors(data);
      });
  }

  async function getCommits(contributor, start, end) {
    console.log("The selected repo is => " + selectedRepo);
    console.log("The selected user is => " + contributor);
    console.log("Access_token => " + localStorage.getItem("access_token"));

    console.log("start: " + start);
    console.log("end: " + end);

    await fetch(
      "http://localhost:9000/getCommits?repo=" +
        selectedRepo +
        "&author=" +
        contributor +
        "&since=" +
        start +
        "&until=" +
        end,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCommits(data);
      });
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formattedDate;
  }

  async function getPRs(contributor, start, end) {
    // var start = selectedDates[0].startDate.toISOString().slice(0, -5) + "Z";
    // var end = selectedDates[0].endDate.toISOString().slice(0, -5) + "Z";
    // console.log("start: " + start);
    // console.log("end: " + end);

    await fetch(
      "http://localhost:9000/getPRs?repo=" +
        selectedRepo +
        "&author=" +
        contributor +
        "&since=" +
        start +
        "&until=" +
        end,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setPRs(data);
      });
  }

  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }

  function handleRepoDropdownChange(event) {
    setSelectedRepo(event.target.value);
    getRepoContributors(event.target.value);
  }

  function handleContributorDropdownChange(event) {
    setSelectedContributor(event.target.value);

    var start = selectedDates[0].startDate.toISOString().slice(0, -5) + "Z";
    var end = selectedDates[0].endDate.toISOString().slice(0, -5) + "Z";
    getCommits(event.target.value, start, end);
    getPRs(event.target.value, start, end);
    // console.log(commits);

  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const list = [];
      for (let z in worksheet) {
        if (z.toString()[0] === "A") {
          list.push(worksheet[z].v);
        }
      }
      setExcelData(list);
    };
    reader.readAsArrayBuffer(file);
  }

  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const hideOnClickOutside = (e) => {
    // console.log(refOne.current)
    // console.log(e.target)
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    
    
    <div className="App">
      {console.log("userdata:", userData)}
     <Router>
        <Routes>
          <Route path="/cha" element={<Chart />}></Route>
        </Routes>
      </Router> 

      
      
      {localStorage.getItem("access_token") ? (
        <div className="mainPage">
          <div className="nav">
            <Button
              startIcon={<AccountTreeOutlinedIcon />}
              style={{
                color: "white",
                padding: 10,
                borderRadius: 15,
                fontFamily: "sans-serif",
                marginRight: "400px",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              GIT VIEW
            </Button>
            <input
              type="file"
              accept=".xlsx, .xls, .xlsm, .csv"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => {
                localStorage.removeItem("access_token");
                setRerender(!rerender);
              }}
              style={{
                color: "white",
                backgroundColor: "black",
                fontFamily: "sans-serif",
                fontSize: 16,
              }}
            >
              Log Out
            </button>
            <Button
              startIcon={<AccountCircle />}
              style={{
                color: "white",
                padding: 10,
                borderRadius: 15,
                fontFamily: "sans-serif",
                justifyContent: "flex-end",
              }}
            >
              WELCOME {userData.login}
            </Button>
          </div>

          <div>
            <div className="tableFilter">
              <button id="repoButton" onClick={getUserRepos} style={{}}>
                GET REPOSITORIES
              </button>
              {Object.keys(repositories).length !== 0 ? (
                <>
                  <select id="repoDropdown" onChange={handleRepoDropdownChange}>
                    <option key="" value="">
                      --Please select a Repository--
                    </option>
                    {Object.entries(repositories).map(([key, value]) => (
                      <option key={key} value={value}>
                        {" "}
                        {value}{" "}
                      </option>
                    ))}
                  </select>
                  <select
                    style={{ marginLeft: 10 }}
                    id="contributorDropdown"
                    value={selectedContributor}
                    onChange={handleContributorDropdownChange}
                  >
                    <option value="">--Please choose a Contributor--</option>
                    <option value="all">All contributors</option>
                    {contributors.map((option, index) => (
                      <option key={index} value={option}>
                        {" "}
                        {option}{" "}
                      </option>
                    ))}
                  </select>

                  <div className="calendarWrap">
                    <input
                      value={`${format(
                        selectedDates[0].startDate,
                        "MM/dd/yyyy"
                      )} to ${format(selectedDates[0].endDate, "MM/dd/yyyy")}`}
                      readOnly
                      className="inputBox"
                      onClick={() => setOpen((open) => !open)}
                    />

                    <div ref={refOne}>
                      {open && (
                        <DateRangePicker
                          onChange={handleDateChange}
                          editableDateInputs={true}
                          moveRangeOnFirstSelection={false}
                          ranges={selectedDates}
                          months={1}
                          direction="horizontal"
                          className="calendarElement"
                        />
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <> </>
              )}
            </div>

            <FullWidthTabs commitData={commits} prData={PRs}></FullWidthTabs>
            
            
            {console.log("commits",commits)}
          </div>
          
        </div> // main page end
      ) : (
        <>
          <div className="card">
            <h1 style={{ color: "white", fontFamily: "sans-serif" }}>
              LOGIN TO BEGIN GRADING
            </h1>
            <Button
              onClick={loginWithGithub}
              variant="outlined"
              startIcon={<GitHubIcon />}
              style={{
                color: "white",
                padding: 10,
                borderRadius: 15,
                fontFamily: "sans-serif",
              }}
            >
              SIGN IN WITH GITHUB
            </Button>
          </div>
          
        </>
      )}

      {/* </header> */}
      
    </div>
    
  );
}

function AppRouter() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<App />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </Router>
  );
}

export default App;
