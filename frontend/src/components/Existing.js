import React from 'react';
import {useNavigate} from "react-router-dom"
  
function About  ({login}) {
  const login2=login;
  const navigate = useNavigate();
  
  
  return (
  <>
     <h1 style={{color:"green"}}>{console.log("login",login2)}A Computer Science portal for geeks.</h1>
     
     <button onClick={()=>navigate(-1)}>Go Back Home</button>
     
  </>
  )
};
  
export default About;