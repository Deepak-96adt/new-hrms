import React, { useState, useEffect, useMemo } from "react";
//import { Table, Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingPage from "./LoadingPage";
import { Paper,TableBody, TableCell, TableContainer, TableHead, TableRow,Tooltip,Button, Table } from "@mui/material";
import RegeneratePayslip from "./RegeneratePayslip";
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
import { useParams } from "react-router-dom";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

function ViewSalaryDetails() {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(true);
  const [salaryInfo, setSalaryInfo] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [updateRow, setNewData] = useState(null); 
  const [page, setPage] = useState(0);
  
   const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchSalaryDetails();
  }, [token, id]);

  const handleRowClick = (row) => {
    setNewData()

    setSelectedRowData(row);
    console.log("row data",row);
    setShowModal(true);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
 
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset to first page on rows per page change
  };
  const fetchSalaryDetails = async () => {
    await axios
          .get(`/apigateway/payroll/salarydetails/getSalaryDetailsById/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setSalaryInfo(response.data);
            setLoading(false);
          })
      .catch((error) => {
        console.log(error); console.log(error);
        toast.error(error.response.data.message || "Error fetching details");
        setLoading(false);
      })
  };

  const exportToExcel = () => {
    setLoading(true);
    axios({
      url: `/apigateway/payroll/salarydetails/getAllMonthlySalaryDetailsExportToExcelById/${id}`,
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
        link.setAttribute("download", "SalaryDetails.xlsx");
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Error uploading excel.");
        setLoading(false);
      });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "employeeName",
        header: "Employee Name",
      },
      {
        accessorKey: "employeePf",
        header: "Employee Pf",
        meta: { filterable: true },
      },
      {
        accessorKey: "employerPf",
        header: "Employer Pf",
        meta: { filterable: true },
      },
      {
        accessorKey: "employerEsic",
        header: "Employer Esic",
        meta: { filterable: true },
      },
      {
        accessorKey: "netPay",
        header: " NetPay",
        meta: { filterable: true },
      },
      {
        accessorKey: "employeeEsic",
        header: "Employee Esic",
        meta: { filterable: true },
      },
      {
        accessorKey: "grossDeduction",
        header: "Gross Deduction",
        meta: { filterable: true },
      },
      { accessorKey: "adhoc", header: "ADHOC", meta: { filterable: true } },
      {
        accessorKey: "month",
        header: "Month",
        meta: { filterVariant: "select" },
      },
      { accessorKey: "year", header: "Year", meta: { filterable: true } },
      {
        accessorKey: "updateSalary",
        header: "Edit",
        meta: { filterable: false },
        cell: (cell) => (
          <Button
            id="update"
            sx={{
              backgroundColor: "var(--red)",
              color: "var(--white)",
              transition: "transform",
              "&:hover": {
                backgroundColor: "var(--red)",
                transform: "scale(1.03)",
              },
            }}
            onClick={() => handleRowClick(cell.row.original)}
          >
            Edit
          </Button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: salaryInfo,
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
      <div style={{ margin: "25px 100px", width: "820px", height: "750px" }}>
      <h1 className="Heading1" style={{backgroundColor:"var(--red)", color:"var(--white)"}}>Salary Information</h1>
        <Tooltip title="Download All Monthly Salary Detail" arrow>
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
            startIcon={<FileDownloadOutlinedIcon />}
          >
            Download
          </Button>
        </Tooltip>
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
          </Paper>
        </div>
      </div>
      <RegeneratePayslip
        show={showModal}
        onHide={() => setShowModal(false)}
        salaryInfo={selectedRowData}
        fetchSalaryDetails={fetchSalaryDetails}
      />
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
            column.setFilterValue((old) => [old?.[0], e.target?.value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1] !== undefined
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
      </div>
    </div>
  ) : null;
}

function DebouncedInput({ value: initialValue, onChange, debounce = 500, ...props }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default ViewSalaryDetails;