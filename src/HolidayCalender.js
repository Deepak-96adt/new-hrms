import React, { useEffect, useState } from "react";
import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Paper,
  TextField,
  Button,
  Table,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,

} from "@mui/icons-material";
import EditHolidayCalender from "./EditHolidayCalender";
import DownloadIcon from '@mui/icons-material/Download';

const HolidayCalender = () => {
  const token = useSelector((state) => state.auth.token);
  const permission = useSelector((state) => state.auth.permissions);
  const [holidays, setHolidays] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editHolidayId, setEditHolidayId] = useState(null);
  const [editHolidayName, setEditHolidayName] = useState("");
  const [editHolidayDate, setEditHolidayDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Manage dialog state

  useEffect(() => {
    fetchHolidayData();
  }, []);

  const fetchHolidayData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/apigateway/hrms/holiday/getHolidayCalendar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHolidays(response.data);
      console.log(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching holidays");
    } finally {
      setLoading(false);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset to first page on rows per page change
  };

  const handleEdit = (holiday) => {
    console.log(holiday.hid)
    setEditHolidayId(holiday.hid);
    setEditHolidayName(holiday.holidayName);
    setEditHolidayDate(holiday.date);
    setEditModalOpen(true);
  };

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleUpdate = () => {
    if (!editHolidayId) {
      console.log(editHolidayId)
      return;
    }
    setLoading(true);
    axios.put(
      `/apigateway/hrms/holiday/updateHolidayCalendar/${editHolidayId}`,
      {},
      {
        params: {
          holidayName: editHolidayName,
          date: editHolidayDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((response) => {
      toast.success(response.data.message || "Holiday updated successfully");
      fetchHolidayData();
      setEditModalOpen(false);
    }).catch((error) => {
      toast.error(error.response?.data?.message || "Error updating holiday");
    });
  };

  const handleDelete = async (holidayId) => {
    console.log(holidayId)
    setLoading(true);
    try {
      const response = await axios.delete(
        `/apigateway/hrms/holiday/deleteHolidayById/${holidayId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message || "Holiday deleted successfully");
      fetchHolidayData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting holiday");
    } finally {
      setLoading(false);
    }
  };

  const handlePdf = () => {
    setLoading(true);
    axios
      .get(`/apigateway/hrms/holiday/downloadHolidayCalendar`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "arraybuffer",
      })
      .then((response) => {
        const pdfData = new Uint8Array(response.data);
        const blob = new Blob([pdfData], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        var newTab = window.open(url, "_blank");

        toast.success("Holiday calendar generated successfully", {
          position: "top-center",
          theme: "colored",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message || "Error updating details");
        setLoading(false);
      });
  };

  const table = useReactTable({
    data: holidays,
    columns: [
      {
        accessorKey: "holidayName",
        header: "Holiday Name",
      },
      {
        accessorKey: "date",
        header: "Date",
      },
      {
        accessorKey: "month",
        header: "Month",
      },
      {
        accessorKey: "day",
        header: "Day",
      },
      ...(permission.includes("MANAGE_HOLIDAY")
        ? [
          {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => (
              <>
                <IconButton sx={{ color: "grey" }} onClick={() => handleEdit(row.original)}>
                  <EditIcon />
                </IconButton>
                <IconButton sx={{ color: "grey" }} onClick={() => handleDelete(row.original.hid)}>
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]
        : []),
    ],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="d-flex ">
      <Paper
        sx={{
          height: "auto",
          width: "100%",
          marginLeft: "5%",
          padding: "5%",
          marginTop: "5%",
          marginBottom: "10%",
          paddingTop: "-10%",
        }}
      >
        <h1 className="Heading1" style={{ backgroundColor: "var(--red)", color: "var(--white)", marginTop:"-25px", marginBottom:"-10px" }}>Holiday Calendar</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end"  }}>
          {permission.includes("MANAGE_HOLIDAY") && (
            <EditHolidayCalender
              open={handleOpenDialog}
              onClose={handleCloseDialog}
            />
          )}
          <Button variant="outline-primary" onClick={handlePdf} sx={{
            backgroundColor: "var(--red)",
            "&:hover": { backgroundColor: "var(--red)" },
            color: "var(--white)"
          }}>
            <DownloadIcon sx={{ marginRight: "8px" }} />
            Download PDF
          </Button>
        </div>

        <TableContainer sx={{ maxHeight: 500,  marginTop:"-15px" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead sx={{ padding: "15px" }}>
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

      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          style={{ backgroundColor: "var(--red)", color: "var(--white)" }}
        >
          Edit Holiday
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Holiday Name"
            value={editHolidayName}
            onChange={(e) => setEditHolidayName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            type="date"
            label="Date"
            value={editHolidayDate}
            onChange={(e) => setEditHolidayDate(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} sx={{
            marginRight: "1rem", backgroundColor: "grey", color: "var(--white)", transition: "transform",
            "&:hover": {
              backgroundColor: "var(--red)",
              transform: "scale(1.03)",
            },
          }}>
            Cancel
          </Button>
          <Button sx={{
            backgroundColor: "var(--red)",
            color: "var(--white)",
            transition: "transform",
            "&:hover": {
              backgroundColor: "var(--red)",
              transform: "scale(1.03)",
            },
          }} onClick={handleUpdate} >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HolidayCalender;
