import axios from 'axios'
import { useFormik } from 'formik'
import React from 'react'
import { toast } from 'react-toastify';
import handleAuthError from './CommonErrorHandling';

// import { CreatePostitionSchema } from './Validations/createpositionyup'
const CreatePositionformik = () => {
    const formik = useFormik({
        initialValues: {
            techid: "",
            positionopendate: "",
            positionclosedate: "",
            status: "",
            experienceInYear: "",
            positionType: "",
            remote: ""
        },
        // validationSchema: CreatePostitionSchema,
        onSubmit: (values, Action) => {
            console.log(values);
            axios.post(`/apigateway/hrms/interview/savePosition`, {
                techid: values.techid,
                positionopendate: values.positionopendate,
                status: values.status,
                experienceInYear: values.experienceInYear,
                positionType: values.positionType,
                remote: values.remote
            }).then((response) => {
                console.log(response)
                toast.success("Position created successfully.", { position: 'top-center', theme: "colored" })
            }).catch((error) => {
                handleAuthError(error);
                console.log(error)
                // toast.error("error occured in creating position try after sometime.", { position: 'top-center', theme: "colored" })
            })
            Action.resetForm();
        },
    })
    return (
        <div><div className='container pt-3'>
            <div className='row'>
                <div className='col-lg-8 col-md-10 mx-auto'>
                    <div className='card border-0 shadow'>
                        <div className='card-body'>
                            <form className='container py-3  mb-3' onSubmit={formik.handleSubmit}>
                                <div className="row mb-3">
                                    <label htmlFor="inputEmail3" className="col-sm-2 col-form-label" name='experienceInYear'>Experience in years</label>
                                    <div className="col-sm-10">
                                        <input
                                            name='experienceInYear'
                                            type="number"
                                            id="experienceInYear"
                                            step='0.1' placeholder='enter your experience in years'
                                            className={`form-control ${formik.touched.experienceInYear && formik.errors.experienceInYear ? 'is-invalid' : ''}`}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.experienceInYear} />
                                        {formik.touched.experienceInYear && formik.errors.experienceInYear ? (
                                            <div className='invalid-feedback'>{formik.errors.experienceInYear}</div>
                                        ) : null
                                        }
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label" name='positionclosedate'>Position close date</label>
                                    <div className="col-sm-10">
                                        <input
                                            name='positionclosedate'
                                            id="positionclosedate"
                                            type="date"
                                            className={`form-control ${formik.touched.positionclosedate && formik.touched.positionclosedate ? 'is-invalid' : ''}`}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.positionclosedate} />

                                        {formik.touched.positionclosedate && formik.errors.positionclosedate ? (
                                            <div className='invalid-feedback'>{formik.errors.positionclosedate}</div>
                                        ) : null
                                        }

                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label" name='positionopendate'>Position open date</label>
                                    <div className="col-sm-10">
                                        <input
                                            id="positionopendate"
                                            name='positionopendate'
                                            type="date"
                                            className={`form-control ${formik.touched.positionopendate && formik.errors.positionopendate ? 'is-invalid' : ''}`}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.positionopendate}
                                        />

                                        {formik.touched.positionopendate && formik.errors.positionopendate ? (
                                            <div className='invalid-feedback'>{formik.errors.positionopendate}</div>
                                        ) : null}

                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label" name="positionType">Position type</label>
                                    <div className="col-sm-10">
                                        <input
                                            id="positionType"
                                            type="text"
                                            name='positionType'
                                            placeholder='enter your position type'
                                            className={`form-control ${formik.touched.positionType && formik.errors.positionType ? 'is-invalid' : ''}`}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.positionType} />

                                        {formik.touched.positionType && formik.errors.positionType ? (
                                            <div className="invalid-feedback">{formik.errors.positionType}</div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label" name="status">Status</label>
                                    <div className="col-sm-10">
                                        <input
                                            id="status"
                                            type="text"
                                            name="status"
                                            placeholder='enter your status'
                                            className={`form-control ${formik.touched.status && formik.errors.status ? 'is-invalid' : ''}`}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.status} />
                                        {formik.touched.status && formik.errors.status ? (<div className="invalid-feedback">{formik.errors.status}</div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label" name='techid'>Tech Id</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="number"
                                            placeholder='enter your tech id'
                                            id="techid"
                                            name='techid'
                                            className={`form-control ${formik.touched.techid && formik.errors.techid ? 'is-invalid' : ''}`}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.touched.techid && formik.errors.techid} />
                                        {formik.touched.techid && formik.errors.techid ? (<div className="invalid-feedback">{formik.errors.techid}</div>
                                        ) : null}
                                    </div>
                                </div>
                                <fieldset className="row mb-3">
                                    <legend className="col-form-label col-sm-2 pt-0">Remote</legend>
                                    <div className="col-sm-10">

                                        <div className="form-check form-check-inline">
                                            <input onChange={(event) => { formik.setFieldValue("remote", true) }}
                                                onBlur={formik.handleBlur}
                                                checked={formik.values.remote === true}
                                                className={`form-check-input ${formik.touched.remote && formik.errors.remote ? "is-invalid" : ''}`}
                                                type="radio"
                                                name="inlineRadioOptions"
                                                id="remote"
                                                value="true" />

                                            {formik.touched.remote && formik.errors.remote ? (<div className="invalid-feedback">{formik.errors.remote}</div>) : null}

                                            <label className="form-check-label" htmlFor="inlineRadio1" name='inlineRadioOptions'>Yes</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input onChange={(event) => { formik.setFieldValue("remote", false) }}
                                                onBlur={formik.handleBlur}
                                                checked={formik.values.remote === false}
                                                className={`form-check-input ${formik.touched.remote && formik.errors.remote ? "is-invalid" : ''}`}
                                                type="radio"
                                                name="inlineRadioOptions"
                                                id="remote"
                                                value="false" />

                                            {formik.touched.remote && formik.errors.remote ? (<div className="invalid-feedback">{formik.errors.remote}</div>) : null}

                                            <label className="form-check-label" htmlFor="inlineRadio2" name='inlineRadioOptions'>No</label>
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
        </div>
    )
}

export default CreatePositionformik