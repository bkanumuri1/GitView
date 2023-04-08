import React from 'react';
import { Pie } from "react-chartjs-2"; 
import { useState ,useEffect} from "react";


function PieChart({chartData}) {
    return <div style={{ position: "relative", margin: '300px', width: "80vw", height: '40vh' }}> <Pie data={chartData} /> </div>
}

export default PieChart;