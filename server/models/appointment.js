const mongoose = require("mongoose");
const { object } = require("zod");

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,ref:"Patient",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,ref:"Doctor",
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    // required: true
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "canceled","completed"],
    default: "pending",
  },
},{timestamps:true});
const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;

// mongoose.Schema.Types.ObjectId	This means that the patient field will store a unique MongoDB ObjectId (which refers to a document in another collection).
// ref: "Patient"	This tells Mongoose that this ObjectId refers to a document in the Patient collection. Mongoose will use this to fetch full patient details when using .populate().