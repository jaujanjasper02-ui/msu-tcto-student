import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaChartBar } from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50 flex flex-col items-center py-6 px-4 text-gray-800">

      {/* Welcome Card */}
      <section className="w-full max-w-5xl bg-white rounded-3xl p-6 mb-6 text-center shadow-lg border border-gray-100">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">Welcome!</h2>
        <p className="text-gray-700 text-sm sm:text-base">Name: <strong>Jasper P. Jaujan</strong></p>
        <p className="text-gray-700 text-sm sm:text-base">Student ID: <strong>21-29079</strong></p>

        <div className="bg-green-100 text-green-700 py-2 rounded-full text-sm font-medium w-full sm:w-1/2 mx-auto mt-3">
          ● System is online and ready
        </div>
      </section>

      {/* Request + Track Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-5xl mb-6">

        {/* Request Document */}
        <button
          onClick={() => navigate("/request")}
          className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 flex flex-col items-center hover:shadow-lg transition"
        >
          <div className="w-16 h-16 bg-[#7A0019] text-white rounded-full flex items-center justify-center mb-3 shadow-md">
            <FaFileAlt className="text-2xl" />
          </div>
          <h3 className="font-semibold text-[#7A0019] text-sm sm:text-base">Request Document</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
           
          </p>
        </button>

        {/* Track Status */}
        <button
          onClick={() => navigate("/track")}
          className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 flex flex-col items-center hover:shadow-lg transition"
        >
          <div className="w-16 h-16 bg-blue-800 text-white rounded-full flex items-center justify-center mb-3 shadow-md">
            <FaChartBar className="text-2xl" />
          </div>
          <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Track Status</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            
          </p>
        </button>

      </section>

      {/* Office Information */}
      <section className="w-full max-w-5xl bg-white rounded-2xl p-6 shadow-md border border-gray-200 text-gray-700 text-sm sm:text-base">
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg sm:text-xl">
          <span className="text-red-600">⏱</span> Office Information
        </h3>
        <p className="mb-1"><strong>Office Hours:</strong> Monday to Friday, 8:00 AM – 4:45 PM</p>
        <p className="mb-1"><strong>Processing Time:</strong> 3–5 business days for regular requests</p>
        <p><strong>SMS Notifications:</strong> Updates sent to your mobile number</p>
      </section>
    </div>
  );
}
