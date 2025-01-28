import * as yup from 'yup';
export const clientInfoSchema = yup.object().shape({
    // Companyname: yup.string().required('Company Name is required'),
    Companyname: yup.string().matches(/^^[A-Za-z]+$/,'It should contain only letters and spaces').required('Company Name is required'),
    Address: yup.string().matches(/^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/,'Input should contain only numbers and letters').required('Address is required'),
    number: yup.string().matches(/^[0-9]{10}$/, 'Mobile number must be numeric and 10 digits long').required('Phone Number is required'),
    Email: yup.string().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Invalid Email').required('Email is required'),
    Cperson: yup.string().matches(/^^[A-Za-z]+$/,'It should contain only letters and spaces').required('Contact Person is required'),
    GST: yup.string().matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/, 'Input should be in proper format (Ex.- 29GYFUD1314R9Z7)').required('GST-IN is required'),
});
