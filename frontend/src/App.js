import "./App.css";
import "./components/LoginButton.css";
import { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Box from "@mui/material/Box";
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
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FullWidthTabs from "./FullWidthTabs";
import Chart from "./components/Charts";
import { UploadIcon } from "@primer/octicons-react";

const CLIENT_ID = "e7231ef0e449bce7d695";
function App() {
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState("");
  const [contributors, setContributors] = useState(new Map());
  const [commits, setCommits] = useState([]);
  const [PRs, setPRs] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [selectedContributor, setSelectedContributor] = useState("");
  const [excelData, setExcelData] = useState([]);
  const [selectedDates, setDateRange] = useState(() => {
    const defaultDateRange = [
      {
        startDate: subDays(new Date(), 30),
        endDate: new Date(),
        key: "selection",
      },
    ];
    var start = localStorage.getItem("startDate");
    var end = localStorage.getItem("endDate");
    if (start && end) {
      const localDateRange = [
        {
          startDate: addDays(new Date(start.slice(0, 10)), 1),
          endDate: new Date(end.slice(0, 10)),
          key: "selection",
        },
      ];
      start = localDateRange[0].startDate.toISOString().slice(0, -5) + "Z";
      end = localDateRange[0].endDate.toISOString().slice(0, -5) + "Z";
      localStorage.setItem("startDate", start);
      localStorage.setItem("endDate", end);
      return localDateRange;
    }
    start = defaultDateRange[0].startDate.toISOString().slice(0, -5) + "Z";
    end = defaultDateRange[0].endDate.toISOString().slice(0, -5) + "Z";
    localStorage.setItem("startDate", start);
    localStorage.setItem("endDate", end);
    return defaultDateRange;
  });

  const handleDateChange = (selectedDate) => {
    setDateRange([selectedDate.selection]);
    var start =
      selectedDate.selection.startDate.toISOString().slice(0, -5) + "Z";
    var end = selectedDate.selection.endDate.toISOString().slice(0, -5) + "Z";
    localStorage.setItem("startDate", start);
    localStorage.setItem("endDate", end);
    getCommits(selectedRepo, selectedContributor, start, end);
    getPRs(selectedRepo, selectedContributor, start, end);
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
    const username = localStorage.getItem("username");
    if (username) {
      setUserData(username);
    }
    const repositories = localStorage.getItem("repositories");
    if (repositories) {
      const repolist = JSON.parse(repositories);
      setExcelData(repolist);
    }
    const contributor_list = localStorage.getItem("contributor-list");
    if (contributor_list) {
      const contributors = JSON.parse(contributor_list);
      setContributors(contributors);
    }

    const localselectedRepository = localStorage.getItem("selectedRepository");
    const localselectedContributor = localStorage.getItem(
      "selectedContributor"
    );
    const localstartDate = localStorage.getItem("startDate");
    const localendDate = localStorage.getItem("endDate");
    if (
      localselectedRepository &&
      localselectedContributor &&
      localstartDate &&
      localendDate
    ) {
      setSelectedRepo(localselectedRepository);
      setSelectedContributor(localselectedContributor);
      getCommits(
        localselectedRepository,
        localselectedContributor,
        localstartDate,
        localendDate
      );
      getPRs(
        localselectedRepository,
        localselectedContributor,
        localstartDate,
        localendDate
      );
      setRerender(!rerender);
    } else {
      setSelectedRepo("select");
      setSelectedContributor("select");
    }

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
        setUserData(data.name);
        localStorage.setItem("username", data.name);
      });
  }

  async function getRepoContributors(selectedValue) {
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
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => {
        setContributors(data);
        localStorage.setItem("contributor-list", JSON.stringify(data));
      })
      .catch((error) => {
        if (error.message === "404") {
          alert(
            "No such repository found! Please ensure the authenticated user is a contributor."
          );
          setContributors(new Map());
        } else {
          console.error(error);
        }
      });
  }

  async function getCommits(repository, contributor, start, end) {
    await fetch(
      "http://localhost:9000/getCommits?repo=" +
        repository +
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

  async function getPRs(repository, contributor, start, end) {
    await fetch(
      "http://localhost:9000/getPRs?repo=" +
        repository +
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

  function handleRepoDropdownChange(event) {
    setSelectedRepo(event.target.value);
    getRepoContributors(event.target.value);
    localStorage.setItem("selectedRepository", event.target.value);
  }

  function handleContributorDropdownChange(event) {
    setSelectedContributor(event.target.value);
    localStorage.setItem("selectedContributor", event.target.value);
    var start = selectedDates[0].startDate.toISOString().slice(0, -5) + "Z";
    var end = selectedDates[0].endDate.toISOString().slice(0, -5) + "Z";
    getCommits(selectedRepo, event.target.value, start, end);
    getPRs(selectedRepo, event.target.value, start, end);
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
      for (const cell in worksheet) {
        if (cell.toString()[0] === "A") {
          const value = worksheet[cell].v;
          list.push(value);
        }
      }
      setExcelData(list);
      localStorage.setItem("repositories", JSON.stringify(list));
    };
    reader.readAsArrayBuffer(file);
  }

  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  return (
    <div className="App">
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
            <label class="upload-file">
              <input
                type="file"
                id="upload"
                name="upload"
                accept=".xlsx, .xls, .xlsm, .csv"
                onChange={handleFileUpload}
              />
              <span>
                <UploadIcon className="upload-icon" />
                Upload file
              </span>
            </label>
            <button
              className="logout-button"
              onClick={() => {
                localStorage.clear();
                setRerender(!rerender);
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
              WELCOME {userData}
            </Button>
          </div>

          <div>
            <Box>
              {excelData.length !== 0 ? (
                <>
                  <Box padding={1} style={{ backgroundColor: "#2074d4" }}>
                    <FormControl
                      fullwidth
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {/* <InputLabel id="repo-label">
                        Select a Repository
                      </InputLabel> */}
                      <div>
                        <Select
                          labelId="repo-label"
                          id="repoDropdown"
                          value={selectedRepo}
                          label="Repository"
                          onChange={handleRepoDropdownChange}
                        >
                          <MenuItem key="" value="select">
                            Select a Repository
                          </MenuItem>
                          {Array.from(excelData).map((value, index) => (
                            <MenuItem key={index} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                          Select a Repository
                        </Select>
                      </div>

                      {/* <InputLabel id="contributor-label"> Select a Contributor </InputLabel> */}
                      <div className="calendarWrap">
                        <Select
                          id="repoDropdown"
                          labelId="contributor-label"
                          value={selectedContributor}
                          label="Contributor"
                          onChange={handleContributorDropdownChange}
                        >
                          <MenuItem key="select" value="select">
                            Select a Contributor
                          </MenuItem>
                          <MenuItem value="0:0">All contributors</MenuItem>
                          {Object.entries(contributors).map(([key, value]) => (
                            <MenuItem key={key} value={key + ":" + value}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                      <div className="calendarWrap">
                        <input
                          value={`${format(
                            selectedDates[0].startDate,
                            "MM/dd/yyyy"
                          )} to ${format(
                            selectedDates[0].endDate,
                            "MM/dd/yyyy"
                          )}`}
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
                    </FormControl>
                  </Box>
                  <Box>
                    <FullWidthTabs
                      commitData={commits}
                      prData={PRs}
                      dates={selectedDates}
                      selectedContributor={selectedContributor}
                    ></FullWidthTabs>
                  </Box>
                </>
              ) : (
                <> </>
              )}
            </Box>
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
        <Route path="/home" element={<App />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/cha" element={<Chart />}></Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
