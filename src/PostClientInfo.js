import React, { useState } from 'react';
import axios from 'axios';
import {toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import LoadingPage from './LoadingPage'

export default function Saveclientinfo() {
  // const token = localStorage.getItem("response-token");
  const  token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    Companyname: "",
    Address: "",
    number: "",
    Email: "",
    Cperson: "",
    GST: "",
  });


  function submit(e) {
    e.preventDefault();
    setLoading(true); 
    axios.post(`/apigateway/expenseManagement/clientInfo/saveClientInfo`, {
      companyName: data.Companyname,
      address: data.Address,
      phone: data.number,
      email: data.Email,
      contactPerson: data.Cperson,
      gstin: data.GST

    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    ).then((response) => {
      console.log(response);
      toast.success("Client info created Successfully!!", { position: "top-center", theme: "colored" });
      setLoading(false); 
    }).catch((error) => {
      toast.error( error.response.data.message || "Error creating details" );
      console.log(error)
      setLoading(false); 

    })
  }
  function handle(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setData(newdata);
    console.log(newdata);
  }
  return (
    <>
      <div className='container pt-3'>
      {loading ? <LoadingPage/> : ''}
        <div className='row'>
          <div className='col-lg-8 col-md-10 mx-auto'>
            <div className='card border-0 shadow'style={{width:'810px',height:'750px'}}>
              <div className='card-body'>
                <form className='container py-3  mb-3' onSubmit={(e) => { submit(e) }} >
                  <div className="row mb-3">
                    <label htmlFor="Company Name " className="col-sm-2 col-form-label" name='Companyname'>Company Name </label>
                    <div className="col-sm-10">
                      <input onChange={(e) => { handle(e) }} value={data.Companyname}
                        type="text "
                        id="Companyname"
                        step='0.1' placeholder='Enter Your  Company Name'
                        className="form-control" />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label htmlFor="Address" className="col-sm-2 col-form-label" name='Address'>Address</label>
                    <div className="col-sm-10">
                      <input onChange={(e) => { handle(e) }} value={data.Address}
                        type="text" className="form-control"
                        id="Address" placeholder='Enter Address..' />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="Phone" className="col-sm-2 col-form-label" name='number'>Number</label>
                    <div className="col-sm-10">
                      <input onChange={(e) => { handle(e) }} value={data.number}
                        type="number" className="form-control"
                        id="number" placeholder='Enter Phone Number...' />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="Email" className="col-sm-2 col-form-label" name="Email">Email</label>
                    <div className="col-sm-10">
                      <input onChange={(e) => { handle(e) }} value={data.Email}
                        type="email" className="form-control"
                        placeholder='Enter Email...'
                        id="Email" />
                    </div>
                  </div>


                  <div className="row mb-3">
                    <label htmlFor="Contact Person  " className="col-sm-2 col-form-label" name='Cperson'>Contact Person </label>
                    <div className="col-sm-10">
                      <input onChange={(e) => { handle(e) }} value={data.Cperson}
                        type="text "
                        id="Cperson"
                        step='0.1' placeholder='Contact person'
                        className="form-control" />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="GST  " className="col-sm-2 col-form-label" name='GST'>GST-IN </label>
                    <div className="col-sm-10">
                      <input onChange={(e) => { handle(e) }} value={data.GST}
                        type="text "
                        id="GST"
                        step='0.1' placeholder='Enter GST Number...'
                        className="form-control" />
                    </div>
                  </div>
                  <div className="d-grid gap-2 col-6 mx-auto">
                    <button className="btn btn-outline-danger" type="submit">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}