import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation and useNavigate for redirection
import axios from "axios"; // Import axios for API requests

const Signin = () => {
  const navigate = useNavigate(); // Hook for navigation after login
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  // Handles input changes and updates formData state
  const handleChange = (e) => {
    setFormData({ 
      ...formData, // Keep all the existing values
      [e.target.name]: e.target.value.toLowerCase() // Update only the field being changed
//       User types "John@example.com" in the email field
//  e.target.name = "email" ,[e.target.name] → Updates only the field that changed.
//  e.target.value = "John@example.com"
//  The function updates only the email in formData:
    });
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page refresh

    try {
      // Sends login data to the backend
      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/user/signin`,
        formData
    );
    
      console.log(response); // Logs response for debugging

      if (response.data && response.data.token) {
        // Store authentication token in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role); // Store role for redirection

        alert(response.data.msg); // Show success message

        // Redirect user based on their role
        if (response.data.role === "doctor") {
          localStorage.setItem("doctorToken", response.data.token);
          localStorage.setItem("doctorId", response.data.userId); // Store doctor ID
          localStorage.setItem("doctorName", response.data.name); // Store doctor name
          navigate("/doctordashboard"); // Redirect to doctor dashboard
        } else if (response.data.role === "patient") {
          localStorage.setItem("patientToken", response.data.token);
          localStorage.setItem("patientId", response.data.userId); // Store patient ID
          localStorage.setItem("patientName", response.data.name); // Store patient name
          navigate("/userhome"); // Redirect to patient dashboard
        } else {
          navigate("/"); // Redirect to home page as fallback
        }
      }
    } catch (error) {
      // Show error message if login fails
      alert("Error: " + (error.response?.data?.msg || "Something went wrong"));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">
          Sign In
        </h2>

        {/* Sign-in Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            required
          />

          {/* Password Input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            required
          />

          {/* Role Selection */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            required
          >
            <option value="" disabled>
              Select Your Role
            </option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>

          {/* Sign-in Button */}
          <button
            type="submit"
            className="w-full p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
          >
            Sign In
          </button>
        </form>

        {/* Sign-up Link */}
        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link to="/role" className="text-teal-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
