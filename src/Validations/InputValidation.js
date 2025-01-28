export const validateBankName = (name) => {
  if (!name) {
    return "Bank name can't be empty";
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return "Bank name should be alphabetical";
  }
  return null;
};

export const validateAccountNumber = (number) => {
  if (!number) {
    return "Account number can't be empty";
  }
  if (!/^\d{9,18}$/.test(number)) {
    return "Account number must be numeric and between 9 to 18 digits";
  }
  return null;
};

export const validateIfscCode = (code) => {
  if (!code) {
    return "IFSC code can't be empty";
  }
  if (!/^[A-Za-z]{4}0\d{6}$/.test(code)) {
    return "IFSC code should follow the format ABCD0XXXXXX";
  }
  return null;
};

//----------------------Create Position file validations--------------

export function validateVacancy(vacancy) {
  const Regex = /^[0-9\s]*$/; // Allows only numbers and spaces
  const trimmedInput = String(vacancy).trim();
  if (!trimmedInput || trimmedInput.length === 0) {
    return "Vacancy cannot be empty";
  } else if (!Regex.test(trimmedInput)) {
    return "Vacancy should contain only numeric characters";
  } else {
    return null;
  }
}

export function validateExperience(value) {
  const numberRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)$/; // Allows integers, decimals, and floats
  const trimmedInput = String(value).trim();

  if (!trimmedInput || trimmedInput.length === 0) {
    return "Input cannot be empty";
  } else if (!numberRegex.test(trimmedInput)) {
    return "Input must be a valid number";
  } else {
    return null;
  }
}

export function validateRemote(remote) {
  if (remote != "") {
    return null;
  } else {
    return "Select any one";
  }
}

export function validateTechStack(techStack) {
  if (techStack.length != 0) {
    return null;
  } else {
    return "Select atleast one technology";
  }
}

//---------------------------------Common validations------------------------//

export function validateString(value) {
  const Regex = /^[a-zA-Z\s]+$/; // Allows only letters and spaces

  if (!value || value.trim().length === 0) {
    return "It cannot be empty";
  } else if (!Regex.test(value.trim())) {
    return "It should contain only letters and spaces";
  } else {
    return null;
  }
}

export function validateMobileNumber(mob) {
  const mobileRegex = /^[0-9]{10}$/; // Allows exactly 10 numeric digits
  const mobile = String(mob);
  if (!mobile || mobile.trim().length === 0) {
    return "Mobile number cannot be empty";
  } else if (!mobileRegex.test(mobile.trim())) {
    return "Mobile number must be numeric and 10 digits long";
  } else {
    return null;
  }
}

export function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Allows a valid email format
  const trimmedEmail = String(email).trim();

  if (!trimmedEmail || trimmedEmail.length === 0) {
    return "Email cannot be empty";
  } else if (!emailRegex.test(trimmedEmail)) {
    return "Invalid email format";
  } else {
    return null;
  }
}

export function validateNumber(input) {
  const numberRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)$/; // Allows integers, decimals, and floats
  const trimmedInput = String(input).trim();

  if (!trimmedInput || trimmedInput.length === 0) {
    return "Input cannot be empty";
  } else if (!numberRegex.test(trimmedInput)) {
    return "Input must be a valid number (integer or decimal)";
  } else {
    return null;
  }
}

export function validateNullCheck(value){
  if(value!==""){
    return null;
  }else{
    return "This field is required";  
  }
 }

 export function validateDate(value){
  if(value!==null){
    return null;
  }else{
    return "This field is required";  
  }
}

export function validateRadioButton(value) {
  if (value === "") {
    return "This field is required";
  } else {
    return null;
  }
}

export function validateInvoice(invoice) {
  if (invoice != "") {
    return null;
  } else {
    return "Accepts only pdf format";
  }
}

export function validateDateDuration(startDate, endDate) {
  // Convert input to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check if both start and end dates are valid
  if (isNaN(start) || isNaN(end)) {
    return "Both start and end dates must be valid dates";
  }

  // Check if start date is earlier than end date
  if (start >= end) {
    return "Start date must be earlier than end date";
  }
  // If all checks pass, return null indicating no errors
  return null;
}

export function validateAlphaNumeric(value) {
  const regex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/; //check alphanumeric value
  const trimmedInput = String(value).trim();

  if (!trimmedInput || trimmedInput.length === 0) {
    return "Input cannot be empty";
  } else if (!regex.test(trimmedInput)) {
    return "Input should contain only numbers and letters";
  } else {
    return null;
  }
}

export function validateGSTBill(bill){
  const regex=/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/; // check GST pattern
  const trimmedInput = String(bill).trim();

  if (!trimmedInput || trimmedInput.length === 0) {
    return "Input cannot be empty";
  } else if (!regex.test(trimmedInput)) {
    return "Input should be in proper format (Ex.- 29GYFUD1314R9Z7)";
  } else {
    return null;
  }
}
