// import * as React from "react";
// import Box from "@mui/material/Box";
// import Popper from "@mui/material/Popper";
// import Fade from "@mui/material/Fade";
// import Chip from "@mui/material/Chip";

// export default function TransitionsPopper({ heading, content }) {
//   const [open, setOpen] = React.useState(false);
//   const [anchorEl, setAnchorEl] = React.useState(null);

//   const handleMouseOver = (event) => {
//     setAnchorEl(event.currentTarget);
//     setOpen((previousOpen) => !previousOpen);
//   };
//   const handlePopperMouseOver = (event) => {
//     setOpen(true);
//   };
//   const handleMouseLeave = () => {
//     setOpen(false);
//   };
//   const canBeOpen = open && Boolean(anchorEl);
//   const id = canBeOpen ? "transition-popper" : undefined;

//   return (
//     <div>
//       <Chip
//         label={heading}
//         variant="outlined"
//         aria-describedby={id}
//         onMouseLeave={handleMouseLeave}
//         onMouseOver={handleMouseOver}
//       />
//       <Popper
//         id={id}
//         onMouseOver={handlePopperMouseOver}
//         onMouseLeave={handleMouseLeave}
//         open={open}
//         anchorEl={anchorEl}
//         transition
//       >
//         {({ TransitionProps }) => (
//           <Fade {...TransitionProps} timeout={350}>
//             <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>
//               {content}
//             </Box>
//           </Fade>
//         )}
//       </Popper>
//     </div>
//   );
// }
import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";

export default function TransitionsPopper({ heading, content }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  function handleMouseOver(event) {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  }

  function handleMouseLeave(event){
    setAnchorEl(null);
    setOpen(false);
  };

  const canBeOpen = Boolean(anchorEl);
  const id = canBeOpen ? "transition-popover" : undefined;
  
  return (
    <div id="popper" onMouseLeave={handleMouseLeave} onMouseOver={handleMouseOver}>
      <Button aria-describedby={id}  type="text">
        {heading}
      </Button>
      <Popper id={id} open={open}
         anchorEl={anchorEl}
         transition
         anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}>
          {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>
              {content}
            </Box>
          </Fade>
        )}
      </Popper>
    </div>
  );
}
