import "./App.css";
import "./components/LoginButton.css";
import { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AboutUs } from "./pages/AboutUs";
import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";
import AccountCircle from "@mui/icons-material/AccountCircle";
import * as XLSX from "xlsx";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import { DateRange } from "react-date-range";
import { addDays, subDays } from "date-fns";
import format from "date-fns/format";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const CLIENT_ID = "e7231ef0e449bce7d695";
function App() {
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
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: subDays(new Date(), 15),
      key: "selection",
    },
  ]);
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
    await fetch("http://localhost:9000/getRepoContributors?repo=" + selectedValue,
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

  async function getCommits(contributor) {
    console.log("The selected repo is => " + selectedRepo);
    console.log("The selected user is => " + contributor);
    console.log("Access_token => " + localStorage.getItem("access_token"));
    var startDate = range[0].startDate.toISOString();
    var endDate = range[0].endDate.toISOString();
    await fetch("http://localhost:9000/getCommits?repo=" + selectedRepo + "&author=" + contributor,
      //  +
      // "&since=" +
      // startDate +
      // "&until=" +
      // endDate,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCommits(data);
        //console.log(commits);
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

  async function getPRs(contributor) {
      await fetch("http://localhost:9000/getPRs?repo=" +selectedRepo + "&creator=" + contributor,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setPRs(data);
          console.log(data);
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
    getCommits(event.target.value);
    getPRs(event.target.value);
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

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell scope="row" align="center">
            {row.date}
          </TableCell>
          <TableCell align="center">{row.commit_count}</TableCell>
          <TableCell align="center">{row.pr_count}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Commit Links</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.commit_details.map((detailsRow, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <a href={detailsRow.html_url} target="_blank">{detailsRow.author.login}: {detailsRow.message}</a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  Row.propTypes = {
    row: PropTypes.shape({
      date: PropTypes.string.isRequired,
      commit_count: PropTypes.number.isRequired,
      pr_count: PropTypes.number.isRequired,
      commit_details: PropTypes.arrayOf(
        PropTypes.shape({
          author: PropTypes.object.isRequired,
          html_url: PropTypes.string.isRequired,
          message: PropTypes.string.isRequired,
        })
      ).isRequired,
    }).isRequired,
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
                    <option key="" value="">--Please select a Repository--</option>
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
                        range[0].startDate,
                        "MM/dd/yyyy"
                      )} to ${format(range[0].endDate, "MM/dd/yyyy")}`}
                      readOnly
                      className="inputBox"
                      onClick={() => setOpen((open) => !open)}
                    />

                    <div ref={refOne}>
                      {open && (
                        <DateRange
                          onChange={(item) => setRange([item.selection])}
                          editableDateInputs={true}
                          moveRangeOnFirstSelection={false}
                          ranges={range}
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
            <div>
              {/* here you check if the state is loading otherwise if you wioll not call that you will get a blank page because the data is an empty array at the moment of mounting */}
              {commits.length == 0 ? (
                <></>
              ) : (
                <TableContainer component={Paper}>
                  <Table aria-label="collapsible table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Details</TableCell>
                        <TableCell align="center">Date</TableCell>
                        <TableCell align="center">Commits</TableCell>
                        <TableCell align="center">Pull Requests</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {commits.map((row, index) => (
                        <Row key={index} row={row} />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
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
