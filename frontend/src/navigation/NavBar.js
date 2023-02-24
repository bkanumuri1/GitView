import { Fragment } from "react";
import './nav.css';
import Button from '@mui/material/Button';
import { useEffect, useState } from "react";
import AccountCircle from '@mui/icons-material/AccountCircle';
// import { Disclosure, Menu, Transition } from "@headlessui/react";
// import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";

// const navigation = [
//   { name: "Dashboard", href: "#", current: true },
//   { name: "Team", href: "#", current: false },
//   { name: "Projects", href: "#", current: false },
//   { name: "Calendar", href: "#", current: false },
// ];

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }


export default function Navbar({data}) {
const [rerender, setRerender] = useState(false);
  return (
  <div className="nav">
    <button
              onClick={() => {

                // localStorage.removeItem("access_token");
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
  );
}