import { useEffect, useState } from "react";
import axios from "axios";

const PendingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const doctorId = localStorage.getItem("doctorId"); // Get doctor ID from localStorage

  useEffect(() => {
    const fetchPendingAppointments = async () => {
      try {
        console.log("Fetching pending appointments for doctor:", doctorId);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_URL}/appointment/pending/${doctorId}`,
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
        console.error(
          "Error fetching pending appointments:",
          error.response?.data || error.message
        );
        setAppointments([]);
      }
    };

    if (doctorId) fetchPendingAppointments();
  }, [doctorId]);

  // Handle status change
  const handleStatusUpdate = async (
    appointmentId,
    newStatus,
    selectedTime = ""
  ) => {
    try {
      const updateData = {
        status: newStatus,
        time: selectedTime || new Date().toISOString(), // Default to current timestamp
      };

      const response = await axios.put(
        `${import.meta.env.VITE_APP_URL}/appointment/${appointmentId}`,
        updateData,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
    

      console.log("Status updated:", response.data);

      // Update UI after successful update
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? {
                ...appointment,
                status: newStatus,
                time: selectedTime || appointment.time,
              }
            : appointment
        )
      );
    } catch (error) {
      console.error(
        "Error updating status:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Pending Appointments
      </h2>
      {appointments.length === 0 ? (
        <p className="text-gray-600">No pending appointments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-teal-500"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {appointment.patient.name}
              </h3>
              <p className="text-gray-600">
                <strong>Email:</strong> {appointment.patient.email}
              </p>
              <p className="text-gray-600">
                <strong>Phone:</strong> {appointment.patient.phone}
              </p>
              <p className="text-gray-600">
                <strong>Appointment Date:</strong>{" "}
                {new Date(appointment.Date).toLocaleString()}
              </p>
              <p className="text-yellow-600 font-semibold mt-2">
                Status: {appointment.status}
              </p>

              {/* Status Update Section */}
              <div className="mt-4">
                <label className="block text-gray-700 font-semibold">
                  Update Status:
                </label>
                <select
                  className="w-full p-2 border rounded-lg mt-2"
                  onChange={(e) => {
                    const selectedStatus = e.target.value;
                    setAppointments((prevAppointments) =>
                      prevAppointments.map((appt) =>
                        appt._id === appointment._id
                          ? {
                              ...appt,
                              newStatus: selectedStatus,
                              confirmedTime: "",
                            }
                          : appt
                      )
                    );
                  }}
                  value={appointment.newStatus || ""}
                >
                  <option value="">Select</option>

                  <option value="confirmed">Confirmed</option>
                  <option value="canceled">Canceled</option>
                  <option value="completed">completed</option>
                </select>

                {/* Show Time Input if Confirmed is selected */}
                {appointment.newStatus === "confirmed" && (
                  <input
                    type="datetime-local"
                    className="w-full p-2 border rounded-lg mt-2"
                    onChange={(e) => {
                      const selectedTime = e.target.value;
                      setAppointments((prevAppointments) =>
                        prevAppointments.map((appt) =>
                          appt._id === appointment._id
                            ? { ...appt, confirmedTime: selectedTime }
                            : appt
                        )
                      );
                    }}
                  />
                )}

                <button
                  onClick={() =>
                    handleStatusUpdate(
                      appointment._id,
                      appointment.newStatus,
                      appointment.confirmedTime
                    )
                  }
                  className="mt-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                  disabled={
                    !appointment.newStatus ||
                    (appointment.newStatus === "confirmed" &&
                      !appointment.confirmedTime)
                  }
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

export default PendingAppointments;
