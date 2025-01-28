import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Table, Form, Button, Dropdown } from "react-bootstrap";
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
import { IconButton } from "@mui/material";

function EmpLeaveBal() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchCriterion, setSearchCriterion] = useState("firstName");
  const [searchValue, setSearchValue] = useState("");
  const token = useSelector((state) => state.auth.token);
  const [columnFilters, setColumnFilters] = useState([]);
 
  const [columnVisibility, setColumnVisibility] = useState({
    employeeId: true,
    firstName: true,
    lastName: true,
    leaveBalance : true,
    halfDays: true,
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
        accessorKey: "employeeId",
        header: "Payroll",
        cell: (cell) => (
          <div>
            <Link to={`/UpdatePayrollSalary/${cell.row.original.employeeId}`}>
              <IconButton color="primary">
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
              <IconButton color="primary">
                <EditIcon />
              </IconButton>
            </Link>
          </div>
        ),
        isVisible: columnVisibility.employeeId,
      },
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
        accessorKey: "leaveBalance",
        header: "Leave Balance",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.leaveBalance,
      },
      {
        accessorKey: "halfDays",
        header: "Half Days",
        meta: { filterVariant: "select" },
        isVisible: columnVisibility.halfDays,
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
    <div style={{ margin: "25px 100px", width: "820px", height: "750px" }}>
      
      <div className="d-flex justify-content-center" style={{ width: "90%" }}>
        <div style={{ paddingLeft: "200px", paddingRight: "20px" }}>
          <h1 className="Heading1 my-4">Employee Leave Balance Details</h1>
          <div className="d-flex justify-content-between">
          <div className="mt-2">
        {/* <strong>Show/Hide Columns:</strong> */}
        {/* <Dropdown>
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
        </Dropdown> */}
      </div>
            <Form.Group controlId="employeeSearch">
              <Form.Label className="my-2">Search By</Form.Label>
              <div className="d-flex my-2">
                <Form.Control
                  as="select"
                  value={searchCriterion}
                  onChange={(e) => setSearchCriterion(e.target.value)}
                  style={{
                    width: "39vh",
                    marginRight: "10px",
                    marginBottom: 0,
                  }}
                >
                  <option value="firstName">First Name</option>
                  <option value="lastName">Last Name</option>
                  <option value="adtId">Emp Id</option>
                  
                 
                </Form.Control>
                <Form.Control
                  type="text"
                  placeholder="Enter Search Value"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  style={{
                    width: "30vh",
                    marginRight: "10px",
                    marginBottom: 0,
                  }}
                />
                <Button onClick={handleSearch} className="mt-0">
                  Search
                </Button>
              </div>
            </Form.Group>
          </div>
          <div
            className="table-responsive-sm"
            style={{ width: "145vh", overflowX: "auto" }}
          >
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
            
          </div>
          <nav>
            <ul className="pagination justify-content-center mt-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
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
          </nav>
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

export default EmpLeaveBal;
