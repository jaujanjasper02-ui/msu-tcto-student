import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaArrowLeft } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === "/dashboard";

  // Show Back button only on specific pages
  const showBackButton =
    ["/request", "/track", "/help"].includes(location.pathname);

  return (
    <header className="bg-white border-b shadow-sm w-full">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4 sm:px-6">

        {/* LEFT: Back Button + Logo + Text */}
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center bg-gray-100 text-gray-800 p-2 rounded-md hover:bg-gray-200 transition"
              aria-label="Back"
            >
              <FaArrowLeft className="text-lg sm:text-xl" />
            </button>
          )}

          <img
            src="/msu_logo.png"
            alt="logo"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
          />

          <div className="leading-tight">
            <h1 className="text-lg sm:text-2xl font-semibold text-[#70121b] font-signin">
              MSU-TCTO
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-500 -mt-1">
              Registrar Queuing System with Notification
            </p>
          </div>
        </div>

        {/* RIGHT: Professional Logout Button */}
        <div className="flex items-center">
          {isDashboard && (
            <button
              onClick={() => navigate("/")}
              title="Logout"
              className="flex items-center gap-2 bg-[#7A0019] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#5a0012] hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7A0019] focus:ring-offset-2 text-sm sm:text-base"
            >
              <FaSignOutAlt className="text-base" />
              <span>Logout</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
