import React, { useState } from "react";
import {
  FaUser,
  FaLock,
  FaBookOpen,
  FaGraduationCap,
  FaBuilding,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

/* ===============================
   MSU-TCTO DEPARTMENTS
================================ */
const departments = [
  { code: "COF", name: "(COF) College of Fisheries" },
  { code: "COED", name: "(COED) College of Education" },
  { code: "CAS", name: "(CAS) College of Arts and Sciences" },
  { code: "CCS", name: "(CCS) College of Computer Studies" },
  { code: "CIAS", name: "(CIAS) College of Islamic and Arabic Studies" },
  { code: "IOES", name: "(IOES) Institute of Oceanography & Environmental Science" },
];

/* =====================================================
   COURSE → DEPARTMENT MAPPING (FULL COURSE NAMES)
===================================================== */
const courseDepartmentMap = {
  // CAS
  "Bachelor of Arts in History": "CAS",
  "Bachelor of Arts in Political Science": "CAS",
  "Bachelor of Arts in English Language": "CAS",
  "Bachelor of Arts in Literary and Cultural Studies": "CAS",
  "Bachelor of Public Administration": "CAS",
  "Bachelor of Science in Business Administration": "CAS",
  "Bachelor of Science in Mathematics": "CAS",
  "Bachelor of Science in Statistic": "CAS",
  "Professional Diploma Physical Education": "CAS",
  "Master in Public Administration": "CAS",
  "Master of Arts in English Language Teaching": "CAS",
  "Diploma in Office Management": "CAS",
  "Master of Science in Teaching Mathematics": "CAS",
  "Master of Science in Mathematics": "CAS",

  // COED
  "Bachelor of Early Childhood Education": "COED",
  "Bachelor of Elementary Education": "COED",
  "Bachelor of Secondary Education": "COED",
  "Master of Arts in Education major in Educational Management": "COED",
  "Master of Science in Education Major in General Science": "COED",
  "PhD in Education Management": "COED",

  // CIAS
  "Bachelor of Arts in Islamic Studies Major in Sharia": "CIAS",
  "Bachelor of Science In Teaching Arabic": "CIAS",
  MAISED: "CIAS",

  // COF
  "Diploma in Fisheries Technology": "COF",
  "Bachelor of Science in Fisheries": "COF",
  "Bachelor of Science in Food Technology": "COF",
  "Master of Science in Aquaculture": "COF",

  // IOES
  "Bachelor of Science in Marine Biology": "IOES",
  "Bachelor of Science in Environmental Science": "IOES",
  "Master of Science in Marine Biology": "IOES",

  // CCS
  "Bachelor of Information Technology": "CCS",
  "Bachelor of Computer Applications": "CCS",
};

/* =====================================================
   DEPARTMENT → COURSES MAPPING
===================================================== */
const departmentCourseMap = {
  CAS: [
    "Bachelor of Arts in History",
    "Bachelor of Arts in Political Science",
    "Bachelor of Arts in English Language",
    "Bachelor of Arts in Literary and Cultural Studies",
    "Bachelor of Public Administration",
    "Bachelor of Science in Business Administration",
    "Bachelor of Science in Mathematics",
    "Bachelor of Science in Statistic",
    "Professional Diploma Physical Education",
    "Master in Public Administration",
    "Master of Arts in English Language Teaching",
    "Master of Science in Teaching Mathematics",
    "Master of Science in Mathematics",
    "Diploma in Office Management",
  ],

  COED: [
    "Bachelor of Early Childhood Education",
    "Bachelor of Elementary Education",
    "Bachelor of Secondary Education",
    "MasterofArtsinEducation MajorinEducationalManagement",
    "Master of Science in Education Major in General Science",
    "PhD in Education Management",
  ],

  CIAS: [
    "Bachelor of Arts in Islamic Studies Major in Sharia",
    "Bachelor of Science In Teaching Arabic",
    "MAISED",
  ],

  COF: [
    "Diploma in Fisheries Technology",
    "Bachelor of Science in Fisheries",
    "Bachelor of Science in Food Technology",
    "Master of Science in Aquaculture",
  ],

  IOES: [
    "Bachelor of Science in Marine Biology",
    "Bachelor of Science in Environmental Science",
    "Master of Science in Marine Biology",
  ],

  CCS: ["Bachelor of Information Technology", "Bachelor of Computer Applications"],
};

export default function AuthPage() {
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");

  const [studentId, setStudentId] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [yearGraduated, setYearGraduated] = useState("");

  const [role, setRole] = useState("Student");
  const [mobile, setMobile] = useState("");
  const [department, setDepartment] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const resetErrors = () => setError("");

  /* =====================================================
     LOGIN HANDLER
  ===================================================== */
  const handleSignIn = (e) => {
    e.preventDefault();
    resetErrors();

    if (!studentId || !password) {
      setError("Please enter your ID and password.");
      return;
    }

    navigate("/dashboard");
  };

  /* =====================================================
     SIGN-UP HANDLER
  ===================================================== */
  const handleSignUp = (e) => {
    e.preventDefault();
    resetErrors();

    if (!lastName || !firstName || !studentId || !role || !mobile || !password || !confirmPassword) {
      setError("Please fill out all required fields.");
      return;
    }

    if (role === "Student" && !yearLevel) {
      setError("Please select your year level.");
      return;
    }

    if (role === "Alumni" && !yearGraduated) {
      setError("Please enter your year graduated.");
      return;
    }

    const normalizedMobile = mobile.replace(/\D/g, "");
    if (!/^\d{10}$/.test(normalizedMobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Reset after success
    setIsSignUp(false);
    setLastName("");
    setFirstName("");
    setMiddleName("");
    setStudentId("");
    setCourse("");
    setYearLevel("");
    setYearGraduated("");
    setRole("Student");
    setMobile("");
    setDepartment("");
    setPassword("");
    setConfirmPassword("");

    setError("Signup successful! Please sign in.");
  };

  /* =====================================================
     COURSE & DEPARTMENT LOGIC
  ===================================================== */
  const handleCourseChange = (e) => {
    const value = e.target.value;
    setCourse(value);
    setDepartment(courseDepartmentMap[value] || "");
  };

  const handleDepartmentChange = (e) => {
    const value = e.target.value;
    setDepartment(value);

    if (!departmentCourseMap[value]?.includes(course)) {
      setCourse("");
    }
  };

  /* INPUT STYLES */
  const inputClass =
    "flex-1 py-2 px-3 bg-[#fafafa] rounded-r-lg outline-none text-sm border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600";

  const selectClass =
    "flex-1 py-2 px-3 bg-[#fafafa] rounded-r-lg outline-none text-sm border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 max-h-40 overflow-y-auto";

  const iconClass = "text-gray-400 p-2 bg-[#fafafa] rounded-l-lg";

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-white to-rose-50 text-gray-800 py-8 px-4">
      {/* HEADER */}
      <div className="w-full max-w-md text-center">
        <img src="/msu_logo.png" alt="MSU Logo" className="w-24 h-24 mx-auto mb-3" />
        <h1 className="text-3xl font-extrabold text-[#7A0019]">MSU-TCTO REQUEST</h1>
        <p className="text-blue-900 font-medium">Registrar Queuing System</p>
        <p className="text-gray-500 text-sm mb-6">🔔 with SMS Notification</p>
      </div>

      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-2xl ring-1 ring-gray-200 p-6 mb-6 shadow-sm">
        {/* TOGGLE */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-5">
          <button
            onClick={() => {
              setIsSignUp(false);
              resetErrors();
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition ${
              !isSignUp ? "bg-white shadow text-[#7A0019]" : "text-gray-500"
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() => {
              setIsSignUp(true);
              resetErrors();
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition ${
              isSignUp ? "bg-white shadow text-[#7A0019]" : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

        {/* SIGN UP FORM */}
        {isSignUp ? (
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* ROLE */}
            <div className="mt-6 flex justify-center gap-6">
              {["Student", "Alumni"].map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    checked={role === r}
                    onChange={() => setRole(r)}
                    className="accent-blue-600"
                  />
                  {r}
                </label>
              ))}
            </div>

            {/* ID NUMBER */}
            <div>
              <label className="block text-sm font-medium text-gray-700">ID Number</label>
              <div className="flex items-center mt-1">
                <FaUser className={iconClass} />
                <input
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter ID"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* NAME INPUTS */}
            {[
              ["Last Name", lastName, setLastName],
              ["First Name", firstName, setFirstName],
              ["Middle Name (optional)", middleName, setMiddleName],
            ].map(([label, value, setter], i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <div className="flex items-center mt-1">
                  <FaUser className={iconClass} />
                  <input
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={label}
                    className={inputClass}
                    required={label !== "Middle Name (optional)"}
                  />
                </div>
              </div>
            ))}

            {/* YEAR LEVEL */}
            {role === "Student" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Year Level</label>
                <div className="flex items-center mt-1">
                  <FaGraduationCap className={iconClass} />
                  <select
                    value={yearLevel}
                    onChange={(e) => setYearLevel(e.target.value)}
                    className={selectClass}
                    required
                  >
                    <option value="" disabled>
                      Select Year Level
                    </option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
              </div>
            )}

            {/* YEAR GRADUATED */}
            {role === "Alumni" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Year Graduated</label>
                <div className="flex items-center mt-1">
                  <FaGraduationCap className={iconClass} />
                  <input
                    type="number"
                    value={yearGraduated}
                    onChange={(e) => setYearGraduated(e.target.value)}
                    placeholder="ex. 2020"
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            )}

            {/* DEPARTMENT */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <div className="flex items-center mt-1">
                <FaBuilding className={iconClass} />
                <select
                  value={department}
                  onChange={handleDepartmentChange}
                  className={selectClass}
                  required
                >
                  <option value="" disabled>
                    Select Department
                  </option>
                  {departments.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* COURSE — WITH SCROLL FIX */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <div className="flex items-center mt-1">
                <FaBookOpen className={iconClass} />
                <select
                  value={course}
                  onChange={handleCourseChange}
                  className={selectClass}
                  required
                >
                  <option value="" disabled>
                    Select Course
                  </option>

                  {department &&
                    departmentCourseMap[department]?.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* MOBILE */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <div className="flex items-center mt-1">
                <span className="px-3 py-2 bg-[#fafafa] border border-gray-300 rounded-l-lg text-gray-700">
                  +63
                </span>
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  maxLength={10}
                  placeholder="9123456789"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* PASSWORD + CONFIRM */}
            {[
              ["Password", password, setPassword, showPassword, setShowPassword],
              [
                "Confirm Password",
                confirmPassword,
                setConfirmPassword,
                showConfirmPassword,
                setShowConfirmPassword,
              ],
            ].map(([label, value, setter, toggle, setToggle], i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <div className="flex items-center mt-1">
                  <FaLock className={iconClass} />
                  <input
                    type={toggle ? "text" : "password"}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={label}
                    className={inputClass}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setToggle(!toggle)}
                    className="ml-2 text-gray-500"
                  >
                    {toggle ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            ))}

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full py-3 mt-1 rounded-xl bg-[#0038A8] hover:bg-[#002b7b] text-white font-semibold shadow-md"
            >
              Sign Up
            </button>
          </form>
        ) : (
          /* =======================
             SIGN IN FORM
          ======================== */
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">ID Number</label>
              <div className="flex items-center mt-1">
                <FaUser className={iconClass} />
                <input
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter ID"
                  className={inputClass}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="/need-help" className="text-xs text-blue-700 hover:underline">
                  Forgot?
                </Link>
              </div>

              <div className="flex items-center mt-1">
                <FaLock className={iconClass} />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className={inputClass}
                />
              </div>

              <label className="flex items-center gap-2 text-sm mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <span>Show Password</span>
              </label>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0038A8] hover:bg-[#002b7b] text-white font-semibold shadow-md"
            >
              Login
            </button>

            {/* FOOTER LINKS */}
            <div className="text-xs text-center mt-3 text-gray-500">
              <Link to="/privacy" className="text-blue-800 hover:underline">
                Privacy Notice
              </Link>{" "}
              |{" "}
              <Link to="/need-help" className="text-blue-800 hover:underline">
                Need Help?
              </Link>{" "}
              |{" "}
              <Link to="/faq" className="text-blue-800 hover:underline">
                FAQ
              </Link>
            </div>
          </form>
        )}
      </div>

      {/* FOOTER */}
      <div className="w-full max-w-md text-center">
        <p className="text-xs text-gray-500">
          © 2025{" "}
          <span className="font-semibold text-gray-700">
            Mindanao State University - Tawi-Tawi College of Technology and Oceanography
          </span>
        </p>
      </div>
    </div>
  );
}
