
import React, { useEffect, useState, useMemo } from "react";
import { Container, Table, Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import Paper from "@mui/material/Paper";
import { IconButton, TableBody, TableContainer, TableHead, TablePagination, } from "@mui/material";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues
} from "@tanstack/react-table";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';



function GetAllPriorTimeRequest() {
  const token = useSelector((state) => state.auth.token);

  const [loading, setLoading] = useState(true);
  const [priorTimeRequests, setPriorTimeRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [columnFilters, setColumnFilters] = useState([]);

  useEffect(() => {
    getAllPriorTimeRequest();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset to first page on rows per page change
  };

  const getAllPriorTimeRequest = () => {
    setLoading(true);
    axios
      .get("/apigateway/payroll/timeSheet/getAllPriorTimeRequest", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      )
      .then((response) => {
        // Flatten the content array to get a single list of all prior time requests
        const requests = response.data.content.flatMap((employeeRequests) =>
          Object.values(employeeRequests).flat()
        );
        console.log(requests);
        setPriorTimeRequests(requests);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message || "Error fetching details");
        setLoading(false);
      });
  };
  const handleApproveStatus = (id) => {
    setLoading(true);
    axios
     .get(`/apigateway/payroll/timeSheet/updatePriorTime/Accepted/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
     )
    .then((response)=>{
      setLoading(false);
    getAllPriorTimeRequest();
      toast.success(response.data, {
        position: "top-center",
        theme: "colored",
      });
      console.log(response.data);
    }).catch(err=>{  
      toast.error(err, {
        position: "top-center",
        theme: "colored",
      });
      setLoading(false);
      console.log(err);})
  };

  const handleRejectStatus = (id) => {
    setLoading(true);  
    
    axios.get(`/apigateway/payroll/timeSheet/updatePriorTime/Rejected/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response)=>{
      setLoading(false);
      console.log(response.data);
    getAllPriorTimeRequest();
      toast.success(response.data, {
        position: "top-center",
        theme: "colored",
      });
    }).catch(err=>{ 
      setLoading(false);
       console.log(err)
      toast.error(err, {
        position: "top-center",
        theme: "colored",
      });
    })
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "employeeId",
        header: "Employee Id",
      },

      {
        accessorKey: "employeeName",
        header: "Employee Name",
        filterFn: "includes",
      },
      {
        accessorKey: "checkIn",
        header: "Check In",
      },
      {
        accessorKey: "checkOut",
        header: "Check Out",
      },
      {
        accessorKey: "date",
        header: "Date",
      },
      {
        accessorKey: "month",
        header: "Month",
      },
      {
        accessorKey: "workingHour",
        header: "Working Hour",
      },
      {
        accessorKey: "status",
        header: "Status",
        meta: { filterVariant: "select" },
      },
      {
        accessorKey: "updatedBy",
        header: "Updated By",
      },
      {
        accessorKey: "year",
        header: "Year",
      },
      {
        accessorKey: "approve",
        header: "Approve",
      },
      {
        accessorKey: "reject",
        header: "Reject",
      },
      {
        accessorKey: "edit",
        header: "Edit",
        meta: { filterable: false },
        cell: ({ row }) =>
          row.original.status === "Comp_Off" ? (
            <Tooltip title="Edit">
              <IconButton color="primary" onClick={() => handleRowClick(row.original)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          ) : null,

      },
    ],

  );

  const table = useReactTable({
    data: priorTimeRequests,
    columns: columns.filter((col) => col.isVisible),
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  const tStyle = {
    backgroundColor: "rgb(114, 108, 108)",
    color: "white",
    position: "sticky",
    top: "0",
    zIndex: 1,
    fontFamily: "Roboto",
    fontWeight: "500",
    fontSize: "0.875rem",
    lineHeight: "1.5rem",
    letterSpacing: "0.01071em",


  }

  return (
    <div className="mt-3">
      {loading && <LoadingPage />}
      <div style={{ margin: "100px 100px", height: "562px" }}>
        <h1 className="Heading1">PriorTime Request</h1>
        <Container>
          <Paper sx={{ width: "100ch", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <tr>
                    <th style={tStyle}>Employee Id</th>
                    <th style={tStyle}>Employee Name</th>
                    <th style={tStyle}>Check In</th>
                    <th style={tStyle}>Check Out</th>
                    <th style={tStyle}>Date</th>
                    <th style={tStyle}>Month</th>
                    <th style={tStyle}>Status</th>
                    <th style={tStyle}>Working Hour</th>
                    <th style={tStyle}>Year</th>
                    <th style={tStyle}>Updated By</th>
                    <th style={tStyle}>Approve</th>
                    <th style={tStyle}>Reject</th>
                  </tr>
                </TableHead>
                <TableBody>
                  {priorTimeRequests.map((request, index) => (
                    <tr key={index}>
                      <td>{request.employeeId}</td>
                      <td>{request.employeeName}</td>
                      <td>{request.checkIn}</td>
                      <td>{request.checkOut}</td>
                      <td>{request.date}</td>
                      <td>{request.month}</td>
                      <td>{request.status}</td>
                      <td>{request.workingHour}</td>
                      <td>{request.year}</td>
                      <td>{request.updatedBy || "N/A"}</td>
                      <td>
                        <IconButton
                          // sx={{  color:"rgb(114, 108, 108)"}}
                          sx={{
                            color: "rgb(114, 108, 108)",
                            "&:hover": {
                              color: "#ab2217",
                            },
                          }}
                          type="submit"
                          variant="outline-primary"
                         
                          onClick={() => handleApproveStatus(request.priortimeId)}
                        >
                           <CheckIcon />
                        </IconButton>
                      </td>
                      <td>
                        <IconButton
                         sx={{
                          color: "rgb(114, 108, 108)",
                          "&:hover": {
                            color: "#ab2217",
                          },
                        }}
                          type="submit"
                          variant="outline-danger"
                          onClick={() => handleRejectStatus(request.priortimeId)}
                        >
                          <CloseIcon />
                        </IconButton>
                      </td>
                   </tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              sx={{ backgroundColor: "rgb(114, 108, 108)", color: "#fff" }}
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={priorTimeRequests.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Container>
      </div>
    </div>
  );
}

export default GetAllPriorTimeRequest;
