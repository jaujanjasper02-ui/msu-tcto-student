import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 text-gray-800 px-4 py-10">
      
      {/* Logo */}
      <div className="text-center mb-6">
        <img 
          src="/Msu-Tcto_Logo.jpg" 
          alt="MSU Logo" 
          className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto mb-4"
        />
      </div>

      {/* Welcome Text */}
      <div className="text-center mb-8 px-4">
        <h2 
  className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 uppercase bg-gradient-to-r from-[#7A0019] to-[#0038A8] bg-clip-text text-transparent" 
  style={{ fontFamily: 'Times New Roman, serif' }}
>
  Welcome to
</h2>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#7A0019] to-[#0038A8] bg-clip-text text-transparent mb-2">
  MSU-TCTO REQUEST
</h1>
        <p className="text-sm sm:text-base md:text-lg bg-gradient-to-r from-[#7A0019] to-[#0038A8] bg-clip-text text-transparent font-medium">
  Registrar Queuing System with Notification
</p>
      </div>

      {/* Get Started Button */}
      <button
        onClick={() => navigate("/login")}
        className="px-10 py-3 mt-6 rounded-xl bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
      >
        <span className="relative z-10">Get Started</span>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0038A8] to-[#7A0019] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    </div>
  );
}