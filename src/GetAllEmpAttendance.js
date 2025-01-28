import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Tooltip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Modal,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
  ListItemText,
  IconButton,
  Paper,
  TablePagination,
} from "@mui/material";
import {
  Edit as EditIcon,
  FileDownloadOutlined as FileDownloadOutlinedIcon,
} from "@mui/icons-material";
import { Form, Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import Graph from "./Graph";
import LoadingPage from "./LoadingPage";
import CompOffLeaveSettlementModal from "./CompOffLeaveSettlementModal ";
//import { FormControl, Select, MenuItem, TextField } from "@mui/material";
import { Container } from '@mui/material';


const GetAllEmpAttendance = () => {
  const token = useSelector((state) => state.auth.token);
  const empid = useSelector((state) => state.auth.empId);
  const navigate = useNavigate();





  const [getAttendence, setAttendence] = useState({
    fromDate: "",
    toDate: "",
  });
  const [PriorTimeRequest, setPriorTimeRequest] = useState(true);
  const handlePriorTimeRequest = () => {
    setPriorTimeRequest(false); // Hide the button when clicked
    navigate("/GetAllPriorTimeRequest");
  };

  const [loading, setLoading] = useState(false);
  const [getData, setData] = useState([]);
  const [alldata, setAlldata] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const [error, setError] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [updateRow, setNewData] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");


  const [columnVisibility, setColumnVisibility] = useState({
    adt_Id: true,
    employeeName: true,
    checkIn: true,
    checkOut: true,
    totalWorkingHours: true,
    date: true,
    status: true,
    month: true,
    year: true,
    day: true,
    edit: true,
  });


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //------
  useEffect(() => {
    axios
      .get(
        `/apigateway/hrms/employee/getAllEmp`,
        {
          params: {
            fromDate: getAttendence.fromDate,
            toDate: getAttendence.toDate,
            // page: page - 1, // Adjust for zero-based indexing
            // size: 10,       // Items per page
          
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data.content);
        setAlldata(response.data.content); // Update with current page's data
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Error fetching details");
        setLoading(false);
      });
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const selectEmployee = (event, page = 1) => {
    console.log(selectedEmployeeId);

    setLoading(true);

    axios
      .get(
        `/apigateway/payroll/timeSheet/allEmpAttendence`,
        {
          params: {
            fromDate: getAttendence.fromDate,
            toDate: getAttendence.toDate,
            page: page - 1, // Adjust for zero-based indexing
            size: 10,       // Items per page
            empid: selectedEmployeeId
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const { content, totalPages } = response.data;
        console.log(response.data);
        setData(content || []); // Update with current page's data
        setTotalPages(totalPages || 0); // Update total pages
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error(error.response?.data?.message || "Error fetching details");
        setLoading(false);
      });

  }

  const handlePageChange = (page) => {
    console.log("Navigating to Page:", page);
    setCurrentPage(page);
    selectEmployee(null, page);
  };

  const handle = (e) => {
    const { id, value } = e.target;
    setAttendence((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    if (id === "toDate" && value < getAttendence.fromDate) {
      setError("To Date cannot be less than From Date");
    } else {
      setError("");
    }
  };

  const handleSelectChange = (event) => {
    setSelectedEmployee(event.target.value);
  };

  const exportToExcel = () => {
    setLoading(true);
    axios({
      url: `/apigateway/payroll/timeSheet/exporttoexcel?fromDate=${getAttendence.fromDate}&toDate=${getAttendence.toDate}`,
      method: "GET",
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "timesheet.xlsx");
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Error uploading excel.");
        setLoading(false);
      });
  };

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
    selectEmployee(null, currentPage);
  }, [currentPage]);


  const toggleColumnVisibility = (columnName) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnName]: !prevVisibility[columnName],
    }));
  };

  const handleSelectEmployee = (event) => {
    console.log(event.target.value);
    setSelectedEmployeeId(event.target.value);
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleRowClick = (row) => {
    setNewData()
    setSelectedRowData(row);
    console.log("row data", row);
    console.log("row data", row.date);
    console.log("row data", row.employeeId);
    handleOpenModal();
  };

  const toggleAllColumns = (isVisible) => {
    const updatedVisibility = {};
    Object.keys(columnVisibility).forEach((key) => {
      updatedVisibility[key] = isVisible;
    });
    setColumnVisibility(updatedVisibility);
  };
  const customFilterFn = (row, columnId, filterValue) => {
    if (!filterValue || filterValue.length === 0) return true; // Show all rows if no filter is applied
    const rowValue = row.getValue(columnId);
    return filterValue.includes(rowValue); // Check if the row's value is in the selected filter values
  };


  const columns = useMemo(
    () => [
      {
        accessorKey: "adtId",
        header: "Adt_Id",
        // meta: { filterVariant: "select" },
        isVisible: columnVisibility.adt_Id,
        filterFn: customFilterFn,
      },

      {
        accessorKey: "employeeName",
        header: "Employee Name",
        filterFn: "includes",
        // meta: { filterVariant: "select" },
        isVisible: columnVisibility.employeeName,
        filterFn: customFilterFn,
      },
      {
        accessorKey: "checkIn",
        header: "Check In",
        //meta: { filterVariant: "select" },
        isVisible: columnVisibility.checkIn,
      },
      {
        accessorKey: "checkOut",
        header: "Check Out",
        // meta: { filterVariant: "select" },
        isVisible: columnVisibility.checkOut,
      },
      {
        accessorKey: "totalWorkingHours",
        header: "Working Hour",
        // meta: { filterVariant: "select" },
        isVisible: columnVisibility.totalWorkingHours,
      },
      {
        accessorKey: "day",
        header: "Day",
        // meta: { filterVariant: "select" },
        isVisible: columnVisibility.day,
      },
      {
        accessorKey: "date",
        header: "Date",
        // meta: { filterVariant: "select" },
        isVisible: columnVisibility.date,
      },
      {
        accessorKey: "status",
        header: "Status",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.status,
      },
      {
        accessorKey: "month",
        header: "Month",
        //meta: { filterVariant: "select" },
        isVisible: columnVisibility.month,
      },
      {
        accessorKey: "year",
        header: "Year",
        //  meta: { filterVariant: "select" },
        isVisible: columnVisibility.year,
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
        isVisible: columnVisibility.edit,
      },
    ],
    [columnVisibility]
  );

  const table = useReactTable({
    data: getData,
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

  const filteredData = useMemo(() => {
    if (selectedEmployee.length === 0) return getData;
    return getData.filter((item) =>
      selectedEmployee.includes(item.employeeName)
    );
  }, [selectedEmployee, getData]);

  const todayDate = new Date().toISOString().split("T")[0];

  const handleOpen = () => {
    setShowGraph(true);
  };

  const handleClose = () => {
    setShowGraph(false);
  };

  return (
    <div style={{ padding: "20px", marginLeft: "50px" }}>

      <div className="mt-3">
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            width: "100%",
            marginBottom: "10px",
            marginLeft: "0px",
          }}
        >
          {loading && <LoadingPage />}
          <Container
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "920px",
              margin: "0 auto",
            }}>
            <TextField
              id="fromDate"
              label="From Date"
              type="date"
              value={getAttendence.fromDate}
              onChange={handle}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ max: todayDate }}
              style={{ marginRight: "20px", width: "180px", height: "20px" }}
              InputProps={{
                style: {
                  height: "40px",
                  padding: "0 14px",
                },
              }}
            />

            <TextField
              id="toDate"
              label="To Date"
              type="date"
              value={getAttendence.toDate}
              onChange={handle}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ max: todayDate }}
              style={{ marginRight: "20px", width: "180px", height: "20px" }}
              InputProps={{
                style: {
                  height: "40px",
                  padding: "0 14px",
                },
              }}
            />

            <Button variant="contained"
              style={{
                marginRight: "20px",
                height: "40px",
                marginTop: "20px",
                backgroundColor: "#ab2217"
              }}
              onClick={selectEmployee}>Get</Button>
          </Container>
          <br></br>

          <Container
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "920px",
              margin: "0 auto",
            }}>

            <Tooltip title="Download employee attendance data" arrow>
              <Button
                onClick={exportToExcel}
                variant="contained"
                startIcon={<FileDownloadOutlinedIcon />}
                style={{
                  marginLeft: "-48px",
                  marginRight: "20px",
                  height: "40px",
                  marginTop: "20px",
                  backgroundColor: "#ab2217"
                }}
              >
                Download
              </Button>
            </Tooltip>
          </Container>


          {error && <Typography color="error">{error}</Typography>}

          <Modal
            open={showGraph}
            onClose={handleClose}
            aria-labelledby="graph-modal-title"
            aria-describedby="graph-modal-description"
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                backgroundColor: "white",
                padding: "20px",
                outline: "none",
                boxShadow: 24,

              }}
            >
              <Typography id="graph-modal-title" variant="h6" component="h2">
                Attendance Graph
              </Typography>
              <Graph data={getData} />
              <Button
                onClick={handleClose}
                variant="contained"
                style={{ marginTop: "20px", backgroundColor: "#ab2217" }}
              >
                Close
              </Button>
            </div>
          </Modal>
        </div>
        <br></br>
        <Container>
          <div className="mt-2" style={{ marginBottom: '30px' }}>
            <strong>Show/Hide Columns:</strong>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{ height: '40px' }}>
                  Select Columns
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {Object.keys(columnVisibility).map((columnKey) => (
                    <Dropdown.Item key={columnKey}>
                      <Form.Check
                        type="checkbox"
                        label={columnKey}
                        checked={columnVisibility[columnKey]}
                        onChange={() => toggleColumnVisibility(columnKey)}
                      />
                    </Dropdown.Item>
                  ))}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => toggleAllColumns(true)}>
                    Select All
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => toggleAllColumns(false)}>
                    Deselect All
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <TextField
                select
                label="Select employee"
                value={selectedEmployeeId}
                onChange={handleSelectEmployee}
                variant="outlined"
                sx={{ width: "30vh", ml: "20px", height: "40px", marginBottom: "20px" }}
              >
                {alldata.map((type) => (
                  <MenuItem key={type.employeeId} value={type.employeeId}>
                    {type.firstName}
                  </MenuItem>
                ))}
              </TextField>

              <Button variant="contained" style={{ marginLeft: "20px", height: "40px", backgroundColor: "#ab2217" }} onClick={() => setSelectedEmployeeId("")}>Reset</Button>
              <Button
                onClick={handlePriorTimeRequest}
                variant="contained"
                style={{
                  marginLeft: "20px",
                  marginBottom: "15px",
                  marginRight: "20px",
                  height: "40px",
                  marginTop: "20px",
                  backgroundColor: "#ab2217"
                }}
              >
                Priortime Request
              </Button>

              <Button
                onClick={handleOpen}
                variant="contained"
                style={{

                  marginBottom: "15px",
                  marginRight: "20px",
                  height: "40px",
                  marginTop: "20px",
                  backgroundColor: "#ab2217"
                }}
              >
                View Graph
              </Button>

            </div>
          </div>
        </Container>
        
        <TableContainer >
          <Paper sx={{ width: "100ch", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead sx={{ padding: "10px" }}>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableCell
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{
                            cursor: header.column.getCanSort()
                              ? "pointer"
                              : "auto",
                            backgroundColor: "rgb(114, 108, 108)",
                            color: "white",
                            position: "sticky",
                            top: "0",
                            zIndex: 1,
                          }}
                          onClick={
                            header.column.getCanSort()
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                        >
                          {header.isPlaceholder ? null : (
                            <>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getIsSorted() === "asc"
                                ? " 🔼"
                                : header.column.getIsSorted() === "desc"
                                  ? " 🔽"
                                  : null}
                              {header.column.getCanFilter() && (
                                <div style={{ width: "18ch" }}>
                                  <Filter column={header.column} />
                                </div>
                              )}
                            </>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
               
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </TableContainer>
            <div style={{ backgroundColor: "rgb(114, 108, 108)", color: "#fff" }} className="mt-5">
              {totalPages > 1 && (
                <ul className="pagination justify-content-center mt-5">
                  {(() => {
                    const maxPagesToShow = 5;
                    let startPage = Math.max(1, currentPage - 2);
                    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

                    if (endPage - startPage + 1 < maxPagesToShow && totalPages >= maxPagesToShow) {
                      startPage = Math.max(1, endPage - maxPagesToShow + 1);
                    }

                    const pages = Array.from(
                      { length: endPage - startPage + 1 },
                      (_, index) => startPage + index
                    );

                    return (
                      <>
                        {/* Previous Button */}
                        {currentPage > 1 && (
                          <li className="page-item">
                            <button
                              style={{
                                backgroundColor: "#ab2217",
                                color: "white",
                                borderRadius: "50%",
                              }}
                              onClick={() => handlePageChange(currentPage - 1)}
                              className="page-link mx-1"
                            >
                              &lt; {/* Left Arrow */}
                            </button>
                          </li>
                        )}

                        {/* Page Numbers */}
                        {pages.map((page) => (
                          <li
                            key={page}
                            className={`page-item ${currentPage === page ? "active" : ""}`}
                          >
                            <button
                              style={{
                                backgroundColor: currentPage === page ? "#ab2217" : "#f0f0f0",
                                color: currentPage === page ? "white" : "#000",
                                borderRadius: "50%",
                              }}
                              onClick={() => handlePageChange(page)}
                              className="page-link mx-1"
                            >
                              {page}
                            </button>
                          </li>
                        ))}

                        {/* Next Button */}
                        {currentPage < totalPages && (
                          <li className="page-item">
                            <button
                              style={{
                                backgroundColor: "#ab2217",
                                color: "white",
                                borderRadius: "50%",
                              }}
                              onClick={() => handlePageChange(currentPage + 1)}
                              className="page-link mx-1"
                            >
                              &gt; {/* Right Arrow */}
                            </button>
                          </li>
                        )}
                      </>
                    );
                  })()}
                </ul>
              )}
            </div>
          </Paper>
        </TableContainer>
     </div>
      <CompOffLeaveSettlementModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        selectedRowData={selectedRowData}
      />
    </div>

  );
};
function Filter({ column, records, itemsPerPage, currentPage, setCurrentPage }) {
  const { filterVariant } = column.columnDef.meta || {};
  const columnFilterValue = column.getFilterValue() || [];
  const [selectedValues, setSelectedValues] = useState(columnFilterValue);

  // Memoized filtered records
  const filteredRecords = useMemo(() => {
    const allRecords = records || [];
    const filterValue = Array.isArray(selectedValues)
      ? selectedValues.join(" ")
      : selectedValues || ""; // Default to an empty string if not an array or string

    // Ensure filterValue is a string before calling .toLowerCase()
    console.log(typeof filterValue);

    const safeFilterValue = typeof filterValue === "string" ? filterValue.toLowerCase() : "";

    return allRecords.filter((record) => {
      const recordValue = Object.values(record).join(" ").toLowerCase();
      return recordValue.includes(safeFilterValue);
    });
  }, [records, selectedValues]);


  // Memoized sorted unique values for dropdown
  const sortedUniqueValues = useMemo(
    () =>
      filterVariant === "select"
        ? Array.from(column.getFacetedUniqueValues().keys()).sort()
        : [],
    [column.getFacetedUniqueValues(), filterVariant]
  );

  // Handle checkbox changes for multi-select filtering
  const handleCheckboxChange = (value) => {
    let updatedValues;
    if (selectedValues.includes(value)) {
      updatedValues = selectedValues.filter((v) => v !== value);
    } else {
      updatedValues = [...selectedValues, value];
    }
    setSelectedValues(updatedValues);
    column.setFilterValue(updatedValues);
  };

  // Handle "Select All" functionality
  const handleSelectAllChange = () => {
    if (selectedValues.length === sortedUniqueValues.length) {
      setSelectedValues([]);
      column.setFilterValue([]);
    } else {
      setSelectedValues(sortedUniqueValues);
      column.setFilterValue(sortedUniqueValues);
    }
  };

  // Calculate total pages based on filtered records
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  // Adjust current page if it exceeds the new total pages
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  const isAllSelected =
    sortedUniqueValues.length > 0 &&
    sortedUniqueValues.every((value) => selectedValues.includes(value));

  return filterVariant === "select" ? (
    <FormControl fullWidth>
      <Select
        value={selectedValues}
        displayEmpty
        renderValue={() =>
          selectedValues.length ? `${selectedValues.length} selected` : "Select"
        }
        multiple
        sx={{
          height: "30px",
          padding: "0 14px",
          color: "white",
          "& .MuiSelect-select": {
            height: "100%",
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        {/* "Select All" option */}
        <MenuItem value="select-all">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAllChange}
            style={{ marginRight: 8 }}
          />
          Select All
        </MenuItem>

        {sortedUniqueValues.map((value) => (
          <MenuItem key={value} value={value}>
            <input
              type="checkbox"
              checked={selectedValues.includes(value)}
              onChange={() => handleCheckboxChange(value)}
              style={{ marginRight: 8 }}
            />
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : filterVariant === "range" ? (
    <div>
      <TextField
        type="number"
        label={`Min (${column.getFacetedMinMaxValues()?.[0] ?? ""})`}
        value={(columnFilterValue ? columnFilterValue[0] : "") || ""}
        onChange={(e) =>
          column.setFilterValue((old) => [e.target.value, old?.[1]])
        }
        style={{ marginRight: "10px" }}
      />
      <TextField
        type="number"
        label={`Max (${column.getFacetedMinMaxValues()?.[1] ?? ""})`}
        value={(columnFilterValue ? columnFilterValue[1] : "") || ""}
        onChange={(e) =>
          column.setFilterValue((old) => [old?.[0], e.target.value])
        }
      />
    </div>
  ) : null;
}


export default GetAllEmpAttendance;
