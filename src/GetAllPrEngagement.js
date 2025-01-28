import React, { useState, useEffect, useMemo } from "react";
import { Modal, Form } from "react-bootstrap";
import { EditOutlined as EditIcon } from "@mui/icons-material"; // Updated import
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
  Tooltip,
} from "@mui/material";

import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
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

const years = Array.from(
  new Array(10),
  (val, index) => new Date().getFullYear() + index
);
function RevenueDetailsModal({
  show,
  onHide,
  revenueDetails,
  currentDetail,
  projectId,
  token,
  onSave,
  handleAddNewRevenueDetail,
  handleEditRevenueDetail,
}) {
  const [formData, setFormData] = useState({
    year: "",
    month: "",
    projectRevenue: "",
    resourceExpense: "",
    contractorRevenue: "",
  });

  useEffect(() => {
    if (currentDetail) {
      setFormData({
        year: currentDetail.year || "",
        month: currentDetail.month || "",
        projectRevenue: currentDetail.projectRevenue || "",
        resourceExpense: currentDetail.resourceExpense || "",
        contractorRevenue: currentDetail.contractorRevenue || "",
      });
    }
  }, [currentDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Regular expression to match integers and decimals
    const numericValue = /^[+-]?([0-9]*[.])?[0-9]+$/;

    // Check if the entered value is a valid numeric value
    if (name !== "month" && (value === "" || numericValue.test(value))) {
      // Update formData state with the new value
      setFormData({
        ...formData,
        [name]: value,
      });
    } else if (name === "month") {
      // Allow non-numeric values for month
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSave = () => {
    const newId = currentDetail && currentDetail.id ? currentDetail.id : null;
    axios
      .post(
        `/apigateway/hrms/engagement/saveProjectRevenue`,
        {
          id: newId,
          projectEngagement: {
            projectId: projectId,
          },
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        toast.success(response.data, {
          position: "top-center",
          theme: "colored",
        });
        onSave();
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          error.response.data.message || "Error saving revenue detail"
        );
      });
  };

  const style = {
    width: "100%",
    height: "46px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      style={{ maxWidth: "100%", margin: "auto" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Revenue Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ overflowX: "auto" }}>
          <Table striped bordered hover style={{ minWidth: "100%" }}>
            <thead style={{ backgroundColor: "#f8d7da", textAlign: "center" }}>
              <tr>
                <th style={{ width: "20%" }}>End Client</th>
                <th style={{ width: "15%" }}>Year</th>
                <th style={{ width: "15%" }}>Month</th>
                <th style={{ width: "15%" }}>Project Revenue</th>
                <th style={{ width: "15%" }}>Resource Expense</th>
                <th style={{ width: "15%" }}>Contractor Expense</th>
                <th style={{ width: "5%" }}>Edit</th>
              </tr>
            </thead>
            <tbody>
              {revenueDetails.map((detail) => (
                <tr key={detail.id} style={{ textAlign: "center" }}>
                  <td>{detail.projectEngagement.endClient}</td>
                  <td>{detail.year}</td>
                  <td>{detail.month}</td>
                  <td>{detail.projectRevenue}</td>
                  <td>{detail.resourceExpense}</td>
                  <td>{detail.contractorRevenue}</td>
                  <td>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditRevenueDetail(detail)}
                    >
                      <EditIcon sx={{ color: "var(--warmGrey)" }} />
                    </Button>
                  </td>
                </tr>
              ))}
              <tr style={{ textAlign: "center" }}>
                <td colSpan={7}>
                  <Button
                    onClick={handleAddNewRevenueDetail}
                    sx={{
                      backgroundColor: "var(--red)",
                      color: "var(--white)",
                      transition: "transform",
                      "&:hover": {
                        backgroundColor: "var(--red)",
                        transform: "scale(1.03)",
                      },
                      width: "30%",
                    }}
                  >
                    Add New
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <Form>
          <Form.Group controlId="formYear">
            <label>Year</label>
            <Form.Control
              as="select"
              name="year"
              value={formData.year}
              onChange={handleChange}
              style={style}
            >
              <option value="">Select Year</option>
              {Array.from(
                { length: 11 },
                (_, i) => new Date().getFullYear() - 3 + i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formMonth">
            <label>Month</label>
            <Form.Control
              as="select"
              name="month"
              value={formData.month}
              onChange={handleChange}
              style={style}
            >
              <option value="">Select Month</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formProjectRevenue">
            <label>Project Revenue</label>
            <Form.Control
              type="text"
              name="projectRevenue"
              value={formData.projectRevenue}
              onChange={handleChange}
              style={style}
            />
          </Form.Group>
          <Form.Group controlId="formResourceExpense">
            <label>Resource Expense</label>
            <Form.Control
              type="text"
              name="resourceExpense"
              value={formData.resourceExpense}
              onChange={handleChange}
              style={style}
            />
          </Form.Group>
          <Form.Group controlId="formContractorExpense">
            <label>Contractor Expense</label>
            <Form.Control
              type="text"
              name="contractorRevenue"
              value={formData.contractorRevenue}
              onChange={handleChange}
              style={style}
            />
          </Form.Group>
          <Button
            sx={{
              backgroundColor: "var(--red)",
              color: "var(--white)",
              transition: "transform",
              "&:hover": {
                backgroundColor: "var(--red)",
                transform: "scale(1.03)",
              },
              width: "30%",
            }}
            onClick={handleSave}
          >
            Save
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function GetAllPrEngagement() {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [revenueDetails, setRevenueDetails] = useState([]);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [columnFilters, setColumnFilters] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentRevenueDetail, setCurrentRevenueDetail] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    axios
      .get("/apigateway/hrms/engagement/allProjectEngagement", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message || "Error fetching details");
        setLoading(false);
      });
  }, [token]);

  const exportToExcel = () => {
    setLoading(true);
    axios({
      url: `/apigateway/hrms/engagement/getAllProjectEngagementExportToExcel`,
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
        link.setAttribute("download", "ProjectEngData.xlsx");
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Error uploading excel.");
        setLoading(false);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset to first page on rows per page change
  };
  const handleRevenueDetailsClick = (projectId) => {
    axios
      .get(
        `/apigateway/hrms/engagement/getRevenueDetailsByprojectId/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setRevenueDetails(response.data);
        setSelectedProject(projectId);
        setShowRevenueModal(true);
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          error.response.data.message || "Error fetching revenue details"
        );
      });
  };

  const handleAddNewRevenueDetail = () => {
    setCurrentRevenueDetail({
      id: null,
      projectEngagement: { projectId: selectedProject },
      year: "",
      month: "",
      projectRevenue: "",
      resourceExpense: "",
    });
    setShowRevenueModal(true);
  };

  const handleEditRevenueDetail = (detail) => {
    setCurrentRevenueDetail(detail);
    setShowRevenueModal(true);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "contractor",
        header: "Contractor",
        meta: { filterVariant: "select" },
      },
      {
        accessorKey: "endClient",
        header: "End Client",
        meta: { filterVariant: "select" },
      },
      {
        accessorKey: "primaryResource",
        header: "Primary Resource",
        meta: { filterVariant: "select" },
      },
      {
        accessorKey: "secondaryResource",
        header: "Secondary Resource",
        meta: { filterVariant: "select" },
      },
      {
        accessorKey: "startDate",
        header: "Start Date",
        meta: { filterVariant: "select" },
      },
      {
        accessorKey: "endDate",
        header: "End Date",
        meta: { filterVariant: "select" },
      },
      {
        accessorKey: "status",
        header: "Status",
        meta: { filterVariant: "select" },
      },
      {
        accessorKey: "revenueDetails",
        header: "Revenue Details",
        meta: { filterable: false },
        cell: (cell) => (
          <Button
            onClick={() =>
              handleRevenueDetailsClick(cell.row.original.projectId)
            }
            sx={{
              backgroundColor: "var(--warmGrey)",
              color: "var(--white)",
              transition: "transform",
              "&:hover": {
                backgroundColor: "var(--red)",
                transform: "scale(1.03)",
              },
              width: "10%",
            }}
          >
            View
          </Button>
        ),
      },
      {
        accessorKey: "edit",
        header: "Edit",
        meta: { filterable: false },
        cell: (cell) => (
          <Link to={`/EditprojEng/${cell.row.original.projectId}`}>
            <IconButton color="primary">
              <EditIcon sx={{ color: "var(--warmGrey)" }} />
            </IconButton>
          </Link>
        ),
      },
    ],
    []
  );

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
    <div className="mt-3">
      {loading ? <LoadingPage /> : ""}
      
      <div style={{ margin: "25px 100px", width: "820px", height: "750px" }}>
        <h1
          className="Heading1"
          style={{ backgroundColor: "var(--red)", color: "var(--white)", }}
        >
          Project Engagement
        </h1>
        <Tooltip title="Download project engagement data" arrow>
          <Button
            onClick={exportToExcel}
            startIcon={
              <FileDownloadOutlinedIcon sx={{ color: "var(--white)" }} />
            }
            sx={{
              backgroundColor: "var(--warmGrey)",
              color: "var(--white)",
              transition: "transform",
              "&:hover": {
                backgroundColor: "var(--red)",
                transform: "scale(1.03)",
              },
              width: "20%",
              marginBottom: "2%",
            }}
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
                                  <Filter column={header.column}/>
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
        </div>
      </div>

      <RevenueDetailsModal
        show={showRevenueModal}
        onHide={() => setShowRevenueModal(false)}
        revenueDetails={revenueDetails}
        currentDetail={currentRevenueDetail}
        projectId={selectedProject}
        token={token}
        onSave={() => {
          setShowRevenueModal(false);
          handleRevenueDetailsClick(selectedProject);
        }}
        handleAddNewRevenueDetail={handleAddNewRevenueDetail}
        handleEditRevenueDetail={handleEditRevenueDetail}
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
      style={{width: "100%"}}
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

export default GetAllPrEngagement;
