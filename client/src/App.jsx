import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Role from "./components/Role";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import SignupDoctor from "./pages/SignupDoctor";
import PendingAppointments from "./components/PendingAppointments";
import UpcomingAppointments from "./components/UpcomingAppointments";
import CompletedAppointments from "./components/CompletedAppointment";
import CanceledAppointments from "./components/CanceledAppointment";
// import UpcomingAppointments from "./UpcomingAppointments";
// import CompletedAppointments from "./CompletedAppointments";
// import CancelledAppointments from "./CancelledAppointments";

import DoctorDashboard from "./components/DoctorDashboard";


const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/role" element={<Role />} />
      <Route path="/user-signup" element={<Signup/>} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/doctor-signup" element={<SignupDoctor />}/>
      <Route path="/doctordashboard" element={<DoctorDashboard />}/>
      <Route path="/doctordashboard/pending-appointment" element={<PendingAppointments />}/>
      <Route path="/doctordashboard/upcoming-appointment" element={<UpcomingAppointments />}/>
      <Route path="/doctordashboard/completed-appointment" element={<CompletedAppointments />}/>
      <Route path="/doctordashboard/canceled-appointment" element={<CanceledAppointments />}/>
      
      
      
    </Routes>
  </Router>
  );
};

export default App;
