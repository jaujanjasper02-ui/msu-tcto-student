import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { SCHOOL, THEME } from "../../config/trac.config";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isDashboard = location.pathname === "/dashboard";

  const showBackButton = ["/request", "/track", "/help", "/profile", "/faq", "/privacy", "/need-help"].includes(
    location.pathname
  ) || location.pathname.startsWith("/track/");

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
    localStorage.removeItem("authResponse");
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-green-100 shadow-sm w-full z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between p-3 sm:p-4 px-4 sm:px-6">
          
          {/* LEFT: Back Button + Logo + Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="flex-shrink-0 flex items-center justify-center bg-green-50 text-[#1B5E20] w-9 h-9 rounded-full hover:bg-[#1B5E20] hover:text-white transition-all duration-200"
                aria-label="Back"
              >
                <FaArrowLeft />
              </button>
            )}

            <button
              onClick={handleLogoClick}
              className="flex-shrink-0 transition-transform hover:scale-105 active:scale-95 focus:outline-none"
              aria-label="Go to Dashboard"
              title="Go to Dashboard"
            >
              <img
                src={SCHOOL.logo}
                alt={`${SCHOOL.shortName} Logo`}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-sm border border-green-100 bg-white cursor-pointer"
                onError={(e) => { e.target.src = SCHOOL.logoFallback; }}
              />
            </button>

            <button
              onClick={handleLogoClick}
              className="flex-1 text-left focus:outline-none"
              aria-label="Go to Dashboard"
            >
              <h1 className="text-base sm:text-xl font-black text-[#1B5E20] leading-tight tracking-tight hover:text-[#2E7D32] transition-colors">
                {SCHOOL.shortName}-{SCHOOL.systemName.split(' ')[1] || 'REQUEST'}
              </h1>
              <p className="text-[9px] sm:text-xs text-gray-500 font-medium uppercase tracking-wider leading-tight hidden sm:block">
                {SCHOOL.subtitle}
              </p>
              <p className="text-[8px] sm:hidden text-gray-400">
                {SCHOOL.fullName}
              </p>
            </button>
          </div>

          {/* RIGHT: Profile & Logout */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {isDashboard && (
              <>
                <button
                  onClick={() => navigate("/profile")}
                  title="Profile"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-green-50 text-[#1B5E20] flex items-center justify-center hover:bg-[#1B5E20] hover:text-white transition-all border border-green-100"
                >
                  <FaUserCircle className="text-xl sm:text-2xl" />
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-[#1B5E20] text-white px-3 sm:px-5 py-2 rounded-xl font-bold hover:bg-[#0D3B10] hover:shadow-lg transition-all text-xs sm:text-sm"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span className="hidden xs:inline">Logout</span>
                </button>
              </>
            )}
            {!isDashboard && (
              <button
                onClick={() => navigate("/profile")}
                title="Profile"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-green-50 text-[#1B5E20] flex items-center justify-center hover:bg-[#1B5E20] hover:text-white transition-all border border-green-100"
              >
                <FaUserCircle className="text-xl sm:text-2xl" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* LOGOUT MODAL - TRAC Theme */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            {/* Header with TRAC Gradient */}
            <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-6 py-4">
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FaSignOutAlt className="text-white text-xl" />
                </div>
              </div>
            </div>
            
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to sign out of your account?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white rounded-xl hover:opacity-90 transition font-semibold text-sm shadow-md"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
