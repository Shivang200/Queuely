import { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile sidebar starts closed

  return (
    <div className={`bg-gray-900 text-white flex flex-col h-screen p-4 
      ${isOpen ? "w-64" : "w-16"} sm:w-64 sm:block transition-all duration-300 relative`}>

      {/* Hamburger Button (Only in Mobile) */}
      <button 
        className="absolute top-4 left-4 bg-gray-800 p-2 rounded-md sm:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Sidebar Content */}
      <h2 className={`text-xl font-bold mb-6 text-center ${!isOpen && "hidden sm:block"}`}>
        Doctor Dashboard
      </h2>

      <nav className="flex flex-col gap-4 mt-10">
        <Link to="/doctordashboard/pending-appointment" 
          className={`p-3 rounded-lg hover:bg-gray-700 ${!isOpen && "hidden sm:block"}`}>
          Pending Appointments
        </Link>
        <Link to="/doctordashboard/upcoming-appointment" 
          className={`p-3 rounded-lg hover:bg-gray-700 ${!isOpen && "hidden sm:block"}`}>
          Upcoming Appointments
        </Link>
        <Link to="/doctordashboard/completed-appointment" 
          className={`p-3 rounded-lg hover:bg-gray-700 ${!isOpen && "hidden sm:block"}`}>
          Completed Appointments
        </Link>
        <Link to="/doctordashboard/canceled-appointment" 
          className={`p-3 rounded-lg hover:bg-gray-700 ${!isOpen && "hidden sm:block"}`}>
          Cancelled Appointments
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;



// When a doctor clicks "Pending Appointments" in Sidebar,
// /doctor-dashboard/pending → Renders <PendingAppointments /> inside <Outlet />.

// When a doctor clicks "Upcoming Appointments",
// /doctor-dashboard/upcoming → Shows <UpcomingAppointments /> inside <Outlet />.