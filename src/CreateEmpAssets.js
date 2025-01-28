import React, { useState ,useEffect} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import LoadingPage from './LoadingPage';
import { useSelector } from 'react-redux';

const CreateEmpAssets = () => {
  // const token = localStorage.getItem("response-token");
  const  token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    assetUser: "",
    assetName: "",
    assetId: "",
    assetNo: "",
    assetType: "",
    processor: "",
    ram: "",
    diskType: "",
    operatingSystem: "",
    purchesDate: "",
    warrenty: "",
    warrentyDate: "",
    status: "",
  });
  const [AssetType, setAssetType] = useState([]);

  useEffect(() => {

    axios
      .get(`/apigateway/hrms/masterAsset/getAllAssetType`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data.data);
        setAssetType(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          error.response.data.message
        );
      });
  
    
   

  }, []);


  function submit(e) {
    e.preventDefault();
    setLoading(true); 
    axios
      .post(
        `/apigateway/hrms/masterAsset/insertAssets`,
        {
          assetUser: data.assetUser,
          assetName: data.assetName,
          assetId: data.assetId,
          assetNo: data.assetNo,
          assetType: data.assetType,
          processor: data.processor,
          ram: data.ram,
          diskType: data.diskType,
          operatingSystem: data.operatingSystem,
          purchesDate: data.purchesDate,
          warrenty: data.warrenty,
          warrentyDate: data.warrentyDate,
          status: data.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        toast.success(response.data, {
          position: "top-center",
          theme: "colored",
        });
        setLoading(false); 
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          error.response.data.message || "Error creating employee asset."
        );
        setLoading(false); 
      });
  }

  function handle(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
  }

  return (
    <div>
      {loading && <LoadingPage />}
      <div className="mt-3">
        <nav
          aria-label="breadcrumb"
          style={{ "--bs-breadcrumb-divider": "'>>'" }}
        >
          <ol className="breadcrumb" style={{ color: "white", marginLeft: '20px' }}>
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>{" "}
            </li>
            <li className="breadcrumb-item">
            <Link to="">Employee Management</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Employee Asset
            </li>
          </ol>
        </nav>
      </div>

      <div className="container pt-3">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div
              className="card border-0 shadow"
              style={{ marginLeft: "100px", width: "700px", height: "1100px" }}
            >
              <div className="card-body">
                <form
                  className="container py-3 mb-3"
                  onSubmit={submit}
                >
                  <div className="row mb-3">
                    <label
                      htmlFor="assetUser"
                      className="col-sm-2 col-form-label"
                    >
                      Asset User
                    </label>
                    <div className="col-sm-10">
                      <input
                        onChange={handle}
                        value={data.assetUser}
                        type="text"
                        id="assetUser"
                        placeholder="Enter asset user name"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label
                      htmlFor="assetName"
                      className="col-sm-2 col-form-label"
                    >
                      Asset Name
                    </label>
                    <div className="col-sm-10">
                      <input
                        onChange={handle}
                        value={data.assetName}
                        type="text"
                        id="assetName"
                        placeholder="Enter asset name"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label
                      htmlFor="assetId"
                      className="col-sm-2 col-form-label"
                    >
                      Asset Id
                    </label>
                    <div className="col-sm-10">
                      <input
                        onChange={handle}
                        value={data.assetId}
                        type="text"
                        id="assetId"
                        placeholder="Enter asset Id"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label
                      htmlFor="assetNo"
                      className="col-sm-2 col-form-label"
                    >
                      Asset Number
                    </label>
                    <div className="col-sm-10">
                      <input
                        onChange={handle}
                        value={data.assetNo}
                        type="text"
                        id="assetNo"
                        placeholder="Enter asset number"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label
                      htmlFor="inputEmail3"
                      className="col-sm-2 col-form-label"
                      name="tech_id"
                    >
                      AssetType
                    </label>
                    <div className="col-sm-10">
                      <select
                        required
                        onChange={(e) => {
                          handle(e);
                        }}
                        value={AssetType.id}
                        id="tech_id"
                        className="form-control"
                      >
                        <option defaultValue>Select AssetType</option>
                        {AssetType.map((asset) => (
                          <option key={asset.id} value={asset.id}>
                            {asset.assetName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label
                      htmlFor="processor"
                      className="col-sm-2 col-form-label"
                    >
                      Processor
                    </label>
                    <div className="col-sm-10">
                      <input
                        onChange={handle}
                        value={data.processor}
                        type="text"
                        className="form-control"
                        placeholder="Enter asset processor"
                        id="processor"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label
                      htmlFor="ram"
                      className="col-sm-2 col-form-label"
                    >
                      RAM
                    </label>
                    <div className="col-sm-10">
                      <input
                        onChange={handle}
                        value={data.ram}
                        type="text"
                        className="form-control"
                        placeholder="Enter asset ram."
                        id="ram"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label
                      htmlFor="diskType"
                      className="col-sm-2 col-form-label"
                    >
                      Disk Type
                    </label>
                    <div className="col-sm-10">
                      <input
                        onChange={handle}
                        value={data.diskType}
                        type="text"
                        className="form-control"
                        placeholder="Enter asset disk type"
                        id="diskType"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label
                      htmlFor="operatingSystem"
                      className="col-sm-2 col-form-label"
                    >
                      Operating System
                    </label>
                    <div className="col-sm-10">
                      <input
                        onChange={handle}
                        value={data.operatingSystem}
                        type="text"
                        className="form-control"
                        placeholder="Enter asset operating system"
                        id="operatingSystem"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label
                      htmlFor="purchesDate"
                      className="col-sm-2 col-form-label"
                    >
                      Purchase Date
                    </label>
                    <div className="col-sm-10">
                      <input
                        onChange={handle}
                        value={data.purchesDate}
                        type="date"
                        className="form-control"
                        id="purchesDate"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label
                      htmlFor="warrenty"
                      className="col-sm-2 col-form-label"
                    >
                      Warranty
                    </label>
                    <div className="col-sm-10">
                      <input
                        onChange={handle}
                        value={data.warrenty}
                        type="text"
                        className="form-control"
                        placeholder="Enter warranty."
                        id="warrenty"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label
                      htmlFor="warrentyDate"
                      className="col-sm-2 col-form-label"
                    >
                      Warranty Date
                    </label>
                    <div className="col-sm-10">
                      <input
                        onChange={handle}
                        value={data.warrentyDate}
                        type="date"
                        className="form-control"
                        id="warrentyDate"
                      />
                    </div>
                  </div>
                  <fieldset className="row mb-3">
                    <legend className="col-form-label col-sm-2 pt-0">
                      Status
                    </legend>
                    <div className="col-sm-10">
                      <div className="form-check form-check-inline">
                        <input
                          onChange={handle}
                          value="true"
                          className="form-check-input"
                          type="radio"
                          name="status"
                          id="statusActive"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="statusActive"
                        >
                          Active
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          onChange={handle}
                          value="false"
                          className="form-check-input"
                          type="radio"
                          name="status"
                          id="statusInactive"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="statusInactive"
                        >
                          Inactive
                        </label>
                      </div>
                    </div>
                  </fieldset>
                  <div className="d-grid gap-2 col-6 mx-auto">
                    <button className="btn btn-outline-danger" type="submit">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEmpAssets;

