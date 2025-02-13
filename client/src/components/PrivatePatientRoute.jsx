import { Navigate, useLocation } from "react-router-dom";
import React from "react"; // Importing React library

const PrivatePatientRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  
         
  if(role=='doctor'){

    return(
       <Navigate to={'/'} />
    )

  }
     
  return children;
};

export default PrivatePatientRoute;