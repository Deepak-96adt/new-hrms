import React, { useState, useEffect, useMemo } from "react";
import { Table } from "react-bootstrap";
import { Edit as EditIcon } from "@mui/icons-material";
import { Button, IconButton, Paper, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
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

function CandidateDetails() {
  const token = useSelector((state) => state.auth.token);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const [searchCriterion, setSearchCriterion] = useState("candidateName");
  const [searchValue, setSearchValue] = useState("");

  console.log(setSearchCriterion);
  const [columnVisibility, setColumnVisibility] = useState({
    candidateName: true, // Candidate Name
    emailId: true, // Email ID
    contactNo: true, // Contact No
    dob: true, // Date of Birth
    workExperience: true, // Work Experience
    expectedCTC: true, // Expected CTC
    lastCTC: true, // Last CTC
    technicalStack: true, // Technical Stack
    cvShortlisted: true, // CV Shortlisted
    noticePeriod: true, // Notice Period
    candidateId: true, // Edit button
    deleteButton: true, // Delete button
    address: false,
    highestQualification: false,
  });

  const fetchCandidate = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/apigateway/hrms/interviewCandidate/allInterviewCandidate`,
        {
          params: {
            page: page - 1,
            size: rowsPerPage,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setCandidates(
        Array.isArray(response.data.body.content)
          ? response.data.body.content
          : []
      );
      setTotalPages(
        response.data.body.totalPages ||
        response.data.body.pageable?.totalPages ||
        0
      );

      console.log(
        "Page Size total====>>>>>",
        response.data.body.pageable.pageSize
      );

      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching details");
      setLoading(false);
    }
  };

  const handleDelete = async (candidateId) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await axios.delete(
          `/apigateway/hrms/interviewCandidate/interviewCandidateById/${candidateId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Candidate deleted successfully!");
        fetchCandidate(currentPage); // Refresh the data
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete candidate."
        );
      }
    }
  };

  const handleSearch = async () => {
    setLoading(true);

    const trimmedCriterion = searchCriterion.trim();
    const trimmedValue = searchValue.trim();

    if (!trimmedCriterion) {
      toast.error("Please select a search criterion.");
      setLoading(false);
      return;
    }

    if (!trimmedValue) {
      switch (trimmedCriterion) {
        case "candidateName":
          toast.error("Please enter a candidate name.");
          break;
        case "emailId":
          toast.error("Please enter an email address.");
          break;
        case "contactNo":
          toast.error("Please enter a mobile number.");
          break;
        default:
          toast.error("Please enter a search value.");
      }
      setLoading(false);
      return;
    }

    if (
      trimmedCriterion === "emailId" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)
    ) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (trimmedCriterion === "contactNo" && !/^\d{10}$/.test(trimmedValue)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      setLoading(false);
      return;
    }

    try {
      // setPage(page+1);
      const response = await axios.get(
        `/apigateway/hrms/interviewCandidate/allInterviewCandidate`,
        {
          // params: {
          //   [trimmedCriterion]: trimmedValue,
          //   page: page,
          //   size: 10,
          // },
          params: {
            [trimmedCriterion]: trimmedValue,
            page: 0,
            size: rowsPerPage,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const candidatesData = Array.isArray(response.data?.body?.content)
        ? response.data.body.content
        : [];

      if (candidatesData.length === 0) {
        toast.success(response.data?.body, {
          style: { color: "green" },
        });
      }

      setCandidates(candidatesData);
      setTotalPages(response.data.body.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error searching candidates:", error);
      toast.error(error.response?.data?.message || "Error searching details");
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchCandidate(currentPage);
  // }, [token, currentPage]);

  useEffect(() => {
    if (searchValue == "") {
      fetchCandidate(page + 1);
    } else {
      handleSearch();
    }
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

  const columns = useMemo(
    () => [
      {
        accessorKey: "candidateName",
        header: "Candidate Name",
        isVisible: columnVisibility.candidateName,
      },
      {
        accessorKey: "emailId",
        header: "Email ID",
        isVisible: columnVisibility.emailId,
      },
      {
        accessorKey: "contactNo",
        header: "Contact No",
        isVisible: columnVisibility.contactNo,
      },
      {
        accessorKey: "workExperience",
        header: "Work Experience",
        isVisible: columnVisibility.workExperience,
      },
      {
        accessorKey: "lastCTC",
        header: "Current CTC",
        isVisible: columnVisibility.lastCTC,
      },
      {
        accessorKey: "expectedCTC",
        header: "Expected CTC",
        isVisible: columnVisibility.expectedCTC,
      },
      {
        accessorKey: "technicalStack",
        header: "Technical Stack",
        isVisible: columnVisibility.technicalStack,
      },
      {
        accessorKey: "noticePeriod",
        header: "Notice Period",
        isVisible: columnVisibility.noticePeriod,
      },
      {
        accessorKey: "candidateId",
        header: "Edit",
        cell: (cell) => (
          <Link to={`/EditCandidate/${cell.row.original.candidateId}`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
        ),
        isVisible: columnVisibility.candidateId,
      },
      {
        accessorKey: "deleteButton",
        header: "Delete",
        cell: (cell) => (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleDelete(cell.row.original.candidateId)}
          >
            Delete
          </Button>
        ),
        isVisible: columnVisibility.deleteButton,
      },
    ],
    [columnVisibility]
  );

  const table = useReactTable({
    data: candidates,
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
    <div
      className="mt-3"
      style={{ marginInlineStart: "20px", marginBlockEnd: "20px" }}
    >
      <div>
        {loading ? <LoadingPage /> : ""}
        {/* <div className="mt-3">
          <nav
            aria-label="breadcrumb"
            style={{ "--bs-breadcrumb-divider": "'>>'" }}
          >
            <ol
              className="breadcrumb"
              style={{ color: "white", marginLeft: "20px" }}
            >
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>{" "}
              </li>
              <li className="breadcrumb-item">
                <Link to="">Hiring</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Candidate Information
              </li>
            </ol>
          </nav>
        </div> */}

        {/* <h1 className="Heading1">Candidate Information</h1> */}
        <h1
          className="Heading1"
          style={{ marginTop:'30px',backgroundColor: "var(--red)", color: "var(--white)" }}
        >
          Candidate Information
        </h1>
        <div className="mt-2 d-flex align-items-center ">
          <Dropdown style={{ display: "flex", flexDirection: "column" }}>
            <Form.Label
              style={{ marginTop: "30px", color: "black", fontSize: "15px" }}
              className="me-2 mb-0"
            >
              Show/Hide Columns:
            </Form.Label>
            <div>
              <Dropdown.Toggle style={{height:'45px'}} variant="outline-secondary" id="dropdown-basic">
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
            </div>
          </Dropdown>

          {/* Search Bar */}
          <Form.Group
            controlId="candidateSearch"
            className="mb-3"
            style={{ marginTop: "10px", marginLeft: "160px" }}
          >
            <Form.Label
              style={{ marginTop: "35px", color: "black", fontSize: "15px" }}
              className="me-2 mb-0"
            >
              Search By
            </Form.Label>
            <div className="d-flex align-items-center mb-2">
              <Form.Control
                as="select"
                value={searchCriterion}
                onChange={(e) => setSearchCriterion(e.target.value.trim())}
                className="me-2"
                style={{ width: "200px" }}
              >
                <option value="candidateName">Candidate Name</option>
                <option value="emailId">Email</option>
                <option value="contactNo">Mobile Number</option>
              </Form.Control>

              <Form.Control
                type="text"
                placeholder="Enter Search Value"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="me-2"
                style={{ width: "300px" }}
              />
              <Button
                sx={{
                  height:"40px",
                  marginBottom:"8px",
                  backgroundColor: "var(--red)",
                  color: "var(--white)",
                  transition: "transform",
                  "&:hover": {
                    backgroundColor: "var(--red)",
                    transform: "scale(1.03)",
                  },
                }}
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </Form.Group>
        </div>

        <div>
          {/* <Table striped bordered hover className="custom-table">
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
          </Table> */}

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


          {/* <div className="mt-5">
            <ul className="pagination justify-content-center mt-5">
              {totalPages > 0 &&
                (() => {
                  const maxPagesToShow = 5; // Number of pages to show at a time
                  let startPage = Math.max(1, currentPage - 1);
                  let endPage = Math.min(
                    totalPages,
                    startPage + maxPagesToShow - 1
                  );

                  // Adjust startPage if we're near the end of the page range
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
                      {/* Previous button 
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

                      {/* Page buttons 
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

                      {/* Next button 
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
export default CandidateDetails;
