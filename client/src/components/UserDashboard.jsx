import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_URL}/appointment/all/doctors`,
          {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
          }
      );
      
        setDoctors(response.data.doctors);
      } catch (error) {
        setError("Failed to fetch doctors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.clear(); // Clear user data
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-teal-800 p-4 flex justify-between items-center shadow-md">
        <Link to="/" className="text-white text-2xl font-bold">Queuely</Link>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
          Logout
        </button>
      </nav>

      <div className="p-6">
        <h1 className="text-3xl font-bold text-teal-900 mb-6 text-center">Available Doctors</h1>

        {loading && <p className="text-gray-600 text-center">Loading doctors...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {doctors.map((doctor) => (
            <Link to={`/doctor/${doctor._id}`} key={doctor._id}>
              <div className="bg-white shadow-lg shadow-teal-900/10 rounded-lg p-6 border-l-4 border-teal-600 hover:shadow-teal-300/20 transition-shadow cursor-pointer">
                <h2 className="text-xl font-semibold text-gray-900">{doctor.name}</h2>
                <p className="text-gray-600 mt-2">
                  <strong className="text-teal-600">Speciality:</strong> {doctor.specialization}
                </p>
                <p className="text-gray-600">
                  <strong className="text-teal-600">Clinic name:</strong> {doctor.clinicName || "Not Available"}
                </p>
                <p className="text-gray-600">
                  <strong className="text-teal-600">Address:</strong> {doctor.clinicAddress}
                </p>
                <p className="text-gray-600">
                  <strong className="text-teal-600">Available Time:</strong> {doctor.availableTimings || "Not Available"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
