import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DoctorDashboard = () => {
    const doctorName = localStorage.getItem("doctorName") || "Doctor";
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
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorDashboard;
