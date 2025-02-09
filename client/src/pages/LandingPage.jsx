import React from 'react'
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Role from "../components/Role";

const LandingPage = () => {
  return (
    <div className="bg-gray-900">
      <Navbar />
      <HeroSection />
      <Features />
      <Footer />
    </div>
  )
}

export default LandingPage