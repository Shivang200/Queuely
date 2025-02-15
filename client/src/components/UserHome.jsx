import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserHome = () => {
  const navigate = useNavigate();
  const patientId = localStorage.getItem("patientId");
  const patientName = localStorage.getItem("patientName");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchApprovedAppointments = async () => {
      console.log("Fetching appointments for patient:", patientId);
      
      try {
       const response = await axios.get(
          `${import.meta.env.VITE_APP_URL}/appointment/user/confirmed/${patientId}`,
          {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
          }
      );
    
       
        console.log("API Response:", response.data);
    
       
        const appointments = response.data?.appointments || [];
        
        const approvedAppointments = appointments.filter(
          (appointment) => appointment.status === "confirmed"
        );
    
        setAppointments(approvedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    if (patientId) fetchApprovedAppointments();
  }, [patientId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-teal-800 p-4 flex justify-between items-center shadow-md">
        <Link to="/" className="text-white text-2xl font-bold">
          Queuely
        </Link>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
          Logout
        </button>
      </nav>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Welcome to Queuely, {patientName}👋</h1>
        
        {/* Browse Doctors Button */}
        <div className="flex justify-center">
          <Link to="/userdashboard">
            <button className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition">
              Browse Doctors
            </button>
          </Link>
        </div>

        {/* Approved Appointments Section */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 ">Your Appointments</h2>
        <h2 className="text-xl  text-gray-500 mt-2 ">"Attend your appointment on time, or it will be canceled."</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-600 mt-2">No approved appointments yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-teal-500">
                <h3 className="text-lg font-semibold text-gray-900">from: {appointment.doctor.name}</h3>
                <p className="text-gray-600">
                  <strong>Date:</strong> {new Date(appointment.time).toLocaleString()}
                </p>
                <p className="text-gray-600">
                  <strong className="text-gray-600">Clinic name:</strong> {appointment.doctor.clinicName || "Not Available"}
                </p>
                <p className="text-gray-600">
                  <strong className="text-gray-600">Clinic address:</strong> {appointment.doctor.clinicAddress || "Not Available"}
                </p>
                <p className="text-green-600 font-semibold">Status: {appointment.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHome;
