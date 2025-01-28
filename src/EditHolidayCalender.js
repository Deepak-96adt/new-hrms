import React, { useState } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  Paper,
  Button,
  Dialog,
  DialogContent,
  TextField,
  DialogActions,
  DialogTitle,
} from "@mui/material";

function EditHolidayCalender() {
  const token = useSelector((state) => state.auth.token); // Retrieve token from Redux
  const [newHolidayName, setNewHolidayName] = useState(""); // Holiday name state
  const [newHolidayDate, setNewHolidayDate] = useState(""); // Holiday date state
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Manage dialog open state

  // Open dialog
  const handleOpenDialog = () => setIsDialogOpen(true);
  // Close dialog
  const handleCloseDialog = () => setIsDialogOpen(false);

  // Save new holiday
  const handleSaveHoliday = async (e) => {
    e.preventDefault(); // Prevent form default submission behavior
    try {
      const response = await axios.post(
        `/apigateway/hrms/holiday/saveHolidayDate`,
        {},
        {
          params: {
            holidayName: newHolidayName,
            date: newHolidayDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message || "Holiday saved successfully");
      setIsDialogOpen(false); // Close dialog on success
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save holiday details"
      );
    }
  };

  return (
    <div className="d-flex">
      <Container>
        {/* Button to open dialog */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
          sx={{
            backgroundColor: "var(--red)",
            "&:hover": { backgroundColor: "var(--red)" },
            marginBottom:"20px",
          }}
        >
          Add Holiday
        </Button>

        {/* Dialog for adding holiday */}
        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            style={{ backgroundColor: "var(--red)", color: "var(--white)" }}
          >
            Holiday Calendar
          </DialogTitle>
          <DialogContent>
            <form>
              <TextField
                fullWidth
                label="Holiday Name"
                variant="outlined"
                placeholder="Enter holiday name"
                value={newHolidayName}
                onChange={(e) => setNewHolidayName(e.target.value)}
                margin="normal"
                InputLabelProps={{
                  style: {
                    color: "black",
                    fontFamily: "Roboto Slab",
                    fontWeight: "normal",
                    fontSize: "18px",
                  },
                }}
              />
              <TextField
                fullWidth
                type="date"
                label="Holiday Date"
                variant="outlined"
                value={newHolidayDate}
                onChange={(e) => setNewHolidayDate(e.target.value)}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                  style: {
                    color: "black",
                    fontFamily: "Roboto Slab",
                    fontWeight: "normal",
                    fontSize: "18px",
                  },
                }}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} sx={{
              marginRight: "1rem", backgroundColor: "grey", color: "var(--white)", transition: "transform",
              "&:hover": {
                backgroundColor: "var(--red)",
                transform: "scale(1.03)",
              },
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveHoliday}
              sx={{
                backgroundColor: "var(--red)",
                color: "var(--white)",
                transition: "transform",
                "&:hover": {
                  backgroundColor: "var(--red)",
                  transform: "scale(1.03)",
                },
              }}
              type="submit"
            >
              Save Holiday
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}

export default EditHolidayCalender;
