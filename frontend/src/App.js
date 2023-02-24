import "./App.css";
import "./components/LoginButton.css";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AboutUs, OurAim, OurVision } from "./pages/AboutUs";
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
import LandingUI from "./components/LandingUI";
import Navbar from "./navigation/NavBar";
import AccountCircle from '@mui/icons-material/AccountCircle';

// import {
//   Services,
//   ServicesOne,
//   ServicesTwo,
//   ServicesThree,
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
  const [text, setText] = useState();
  const [data, setData] = useState([]);
  const [repos, setRepos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  //Forward the user to the guthub login screen (pass clientID)
  // user is now on the github side ang logs in
  // when user decides to login .. they get forwaded back to localhost
  // get code
  //use code to get access token ( code can be only used once)
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    console.log(codeParam);
    //using local storage to store access_token, help persists through login in with Github

    if (codeParam && localStorage.getItem("access_token") === null) {
      console.log("Inside if block");
      async function getAccessToken() {
        await fetch("http://localhost:9000/getAccessToken?code=" + codeParam, {
          method: "GET",
        })
          .then((response) => {
            console.log(response);
            return response.json();
          })
          .then((data) => {
            console.log(data);
            if (data.access_token) {
              localStorage.setItem("access_token", data.access_token);
              setRerender(!rerender); // to force rerender on success
            }
          });
      }

      getAccessToken();

    }



  }, []); //[] is used to run once



  const getData = async () => {
    const response = await fetch("http://localhost:9000/getUserData", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });

    const data = await response.json();
    console.log("data", data);
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      setData(result);
    };
    fetchData();
  }, []);



  function loginWithGithub() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
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
        console.log(data);
        setUserData(data);
        setText(data)
        getUserRepos();
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
        setRepositories(data);
      });
  }

  async function getRepoContributors(repo) {
    await fetch("http://localhost:9000/getRepoContributors/?repo=" + repo, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setRepositories(data);
      });
  }

  function handleSearch(event) {
    setSearchTerm(event.target.value);
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

      setRepos(data);
    }
    fetchRepos();
  }, []);

  return (

    <div className="App">
      
      {/* <header className="App-header"> */}
      
        {localStorage.getItem("access_token") ? (
        <div>
          <div className="nav">
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
                       WELCOME {data.login}
                                </Button>
             </div>
          <header className="App-header">
            <div className="card">
            <h4 style={{ color: "white" , fontFamily: "sans-serif" }}> Hey there {data.login} !</h4>
            <div>
              
              <button onClick={getUserData} style={{
                color: "white", backgroundColor: '#7d3cff',
                padding: 10, borderRadius: 15, fontFamily: "sans-serif", fontSize: 16

              }}>Click to get your repositories</button></div>
            {Object.keys(userData).length !== 0 ? (
              <>

                {Object.keys(repositories).length !== 0 ? (

                  <>
                    <select> {
                      Object.entries(repositories).map(([key, value]) => (
                        <option key={key}
                          value={value}>
                          {value}</option>
                      ))
                    } </select>

                  </>) : (
                  <> </>
                )}
              </>
            ) : (
              <></>
            )}
            <br></br>
            <button
              onClick={() => {
                localStorage.removeItem("access_token");
                setRerender(!rerender);
              }}
              style={{
                color: "white", backgroundColor: '#7d3cff',
                padding: 10,borderRadius: 15, fontFamily: "sans-serif", fontSize: 16

              }}
            >
              Log Out
            </button>
          </div>
          </header>
        </div>
        /* </div> */
    
        ) : (
          <>
          <div className="newCard">
            <div className="card">
              <h3 style={{ color: "white", fontFamily: "sans-serif" }}>LOGIN TO BEGIN GRADING </h3>
              {/* <button onClick={loginWithGithub} style={{
                color: "white", backgroundColor: '#7d3cff', 
                padding: 10, borderRadius: 15, fontFamily: "sans-serif"
              }}> SIGN IN WITH GITHUB</button> */}
               {/* <Stack direction="row" > */}
                  <Button onClick={loginWithGithub} variant="outlined" startIcon={<GitHubIcon />} style={{
                color: "white", 
                padding: 10, borderRadius: 15, fontFamily: "sans-serif", 
              }}>
                  SIGN IN WITH GITHUB
                          </Button>
        
              </div>
              </div>
          </>
        )}
        
      {/* </header> */}
    </div>
  );
}

export default App;