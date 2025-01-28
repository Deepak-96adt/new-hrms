import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  Select,
  MenuItem,
  Typography,
  FormControl,
  Input,
  Grid
} from "@mui/material";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';

const UpdateEmpDocumentByAdmin = () => {
    const { id } = useParams();
    // const token = localStorage.getItem("response-token");
    const  token = useSelector((state) => state.auth.token);
    const [documents, setDocuments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [selectedDocumentType, setSelectedDocumentType] = useState("");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchDocuments = async () => {
          try {
            const { data } = await axios.get(
              `/apigateway/hrms/employee/getAllDocumentDetailsByEmpId/${id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setDocuments(data.map((item) => item.documentType));
          } catch (error) {
            console.error(error);
          }
        };
    
        const fetchDocumentTypes = async () => {
          try {
            const { data } = await axios.get(
              `/apigateway/hrms/employee/getDocumentTypes`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setDocumentTypes(data);
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchDocuments();
        fetchDocumentTypes();
      }, [token, id]);
      const handleDelete = async (documentId) => {
        try {
          setLoading(true);
          const { data } = await axios.delete(
            `/apigateway/hrms/employee/deleteDocument/${id}/${documentId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success(data, { position: "top-center", theme: "colored" });
          setLoading(false);
          setDocuments((prevDocs) =>
            prevDocs.filter((doc) => doc.id !== documentId)
          );
        } catch (error) {
          setLoading(false);
          console.error(error);
          toast.error("Error while deleting the file.", {
            position: "top-center",
            theme: "colored",
          });
        }
      };
    
      const handleDownload = async (documentId) => {
        try {
          setLoading(true);
          const { data, headers } = await axios.get(
            `/apigateway/hrms/employee/downloadDocument/${id}/${documentId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              responseType: "arraybuffer",
            }
          );
    
          if (data.byteLength > 0) {
            const contentType = headers["content-type"];
            const fileExtension = contentType.split("/")[1];
            const blob = new Blob([data], { type: contentType });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
              "download",
              `EmployeeDocument${id}.${fileExtension}`
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("File downloaded successfully.", {
              position: "top-center",
              theme: "colored",
            });
            setLoading(false);
          } else {
            toast.error("File not found.", {
              position: "top-center",
              theme: "colored",
            });
          }
        } catch (error) {
          setLoading(false);
          console.error(error);
          toast.error("Error occurred, please try again later.", {
            position: "top-center",
            theme: "colored",
          });
        }
      };
    
      const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData();
        const documentFile = document.getElementById("myfile").files[0];
    
        formData.append(
          "emp",
          JSON.stringify({ empId: id, docTypeId: selectedDocumentType })
        );
        formData.append("document", documentFile);
    
        try {
          const { data } = await axios.post(
            `/apigateway/hrms/employee/uploadDocument/${id}/${selectedDocumentType}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          toast.success(data, { position: "top-center", theme: "colored" });
          setIsModalOpen(false);
          const { data: updatedDocs } = await axios.get(
            `/apigateway/hrms/employee/getAllDocumentDetailsByEmpId/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setDocuments(updatedDocs.map((item) => item.documentType));
        } catch (error) {
          console.error(error);
          toast.error("Error uploading document. Please try again.", {
            position: "top-center",
            theme: "colored",
          });
        } finally {
          setLoading(false);
        }
      };
    
      const styles = {
        tableContainer: {
          maxWidth: "700px",
          // margin: "0 auto",
        },
      };
    
      return (
        <div>
         {loading ? (
            <LoadingPage />
          ) : (
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  maxWidth: 400,
                }}
              >
                <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
                  Upload Document
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ mr: 2 }}>
                      Document Type:
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={selectedDocumentType}
                        onChange={(event) =>
                          setSelectedDocumentType(event.target.value)
                        }
                      >
                        <MenuItem value="">
                          <em>Select document type</em>
                        </MenuItem>
                        {documentTypes.map((docType) => (
                          <MenuItem key={docType.id} value={docType.id}>
                            {docType.documentType}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <FormControl fullWidth>
                    <Input type="file" id="myfile" name="myfile" />
                  </FormControl>
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Button sx={{ backgroundColor:'#ab2217'}} variant="contained" type="submit">
                      Upload
                    </Button>
                    <Button
                    sx={{backgroundColor: "rgb(114, 108, 108)"}}
                      variant="contained"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </Button>
                  </Box>
                </form>
              </Box>
            </Modal>
          )}
          <TableContainer sx={{marginTop:"50px"}} component={Paper} style={styles.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document Type</TableCell>
                  <TableCell>Download</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              {documents.map((document) => (
                <TableBody key={document.id}>
                  <TableRow>
                    <TableCell>{document.documentType}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleDownload(document.id)}
                      >
                        Download
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you wish to delete this item?"
                            )
                          ) {
                            handleDelete(document.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
            </Table>
          </TableContainer>
          <Grid container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
                    <Grid item>
                      <button
                       style={{
                         backgroundColor:'#ab2217'}}  
                         type="submit"
                         onClick={() => setIsModalOpen(true)}>
                        Upload
                      </button>
                    </Grid>
           </Grid>
          
        </div>
      );
    }
    
export default UpdateEmpDocumentByAdmin;
