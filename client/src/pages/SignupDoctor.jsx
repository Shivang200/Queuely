import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import { Link } from "react-router-dom";

const SignupDoctor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    specialization: "",
    clinicAddress: "",
    availableTimings: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    if (formData.email !== formData.email.toLowerCase()) {
      alert("Email must be in lowercase!");
      return;
    }
    e.preventDefault();
    try{
      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/user/signup/doctor`,
        formData
    );
    
    localStorage.setItem("doctorId", response.data.userId);
    localStorage.setItem("doctorName", response.data.name);
    
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      alert(response.data.message);
      navigate("/");
    } catch (error) {
      alert("Error: " + error.response?.data?.error || "Something went wrong");
    }

   
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-center text-teal-700 mb-5">
          Sign Up as a Professional
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              required
            />
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              required
            />
            <textarea
            type="text"
              name="clinicAddress"
              placeholder="Clinic address,city"
              value={formData.clinicAddress}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              required
            />
            <input
              type="text"
              name="availableTimings"
              placeholder="9 to 5"
              value={formData.availableTimings}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="text-teal-700 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupDoctor;