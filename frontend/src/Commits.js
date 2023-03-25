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
import TableSortLabel from '@mui/material/TableSortLabel';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Chart from "./components/Charts";
import Checkbox from '@mui/material/Checkbox';

import { visuallyHidden } from '@mui/utils';

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState([]);


  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelected = rows.map((n) => n.name);
  //     setSelected(newSelected);
  //     return;
  //   }
  //   setSelected([]);
  // };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <>

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
                    {row.commit_details.map((detailsRow, index) => {
                      const isItemSelected = isSelected(detailsRow.html_url);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          onClick={(event) => handleClick(event, detailsRow.html_url)}
                          role="checkbox"
                          selected={isItemSelected}
                        >
                          <TableCell
                          >
                            {/* {row.commit_details.map((detailsRow, index) => (  */}
                            <div>
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  // 'aria-labelledby': labelId,
                                }} />
                              {" "}
                              <a
                                key={index}
                                href={detailsRow.html_url}
                                target="_blank"
                              >
                                {detailsRow.author.login}: {detailsRow.message}
                              </a>
                            </div>
                            {/* ))} */}
                          </TableCell>
                          <TableCell>
                            {/* {row.commit_details.map((detailsRow, index) => ( */}
                            <div>
                              {" "}
                              <p style={{ color: "green" }}>+{detailsRow.stats.additions}</p>
                            </div>
                            {/* ))} */}
                          </TableCell>
                          <TableCell>
                            {/* {row.commit_details.map((detailsRow, index) => ( */}
                            <div>
                              {" "}
                              <p style={{ color: "red" }}>-{detailsRow.stats.deletions}</p>
                            </div>
                            {/* ))} */}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>

      </React.Fragment>
    </>
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
  return order === 'desc'
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
  // {
  //   id: 'details',
  //   numeric: false,
  //   disablePadding: true,
  //   label: 'Details',
  // },
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'Date',
  },
  {
    id: 'commit_count',
    numeric: true,
    disablePadding: false,
    label: 'Commits',
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
        <TableCell>Details</TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            // align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function Commits({ commits }) {

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('Commits');
  const [selected, setSelected] = React.useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  return (
    <div>
      {/* here you check if the state is loading otherwise if you wioll not call that you will get a blank page because the data is an empty array at the moment of mounting */}
      {commits.length == 0 ? (
        <></>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={commits.length}
            />
            <TableBody >
              {stableSort(commits, getComparator(order, orderBy))
                .map((row, index) => {
                  return (
                    <Row key={index} row={row} />
                  );
                })}
            </TableBody>
          </Table>
          <Chart commitData={commits} />
        </TableContainer>
      )}
    </div>
  );
}
