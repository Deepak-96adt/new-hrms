
import React, { useState, useEffect, useMemo } from "react";
import { Table } from "react-bootstrap";
import {
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Button,
  IconButton,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
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

function PositionDetails() {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const fetchPosition = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "/apigateway/hrms/interview/getAllPositionNew",
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
      setPositions(response.data.content); // Update state with the response data
      setTotalPages(response.data.totalPages || response.data.pageable?.totalPages || 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching interview details:", error);
      toast.error(error.response?.data?.message || "Error fetching details");
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPosition(page + 1);
  }, [page, rowsPerPage]);


  const columns = useMemo(() => [
    {
      accessorKey: 'positionName',
      header: 'Position Name',
      meta: { filterVariant: 'select' }
    },
    {
      accessorKey: 'vacancy',
      header: 'Vacancy',
      meta: { filterVariant: 'select' }
    },
    {
      accessorKey: 'positionOpenDate',
      header: 'Position Open Date',
      meta: { filterVariant: 'select' }
    },
    {
      accessorKey: 'positionCloseDate',
      header: 'position Close Date',
      meta: { filterVariant: 'select' }
    },
    {
      accessorKey: 'status',
      header: 'status',
      meta: { filterVariant: 'select' }
    },
    {
      accessorKey: 'experienceInYear',
      header: 'experienceInYear',
      meta: { filterVariant: 'select' }
    },
    {
      accessorKey: 'remote',
      header: 'remote',
      meta: { filterVariant: 'select' }
    },
    {
      accessorKey: 'positionType',
      header: 'positionType',
      meta: { filterVariant: 'select' }
    },
    {
      accessorKey: 'positionId',
      header: 'Edit',
      meta: { filterable: false },
      cell: (cell) => (
        <Link to={`/EditPosition/${cell.row.original.positionId}`}>
          <IconButton color="primary">
            <EditIcon />
          </IconButton>
        </Link>
      )
    }
  ], []);


  const table = useReactTable({
    data: positions,
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  return (
    <div className="mt-3">
      {loading ? <LoadingPage /> : ""}
      <div style={{ margin: "25px 100px", width: "820px", height: "750px" }}>
        
        <h1
            className="Heading1"
            style={{ backgroundColor: "var(--red)", color: "var(--white)" }}
          >
            Employee Position
          </h1>
        
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
                            textAlign: 'center'
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
                        <TableCell key={cell.id} style={{ textAlign: 'center' }}>
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
                Array.from({ length: totalPages }).map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                  >
                    <button
                      onClick={() => setCurrentPage(index + 1)}
                      className="page-link mx-1"
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
            </ul>




          </div> */}
          {/* <div className="mt-5">
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
export default PositionDetails;