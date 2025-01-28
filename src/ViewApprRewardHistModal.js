import { Button, Paper, Table } from "@mui/material";
import React from "react";
import { Modal } from "react-bootstrap";

function ViewApprRewardHistModal({ show, onHide, appraisalHistory, type }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" centered>
          View Appraisal & Reward History
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Paper>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Amount</th>
                {type === "history" && <th>Salary</th>}
                {type === "history" && <th>Bonus</th>}
                {type === "history" && <th>Variable</th>}
                {type === "reward" && <th>Reward Type</th>}
              </tr>
            </thead>
            <tbody>
              {appraisalHistory.length > 0 ? (
                appraisalHistory.map((appraisal, index) => (
                  <tr key={index}>
                    <td>{appraisal.name}</td>
                    <td>{appraisal.appraisalDate}</td>
                    <td>{appraisal.amount}</td>
                    {type === "history" && <td>{appraisal.salary}</td>}
                    {type === "history" && <td>{appraisal.bonus}</td>}
                    {type === "history" && <td>{appraisal.variable}</td>}
                    {type === "reward" && <td>{appraisal.rewardType}</td>}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={type === "reward" ? "4" : "6"}
                    className="text-center"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Paper>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={onHide}
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
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewApprRewardHistModal;
