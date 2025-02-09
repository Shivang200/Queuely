import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Role = () => {
  const [role, setRole] = useState(""); // State to store the selected role
  const navigate = useNavigate(); // Hook for navigating to different routes

  const handleSelect = (event) => {
    const selectedRole = event.target.value; // Get selected role from dropdown
    setRole(selectedRole); // Update state with the selected role

    // Redirect user to the respective signup page based on role selection
    if (selectedRole === "user") {
      navigate("/user-signup"); // Navigate to User Signup
    } else if (selectedRole === "doctor") {
      navigate("/doctor-signup"); // Navigate to Doctor Signup
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-white p-6 rounded-lg shadow-xl w-80">
        <h2 className="text-2xl font-semibold text-teal-700 text-center mb-4">
          Select Your Role
        </h2>
        <select
          value={role}
          onChange={handleSelect}
          className="w-full p-3 border-2 border-gray-400 rounded-md text-black 
             focus:outline-none focus:border-teal-500 
             hover:border-teal-500 transition duration-200 text-lg"
        >
          <option value="" disabled>Select an option</option>
          <option className="text-teal-800" value="user">User</option>
          <option className="text-teal-800" value="doctor">Doctor</option>
        </select>
      </div>
    </div>
  );
};

export default Role;
