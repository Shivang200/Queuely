import { useEffect, useState } from "react";
import axios from "axios";

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const doctorId = localStorage.getItem("doctorId");

  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        console.log("Fetching upcoming appointments for doctor:", doctorId);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_URL}/appointment/confirmed/${doctorId}`,
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
        console.error("Error fetching upcoming appointments:", error.response?.data || error.message);
        setAppointments([]);
      }
    };

    if (doctorId) fetchUpcomingAppointments();
  }, [doctorId]);

  // Handle status update
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    if (!newStatus) return; // Prevent empty status update

    try {
      const timestamp = new Date().toISOString(); // Generate timestamp

      const response = await axios.put(
        `${import.meta.env.VITE_APP_URL}/appointment/${appointmentId}`,
        { status: newStatus, time: timestamp }, // Include timestamp in request
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
    

      console.log("Status updated:", response.data);
      // .map() loops through all appointments.
      //  Checks if appointment._id matches appointmentId.
      //  If it matches, creates a new object with updated status.
      //  If it doesn't match, returns the same object unchanged.
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Appointments</h2>
      {appointments.length === 0 ? (
        <p className="text-gray-600">No upcoming appointments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-900">{appointment.patient.name}</h3>
              <p className="text-gray-600"><strong>Email:</strong> {appointment.patient.email}</p>
              <p className="text-gray-600"><strong>Phone:</strong> {appointment.patient.phone}</p>
              <p className="text-gray-600"><strong>Appointment Date:</strong> {new Date(appointment.Date).toLocaleString()}</p>
              <p className="text-green-600 font-semibold mt-2">Status: {appointment.status}</p>

              {/* Status Update Section */}
              <div className="mt-4">
                <label className="block text-gray-700 font-semibold">Update Status:</label>
                <select
                  className="w-full p-2 border rounded-lg mt-2"
                  onChange={(e) => {
                    const selectedStatus = e.target.value;
                    setAppointments((prevAppointments) =>
                      prevAppointments.map((appt) =>
                        appt._id === appointment._id
                          ? { ...appt, newStatus: selectedStatus }
                          : appt
                      )
                    );
                  }}
                  value={appointment.newStatus || ""}
                >
                  <option value="">Select</option>
                  <option value="confirmed" >Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>

                {/* Update Button */}
                <button
                  onClick={() =>
                    handleStatusUpdate(appointment._id, appointment.newStatus)
                  }
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  disabled={!appointment.newStatus} // Disable button if no status selected
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointments;
