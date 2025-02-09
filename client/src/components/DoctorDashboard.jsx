import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

const DoctorDashboard = () => {
  const doctorName = localStorage.getItem("doctorName") || "Doctor";
  const doctorId = localStorage.getItem("doctorId");

  const [stats, setStats] = useState({
    confirmed: 0,
    pending: 0,
    canceled: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/appointment/stats/${doctorId}`
        );
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching appointment stats:", error.response?.data || error.message);
      }
    };

    if (doctorId) fetchStats();
  }, [doctorId]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Queuely</h1>
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
  <div className={`bg-white shadow-lg rounded-lg p-6  border-l-4 border-${color}-500`}>
    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    <p className={`text-${color}-600 text-3xl font-bold`}>{count}</p>
  </div>
);

export default DoctorDashboard;

