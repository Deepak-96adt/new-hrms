import React, { useState, useEffect, useMemo } from "react";
import { Table } from "react-bootstrap";
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
import './Hrmscss/VarColors.css'

function GetGstDetails() {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(true);
  const [Gst, setGst] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    axios
      .get("/apigateway/expensemanagement/gst/displayAllGSTDetails", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setGst(response.data.content);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message || "Error fetching details");
        setLoading(false);
      });
  }, [token]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset to first page on rows per page change
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "invoiceNumber",
        header: "Invoice Number",
      },
      {
        accessorKey: "customerId",
        header: "Customer ID",
        meta: { filterVariant: "select" },
      },
      { accessorKey: "fy", header: "FY" },
      // {
      //   accessorKey: "invoiceDate",
      //   header: "Invoice Date",
      //   meta: { filterVariant: "select" },
      // },
      {
        accessorKey: "gstPeriod",
        header: "GST Period",
      },
      {
        accessorKey: "billingPeriod",
        header: "Billing Period",
      },
      {
        accessorKey: "paidTo",
        header: "Paid To",
        meta: { filterVariant: "select" },
      },
      {
        accessorKey: "taxableAmount",
        header: "Taxable Amount",
        meta: { filterable: true },
      },
      // { accessorKey: "tds", header: "TDS", meta: { filterable: true } },
      // { accessorKey: "gst", header: "GST", meta: { filterable: true } },
      {
        accessorKey: "invoiceAmount",
        header: "Invoice Amount",
      },
      // {
      //   accessorKey: "receivable",
      //   header: "Receivable",
      //   meta: { filterable: true },
      // },
      {
        accessorKey: "amountReceived",
        header: "Amount Received",
        meta: { filterable: true },
      },
      // {
      //   accessorKey: "dateReceived",
      //   header: "Date Received",
      //   meta: { filterVariant: "select" },
      // },
      {
        accessorKey: "invoiceBalance",
        header: "Invoice Balance",
      },
      {
        accessorKey: "status",
        header: "Status",
        meta: { filterVariant: "select" },
      },
      // {
      //   accessorKey: "tdsCredited",
      //   header: "TDS Credited",
      //   meta: { filterable: true },
      // },
      {
        accessorKey: "tdsBalance",
        header: "TDS Balance",
      },
      {
        accessorKey: "edit",
        header: "Edit",
        cell: ({ row }) => (
          <Link to={`/EditGstDetails/${row.original.invoiceNumber}`}>
            <IconButton color="rgb(114, 108, 108)">
              <EditIcon />
            </IconButton>
          </Link>
        ),
        meta: { filterable: false },
      },
    ],
    []
  );

  const table = useReactTable({
    data: Gst,
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
    <div className="mt-3">
      {loading ? <LoadingPage /> : ""}
      <div style={{ margin: "5% 10%", width: "100%", height: "auto",}}>
        <h1 className="Heading1" style={{backgroundColor:"var(--red)", color:"var(--white)"}}> GST Details</h1>
        <div style={{ marginTop: "5%" }}>
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
                            color: "var(--white)",
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
export default GetGstDetails;
