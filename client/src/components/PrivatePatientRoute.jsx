import { Navigate, useLocation } from "react-router-dom";
import React from "react"; // Importing React library

const PrivatePatientRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  
         
 
  if (!role) return <Navigate to="/signin" />; // Redirect if no role is found
  if (role === "doctor") return <Navigate to="/" />; // Redirect doctors to home

     
  return children;
};

export default PrivatePatientRoute;