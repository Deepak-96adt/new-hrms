import React, { useState, useEffect, useMemo } from "react";
import { Button, Table } from "react-bootstrap";
import { Edit as EditIcon } from "@mui/icons-material";
import {
  IconButton,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Form, Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingPage from "./LoadingPage";

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

function Getinterviewdetails() {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(true);
  const [searchCriterion, setSearchCriterion] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const [columnVisibility, setColumnVisibility] = useState({
    interviewerName: false,
    description: false,
    type: false,
    offerAccepted: false,
    date: false,
    source: false,
    marks: false,
    communication: false,
    enthusiasm: false,
    candidateName: true,
    positionName: true,
    notes: true,
    workExInYears: true,
    clientName: true,
    status: true,
    interviewId: true,
  });
  const fetchInterview = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/apigateway/hrms/interview/getAllInterviewDetails`,

        {
          // params: {
          //   page: page - 1,
          //   size: 10,
          // },
          params: {
            page: page - 1,
            size: rowsPerPage,
          },

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.content);
      setData(
        Array.isArray(response.data.content) ? response.data.content : []
      );
      console.log("Response data content:", response.data.content);

      setTotalPages(
        response.data.totalPages || response.data.pageable?.totalPages || 0
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching interview details:", error);
      toast.error(error.response?.data?.message || "Error fetching details");
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchInterview(currentPage);
  // }, [token, currentPage]);

  useEffect(() => {
    fetchInterview(page + 1);
  }, [page, rowsPerPage]);

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

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/apigateway/hrms/interview/getAllInterviewDetails`,
        {
          params: {
            [searchCriterion]: searchValue,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(
        Array.isArray(response.data.content)
          ? response.data.content
          : toast.success(response.data)
      );
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      // console.error("Error searching employees:", error);
      // console.log(error.response.data);
      toast.error(error.response?.data || "Error searching details");
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "candidateName",
        header: "Candidate Name",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.candidateName,
      },
      {
        accessorKey: "avTechnology.description",
        header: "Tech Description",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.description,
      },
      {
        accessorKey: "positionModel.positionName",
        header: "Position Name",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.positionName,
      },

      {
        accessorKey: "marks",
        header: "Marks",
        isVisible: columnVisibility.marks,
        meta: { filterable: true },
      },
      {
        accessorKey: "communication",
        header: "Communication",
        meta: { filterable: true },
        isVisible: columnVisibility.communication,
      },
      {
        accessorKey: "enthusiasm",
        header: "Enthusiasm",
        meta: { filterable: true },
        isVisible: columnVisibility.enthusiasm,
      },
      {
        accessorKey: "notes",
        header: "Notes",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.notes,
      },
      {
        accessorKey: "workExInYears",
        header: "Work Experience (Years)",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.workExInYears,
      },
      {
        accessorKey: "interviewerName",
        header: "Interviewer Name",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.interviewerName,
      },
      {
        accessorKey: "source",
        header: "Source",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.source,
      },
      {
        accessorKey: "offerAccepted",
        header: "Offer Accepted",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.offerAccepted,
      },
      {
        accessorKey: "type",
        header: "Type",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.type,
      },
      {
        accessorKey: "clientName",
        header: "Client Name",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.clientName,
      },
      {
        accessorKey: "date",
        header: "Date",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.date,
      },
      {
        accessorKey: "status",
        header: "Status",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.status,
      },
      {
        accessorKey: "interviewId",
        header: "Edit",
        cell: (cell) => {
          const interviewId = cell.row.original.interviewId;
          const round = cell.row.original.roundNumber;
          const isDisabled = !interviewId || !round;

          return (
            <Link
              to={
                isDisabled
                  ? "#"
                  : `/EditInterviewDetails/${interviewId}/${round}`
              }
            >
              <IconButton sx={{ color: "var(--warmGrey)" }} disabled={isDisabled}>
                <EditIcon />
              </IconButton>
            </Link>
          );
        },
        isVisible: columnVisibility.interviewId,
      },
    ],
    [columnVisibility]
  );
  const table = useReactTable({
    data,
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ width: "100vw" }}>
      {loading ? <LoadingPage /> : ""}
      <div style={{ margin: "2% 0% 5% 10%",width: "120ch", height: "auto" }}>
        <h1
          className="Heading1"
          style={{ backgroundColor: "var(--red)", color: "var(--white)" }}
        >
          Interview Details
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "40px",
          }}
        >
          {/* Show/Hide Columns */}
          <div
            style={{ flex: "1 1 250px", minWidth: "250px", marginTop: "2.5%" }}
          >
            <Form.Label
              style={{
                marginBottom: "5px",
                marginLeft: "10px",
                color: "black",
              }}
            >
              Show/Hide Columns
            </Form.Label>
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                id="dropdown-basic"
                style={{ width: "70%" }}
              >
                Select Columns
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "300px", overflowY: "auto" }}>
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
          </div>
          <div
            style={{
              flex: "2 1 500px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Form.Group controlId="employeeSearch" style={{ width: "100%" }}>
              <Form.Label
                style={{
                  marginBottom: "-15px",
                  marginTop: "22px",
                  marginLeft: "10px",
                  color: "black",
                }}
              >
                Search By
              </Form.Label>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  flexWrap: "nowrap",
                }}
              >
                <Form.Control
                  as="select"
                  variant="outline-secondary"
                  value={searchCriterion}
                  onChange={(e) => {
                    const selectedCriterion = e.target.value;
                    setSearchCriterion(selectedCriterion);
                    // Clear search value if "All" is selected
                    if (selectedCriterion === "") {
                      setSearchValue("");
                    }
                  }}
                  style={{
                    flex: "1 1 200px",
                    minWidth: "200px",
                    height: "40px", // Uniform height
                    paddingTop: "7px",
                  }}
                >
                  <option value="">All</option>
                  <option value="candidateName">Candidate Name</option>
                  <option value="emailId">Email</option>
                  <option value="contact_no">Mobile Number</option>
                </Form.Control>

                <Form.Control
                  type="text"
                  placeholder={
                    searchCriterion === "" ? "" : "Enter Search Value"
                  }
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  disabled={searchCriterion === ""}
                  style={{
                    flex: "1 1 200px",
                    minWidth: "200px",
                    height: "40px",
                  }}
                />

                <Button
                  onClick={handleSearch}
                  style={{
                    flex: "0 1 100px",
                    minWidth: "100px",
                    height: "38px",
                    lineHeight: "1",
                    marginBottom: "5%",
                    backgroundColor: "var(--red)",
                    color: "var(--white)",
                    transition: "transform",
                    "&:hover": {
                      backgroundColor: "var(--red)",
                      transform: "scale(1.03)",
                    },
                  }}
                >
                  Search
                </Button>
              </div>
            </Form.Group>
          </div>
        </div>

        {/* <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <Table striped bordered hover className="custom-table">
            <thead className="table-danger table-striped">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={
                              header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : ""
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() === "asc"
                              ? " 🔼"
                              : header.column.getIsSorted() === "desc"
                              ? " 🔽"
                              : null}
                          </div>
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} />
                            </div>
                          ) : null}
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="body">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div> */}

        <Paper sx={{ width: "120ch", overflow: "hidden" }}>
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
          <TablePagination
            sx={{ backgroundColor: "rgb(114, 108, 108)", color: "#fff" }}
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalPages * rowsPerPage}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Pagination Section */}
        {/* <div className="mt-3">
          <ul
            className="pagination justify-content-center mt-3"
            style={{ flexWrap: "wrap" }}
          >
            {totalPages > 0 &&
              (() => {
                const maxPagesToShow = 5;
                let startPage = Math.max(1, currentPage - 1);
                let endPage = Math.min(
                  totalPages,
                  startPage + maxPagesToShow - 1
                );

                if (
                  endPage - startPage + 1 < maxPagesToShow &&
                  totalPages >= maxPagesToShow
                ) {
                  startPage = Math.max(1, endPage - maxPagesToShow + 1);
                }

                const pages = Array.from(
                  { length: endPage - startPage + 1 },
                  (_, index) => startPage + index
                );

                return (
                  <>
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
                    {pages.map((page) => (
                      <li
                        key={page}
                        className={`page-item ${
                          currentPage === page ? "active" : ""
                        }`}
                      >
                        <button
                          onClick={() => setCurrentPage(page)}
                          className="page-link mx-1"
                        >
                          {page}
                        </button>
                      </li>
                    ))}
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
        </div> */}
      </div>
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
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0] !== undefined
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
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1] !== undefined
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
export default Getinterviewdetails;
