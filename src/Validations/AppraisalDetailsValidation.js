import * as Yup from 'yup';
export const AppraisalSchema = Yup.object().shape({
    year: Yup.string()
        .required('Select year'),
    empId: Yup.string()
        .required('Emp ID is required'),
    month: Yup.string()
        .required('Select month'),
    appraisalDate: Yup.string()
        .required('Select Date'),
    amount: Yup.number()
        .required('Amount is required.'),
    salary: Yup.number()
        .required('Salary is required'),
    rewardType: Yup.string()
        .required('Reward type Required.'),
});