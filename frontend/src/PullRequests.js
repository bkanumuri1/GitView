import * as React from "react";
import { styled, withStyles } from "@mui/material/styles";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import Chip from "@mui/material/Chip";
import TransitionsPopper from "./components/TransitionsPopper";
import Charts from "./components/PullRequestBarChart";
import { GitMergeIcon } from "@primer/octicons";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#778899",
    color: theme.palette.common.black,
    width: "100px",
    textAlign: "center"
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    wordWrap: 'break-word',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <StyledTableRow>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell scope="row" align="center">
          {row.date}
        </StyledTableCell>
        <StyledTableCell align="center">{row.pr_count}</StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>PR Links</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Head Ref</StyledTableCell>
                    <StyledTableCell>Base Ref</StyledTableCell>
                    <StyledTableCell>Reviewers</StyledTableCell>
                    <StyledTableCell align="center" colSpan={2}>
                      Comments
                    </StyledTableCell>
                    {/* <StyledTableCell></StyledTableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.pr_details.map((detailsRow, index) => (
                    <>
                      <StyledTableRow key={index}>
                        <StyledTableCell>
                          <div>
                            <a
                              key={index}
                              href={detailsRow.url}
                              target="_blank"
                            >
                              {detailsRow.author}: {detailsRow.title}
                            </a>
                          </div>
                        </StyledTableCell>
                        <StyledTableCell>
                          {detailsRow.state && (
                            <>
                              {
                                {
                                  OPEN: <Chip label="open" color="success" />,
                                  CLOSED: <Chip label="closed" color="error" />,
                                  MERGED: (
                                    <Chip
                                      label="merged"
                                      color="secondary"
                                    ></Chip>
                                  ),
                                }[detailsRow.state]
                              }
                            </>
                          )}
                        </StyledTableCell>
                        <StyledTableCell>{detailsRow.headRef}</StyledTableCell>
                        <StyledTableCell>{detailsRow.baseRef}</StyledTableCell>
                        <StyledTableCell>
                          <p>{detailsRow.reviewers.join(", ")}</p>
                        </StyledTableCell>
                        <StyledTableCell>
                          <TransitionsPopper
                            heading="Review Comments"
                            content={
                              detailsRow.reviews.length == 0 ? (
                                "None"
                              ) : (
                                <div>
                                  {detailsRow.reviews.map((comment) => (
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: `${comment.author}: ${comment.comment}<br>`,
                                      }}
                                    />
                                  ))}
                                </div>
                              )
                            }
                          ></TransitionsPopper>
                        </StyledTableCell>
                        <StyledTableCell>
                          <div>
                            <TransitionsPopper
                              heading="Issue Comments"
                              content={
                                detailsRow.comments.length == 0 ? (
                                  "None"
                                ) : (
                                  <div>
                                    {detailsRow.comments.map((comment) => (
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: `${comment.author}: ${comment.comment}<br>`,
                                        }}
                                      />
                                    ))}
                                  </div>
                                )
                              }
                            ></TransitionsPopper>
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// Row.propTypes = {
//   row: PropTypes.shape({
//     date: PropTypes.string.isRequired,
//     commit_count: PropTypes.number.isRequired,
//     // commit_details: PropTypes.arrayOf(
//     //   // PropTypes.shape({
//     //   //   author: PropTypes.object.isRequired,
//     //   //   html_url: PropTypes.object.isRequired,
//     //   //   message: PropTypes.string.isRequired,
//     //   // })
//     // ).isRequired,
//   }).isRequired,
// };

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "pr_count",
    numeric: true,
    disablePadding: false,
    label: "Pull Requests",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell>Details</StyledTableCell>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align="center"
            // align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function PRS({ prData }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("prData");
  const [selected, setSelected] = React.useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <div>
      {/* here you check if the state is loading otherwise if you wioll not call that you will get a blank page because the data is an empty array at the moment of mounting */}
      {prData.length == 0 ? (
        <></>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={prData.length}
            />
            <TableBody>
              {stableSort(prData, getComparator(order, orderBy)).map(
                (row, index) => {
                  return <Row key={index} row={row} />;
                }
              )}
            </TableBody>
          </Table>
          {/* <Charts prData={prData}></Charts> */}
        </TableContainer>
      )}
    </div>
  );
}
