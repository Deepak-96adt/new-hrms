import * as Yup from 'yup';

export const registerUserSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("First name is required")
      .matches(/^[a-zA-Z]+$/, "First name can only contain letters")
      .max(30, "First name must be at most 30 characters long"),
    middleName: Yup.string()
      .matches(/^[a-zA-Z]*$/, "Middle name can only contain letters")
      .max(30, "Middle name must be at most 30 characters long"),
    lastName: Yup.string()
      .required("Last name is required")
      .matches(/^[a-zA-Z]+$/, "Last name can only contain letters")
      .max(30, "Last name must be at most 30 characters long"),
    email: Yup.string()
      .email("Invalid email address")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|co\.in|in)$/,
        "Email must be a valid address ending with .com, .co.in, or .in"
      )
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    employeeType: Yup.string().required("Employee type is required"),
  });