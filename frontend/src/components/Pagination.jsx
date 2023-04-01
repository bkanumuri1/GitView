import { useState, useEffect } from "react";
import {
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
} from "@mui/material";

const Pagination = () => {
  //   const [passengersList, setPassengersList] = useState([]);
  //   const [passengersCount, setPassengersCount] = useState(0);
  //   const [controller, setController] = useState({
  //     page: 0,
  //     rowsPerPage: 10,
  //   });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [isNextPage, setIsNextPage] = useState(false);
  // const [isNextPage, setIsNextPage] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const url = `http://localhost:9000/getPRs?perPage=${rowsPerPage}&pageNumber=${page}&repo=bkanumuri1/SER-517-Group-17---Github-Grading-Tool&since=2023-03-01T02:59:49Z&until=2023-03-31T01:59:49Z&author=all`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: "Bearer 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",
          },
        });
        if (response.statusText === "OK") {
          const data = await response.json();
          console.log(data);
          setData(data.data);
          //   setPassengersCount(data.data.length);
          setIsNextPage(data.isNextPage);
        } else {
          throw new Error("Request failed");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [page, rowsPerPage]);

  const handlePageChange = (event, newPage) => {
    console.log(newPage);
    setPage(newPage);
    // setController({
    //   ...controller,
    //   page: newPage,
    // });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    // setController({
    //   ...controller,
    //   rowsPerPage: parseInt(event.target.value, 10),
    //   page: 0,
    // });
  };
  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Trips</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((passenger) => (
            <TableRow key={passenger.date}>
              <TableCell>{passenger.date}</TableCell>
              <TableCell>{passenger.pr_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        onPageChange={handlePageChange}
        page={page}
        count={isNextPage ? (page + 2) * rowsPerPage : (page + 1) * rowsPerPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
};

export default Pagination;
