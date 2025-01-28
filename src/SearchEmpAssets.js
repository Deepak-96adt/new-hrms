import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Container, Table, Form, Button } from 'react-bootstrap';
import './Hrmscss/App.css';
import LoadingPage from './LoadingPage'
import { useSelector } from 'react-redux';
function SearchEmpAssets() {
  // const token = localStorage.getItem("response-token");
  const  token = useSelector((state) => state.auth.token);
  const [searchAsset, setSearchAsset] = useState('');
  const [loading, setLoading] = useState(false);
  const [asset, setAsset] = useState([]);

  const handleNameChange = (event) => {
    setSearchAsset(event.target.value);
  }

  const handleSubmit = () => {
    setLoading(true); 
    axios.get(`/apigateway/hrms/masterAsset/searchByAssetUser?query=${searchAsset}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        setAsset(response.data);
        toast.success('Assets data found successfully', { position: 'top-center', theme: 'colored' });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error( error.response.data.message || "Error fetching details" );
        setLoading(false);
      });
  }

  const [assetTypes, setAssetTypes] = useState([]); 
  const [selectedAssetType, setSelectedAssetType] = useState(''); 
  const [selectedAssetStatus, setSelectedAssetStatus] = useState(''); 


  const handleSearchByTypeAndStatus = () => {
    setLoading(true); 
    axios.get(`/apigateway/hrms/masterAsset/searchByAssetType?query=${selectedAssetType}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        setAsset(response.data);
        toast.success('Assets data found successfully', { position: 'top-center', theme: 'colored' });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error( error.response.data.message || "Error fetching asset type  details" );
        setLoading(false);
      });
  };

  const handleSearchByStatus = () => {
    setLoading(true); 
    axios.get(`/apigateway/hrms/masterAsset/searchByStatus?query=${selectedAssetStatus}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        // Update the asset state with the data from the third API call
        setAsset(response.data);
        toast.success('Assets data found successfully', { position: 'top-center', theme: 'colored' });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error( error.response.data.message || "Error fetching asset" );
        setLoading(false);
      });
  };
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);


    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div className="table-responsive-sm">
        {loading ? <LoadingPage/> : ''}
      <div className=" mt-3">
        <nav aria-label="breadcrumb" style={{ "--bs-breadcrumb-divider": "'>>'" }}>
          <ol className="breadcrumb" style={{ color: "white" ,marginLeft:'20px'}}>
            <li className="breadcrumb-item"><Link to="/">Home</Link> </li>
            <li className="breadcrumb-item"><a href="">Employee Management</a></li>
            <li className="breadcrumb-item active" aria-current="page">Search Employee Asset</li>
          </ol>
        </nav>
      </div>
      <div className="d-flex justify-content-center  " style={{ width: screenWidth - 50 }}>
        <div>
          <h1 className='Heading1'> Search Employee Assets</h1>
          <Container>
            <div className="d-flex justify-content-between " style={{marginTop:'50px'}}>
              <Form.Group controlId="employeeName">
                <Form.Label>Search By Asset User</Form.Label>
                <div className="d-flex">
                  <Form.Control type="text" placeholder="Enter Asset User" value={searchAsset} onChange={handleNameChange} style={{ width: '40vh', marginBottom: 0 }} />
                  <Button onClick={handleSubmit} className=" mt-0 mx-2">Search</Button>
                </div>
              </Form.Group>

              <Form.Group controlId="assetType">
                <Form.Label>Search By Asset Type</Form.Label>
                <div className="d-flex">
                  <Form.Control type="text" placeholder="Enter Asset Type" className=" m-0" value={selectedAssetType} onChange={(e) => setSelectedAssetType(e.target.value)} style={{ width: '40vh', marginBottom: 0 }} />
                  <Button onClick={handleSearchByTypeAndStatus} className=" mt-0 mx-2">Search</Button>
                </div>
              </Form.Group>

              <Form.Group controlId="assetStatus">
                <Form.Label>Search By Asset Status</Form.Label>
                <div className="d-flex">
                  <Form.Control as="select" value={selectedAssetStatus} onChange={(e) => setSelectedAssetStatus(e.target.value)} style={{ width: '40vh', marginBottom: 0 }}>
                    <option value="">Select Asset Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Control>
                  <Button onClick={handleSearchByStatus} className=" mt-0  ms-2">Search</Button>
                </div>
              </Form.Group>
            </div>

           

            <div style={{marginBottom:'60px', marginTop:'50px'}}>
            <table border='2' className="table table-striped table-bordered">
              <thead className="head">
                <tr className="table-danger table-striped">
                  <th>ID</th>
                  <th>ASSET USER</th>
                  <th>ASSET NAME</th>
                  <th>ASSET ID</th>
                  <th>ASSET NUMBER</th>
                  <th>ASSET TYPE</th>
                  <th>PROCESSOR</th>
                  <th>RAM</th>
                  <th>DISK TYPE</th>
                  <th>OPERATING SYSTEM</th>
                  <th>PURCHASE DATE</th>
                  <th>WARRANTY</th>
                  <th>WARRANTY DATE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody className="body">
                {asset.map((assets) => (
                  <tr key={assets.id}>
                    <td><Link to={`/EditAssets/${assets.id}`} className="Candidate-id">{assets.id}</Link></td>
                    <td>{assets.assetUser}</td>
                    <td>{assets.assetName}</td>
                    <td>{assets.assetId}</td>
                    <td>{assets.assetNo}</td>
                    <td>{assets.assetType}</td>
                    <td>{assets.processor}</td>
                    <td>{assets.ram}</td>
                    <td>{assets.diskType}</td>
                    <td>{assets.operatingSystem}</td>
                    <td>{assets.purchesDate}</td>
                    <td>{assets.warrenty}</td>
                    <td>{assets.warrentyDate}</td>
                    <td>{assets.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </Container>
        </div>
      </div>
    </div>
  )
}

export default SearchEmpAssets;
