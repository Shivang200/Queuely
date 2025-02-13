const express = require("express");
const mongoose = require("mongoose");
const Appointment = require("../models/appointment");
 const { authMiddleware, authRole } = require("../middlewares/authmiddleware");
const Patient = require("../models/patientModel");
const Doctor = require("../models/doctorModel");
const router = express.Router();

// Route to book an appointment
// authMiddleware- Patient books an appointment (only logged-in patients can book)
router.post("/book", authMiddleware,authRole(["patient"]), async (req, res) => {
  try {
    const { patientId, doctorId, date } = req.body;
    // Log IDs to see their format
    console.log("Patient ID:", patientId);
    console.log("Doctor ID:", doctorId);

    // Validate required fields
    if (!patientId || !doctorId || !date) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const patientObjectId = new mongoose.Types.ObjectId(patientId);
    const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

    // Check if the patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    // Check if the doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    // Create the appointment
    const newAppointment = new Appointment({
      patient: patientObjectId,
      doctor: doctorObjectId,
      Date: new Date(date),

      status: "pending", // Default status is "pending"
    });

    // Save to the database
    await newAppointment.save();

    res.status(201).json({
      msg: "Appointment request sent successfully, wait for sometime.",
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// here receptionist updates the appointment by updating time and status
// authrole-Receptionist updates appointment (only receptionists can modify)
router.put("/:id",authMiddleware,authRole(["doctor"]) ,async (req, res) => {
  try {
    const { time, status } = req.body; // Time and status are provided by the receptionist

    // Validate that both time and status are provided
    if (!time || !status) {
      return res.status(400).json({ msg: "Time and status are required" });
    }

    // Find the appointment by ID
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    // Update the appointment with time and status
    appointment.time = new Date(time); // Set the time
    appointment.status = status; // Set the status (confirmed, etc.)

    // Save the updated appointment
    await appointment.save();

    res.status(200).json({
      msg: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

//route to get all appointment of all status
// Get all appointments for a doctor (pending statuses)
router.get("/pending/:doctorId",authMiddleware,authRole(["doctor"]), async (req, res) => {
  try {
    const { doctorId } = req.params; // Extract doctor ID from URL

    // Find all appointments for the doctor, regardless of status
    const appointments = await Appointment.find({
      doctor: doctorId,
      status: "pending",
    })
      .populate("patient", "name email phone") // Get patient details
      .sort({ date: 1, time: 1 }); // Sort by date & time

    res
      .status(200)
      .json({ msg: "Doctor's full schedule retrieved", appointments });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// to get all confirmed appointment of doctor
// authrole- only receptionsist need to see all appointment of his doctor
router.get("/confirmed/:doctorId",authMiddleware,authRole(["doctor"]), async (req, res) => {
  try {
    const { doctorId } = req.params; // Extract the doctor's ID from the request URL

    // Fetch all appointments where:
    // - The doctor field matches the given doctorId
    // - The status is "confirmed" (i.e., not pending or canceled)
    const appointments = await Appointment.find({
      doctor: doctorId,
      status: "confirmed",
    })
      .populate("patient", "name email phone") // Get related patient details (only name, email, phone)
      .sort({ date: 1, time: 1 }); // Sort appointments in ascending order of date & time

    // Send the retrieved appointments in the response
    res.status(200).json({ msg: "Appointments retrieved", appointments });
  } catch (error) {
    // If an error occurs, send a 500 status with the error message
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

//router to get canceled appointment

router.get("/canceled/:doctorId",authMiddleware,authRole(["doctor"]), async (req, res) => {
  try {
    const { doctorId } = req.params;

    const appointments = await Appointment.find({
      doctor: doctorId,
      status: "canceled",
    })
      .populate("patient", "name email phone") // Get related patient details (only name, email, phone)
      .sort({ date: 1, time: 1 }); // Sort appointments in ascending order of date & time

    // Send the retrieved appointments in the response
    res.status(200).json({ msg: "Appointments retrieved", appointments });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});
//router to get completed appointment

router.get("/completed/:doctorId",authMiddleware,authRole(["doctor"]), async (req, res) => {
  try {
    const { doctorId } = req.params;

    const appointments = await Appointment.find({
      doctor: doctorId,
      status: "completed",
    })
      .populate("patient", "name email phone") // Get related patient details (only name, email, phone)
      .sort({ date: 1, time: 1 }); // Sort appointments in ascending order of date & time

    // Send the retrieved appointments in the response
    res.status(200).json({ msg: "Appointments retrieved", appointments });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// to delete a completed appointment manually (we also deleting it automatically using cron )auto delete in 7 days of completion

router.get("/stats/:doctorId",authMiddleware,authRole(["doctor"]), async (req, res) => {
  try {
    const { doctorId } = req.params; // Get doctor ID from request params

    // 🔢 Count the number of appointments for each status
    const confirmed = await Appointment.countDocuments({
      doctor: doctorId,
      status: "confirmed",
    });
    const pending = await Appointment.countDocuments({
      doctor: doctorId,
      status: "pending",
    });
    const canceled = await Appointment.countDocuments({
      doctor: doctorId,
      status: "canceled",
    });
    const completed = await Appointment.countDocuments({
      doctor: doctorId,
      status: "completed",
    });

    // 📊 Send the stats as a JSON response
    res.json({ confirmed, pending, canceled, completed });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Server error" }); // Handle server errors
  }
});

router.get("/all/doctors", authMiddleware,authRole(["patient"]),async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json({
      msg: "doctors fetched",
      doctors,
    });
  } catch (error) {
    res.json({
      msg: "error",error:error.message
    });
  }
});

// Get a single doctor by ID
router.get("/doctor/:id",authMiddleware,authRole(["patient"]), async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    res.json({ msg: "Doctor fetched successfully", doctor });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});


//router to get a list of confirmed appointments in user

router.get("/user/confirmed/:patientId",authMiddleware,authRole(["doctor"]), async (req, res) => {
  try {
    const { patientId } = req.params;

    console.log("Received patientId:", patientId);

    const appointments = await Appointment.find({
      patient: new mongoose.Types.ObjectId(patientId), // Use 'patient' (not 'patientId')
      status: "confirmed",
    }).populate("doctor", "name specialization clinicAddress"); // Populate doctor details

    console.log("Matching appointments:", appointments);

    if (appointments.length === 0) {
      return res.json({ message: "No confirmed appointments found." });
    }

    res.json({ appointments });
  } catch (error) {
    console.error("Error fetching approved appointments:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/delete/:id",authMiddleware,authRole(["doctor"]), async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    if (
      appointment.status !== "completed" &&
      appointment.status !== "canceled"
    ) {
      return res
        .status(400)
        .json({ msg: "Only completed & canceled appointments can be deleted" });
    }

    await appointment.deleteOne();
    res.json({ msg: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
