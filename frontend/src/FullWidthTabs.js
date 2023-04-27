import "./FullWidthTabs.css";
import * as React from "react";
import PropTypes from "prop-types";
// import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Commits from "./Commits";
import PRS from "./PullRequests";
import Chart from "./components/Charts";
import Charts from "./components/PullRequestBarChart";
import DoughnutChart from "./components/DoughnutChart";

import commits from "./Commits"

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs({ commitData, prData, dates , selectedContributor}) {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    Chart(commitData);
    Charts(prData);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Commits" {...a11yProps(0)} />
          <Tab label="Pull Requests" {...a11yProps(1)} />       
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <div className="tab-container">
          <div className="table-container">
            <Commits commits={commitData}></Commits>
          </div>
          <div>
            <Chart dates={dates} commitData={commitData} selectedContributor= {selectedContributor} />
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
      <div className="tab-container">
        <div className="table-container">
          <PRS prData={prData}></PRS>
        </div>
        <div>
          <Charts dates={dates} prData={prData} />
          <DoughnutChart prData={prData}/>
        </div>
      </div>  
      </TabPanel>    
    </Box>
  );
}
