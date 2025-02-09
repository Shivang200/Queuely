import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full bg-transparent py-4 flex justify-center fixed top-0 left-0 z-50 mix-blend-luminosity">
      <div className="w-[95%] max-w-[1200px] flex justify-between items-center">
      <Link to="/">

        <h1 className="text-xl font-bold text-white">Queuely</h1>
      </Link>
        <Link to="/role">
          <button className="px-4 py-2 bg-gray-100 text-black rounded-full hover:bg-teal-400">
            Getting Started
          </button>
        </Link>
      </div>
    </nav>
  );
};
export default Navbar;
