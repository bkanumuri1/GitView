import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell scope="row" align="center">
          {row.date}
        </TableCell>
        <TableCell align="center">{row.commit_count}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Commit Links</TableCell>
                    <TableCell>Additions</TableCell>
                    <TableCell>Deletions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {row.commit_details.map((detailsRow, index) => (
                        <div>
                          {" "}
                          <a
                            key={index}
                            href={detailsRow.html_url}
                            target="_blank"
                          >
                            {detailsRow.author.login}: {detailsRow.message}
                          </a>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                    {row.commit_details.map((detailsRow, index) => (
                        <div>
                          {" "}
                          <p>{detailsRow.stats.additions}</p>                         
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                    {row.commit_details.map((detailsRow, index) => (
                        <div>
                          {" "}
                          <p>{detailsRow.stats.deletions}</p>                         
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    date: PropTypes.string.isRequired,
    commit_count: PropTypes.number.isRequired,
    commit_details: PropTypes.arrayOf(
      PropTypes.shape({
        author: PropTypes.object.isRequired,
        html_url: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default function Commits({ commits }) {
  return (
    <div>
      {/* here you check if the state is loading otherwise if you wioll not call that you will get a blank page because the data is an empty array at the moment of mounting */}
      {commits.length == 0 ? (
        <></>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell>Details</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Commits</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {commits.map((row, index) => (
                <Row key={index} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
