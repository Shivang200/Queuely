const mongoose = require('mongoose')

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
      type: String,
      default: "patient",
    },
}, { timestamps: true });

module.exports = mongoose.model("Patient", PatientSchema);

