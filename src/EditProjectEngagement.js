import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom';
import LoadingPage from './LoadingPage'
import { useSelector } from 'react-redux';
const EditProjectEngagement = () => {
    // const token = localStorage.getItem("response-token");
    const  token = useSelector((state) => state.auth.token);
    const [loading, setLoading] = useState(false);
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({
        projectId:'',
        contractor: '',
        endClient: '',
        primaryResource: '',
        secondaryResource: '',
        startDate: '',
        endDate: '',
        status: ''
    });
    useEffect(() => {
        setLoading(true);
        axios.get(`/apigateway/hrms/engagement/ProjectEngagementDetailById/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            console.log(response.data)
            setData(response.data)
            setLoading(false); 
        }).catch((error) => {
            console.log(error.response.data);
            toast.error( error.response.data.message || "Error fetching details" );
            setLoading(false); 
        })
    }, []);

    function handleSubmit(e) {
        setLoading(true);
        e.preventDefault();
        axios.put(`/hrms/engagement/updateProjectEngagement/${projectId}`, {
            projectId:data.projectId,
            contractor: data.contractor,
            endClient: data.endClient,
            primaryResource: data.primaryResource,
            secondaryResource: data.secondaryResource,
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log(response);
            toast.success(response.data, { position: "top-center", theme: 'colored' });
            setLoading(false); 
        }).catch(error => {
            console.log(error);
            toast.error( error.response.data.message || "Error updating details" );
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
        <div className='container pt-3'>
             {loading ? <LoadingPage/> : ''}
            <div className='row'>
                <div className='col-md-8 mx-auto'>
                    <div className='card border-0 shadow' style={{ marginRight: '100px', width: '700px', height: '650px' }}>
                        <div className='card-body'>
                            <form className='container py-3 mb-3' onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label" name='projectId'>ID:</label>
                                    <div className="col-sm-10">
                                        <input disabled value={data.projectId || ''}
                                            type="text" className="form-control"
                                            id="projectId" />
                                    </div>
                                </div>
                                <div className='row mb-3 '>
                                    <label className='col-sm-2 col-form-label' name='contractor' >Contractor:</label>
                                    <div className='col-sm-10'>
                                        <input className='form-control' onChange={(e) => { handle(e) }}
                                            value={data.contractor}
                                            type='text' id='contractor'
                                            placeholder='Enter Contractor Name' >
                                        </input>
                                    </div>
                                </div>
                                <div className='row mb-3 '>
                                    <label className='col-sm-2 col-form-label' name='endClient' >End Client:</label>
                                    <div className='col-sm-10'>
                                        <input className='form-control' onChange={(e) => { handle(e) }}
                                            value={data.endClient}
                                            type='text' id='endClient'
                                            placeholder='Enter End Client'>
                                        </input>
                                    </div>
                                </div>
                                <div className='row mb-3 '>
                                    <label className='col-sm-2 col-form-label' name='primaryResource' >Primary Resource:</label>
                                    <div className='col-sm-10'>
                                        <input className='form-control' onChange={(e) => { handle(e) }}
                                            value={data.primaryResource}
                                            type='text' id='primaryResource'
                                            placeholder='Enter Primary Resource Name.'
                                        >

                                        </input>
                                    </div>
                                </div>
                                <div className='row mb-3 '>
                                    <label className='col-sm-2 col-form-label' name='secondaryResource' >Secondary Resource:</label>
                                    <div className='col-sm-10'>
                                        <input className='form-control' onChange={(e) => { handle(e) }}
                                            value={data.secondaryResource}
                                            type='text' id='secondaryResource'
                                            placeholder='Enter Secondary Resource Name.'
                                        >

                                        </input>
                                    </div>
                                </div>

                                <div className='row mb-3 '>
                                    <label className='col-sm-2 col-form-label' name='startDate' >Start Date:</label>
                                    <div className='col-sm-10'>
                                        <input className='form-control' onChange={(e) => { handle(e) }}
                                            value={data.startDate}
                                            type='date' id='startDate'>
                                        </input>
                                    </div>
                                </div>
                                <div className='row mb-3 '>
                                    <label className='col-sm-2 col-form-label' name='endDate' >End Date:</label>
                                    <div className='col-sm-10'>
                                        <input className='form-control' onChange={(e) => { handle(e) }} value={data.endDate}
                                            type='date' id='endDate' >

                                        </input>
                                    </div>
                                </div>
                                <fieldset className="row mb-3">
                                    <legend className="col-form-label col-sm-2 pt-0">IsActive</legend>
                                    <div className="col-sm-10">
                                        <div className="form-check form-check-inline">
                                            <input checked={data.isActive === true} value={true || ''} onChange={e => setData({ ...data, isActive: true })} className="form-check-input" type="radio" name="inlineRadioOptions" id="true" />
                                            <label className="form-check-label" htmlFor="true">Yes</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input checked={data.isActive === false} value={false || ''} onChange={e => setData({ ...data, isActive: false })} className="form-check-input" type="radio" name="inlineRadioOptions" id="false" />
                                            <label className="form-check-label" htmlFor="false">No</label>
                                        </div>
                                    </div>
                                </fieldset>
                                <div className="d-grid gap-2 col-6 mx-auto">
                                    <button className="btn btn-outline-danger" type="submit">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProjectEngagement