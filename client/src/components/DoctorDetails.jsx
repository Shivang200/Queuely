import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "./API";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [description, setDescription] = useState(""); 

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await API.get(
          `/appointment/doctor/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setDoctor(response.data.doctor);
      } catch (error) {
        setError("Failed to fetch doctor details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleBookAppointment = async () => {
    const patientId = localStorage.getItem("patientId");
    const doctorId = doctor._id;
    const date = appointmentDate;

    try {
      const response = await API.post(
        `/appointment/book`,
        { patientId, doctorId, date,description }, // Request body (data)
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert(response.data.msg);
      navigate("/userhome");
    } catch (error) {
      alert(
        "Failed to book appointment enter dates as mentioned :" +
          (error.response?.data?.msg || error.message)
      );
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  if (loading)
    return (
      <p className="text-center text-gray-600">Loading doctor details...</p>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-teal-700 p-4 flex justify-between items-center shadow-md">
        <h1
          className="text-white text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Queuely
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </nav>

      {/* Doctor Details Card */}
      <div className="flex justify-center items-center py-10 px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-teal-500 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-gray-900">
            {doctor.name}
          </h2>
          <p className="text-gray-600 mt-2">
            <strong className="text-teal-600">Speciality:</strong>{" "}
            {doctor.specialization}
          </p>
          <p className="text-gray-600">
            <strong className="text-teal-600">Clinic name:</strong>{" "}
            {doctor.clinicName || "Not Available"}
          </p>
          <p className="text-gray-600">
            <strong className="text-teal-600">Address:</strong>{" "}
            {doctor.clinicAddress}
          </p>
          <p className="text-gray-600">
            <strong className="text-teal-600">Available Time:</strong>{" "}
            {doctor.availableTimings || "Not Available"}
          </p>

          {/* Date Input - Manual entry on small screens, Calendar picker on large screens */}

          <input
            type="date"
            className="mt-4 px-4 py-2 border rounded-lg w-full "
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="Describe your symptoms (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-4 px-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-teal-600"
          />

          {/* Book Appointment Button */}
          <button
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition w-full"
            onClick={handleBookAppointment}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
