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

    // If validation fails, return a 400 error with the validation messages
    if (!response.success) {
      return res.status(400).json({
        msg: "invalid input", // Join all error messages into a string
      });
    }
    const existingUser = await Patient.findOne({ email: response.data.email });

    // If the user already exists, return a message
    if (existingUser) {
      return res.status(400).json({
        msg: "User already exists.",
      });
    }

    // If validation succeeds, extract the data
    const { name, phone, email, password } = response.data;

    // Hash the password before saving it
    //   bcrypt.hash(password, 10) hashes the user's password with a salt rounds of 10 (the higher the salt rounds, the stronger but slower the hash).he hashed password is then saved in the database instead of the plain-text password.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new patient
    const newPatient = new Patient({
      name,
      phone,
      email,
      password: hashedPassword,
      role: "patient",
    });

    // Save the patient to the database
    //   .create() does both the instantiation and saving in one step, whereas .save() requires you to first instantiate the object with new.
    await newPatient.save();

    // Create JWT token
    const token = jwt.sign(
      // This is the payload.
      // newPatient._id: This is the unique identifier (usually an auto-generated MongoDB ObjectId)
      // we are addingg role so jwt have role with the token and can be accessed for role based auth
      { userId: newPatient._id, role: newPatient.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return the success response with the JWT token
    res.status(201).json({
      message: "Patient registered successfully",
      token: token,
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
      return res.json({
        msg: "invalid input",
      });
    }

    const existingUser = await Doctor.findOne({ email: response.data.email });

    // If the user already exists, return a message
    if (existingUser) {
      return res.status(400).json({
        msg: "User already exists.",
      });
    }

    // If validation is successful, extract the data
    const {
      name,
      phone,
      email,
      password,
      specialization,
      clinicAddress,
      availableTimings,
    } = response.data;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new doctor in the database
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

    // Save the new doctor document to the database
    await newDoctor.save();

    // Create a JWT token for the doctor
    const token = jwt.sign(
      // we are addingg role so jwt have role with the token and can be accessed for role based auth
      { userId: newDoctor._id, role: newDoctor.role }, // Payload with doctor’s unique ID
      process.env.JWT_SECRET, // Secret key for signing the token
      { expiresIn: "1h" } // Token expiration (1 hour in this case)
    );

    // Return success response with the JWT token
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
