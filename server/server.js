const express = require('express')
const mongoose = require('mongoose');
const cors = require("cors");
const userRoutes = require('./routes/users');
const appointmentRoutes = require("./routes/appointmentRoutes");
const { authMiddleware } = require('./middlewares/authmiddleware');
require('dotenv').config();
const app = express()

app.use(cors({
  origin: "http://localhost:5173", // Change this to your frontend URL
  methods: "GET,POST,PUT,DELETE",
  credentials: true, // Allow cookies if needed
}));
// app.use(authMiddleware)
app.use(express.json());
// http://localhost:5000/user/signup/doctor /signup/doctor is due to router.post('signup/doctor')
app.use('/user', userRoutes); 
app.use('/appointment',appointmentRoutes)

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });