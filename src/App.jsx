import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Student Components
import Navbar from "./student/components/Navbar";
import LandingPage from "./student/pages/LandingPage";
import AuthPage from "./student/pages/AuthPage";
import Dashboard from "./student/pages/Dashboard";
import RequestDocument from "./student/pages/RequestDocument";
import TrackStatus from "./student/pages/TrackStatus";
import RequestSubmitted from "./student/pages/RequestSubmitted";
import Help from "./student/pages/Help";

// New Pages
import PrivacyNotice from "./student/pages/PrivacyNotice";
import NeedHelp from "./student/pages/NeedHelp";
import FAQ from "./student/pages/FAQ";

// Note: admin UI moved to separate msu-tcto-admin app.

export default function App() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminLogin = location.pathname === "/admin/login";
  const isStudentAuth = location.pathname === "/login"; // AuthPage is /login
  const showStudentNavbar = !isAdminRoute && !isStudentAuth && location.pathname !== "/";

  return (
    <div className="min-h-screen">
      {/* STUDENT NAVBAR */}
      {showStudentNavbar && <Navbar />}

      {/* MAIN ROUTING STRUCTURE */}
      <Routes>
        {/* ======================= */}
        {/*       STUDENT ROUTES    */}
        {/* ======================= */}
        <Route path="/" element={<LandingPage />} />               {/* Landing Page */}
        <Route path="/login" element={<AuthPage />} />             {/* Login / Signup */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/request" element={<RequestDocument />} />
        <Route path="/track" element={<TrackStatus />} />
        <Route path="/submitted" element={<RequestSubmitted />} />
        <Route path="/help" element={<Help />} />

        {/* ======================= */}
        {/*       INFO PAGES        */}
        {/* ======================= */}
        <Route path="/privacy" element={<PrivacyNotice />} />
        <Route path="/need-help" element={<NeedHelp />} />
        <Route path="/faq" element={<FAQ />} />

        {/* FALLBACK */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </div>
  );
}
