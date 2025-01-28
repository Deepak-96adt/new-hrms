import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { Edit as EditIcon } from "@mui/icons-material";
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
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import "./Hrmscss/VarColors.css";

const Getallexpenses = () => {
  const token = useSelector((state) => state.auth.token);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [expenseItems, setExpenseItems] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    axios
      .get("/apigateway/expensemanagement/getAllExpenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setExpenseItems(response.data);
        setLoading(false);
        toast.success("Data found successfully!!", {
          position: "top-center",
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        toast.error("Error happened. Try again later.", {
          position: "top-center",
          theme: "colored",
        });
      });
  }, [token]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "paymentDate",
        header: "Payment Date",
        meta: { filterVariant: "select" },
      },
      {
        accessorKey: "paymentMode",
        header: "Payment Mode",
      },
      {
        accessorKey: "paidBy",
        header: "Paid By",
        meta: { filterVariant: "select" },
      },
      {
        accessorKey: "createdBy",
        header: "Created By",
      },
      {
        accessorKey: "amount",
        header: "Amount",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      { accessorKey: "gst", header: "GST", meta: { filterVariant: "boolean" } },
      {
        accessorKey: "status",
        header: "Status",
        meta: { filterVariant: "select" },
      },
      {
        accessorKey: "edit",
        header: "Edit",
        meta: { filterable: false },
        cell: (cell) => (
          <Link to={`/editexpenses/${cell.row.original.id}`}>
            <IconButton color="primary">
              <EditIcon sx={{ color: "rgb(114, 108, 108)" }} />
            </IconButton>
          </Link>
        ),
      },
    ],
    []
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset to first page on rows per page change
  };

  const table = useReactTable({
    data: expenseItems,
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

  const getExpenseByDate = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .get(
        `/apigateway/expensemanagement/getExpenseByDateRange?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setExpenseItems(response.data);
        setLoading(false);
        toast.success("Data found successfully!!", {
          position: "top-center",
          theme: "colored",
        });
        navigate("/Getallexpenses");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        toast.error("Error happened. Try again later.", {
          position: "top-center",
          theme: "colored",
        });
      });
  };

  return (
    <div>
      {loading ? <LoadingPage /> : ""}
      <div className="mt-3">
        <nav
          aria-label="breadcrumb"
          style={{ "--bs-breadcrumb-divider": "'>>'" }}
        ></nav>
      </div>
      <div style={{ margin: "25px 100px", width: "820px", height: "750px" }}>
        <div className="row">
          <h1
            className="Heading1"
            style={{ backgroundColor: "var(--red)", color: "var(--white)" }}
          >
            Get All Expense
          </h1>
          <div className="col-lg-12 container pt-2">
            <form onSubmit={getExpenseByDate}>
              <div className="mb-2 d-grid gap-1 d-md-flex justify-content-center ">
                <label className="pt-3" htmlFor="startDate">
                  startDate:
                </label>
                <input
                  onChange={(e) => setStartDate(e.target.value)}
                  value={startDate}
                  type="date"
                  className="form-control"
                  name="start-date"
                  id="startDate"
                />
                <label className="pt-3" htmlFor="endDate">
                  endDate:
                </label>
                <input
                  onChange={(e) => setEndDate(e.target.value)}
                  value={endDate}
                  type="date"
                  name="end-date"
                  className="form-control"
                  id="endDate"
                />
                <Button
                  type="submit"
                  sx={{
                    margin: "3px",
                    height: "40px",
                    backgroundColor: "var(--red)",
                    color: "var(--white)",
                    transition: "transform",
                    "&:hover": {
                      backgroundColor: "var(--red)",
                      transform: "scale(1.03)",
                    },
                    marginLeft: "5%",
                    paddingLeft: "10%",
                    paddingRight: "10%",
                  }}
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div>
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
                            backgroundColor: "var(--warmGrey)",
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
              sx={{ backgroundColor: "var(--warmGrey)", color: "var(--white)" }}
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={table.getRowModel().rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </div>
    </div>
  );
};

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

export default Getallexpenses;
