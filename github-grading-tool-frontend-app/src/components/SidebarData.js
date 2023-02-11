import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import * as GoIcons from "react-icons/go";
import * as GrIcons from "react-icons/gr";
// import * as FaUserGraduate from "react-icons/fa"
 
export const SidebarData = [
  {
    title: "Git Repositories",
    path: "/about-us",
    icon: <GoIcons.GoMarkGithub />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
 
    subNav: [
      {
        title: "Repo 1",
        path: "/about-us/aim",
        icon: <GoIcons.GoRepo  />,
      },
      {
        title: "Repo 2",
        path: "/about-us/vision",
        icon: <GoIcons.GoRepo  />,
      },
    ],
  },
  {
    title: "Students",
    path: "/services",
    icon: <FaIcons.FaUserGraduate />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
 
    subNav: [
      {
        title: "Student 1",
        path: "/services/services1",
        icon: <FaIcons.FaUserGraduate />,
        cName: "sub-nav",
      },
      {
        title: "Student 2",
        path: "/services/services2",
        icon: <FaIcons.FaUserGraduate />,
        cName: "sub-nav",
      },
      {
        title: "Student 3",
        path: "/services/services3",
        icon: <FaIcons.FaUserGraduate />,
      },
    ],
  },
//   {
//     title: "Contact",
//     path: "/contact",
//     icon: <FaIcons.FaPhone />,
//   },
  {
    title: "Grades",
    path: "/events",
    icon: <FaIcons.FaEnvelopeOpenText />,
 
    iconClosed: <GrIcons.GrScorecard />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
 
    // subNav: [
    //   {
    //     title: "Event 1",
    //     path: "/events/events1",
    //     icon: <IoIcons.IoIosPaper />,
    //   },
    //   {
    //     title: "Event 2",
    //     path: "/events/events2",
    //     icon: <IoIcons.IoIosPaper />,
    //   },
    // ],
  },
  {
    title: "Comments",
    path: "/support",
    icon: <RiIcons.RiMessageLine />,
  },
];