import "./App.css";
import Sidebar from "./components/Sidebar";
import {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {AboutUs, OurAim, OurVision} from "./pages/AboutUs";
import * as XLSX from 'xlsx';

// import {
// Services,
// ServicesOne,
// ServicesTwo,
// ServicesThree,
// } from "./pages/Services";
// import { Events, EventsOne, EventsTwo } from "./pages/Events";
// import Contact from "./pages/ContactUs";
// import Support from "./pages/Support";

const CLIENT_ID = "e7231ef0e449bce7d695";
function App() {
    const [rerender, setRerender] = useState(false);
    const [userData, setUserData] = useState({});
    const [repositories, setRepositories] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [excelData, setExcelData] = useState([]);

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
            console.log("Inside if block");
            async function getAccessToken() {
                await fetch("http://localhost:9000/getAccessToken?code=" + codeParam, {method: "GET"}).then((response) => {
                    console.log(response);
                    return response.json();
                }).then((data) => {
                    console.log(data);
                    if (data.access_token) {
                        localStorage.setItem("access_token", data.access_token);
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
            console.log(data);
            let commonElements = new Map();
            Object.keys(data).forEach(key => {
                if (excelData.includes(data[key])) {
                    commonElements[key] = data[key];
                }
            });
            setRepositories(commonElements);
        });
    }

    async function getRepoContributors(repo) {
        await fetch("http://localhost:9000/getRepoContributors/?repo=" + repo, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setRepositories(data);
        });
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

    return (
        <div className="App">
            <Router>
                <Sidebar/>
                <Routes>
                    <Route path='/about-us'
                        element={<AboutUs/>}/> {/* <Route path='/about-us/aim' element={<OurAim/>} />
          <Route path='/about-us/vision' element={<OurVision/>} />
          <Route path='/services' element={<Services/>} />
          <Route path='/services/services1' element={<ServicesOne/>} />
          <Route path='/services/services2' element={<ServicesTwo/>} />
          <Route path='/services/services3' element={<ServicesThree/>} />
          <Route path='/contact' element={<Contact/>} />
          <Route path='/events' element={<Events/>} />
          <Route path='/events/events1' element={<EventsOne/>} />
          <Route path='/events/events2' element={<EventsTwo/>} />
          <Route path='/support' element={<Support/>} /> */} </Routes>
            </Router>
            <header className="App-header">
                {
                localStorage.getItem("access_token") ? (
                    <>
                        <h1>we have the access token</h1>
                        <button onClick={
                            () => {
                                localStorage.removeItem("access_token");
                                setRerender(!rerender);
                            }
                        }>
                            Log Out
                        </button>
                        <h3>Get User Data from Github API</h3>
                        <button onClick={getUserData}>Click to get Data</button>
                        {
                        Object.keys(userData).length !== 0 ? (
                            <>
                                <h4>
                                    Hey there {
                                    userData.login
                                }
                                    !</h4>
                                <h3>Please upload an excel file with repositories.</h3>
                                <h5> Accepted formats: .xlsx, .xls, .xlsm, .csv</h5>
                                <input type="file" accept=".xlsx, .xls, .xlsm, .csv"
                                    onChange={handleFileUpload}/>
                                <button onClick={getUserRepos}>Click to get Repos</button>
                                {
                                Object.keys(repositories).length !== 0 ? (
                                    <>
                                        <select> {
                                            Object.entries(repositories).map(([key, value]) => (
                                                <option key={key}
                                                    value={value}>
                                                    {value}</option>
                                            ))
                                        } </select>
                                    </>
                                ) : (
                                    <>
                                      </>
                                )
                            } </>
                        ) : (
                            <></>
                        )
                    } </>
                ) : (
                    <>
                        <h3>
                            User not logged in</h3>
                        <button onClick={loginWithGithub}>Login With Github</button>
                    </>
                )
            } </header>
        </div>
    );
}

export default App;
