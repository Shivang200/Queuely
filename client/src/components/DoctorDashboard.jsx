import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

const DoctorDashboard = () => {
  const doctorName = localStorage.getItem("doctorName") || "Doctor";
  const doctorId = localStorage.getItem("doctorId");
  const navigate = useNavigate();

  //for stat card
  const [stats, setStats] = useState({
    confirmed: 0,
    pending: 0,
    canceled: 0,
    completed: 0,
  });

  useEffect(() => {
    // Function to fetch appointment statistics for the doctor
    const fetchStats = async () => {
      try {
        // Sending GET request to fetch appointment statistics for the doctor
        const response = await axios.get(
          `http://localhost:5000/appointment/stats/${doctorId}`
        );
        setStats(response.data); // Updating the stats state with fetched data
      } catch (error) {
        // Logging any error that occurs during the fetch process
        console.error("Error fetching appointment stats:", error.response?.data || error.message);
      }
    };
  
    // Ensuring the API request is only made when doctorId is available (not null or undefined)
    if (doctorId) fetchStats();
  }, [doctorId]); // Runs the effect whenever doctorId changes

  // Logout function
  const handleLogout = () => {
    localStorage.clear(); // Clear localStorage
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        {/* Header Section with Logout Button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Queuely</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-teal-700">
            Welcome, {doctorName} 👋
          </h1>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard title="Confirmed" count={stats.confirmed} color="blue" />
          <StatCard title="Pending" count={stats.pending} color="yellow" />
          <StatCard title="Canceled" count={stats.canceled} color="red" />
          <StatCard title="Completed" count={stats.completed} color="green" />
        </div>

        <Outlet />
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, count, color }) => (
  <div className={`bg-white shadow-lg rounded-lg p-6 border-l-4 border-${color}-500`}>
    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    <p className={`text-${color}-600 text-3xl font-bold`}>{count}</p>
  </div>
);

export default DoctorDashboard;
