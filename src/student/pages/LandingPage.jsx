import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-rose-50 text-gray-800 px-4 py-10">
      
      {/* Logo */}
<div className="text-center mb-6">
  <img 
    src="/msu_logo.png" 
    alt="MSU Logo" 
    className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto mb-4"
  />
</div>


      {/* Welcome Text */}
      <div className="text-center mb-8 px-4">
        <h2 
          className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 uppercase" 
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          Welcome to
        </h2>

        <h1 
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#7A0019] mb-2"
        >
          MSU-TCTO REQUEST
        </h1>
        <p 
  className="text-sm sm:text-base md:text-lg text-blue-900 font-medium"
>
  <span className="font-bold text-[#7A0019]">Re</span>gistrar{" "}
  <span className="font-bold text-[#7A0019]">Que</span>uing{" "}
  <span className="font-bold text-[#7A0019]">s</span>ystem with No
  <span className="font-bold text-[#7A0019]">t</span>ification
</p>

      </div>

      {/* Get Started Button */}
      <button
        onClick={() => navigate("/login")}
        className="px-8 py-3 mt-6 rounded-xl bg-[#0038A8] text-white font-semibold shadow-md hover:bg-[#002b7b] transition text-sm sm:text-base md:text-lg"
      >
        Get Started
      </button>
    </div>
  );
}
