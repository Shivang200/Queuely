import { useEffect, useState } from "react";
import axios from "axios";

const CanceledAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const doctorId = localStorage.getItem("doctorId");

  useEffect(() => {
    const fetchCancelledAppointments = async () => {
      try {
        console.log("Fetching cancelled appointments for doctor:", doctorId);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_URL}/appointment/canceled/${doctorId}`,
          {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
          }
      );
      

        console.log("API Response:", response.data);

        if (Array.isArray(response.data.appointments)) {
          setAppointments(response.data.appointments);
        } else {
          setAppointments([]);
          console.error("Unexpected API response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching cancelled appointments:", error.response?.data || error.message);
        setAppointments([]);
      }
    };

    if (doctorId) fetchCancelledAppointments();
  }, [doctorId]);

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_URL}/appointment/delete/${id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
    
//       The appointment is deleted in the database,
// But it will still appear on the screen until the page is refreshed.
// That’s why we manually update the UI using .filter(), so the deleted item disappears instantly from the screen.
      setAppointments((prev) => prev.filter((appointment) => appointment._id !== id));
      console.log("Appointment deleted successfully");
    } catch (error) {
      console.error("Error deleting appointment:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cancelled Appointments</h2>
      {appointments.length === 0 ? (
        <p className="text-gray-600">No cancelled appointments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-red-500">
              <h3 className="text-lg font-semibold text-gray-900">{appointment.patient.name}</h3>
              <p className="text-gray-600"><strong>Email:</strong> {appointment.patient.email}</p>
              <p className="text-gray-600"><strong>Phone:</strong> {appointment.patient.phone}</p>
              <p className="text-gray-600"><strong>Appointment Date:</strong> {new Date(appointment.Date).toLocaleString()}</p>
              <p className="text-red-600 font-semibold mt-2">Status: {appointment.status}</p>

              <button
                onClick={() => handleDeleteAppointment(appointment._id)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CanceledAppointments;
