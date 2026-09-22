import React from "react";
import { useNavigate } from "react-router-dom";
import { SCHOOL, THEME } from "../../config/trac.config";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-[#F1F8E9] text-gray-800 px-4 py-10">
      
      {/* Logo */}
      <div className="text-center mb-6">
        <img 
          src={SCHOOL.logo} 
          alt={`${SCHOOL.shortName} Logo`} 
          className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto mb-4 rounded-full shadow-lg border-4 border-white object-cover bg-white"
          onError={(e) => { e.target.src = SCHOOL.logoFallback; }}
        />
      </div>

      {/* Welcome Text */}
      <div className="text-center mb-8 px-4">
        <h2 
          className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 uppercase bg-gradient-to-r from-[#1B5E20] to-[#F9A825] bg-clip-text text-transparent" 
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          Welcome to
        </h2>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#1B5E20] to-[#F9A825] bg-clip-text text-transparent mb-2">
          {SCHOOL.systemName}
        </h1>
        <p className="text-sm sm:text-base md:text-lg bg-gradient-to-r from-[#1B5E20] to-[#33691E] bg-clip-text text-transparent font-medium">
          {SCHOOL.subtitle}
        </p>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
          {SCHOOL.fullName}
        </p>
      </div>

      {/* Institutes Quick Preview */}
      <div className="max-w-2xl w-full mb-6 bg-white/60 backdrop-blur rounded-xl p-4 border border-green-100 shadow-sm">
        <p className="text-xs text-center text-gray-500 uppercase tracking-widest font-bold mb-2">Academic Institutes</p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-[#1B5E20]/10 text-[#1B5E20] rounded-full text-xs font-semibold">ICS</span>
          <span className="px-3 py-1 bg-[#1B5E20]/10 text-[#1B5E20] rounded-full text-xs font-semibold">ISCJS</span>
          <span className="px-3 py-1 bg-[#1B5E20]/10 text-[#1B5E20] rounded-full text-xs font-semibold">IVTES</span>
          <span className="px-3 py-1 bg-[#2E7D32]/10 text-[#2E7D32] rounded-full text-xs font-semibold">IAS</span>
          <span className="px-3 py-1 bg-[#F9A825]/20 text-[#5D4037] rounded-full text-xs font-semibold">Graduate Studies</span>
        </div>
      </div>

      {/* Get Started Button */}
      <button
        onClick={() => navigate("/login")}
        className="px-10 py-3 mt-2 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
      >
        <span className="relative z-10">Get Started</span>
        <div className="absolute inset-0 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      <p className="text-[10px] text-gray-400 mt-6 text-center max-w-md">
        First-come, first-served • {SCHOOL.footer.location}
      </p>
    </div>
  );
}
