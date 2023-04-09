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
