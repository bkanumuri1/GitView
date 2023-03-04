import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import Button from '@mui/material/Button';
import {useEffect, useState} from "react";
import Chartsss from './Chart'
import {BrowserRouter as Router, Routes, Route,Switch,useNavigate} from "react-router-dom";

const Existing =(props)=>{
    const [rerender, setRerender] = useState(false);
    const navigate =useNavigate();
    return(
        <>

<header className="App-header">
        {localStorage.getItem("access_token") ? (
        <div className="card">


        <h4 style={{ color: "white" , fontFamily: "sans-serif" }}> Hey there {props.data.login} !</h4>


        <h3>Please upload an excel file with repositories.</h3>
        <h5> Accepted formats: .xlsx, .xls, .xlsm, .csv</h5>
        <input type="file" accept=".xlsx, .xls, .xlsm, .csv" onChange={props.handleFileUpload}/>

        <br></br>
        <div>
          <button onClick={props.getUserData} style={{
            color: "white", backgroundColor: '#7d3cff',
            padding: 10, borderRadius: 15, fontFamily: "sans-serif", fontSize: 16, margin : 10

          }}>Click to get your repositories</button></div>
          {Object.keys(props.userData).length !== 0 ? (
          <>

            {Object.keys(props.repositories).length !== 0 ? (

              <>
                <select> {
                  Object.entries(props.repositories).map(([key, value]) => (
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
        style={{
            color: "white", backgroundColor: '#7d3cff',
            padding: 10,borderRadius: 15, fontFamily: "sans-serif", fontSize: 16

          }}onClick={
                ()=>navigate('charts')

        }>charts</button>
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
        
        
        ):(
          <>
            <div className="card">
              <h3 style={{ color: "white", fontFamily: "sans-serif" }}>Login to begin grading</h3>
              {/* <button onClick={loginWithGithub} style={{
                color: "white", backgroundColor: '#7d3cff', 
                padding: 10, borderRadius: 15, fontFamily: "sans-serif"
              }}> SIGN IN WITH GITHUB</button> */}
               {/* <Stack direction="row" > */}
                  <Button onClick={props.loginWithGithub} variant="outlined" startIcon={<GitHubIcon />} style={{
                color: "white", 
                padding: 10, borderRadius: 15, fontFamily: "sans-serif"
              }}>
                  SIGN IN WITH GITHUB
                          </Button>
                     {/* </Stack> */}
              </div>
          </>
        )}</header>

        </>
    )
}

export default Existing;