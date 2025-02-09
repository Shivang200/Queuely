import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-xl font-bold mb-6 text-center">Doctor Dashboard</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/doctordashboard/pending-appointment" className="p-3 rounded-lg hover:bg-gray-700">
          Pending Appointments
        </Link>
        <Link to="/doctordashboard/upcoming-appointment" className="p-3 rounded-lg hover:bg-gray-700">
          Upcoming Appointments
        </Link>
        <Link to="/doctordashboard/completed-appointment" className="p-3 rounded-lg hover:bg-gray-700">
          Completed Appointments
        </Link>
        <Link to="/doctordashboard/canceled-appointment" className="p-3 rounded-lg hover:bg-gray-700">
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