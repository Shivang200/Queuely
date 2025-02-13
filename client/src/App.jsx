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
import UserDashboard from "./components/UserDashboard";
import DoctorDetails from "./components/DoctorDetails";
import UserHome from "./components/UserHome";
import PrivateDoctorRoute from "./components/PrivateDoctorRoute";
import PrivatePatientRoute from "./components/PrivatePatientRoute";


const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/role" element={<Role />} />
      <Route path="/user-signup" element={<Signup/>} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/doctor-signup" element={<SignupDoctor />}/>


      <Route path="/doctordashboard" element={
        <PrivateDoctorRoute> <DoctorDashboard /></PrivateDoctorRoute>
       
        }/>
      <Route path="/doctordashboard/pending-appointment" element={<PrivateDoctorRoute> <PendingAppointments /></PrivateDoctorRoute>}/>
      <Route path="/doctordashboard/upcoming-appointment" element={<PrivateDoctorRoute><UpcomingAppointments /></PrivateDoctorRoute>}/>
      <Route path="/doctordashboard/completed-appointment" element={<PrivateDoctorRoute><CompletedAppointments /></PrivateDoctorRoute>}/>
      <Route path="/doctordashboard/canceled-appointment" element={<PrivateDoctorRoute><CanceledAppointments /></PrivateDoctorRoute>}/>
      
      
      <Route path="/userdashboard" element={<PrivatePatientRoute><UserDashboard/></PrivatePatientRoute>}/>
      <Route path="/doctor/:id" element={<PrivatePatientRoute><DoctorDetails /></PrivatePatientRoute>} />  
      <Route path="/userhome" element={<PrivatePatientRoute><UserHome /></PrivatePatientRoute>} />  
      
      
      
    </Routes>
  </Router>
  );
};

export default App;