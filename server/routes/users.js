const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const zod = require("zod"); // Import Zod for validation
const Patient = require("../models/patientModel");
const Doctor = require("../models/doctorModel");
require("dotenv").config();

const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

const router = express.Router();

const patientValidate = zod.object({
  name: zod.string(),
  phone: zod.string(),
  email: zod.string().email(),
  password: zod.string(),
});
const SigninDetails = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});
const doctorValidate = zod.object({
  name: zod.string(), // Ensure name is provided
  phone: zod.string(), // Validate phone number format
  email: zod.string().email(), // Ensure valid email format
  password: zod.string(), // Password length validation
  specialization: zod.string(), // Ensure specialization is provided
  clinicAddress: zod.string(), // Optional field for clinic details
  availableTimings: zod.string() // Optional field for available timings
});

// POST route to handle admin login
router.post("/admin-login", (req, res) => {
  // Destructure email and password from the request body
  const { email, password } = req.body;
  console.log("Provided email:", email);
  console.log("Provided password:", password);
  // Check if the provided email and password match the stored admin credentials
  if (
    email === ADMIN_CREDENTIALS.email && // Check if the provided email matches the stored email
    password === ADMIN_CREDENTIALS.password // Check if the provided password matches the stored password
  ) {
    // If credentials match, generate a JWT token with the role "admin"
    const token = jwt.sign(
      //adding userid because bescause it needed for authmiddleware func
      { userId: "admin123", role: "admin" }, // The payload containing the admin role
      process.env.JWT_SECRET, // Use the JWT secret from environment variables to sign the token
      { expiresIn: "1h" } // Set the token's expiration time to 1 hour
    );

    // Return a success message with the generated JWT token
    res.json({ message: "Admin login successful", token });
  } else {
    // If the credentials don't match, return a 401 Unauthorized status with an error message
    res.status(401).json({ message: "Invalid credentials" });
  }
});

router.post("/signup/patient", async (req, res) => {
  try {
    const patientDetails = req.body;

    // Validate input using Zod's safeParse
    const response = patientValidate.safeParse(patientDetails);

    if (!response.success) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const { name, phone, email, password } = response.data;

    // 🔍 Check if email OR phone already exists
    const existingUser = await Patient.findOne({
      $or: [{ email: email }, { phone: phone }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email is already registered." });
      }
      if (existingUser.phone === phone) {
        return res.status(400).json({ error: "Phone number is already registered." });
      }
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new patient
    const newPatient = new Patient({
      name,
      phone,
      email,
      password: hashedPassword,
      role: "patient",
    });

    await newPatient.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newPatient._id, role: newPatient.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Patient registered successfully",
      token,
      userId: newPatient._id,
      name: newPatient.name,
      role: newPatient.role,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/signup/doctor", async (req, res) => {
  try {
    const doctorDetails = req.body;
    const response = doctorValidate.safeParse(doctorDetails);

    if (!response.success) {
      return res.status(400).json({ msg: "Invalid input" });
    }

    // Check if email or phone already exists
    const existingUser = await Doctor.findOne({
      $or: [{ email: response.data.email }, { phone: response.data.phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        msg: existingUser.email === response.data.email
          ? "Email already exists."
          : "Phone number already exists.",
      });
    }

    // Extract validated fields
    const {
      name,
      phone,
      email,
      password,
      specialization,
      clinicAddress,
      availableTimings,
    } = response.data;

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new doctor
    const newDoctor = new Doctor({
      name,
      phone,
      email,
      password: hashedPassword,
      specialization,
      clinicAddress,
      availableTimings,
      role: "doctor",
    });

    // Save to database
    await newDoctor.save();

    // Generate JWT Token
    const token = jwt.sign(
      { userId: newDoctor._id, role: newDoctor.role }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration
    );

    // Send response with token
    res.status(201).json({
      message: "Doctor registered successfully",
      token,
      userId: newDoctor._id,
      name: newDoctor.name,
      role: newDoctor.role,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/signin", async (req, res) => {
  const { email, password, role } = req.body; // Extract role, email, and password from request body
  const response = SigninDetails.safeParse({ email, password, role });

  if (!response.success) {
    return res.json({ msg: "Invalid input." });
  }

  try {
    let UserModel; // Variable to store the correct model

    // Select the appropriate model based on role
    if (role === "doctor") {
      UserModel = Doctor;
    } else if (role === "patient") {
      UserModel = Patient;
    } else {
      return res.status(400).json({ msg: "Invalid role provided." });
    }

    // Find the user in the correct collection
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    // Compare the password using bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ msg: "Invalid password." });
    }

    // Generate JWT token with role for authorization
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    // Use jwt.sign() to generate a secure token with user data.
    // Use res.json() to send the token to the frontend.
    res.json({
      msg: "Login successful",
      token,
      role: role, //  Make sure this is included!
      userId: user._id,
      name: user.name,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "An error occurred during login." });
  }
});

module.exports = router;
