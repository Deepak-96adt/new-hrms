import { toast } from 'react-toastify';

export default function handleAuthError(error) {

    const rolearray = parseInt(localStorage.getItem("roleArray"));
    console.log(typeof rolearray);
    //if role array size is equal to 1 then login as user. 
    if (rolearray === 1) {
        console.log("Error occured", error)
        toast.error("You are not authorized to access this page.", { position: "top-center", theme: "colored" })
        //if role array size is equal to 2 then login as admin.
    } else if (rolearray === 2) {
        toast.error("Error,Try After Sometime.", { position: "top-center", theme: "colored" })
    }
    else {
        toast.error("Error while calling the API.", { position: "top-center", theme: "colored" });
    }

}

