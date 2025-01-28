import React, { useState, useEffect, useMemo } from "react";
import { Edit as EditIcon } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingPage from "./LoadingPage";
import ViewApprRewardHistModal from "./ViewApprRewardHistModal";

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

function GetAllEmpAppraisalDetails() {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [data, setData] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [appraisalHistory, setAppraisalHistory] = useState([]);
  const [showAppraisalHistoryModal, setShowAppraisalHistoryModal] =
    useState(false);
  const [type, setType] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchAppraisal(page + 1);
  }, [page, rowsPerPage]);

  const fetchAppraisal = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/apigateway/payroll/getAllEmployeesWithLatestAppraisal`,
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
      setData(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Error fetching details");
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        meta: { filterVariant: false },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        meta: { filterVariant: false },
      },
      {
        accessorKey: "salary",
        header: "Salary",
        meta: { filterVariant: false },
      },
      {
        accessorKey: "appraisalDate",
        header: "Date",
        meta: { filterVariant: false },
      },
      {
        accessorKey: "bonus",
        header: "Bonus",
        meta: { filterVariant: false },
      },
      {
        accessorKey: "variable",
        header: "Variable",
        meta: { filterVariant: false },
      },
      {
        accessorKey: "history",
        header: "Appraisal History",
        meta: { filterable: false },
        cell: (cell) => (
          <Button
            id="history"
            sx={{
              backgroundColor: "var(--warmGrey)",
              color: "var(--white)",
              transition: "transform",
              "&:hover": {
                backgroundColor: "var(--red)",
                transform: "scale(1.03)",
              },
              width: "fit-content",
            }}
            onClick={() =>
              handleAppraisalHistoryOnClick(cell.row.original.empId)
            }
            //onClick={handleAppraisalHistoryOnClick1}
          >
            View Appraisal
          </Button>
        ),
      },
      {
        accessorKey: "view",
        header: "View Rewards",
        meta: { filterable: false },
        cell: (cell) => (
          <Button
            id="reward"
            sx={{
              backgroundColor: "var(--warmGrey)",
              color: "var(--white)",
              transition: "transform",
              "&:hover": {
                backgroundColor: "var(--red)",
                transform: "scale(1.03)",
              },
              width: "fit-content",
            }}
            onClick={() => handleRewardHistoryOnClick(cell.row.original.empId)}
            //onClick={handleAppraisalHistoryOnClick2}
          >
            View Reward
          </Button>
        ),
      },
    ],
    []
  );

  const handleAppraisalHistoryOnClick = (empId) => {
    axios
      .get(`/apigateway/payroll/getAllAppraisalDetailsbyId/${empId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAppraisalHistory(response.data);
        setShowAppraisalHistoryModal(true);
        setType("history");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data || "Error fetching appraisal history");
      });
  };

  const handleRewardHistoryOnClick = (empId) => {
    axios
      .get(`/apigateway/payroll/getRewardDetails/${empId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAppraisalHistory(response.data);
        setShowAppraisalHistoryModal(true);
        setType("reward");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data || "Error fetching reward history");
      });
  };

  const table = useReactTable({
    data: data,
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
    <div style={{ marginLeft: "20%" }}>
      {loading ? <LoadingPage /> : ""}
      <div style={{ width: "fit-content" }}>
        <center>
          <h1
            className="Heading1"
            style={{ backgroundColor: "var(--red)", color: "var(--white)" }}
          >
            Appraisal Details
          </h1>
        </center>
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
        </div>
      </div>

      <ViewApprRewardHistModal
        show={showAppraisalHistoryModal}
        onHide={() => setShowAppraisalHistoryModal(false)}
        appraisalHistory={appraisalHistory}
        type={type}
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
export default GetAllEmpAppraisalDetails;
