const mongoose = require("mongoose");
const DoctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    clinicAddress: { type: String, required:true },
    availableTimings: { type: String,required:true },

    // no need to add roles but have to add to make the roles based auth part esy
    role: {
      type: String,
      default: "doctor",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", DoctorSchema);
