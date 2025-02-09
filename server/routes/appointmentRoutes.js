const express = require("express");
const mongoose=require('mongoose')
const Appointment = require("../models/appointment");
const { authMiddleware, authRole } = require("../middlewares/authmiddleware");
const Patient = require("../models/patientModel");
const Doctor = require("../models/doctorModel");
const router = express.Router();

// Route to book an appointment
// authMiddleware- Patient books an appointment (only logged-in patients can book)
router.post("/book", async (req, res) => {
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
router.put("/:id",   async (req, res) => {
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
router.get("/pending/:doctorId",  async (req, res) => {
  try {
    const { doctorId } = req.params; // Extract doctor ID from URL

    // Find all appointments for the doctor, regardless of status
    const appointments = await Appointment.find({ doctor: doctorId, status:"pending" })
      .populate("patient", "name email phone") // Get patient details
      .sort({ date: 1, time: 1 }); // Sort by date & time

    res.status(200).json({ msg: "Doctor's full schedule retrieved", appointments });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});


  // to get all confirmed appointment of doctor
  // authrole- only receptionsist need to see all appointment of his doctor
router.get("/confirmed/:doctorId",  async (req, res) => {
    try {
      const { doctorId } = req.params; // Extract the doctor's ID from the request URL
  
      // Fetch all appointments where:
      // - The doctor field matches the given doctorId
      // - The status is "confirmed" (i.e., not pending or canceled)
      const appointments = await Appointment.find({ doctor: doctorId, status: "confirmed" })
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

router.get('/canceled/:doctorId',async(req,res)=>{
  try {
    const{doctorId}=req.params;

    const appointments = await Appointment.find({doctor:doctorId, status:"canceled"})
    .populate("patient", "name email phone") // Get related patient details (only name, email, phone)
        .sort({ date: 1, time: 1 }); // Sort appointments in ascending order of date & time
  
      // Send the retrieved appointments in the response
      res.status(200).json({ msg: "Appointments retrieved", appointments });


  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
})
  //router to get completed appointment

router.get('/completed/:doctorId',async(req,res)=>{
  try {
    const{doctorId}=req.params;

    const appointments = await Appointment.find({doctor:doctorId, status:"completed"})
    .populate("patient", "name email phone") // Get related patient details (only name, email, phone)
        .sort({ date: 1, time: 1 }); // Sort appointments in ascending order of date & time
  
      // Send the retrieved appointments in the response
      res.status(200).json({ msg: "Appointments retrieved", appointments });


  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
})

  // to delete a completed appointment manually (we also deleting it automatically using cron )auto delete in 7 days of completion
  
router.delete("/delete/:id",  async (req, res) => {
    try {
      const { id } = req.params;
  
      const appointment = await Appointment.findById(id);
      if (!appointment) {
        return res.status(404).json({ msg: "Appointment not found" });
      }
  
      if (appointment.status !== "completed" && appointment.status !== "canceled") {
        return res.status(400).json({ msg: "Only completed & canceled appointments can be deleted" });
      }
  
      await appointment.deleteOne();
      res.json({ msg: "Appointment deleted successfully" });
  
    } catch (error) {
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  });
  
  

module.exports = router;
