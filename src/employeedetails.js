
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Button, Dropdown } from "react-bootstrap";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Edit as EditIcon } from "@mui/icons-material";
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
// import "./Hrmscss/VarColors.css"
import Grid from '@mui/material/Grid';


function Empfunc() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchCriterion, setSearchCriterion] = useState("firstName");
  const [searchValue, setSearchValue] = useState("");
  const token = useSelector((state) => state.auth.token);
  const [columnFilters, setColumnFilters] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [columnVisibility, setColumnVisibility] = useState({
    firstName: true,
    lastName: true,
    dob: true,
    email: false,
    mobileNo: false,
    employeeId: true,
  });

  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage]);

  const fetchEmployees = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`/apigateway/hrms/employee/getAllEmp`, {
        params: {
          page: page - 1,
          size: 10,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error(error.response?.data?.message || "Error fetching details");
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset to first page on rows per page change
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/apigateway/hrms/employee/searchEmployees`,
        {
          params: {
            [searchCriterion]: searchValue,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployees(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error searching employees:", error);
      toast.error(error.response?.data?.message || "Error searching details");
      setLoading(false);
    }
  };

  const toggleColumnVisibility = (columnName) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnName]: !prevVisibility[columnName],
    }));
  };

  const toggleAllColumns = (isVisible) => {
    const updatedVisibility = {};
    Object.keys(columnVisibility).forEach((key) => {
      updatedVisibility[key] = isVisible;
    });
    setColumnVisibility(updatedVisibility);
  };

  const columns = useMemo(
    () => [

      {
        accessorKey: "firstName",
        header: "First Name",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.firstName,
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.lastName,
      },
      {
        accessorKey: "dob",
        header: "DOB",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.dob,
      },
      {
        accessorKey: "email",
        header: "Email",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.email,
      },
      {
        accessorKey: "mobileNo",
        header: "Mobile No",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.mobileNo,
      },
      {
        accessorKey: "employeeId",
        header: "Payroll",
        cell: (cell) => (
          <div>
            <Link to={`/UpdatePayrollSalary/${cell.row.original.employeeId}`}>
              <IconButton sx={{ margin: "8%" }} color="rgb(114, 108, 108)">
                <EditIcon />
              </IconButton>
            </Link>
          </div>
        ),
        isVisible: columnVisibility.employeeId,
      },
      {
        accessorKey: "employeeId",
        header: "Personal",
        cell: (cell) => (
          <div>
            <Link to={`/EditEmployee/${cell.row.original.employeeId}`}>
              <IconButton sx={{ margin: "10%" }} color="rgb(114, 108, 108)">
                <EditIcon />
              </IconButton>
            </Link>
          </div>
        ),
        isVisible: columnVisibility.employeeId,
      },
    ],
    [columnVisibility]
  );

  const table = useReactTable({
    data: employees,
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

  if (loading) return <LoadingPage />;

  return (
    <>
      <h1 style={{backgroundColor:"var(--red)" , color:"var(--white)"}} className="Heading1 my-4">Employee Details</h1>

      <div  style={{ marginTop: "10px", display: "flex", gap: "15px", alignItems: "center", marginLeft: "10%" }}>
        <Grid
         item  md={3} sm={3}
          sx={{ display: "flex", flexDirection: "column" }}>
          <strong>Show/Hide Columns:</strong>
          <Dropdown style={{ marginTop: "20px", width: "250px" }} className="mt-1">
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
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
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            // marginLeft: "40px",
             margin:"0 120px 0 120px"
          }}
        >
         <strong >Search By:</strong>
          <div style={{ marginTop: "10px", display: "flex", gap: "15px", alignItems: "center" }}>
          <Form.Control
              as="select"
              value={searchCriterion}
              onChange={(e) => setSearchCriterion(e.target.value)}
              style={{ width: "200px", height: "40px" }}
            >
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="email">Email</option>
              <option value="mobileNo">Mobile Number</option>
            </Form.Control>
            <Form.Control
              type="text"
              placeholder="Enter Search Value"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: "200px", height: "40px" }}
            />
            <Button
              style={{
                backgroundColor: "var(--red)",
                height: "34px",
                padding: "0px 10px",
                marginTop: "0px",
                marginBottom:"11px"
              }}
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>

        </Grid>
      </div>

      <Paper sx={{ width: "100ch", overflow: "hidden", marginLeft: "10%", }}>
        <TableContainer sx={{ maxHeight: 500 ,}}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead sx={{ padding: "5px"}}>
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
                        textAlign: "center",
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
                            <div style={{ width: "13ch" , display: "flex",
                              justifyContent: "center", marginLeft:"12%"}}>
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
            <TableBody >
              {table
                .getRowModel()
                .rows.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
                .map((row) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}

                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        style={{ padding: 0 , textAlign: "center",}}
                        key={cell.id}>
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
        <TablePagination
          sx={{ backgroundColor: "rgb(114, 108, 108)", color: "#fff" }}
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={table.getRowModel().rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        
      </Paper>
    </>
  );
}

function Filter({ column }) {
  const { filterVariant } = column.columnDef.meta || {};

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      filterVariant === "select"
        ? Array.from(column.getFacetedUniqueValues().keys()).sort()
        : [],
    [column.getFacetedUniqueValues(), filterVariant]
  );

  return filterVariant === "select" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString() || ""}
    >
      <option value="">All</option>
      {sortedUniqueValues.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  ) : filterVariant === "range" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue ? columnFilterValue[0] : "") ?? ""}
          onChange={(e) =>
            column.setFilterValue((old) => [e.target?.value, old?.[1]])
          }
          placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] !== undefined
            ? `(${column.getFacetedMinMaxValues()?.[0]})`
            : ""
            }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue ? columnFilterValue[1] : "") ?? ""}
          onChange={(e) =>
            column.setFilterValue((old) => [e.target?.value, old?.[1]])
          }
          placeholder={`Max ${column.getFacetedMinMaxValues()?.[1] !== undefined
            ? `(${column.getFacetedMinMaxValues()?.[1]})`
            : ""
            }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : null;
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default Empfunc;
