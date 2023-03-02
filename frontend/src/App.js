import "./App.css";
import * as React from 'react';
import "./components/LoginButton.css";
import {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {AboutUs, OurAim, OurVision} from "./pages/AboutUs";
import { RiServerFill } from "react-icons/ri";
import * as GoIcons from "react-icons/go";
import * as GrIcons from "react-icons/gr";
import { IconButton } from "rsuite";
import { Admin, Menu, Reload, Resize, Search } from '@rsuite/icons';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import GitHubIcon from '@mui/icons-material/GitHub';
import * as XLSX from 'xlsx';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// import { Dayjs } from 'dayjs';
// import Typography from '@mui/material/Typography';
// import TextField from '@mui/material/TextField';
// import { LocalizationProvider } from '@mui/x-date-pickers-pro';
// import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
// import { DateRangePicker} from '@mui/x-date-pickers-pro/DateRangePicker';
// import { DateRangePickerDay } from "@mui/x-date-pickers-pro";
import Box from '@mui/material/Box';

const CLIENT_ID = "e7231ef0e449bce7d695";
function App() {
    const [rerender, setRerender] = useState(false);
    const [userData, setUserData] = useState({});
    const [repositories, setRepositories] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [text, setText] = useState();
    const [data, setData] = useState([]);
    const [repos, setRepos] = useState([]);
    const [selectedValue, setSelectedValue] = useState("");
    const [selectedContributor, setSelectedContributor] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [excelData, setExcelData] = useState([]);
    // const [value, setValue] = useState(["2000/02/03", null]);
    // const [value, setValue] = React.useState<DateRangePickerDay>([null, null]);

    // Forward the user to the guthub login screen (pass clientID)
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
                await fetch("http://localhost:9000/getAccessToken?code=" + codeParam, {method: "GET"}).then((response) => {
                    return response.json();
                }).then((data) => {
                    if (data.access_token) {
                        localStorage.setItem("access_token", data.access_token);
                        getUserData();
                        setRerender(!rerender); // to force rerender on success
                    }
                });
            }
            getAccessToken();
        }
    }, []); // [] is used to run once

    function loginWithGithub() {
        window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID);
    }


    // const getData = async () => {
    //   const response = await fetch("http://localhost:9000/getUserData", {
    //     method: "GET",
    //     headers: {
    //       Authorization: "Bearer " + localStorage.getItem("access_token"),
    //     },
    //   });
  
    //   const data = await response.json();
    //   console.log("data", data);
    //   return data;
    // };
  
    // useEffect(() => {
    //   const fetchData = async () => {
    //     const result = await getData();
    //     setData(result);
    //   };
    //   fetchData();
    // }, []);

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
        // getUserRepos();
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
        console.log("Repo"+JSON.stringify(data));
        let commonElements = new Map();
        Object.keys(data).forEach(key => {
            if (excelData.includes(data[key])) {
                commonElements[key] = data[key];
            }
        });
        setRepositories(commonElements);
      });
  }

  async function getRepoContributors(selectedValue) {
    console.log("Repo: " + selectedValue);
    await fetch("http://localhost:9000/getRepoContributors?repo=" + selectedValue, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        setContributors(data);
    });
}

  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }

  function handleDropdownChange(event) {
    setSelectedValue(event.target.value);
    getRepoContributors(event.target.value);
    // getUserRepos(event.target.value);
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const list = [];
        for (let z in worksheet) {
            if (z.toString()[0] === 'A') {
                list.push(worksheet[z].v);
            }
        }
        console.log(JSON.stringify({list}));
        setExcelData(list);
    };
    reader.readAsArrayBuffer(file);
  }

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    async function fetchRepos() {
      await fetch("http://localhost:9000/getUserRepos", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      })
        .then((response) => {
          return response.json();
        })

      setRepos(repos);
    }
    fetchRepos();
  }, []);

  return (

    <div className="App">
      <Router>
        {/* <Sidebar /> */}
        <Routes>
          <Route path='/about-us' element={<AboutUs />} />
        </Routes>
      </Router>
      {/* <header className="App-header"> */}
        {localStorage.getItem("access_token") ? (
        <div className="mainPage">
        
          <div className="nav">
          <div color="white" className="title"> GIT VIEW </div>
          <input type="file" accept=".xlsx, .xls, .xlsm, .csv" onChange={handleFileUpload}/>
          <button
              onClick={() => {
                localStorage.removeItem("access_token");
                setRerender(!rerender);
              }}
              style={{
                color: "white", backgroundColor: 'black',
                 fontFamily: "sans-serif", fontSize: 16

              }}
            >
              Log Out
            </button>
              <Button startIcon={<AccountCircle />} style={{
                color: "white", 
                padding: 10, borderRadius: 15, fontFamily: "sans-serif",
                justifyContent:"flex-end"
              }}>
                 WELCOME {userData.login}
                          </Button>
          
          </div>
      
       <div className="tableFilter"> 
       <button onClick={getUserRepos} style={{
                color: "white", backgroundColor: '#7d3cff',
                padding: 10, borderRadius: 15, fontFamily: "sans-serif", fontSize: 16, margin : 10

              }}>Click to get your repositories</button>
                {
                    Object.keys(repositories).length !== 0 ? (
                    <>
                        <select id="repoDropdown" onChange={handleDropdownChange}> {
                            Object.entries(repositories).map(([key, value]) => (
                                <option key={key} value={value}> {value} </option>))
                        } 
                        </select>
                        <select id="dropdown" value={selectedContributor}>
                          <option value="">--Please choose a Contributor--</option>
                          <option value="all">All contributors</option>
                            {
                              contributors.map((option, index) => (
                                  <option key={index} value={option}> {option} </option>
                              ))
                            } 
                        </select>
                    </>
                    ) : (<> </>)
                }
        
        <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Choose Contributor</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          // value={age}
          label="Repository List"
          onChange={handleDropdownChange}
        >
         {/* { Object.entries(contributors).map(([key, value]) => (
                                <MenuItem key ={key} value={value}>
                                <em>{value}</em>
                              </MenuItem>))} */}
                              {
                              contributors.map((option, index) => (
                                  <option key={index} value={option}> {option} </option>
                              ))
                            } 
          {/* <MenuItem value={value}>
            <em>{value}</em>
          </MenuItem> */}
          {/* <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem> */}
        </Select>
        <FormHelperText>Please select a Contributor</FormHelperText>
          </FormControl>

       </div>
       </div>
          // <div className="card">

          //   {Object.keys(userData).length !== 0 ? (
          //     <>
          //   <h4 style={{ color: "white" , fontFamily: "sans-serif" }}> Hey there {userData.login} !</h4>
          //   </>) : (
          //       <>
          //       </>
          //   )
          //   }

          //   <h3>Please upload an excel file with repositories.</h3>
          //   <h5> Accepted formats: .xlsx, .xls, .xlsm, .csv</h5>
          //   <input type="file" accept=".xlsx, .xls, .xlsm, .csv" onChange={handleFileUpload}/>

          //   <br></br>
          //     <button onClick={getUserRepos} style={{
          //       color: "white", backgroundColor: '#7d3cff',
          //       padding: 10, borderRadius: 15, fontFamily: "sans-serif", fontSize: 16, margin : 10

          //     }}>Click to get your repositories</button>
          //       {
          //           Object.keys(repositories).length !== 0 ? (
          //           <>
          //               <select id="repoDropdown" onChange={handleDropdownChange}> {
          //                   Object.entries(repositories).map(([key, value]) => (
          //                       <option key={key} value={value}> {value} </option>))
          //               } 
          //               </select>
          //               <select id="dropdown" value={selectedContributor}>
          //                 <option value="">--Please choose a Contributor--</option>
          //                 <option value="all">All contributors</option>
          //                   {
          //                     contributors.map((option, index) => (
          //                         <option key={index} value={option}> {option} </option>
          //                     ))
          //                   } 
          //               </select>
          //           </>
          //           ) : (<> </>)
          //       }
          //   <br></br>
          //   <button
          //     onClick={() => {
          //       localStorage.removeItem("access_token");
          //       setRerender(!rerender);
          //     }}
          //     style={{
          //       color: "white", backgroundColor: '#7d3cff',
          //       padding: 10,borderRadius: 15, fontFamily: "sans-serif", fontSize: 16

          //     }}
          //   >
          //     Log Out
          //   </button>
          // </div>
        ) : (
          <>
            <div className="card">
              <h3 style={{ color: "white", fontFamily: "sans-serif" }}>Login to begin grading</h3>
                  <Button onClick={loginWithGithub} variant="outlined" startIcon={<GitHubIcon />} style={{
                color: "white", 
                padding: 10, borderRadius: 15, fontFamily: "sans-serif"
              }}>
                  SIGN IN WITH GITHUB
                          </Button>
              </div>
          </>
        )}
        
      {/* </header> */}
    </div>
  );
}


export default App;
