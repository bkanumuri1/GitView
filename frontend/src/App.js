import "./App.css";
import "./components/LoginButton.css";
import {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {AboutUs} from "./pages/AboutUs";
import Button from '@mui/material/Button';
import GitHubIcon from '@mui/icons-material/GitHub';
import * as XLSX from 'xlsx';

const CLIENT_ID = "e7231ef0e449bce7d695";
function App() {
    const [rerender, setRerender] = useState(false);
    const [userData, setUserData] = useState({});
    const [repositories, setRepositories] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [commits, setCommits] = useState([]);
    const [PRs, setPRs] = useState([]);
    const [text, setText] = useState();
    const [repos, setRepos] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState("");
    const [selectedContributor, setSelectedContributor] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [excelData, setExcelData] = useState([]);

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
      const scope = "repo,user";
      window.location.assign(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${scope}`);
    }

    async function getUserData() {
        await fetch("http://localhost:9000/getUserData", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setUserData(data);
        });
    }

    async function getUserRepos() {
        await fetch("http://localhost:9000/getUserRepos", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
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
            console.log(data)
            setContributors(data);
        });
    }

    async function getCommits(){
        console.log("getting commits for this repo => " + selectedRepo);
        await fetch("http://localhost:9000/getCommits?repo=" + selectedRepo, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data)
            setCommits(data);
        });
    }

    async function getPRs(){
        console.log("getting PRs for this repo => " + selectedRepo);
        await fetch("http://localhost:9000/getPRs?repo=" + selectedRepo, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data)
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
            setExcelData(list);
        };
        reader.readAsArrayBuffer(file);
    }

    const filteredRepos = repos.filter((repo) => repo.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // useEffect(() => {
    //     async function fetchRepos() {
    //         await fetch("http://localhost:9000/getUserRepos", {
    //             method: "GET",
    //             headers: {
    //                 Authorization: "Bearer " + localStorage.getItem("access_token")
    //             }
    //         }).then((response) => {
    //             return response.json();
    //         })
    //         setRepos(repos);
    //     }
    //     fetchRepos();
    // }, []);

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path='/about-us'
                        element={<AboutUs/>}/>
                </Routes>
            </Router>
            <header className="App-header">
                {
                localStorage.getItem("access_token") ? (
                    <div className="card">
                        {
                        Object.keys(userData).length !== 0 ? (
                            <>
                                <h4 style={
                                    {
                                        color: "white",
                                        fontFamily: "sans-serif"
                                    }
                                }>
                                    Hey there {
                                    userData.login
                                }
                                    !</h4>
                            </>
                        ) : (
                            <></>
                        )
                    }

                        <h3>Please upload an excel file with repositories.</h3>
                        <h5>
                            Accepted formats: .xlsx, .xls, .xlsm, .csv</h5>
                        <input type="file" accept=".xlsx, .xls, .xlsm, .csv"
                            onChange={handleFileUpload}/>

                        <br></br>
                        <button onClick={getUserRepos}
                            style={
                                {
                                    color: "white",
                                    backgroundColor: '#7d3cff',
                                    padding: 10,
                                    borderRadius: 15,
                                    fontFamily: "sans-serif",
                                    fontSize: 16,
                                    margin: 10

                                }
                        }>Get repositories</button>
                        {
                        Object.keys(repositories).length !== 0 ? (
                            <>
                                <select id="repoDropdown"
                                    onChange={handleRepoDropdownChange}>
                                    <option value="">--Please choose a Contributor--</option>
                                    {
                                    Object.entries(repositories).map(([key, value]) => (
                                        <option key={key}
                                            value={value}>
                                            {value} </option>
                                    ))
                                } </select>
                                <select id="dropdown"
                                    onChange={handleContributorDropdownChange}>
                                    <option value="">--Please choose a Contributor--</option>
                                    <option value="all">All contributors</option>
                                    {
                                    contributors.map((option, index) => (
                                        <option key={index}
                                            value={option}>
                                            {option} </option>
                                    ))
                                } </select>
                                <button onClick={getCommits}>Get Commits</button>
                                <button onClick={getPRs}> Get PRs</button>
                            </>
                        ) : (
                            <></>
                        )
                    }
                        <br></br>
                        <button onClick={
                                () => {
                                    localStorage.removeItem("access_token");
                                    setRerender(!rerender);
                                }
                            }
                            style={
                                {
                                    color: "white",
                                    backgroundColor: '#7d3cff',
                                    padding: 10,
                                    borderRadius: 15,
                                    fontFamily: "sans-serif",
                                    fontSize: 16

                                }
                        }>
                            Log Out
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="card">
                            <h3 style={
                                {
                                    color: "white",
                                    fontFamily: "sans-serif"
                                }
                            }>Login to begin grading</h3>
                            <Button onClick={loginWithGithub}
                                variant="outlined"
                                startIcon={<GitHubIcon/>}
                                style={
                                    {
                                        color: "white",
                                        padding: 10,
                                        borderRadius: 15,
                                        fontFamily: "sans-serif"
                                    }
                            }>
                                SIGN IN WITH GITHUB
                            </Button>
                        </div>
                    </>
                )
            } </header>
        </div>
    );
}


export default App;
