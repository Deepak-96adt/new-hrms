import React, { useState, useEffect, useMemo } from "react";
import { Container, Table } from "react-bootstrap";
import { Box, Button, Paper, Tabs, Tab, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import "./Hrmscss/ExampleTable.css";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Hrmscss/App.css";
import FileUpload from "./FileUpload";
import LoadingPage from "./LoadingPage";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
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

function EmployeeSalary() {
  const token = useSelector((state) => state.auth.token);
  // const  EmpId = useSelector((state) => state.auth.empId);
  const [activeTab, setActiveTab] = useState("one");
  const [loading, setLoading] = useState(false);
  const [clientInfo, setClientInfo] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [employee_salary, setEmployee_Salary] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset to first page on rows per page change
  };


  const fetchSalary = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "/apigateway/payroll/salarydetails/getAllMonthlySalaryDetails",
        {
          params: {
            page: page - 1,
            size: 10,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      setEmployee_Salary(response.data || []);
      setTotalPages(response.data.totalPages || 0);
      setLoading(false);

      console.log("Fetched employee salary data:", response.data); // Debugging
    } catch (error) {
      console.error("Error fetching salary details:", error);
      toast.error(error.response?.data?.message || "Error fetching details");
      setLoading(false);
    }
  };

  // Trigger fetch when the component mounts or page changes
  useEffect(() => {
    fetchSalary(currentPage);
  }, [currentPage]);




  const columns = useMemo(
    () => [
      {
        accessorKey: "empId",
        header: "Emp ID",
        meta: { filterable: true },
      },
      {
        accessorKey: "employeeName",
        header: "Employee Name",
        meta: { filterVariant: "select" }
      },
      {
        accessorKey: "grossSalary",
        header: "Gross Salary",
        meta: { filterable: true },
        cell: (info) => {
          const value = info.getValue();
          return value !== null ? `₹${value.toFixed(2)}` : 'N/A';
        },
      },
      {
        accessorKey: "bankName",
        header: "Bank Name",
        meta: { filterVariant: "select" }
      },
      {
        accessorKey: "accountNo",
        header: "Account No",
        meta: { filterable: true },
      },
      {
        accessorKey: "netPay",
        header: "Net Pay",
        meta: { filterable: true },
      },
      {
        accessorKey: "employerPf",
        header: "Employer Pf",
        meta: { filterable: true },
      },
      {
        accessorKey: "employeePf",
        header: "Employee Pf",
        meta: { filterable: true },
      },
      {
        accessorKey: "employerEsic",
        header: "Employer Esic",
        meta: { filterable: true },
      },
      {
        accessorKey: "employeeEsic",
        header: "Employee Esic",
        meta: { filterable: true },
      },

      {
        accessorKey: "medicalAmount",
        header: "Medical Amount",
        meta: { filterable: true },
      },

      {
        accessorKey: "month",
        header: "Month",
        meta: { filterVariant: "select" },
      },
      { accessorKey: "year", header: "Year", meta: { filterable: true } },
      {
        accessorKey: "view",
        header: " View Archive",
        meta: { filterable: false },
        cell: (cell) => (
          <Link to={`/view-salary-details/${cell.row.original.empId}`}>
            <Button
              sx={{
                backgroundColor: "var(--red)",
                color: "var(--white)",
                transition: "transform",
                "&:hover": {
                  backgroundColor: "var(--red)",
                  transform: "scale(1.03)",
                },
              }}
              type="submit"
            >
              View
            </Button>
          </Link>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    //  data: clientInfo,
    data: employee_salary,
    columns,
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

  return (
    <div class="d-flex">
      {loading ? <LoadingPage /> : ""}

      <Container>
        <Box  sx={{ display: "flex", borderBottom: 2, borderColor: "divider", }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Tabs example"
            sx={{ width: "100%", marginLeft: "30px" }}
          >
            <Tab value="one" label="Payslip Generation" />
            <Tab value="two" label="Employee Salary Details" />
          </Tabs>
        </Box>
        {activeTab === "one" && (<FileUpload />)}
        {activeTab === "two" && (
          <div >
            <h1 className="Heading1" style={{ backgroundColor: "var(--red)", color: "var(--white)", }}>Employee Salary</h1>
            <Paper sx={{
              width: "100ch", marginTop: "3%",
              marginBottom: "10%",
              paddingRight: "10%", marginLeft: "5%",
              padding: "5%", height: "auto", paddingTop: "5%"
            }}>
              
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
            <div className="mt-5">
              <ul className="pagination justify-content-center mt-5">
                {totalPages > 0 && (() => {
                  const maxPagesToShow = 5; // Number of pages to show at a time
                  let startPage = Math.max(1, currentPage - 1);
                  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

                  // Adjust startPage if we're near the end of the page range
                  if (endPage - startPage + 1 < maxPagesToShow && totalPages >= maxPagesToShow) {
                    startPage = Math.max(1, endPage - maxPagesToShow + 1);
                  }

                  const pages = Array.from(
                    { length: endPage - startPage + 1 },
                    (_, index) => startPage + index
                  );

                  return (
                    <>
                      {/* Previous button */}
                      {currentPage > 1 && (
                        <li className="page-item">
                          <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="page-link mx-1"
                          >
                            Previous
                          </button>
                        </li>
                      )}

                      {/* Page buttons */}
                      {pages.map((page) => (
                        <li
                          key={page}
                          className={`page-item ${currentPage === page ? "active" : ""}`}
                        >
                          <button
                            onClick={() => setCurrentPage(page)}
                            className="page-link mx-1"
                          >
                            {page}
                          </button>
                        </li>
                      ))}

                      {/* Next button */}
                      {currentPage < totalPages && (
                        <li className="page-item">
                          <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="page-link mx-1"
                          >
                            Next
                          </button>
                        </li>
                      )}
                    </>
                  );
                })()}
              </ul>
            </div>
            <div className="mt-5">
              <ul className="pagination justify-content-center mt-5">
                {totalPages > 0 && (() => {
                  const maxPagesToShow = 5; // Number of pages to show at a time
                  let startPage = Math.max(1, currentPage - 1);
                  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

                  // Adjust startPage if we're near the end of the page range
                  if (endPage - startPage + 1 < maxPagesToShow && totalPages >= maxPagesToShow) {
                    startPage = Math.max(1, endPage - maxPagesToShow + 1);
                  }

                  const pages = Array.from(
                    { length: endPage - startPage + 1 },
                    (_, index) => startPage + index
                  );

                  return (
                    <>
                      {/* Previous button */}
                      {currentPage > 1 && (
                        <li className="page-item">
                          <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="page-link mx-1"
                          >
                            Previous
                          </button>
                        </li>
                      )}

                      {/* Page buttons */}
                      {pages.map((page) => (
                        <li
                          key={page}
                          className={`page-item ${currentPage === page ? "active" : ""}`}
                        >
                          <button
                            onClick={() => setCurrentPage(page)}
                            className="page-link mx-1"
                          >
                            {page}
                          </button>
                        </li>
                      ))}

                      {/* Next button */}
                      {currentPage < totalPages && (
                        <li className="page-item">
                          <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="page-link mx-1"
                          >
                            Next
                          </button>
                        </li>
                      )}
                    </>
                  );
                })()}
              </ul>
            </div>
          </div>
        )}
      </Container>
    </div>

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
export default EmployeeSalary;
