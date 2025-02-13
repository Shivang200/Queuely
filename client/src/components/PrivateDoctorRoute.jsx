import { Navigate, useLocation } from "react-router-dom";
import React from "react"; // Importing React library

const PrivateDoctorRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  
         
  if(role=='patient'){

    return(
       <Navigate to={'/'} />
    )

  }
     
  return children;
};

export default PrivateDoctorRoute;