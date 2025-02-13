import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleNavigation = () => {
    if (role === "doctor") {
      navigate("/doctordashboard");
    } else if (role === "patient") {
      navigate("/userdashboard");
    } else {
      navigate("/signin"); // Redirect to sign-in if role is missing
    }
  };

  return (
    <div className="w-full flex justify-center pt-24 pb-16 bg-cover bg-center">
      <div className="w-[95%] max-w-[1200px] bg-white bg-opacity-100 text-teal-800 rounded-3xl p-20 flex flex-col md:flex-row items-center text-center md:text-left relative overflow-hidden h-auto md:h-[650px] justify-center gap-8">
        {/* Left Section */}
        <div className="flex-1 flex flex-col justify-start items-start">
          <h2 className="text-lg md:text-2xl font-medium text-teal-600">
            Queue Less, Do More
          </h2>
          <h1 className="text-xl md:text-5xl font-bold mt-2 mb-3 leading-tight">
            Say goodbye to long waits, say hello to Queuly
          </h1>
          <button
            onClick={handleNavigation}
            className="bg-teal-400 text-white px-8 py-3 rounded-full mt-6 text-lg font-semibold shadow-lg hover:bg-teal-300 transition"
          >
            Start
          </button>
        </div>
        {/* Right Section */}
        <div className="flex-1 flex justify-center">
          <img
            src="/bg.jpg"
            alt="Hero Image"
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
