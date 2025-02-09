import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", role: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.toLowerCase() }); // Ensuring role is in lowercase
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/user/signin", formData);
      console.log(response)
      
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);  // Store role for redirection
        
        alert(response.data.msg);
        
        // Redirect based on role
        if (response.data.role === "doctor") {
          localStorage.setItem("doctorId", response.data.userId);
          localStorage.setItem("doctorName", response.data.name);
          navigate("/doctordashboard");
        } else if (response.data.role === "patient") {
          navigate("/patient-dashboard");
          localStorage.setItem("patientId", response.data.userId);
          localStorage.setItem("patientName", response.data.name);
        } else {
          navigate("/"); // Default fallback
        }
      }
    } catch (error) {
      alert("Error: " + (error.response?.data?.msg || "Something went wrong"));
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            required
          >
            <option value="" disabled>Select Your Role</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
          <button
            type="submit"
            className="w-full p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
          >
            Sign In
          </button>
        </form>
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
