import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaLock,
  FaBookOpen,
  FaGraduationCap,
  FaBuilding,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaCheckCircle,
  FaGoogle
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

/* ===============================
   MSU-TCTO DEPARTMENTS
================================ */
const departments = [
  { code: "CASS", name: "CASS - College of Arts and Social Sciences" },
  { code: "COED", name: "COED - College of Education" },
  { code: "CIAS", name: "CIAS - College of Islamic Arts and Studies" },
  { code: "COFEST", name: "COFEST - Fisheries, Oceanography, Envi. Sci. & Tech." },
  { code: "CCS", name: "CCS - College of Computer Studies" },
  { code: "CBAM", name: "CBAM - Business, Accountancy, and Management" },
  { code: "CMS", name: "CMS - College of Mathematical Sciences" },
  { code: "COL", name: "COL - College of Law" },
];

/* =====================================================
   COURSE → DEPARTMENT MAPPING
===================================================== */
const courseDepartmentMap = {
  // CASS (College of Arts and Social Sciences)
  "Bachelor of Arts in History": "CASS",
  "Bachelor of Arts in Political Science": "CASS",
  "Bachelor of Arts in English Language": "CASS",
  "Bachelor of Arts in Literary and Cultural Studies": "CASS",
  "Bachelor of Public Administration": "CASS",
  "Bachelor of Science in Business Administration": "CASS",
  "Bachelor of Science in Mathematics": "CASS",
  "Bachelor of Science in Statistics": "CASS",
  "Professional Diploma in Physical Education": "CASS",
  "Master in Public Administration": "CASS",
  "Master of Arts in English Language Teaching": "CASS",
  "Diploma in Office Management": "CASS",
  "Master of Science in Teaching Mathematics": "CASS",
  "Master of Science in Mathematics": "CASS",
  
  // COED (College of Education)
  "Bachelor of Early Childhood Education": "COED",
  "Bachelor of Elementary Education": "COED",
  "Bachelor of Secondary Education": "COED",
  "Master of Arts in Education major in Educational Management": "COED",
  "Master of Science in Education Major in General Science": "COED",
  "PhD in Education Management": "COED",
  
  // CIAS (College of Islamic Arts and Studies)
  "Bachelor of Arts in Islamic Studies Major in Sharia": "CIAS",
  "Bachelor of Science in Teaching Arabic": "CIAS",
  "Master of Arts in Islamic Studies Education": "CIAS",
  
  // COFEST (College of Fisheries, Oceanography, Environmental Science, and Technology)
  "Diploma in Fisheries Technology": "COFEST",
  "Bachelor of Science in Fisheries": "COFEST",
  "Bachelor of Science in Food Technology": "COFEST",
  "Master of Science in Aquaculture": "COFEST",
  "Bachelor of Science in Marine Biology": "COFEST",
  "Bachelor of Science in Environmental Science": "COFEST",
  "Master of Science in Marine Biology": "COFEST",
  
  // CCS (College of Computer Studies)
  "Bachelor of Science in Information Technology": "CCS",
  "Bachelor of Science in Computer Applications": "CCS",
};

/* =====================================================
   DEPARTMENT → COURSES MAPPING
===================================================== */
const departmentCourseMap = {
  CASS: [
    "Bachelor of Arts in History",
    "Bachelor of Arts in Political Science",
    "Bachelor of Arts in English Language",
    "Bachelor of Arts in Literary and Cultural Studies",
    "Bachelor of Public Administration",
    "Bachelor of Science in Business Administration",
    "Bachelor of Science in Mathematics",
    "Bachelor of Science in Statistics",
    "Professional Diploma in Physical Education",
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
    "Master of Arts in Education major in Educational Management",
    "Master of Science in Education Major in General Science",
    "PhD in Education Management",
  ],
  CIAS: [
    "Bachelor of Arts in Islamic Studies Major in Sharia",
    "Bachelor of Science in Teaching Arabic",
    "Master of Arts in Islamic Studies Education",
  ],
  COFEST: [
    "Diploma in Fisheries Technology",
    "Bachelor of Science in Fisheries",
    "Bachelor of Science in Food Technology",
    "Master of Science in Aquaculture",
    "Bachelor of Science in Marine Biology",
    "Bachelor of Science in Environmental Science",
    "Master of Science in Marine Biology",
  ],
  CCS: [
    "Bachelor of Science in Information Technology",
    "Bachelor of Science in Computer Applications",
  ],
  // Para sa mga department na walang courses pa o nasa future:
  CBAM: [],
  CMS: [],
  COL: [],
};

/* =====================================================
   PASSWORD REQUIREMENTS CHECKLIST COMPONENT
===================================================== */
const PasswordRequirements = ({ password }) => {
  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Uppercase Letter", met: /[A-Z]/.test(password) },
    { label: "Lowercase Letter", met: /[a-z]/.test(password) },
    { label: "Number (0-9)", met: /[0-9]/.test(password) },
    { label: "Special Character (!@#$%^&*)", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const metCount = requirements.filter(req => req.met).length;
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = ['text-red-600', 'text-orange-600', 'text-yellow-600', 'text-blue-600', 'text-green-600', 'text-green-700'];

  return (
    <div className="mt-2">
      <div className="space-y-1 mb-2">
        {requirements.map((req, idx) => (
          <div key={idx} className="flex items-center">
            <div className={`w-4 h-4 mr-2 flex items-center justify-center rounded-full border ${req.met ? 'bg-green-500 border-green-500' : 'bg-gray-100 border-gray-300'}`}>
              {req.met && <span className="text-white text-xs">✓</span>}
            </div>
            <span className={`text-xs ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
      
      {password && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Password strength:</span>
            <span className={`text-xs font-semibold ${strengthColors[metCount]}`}>
              {strengthLabels[metCount]}
            </span>
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div 
                key={i}
                className={`h-1 flex-1 rounded-full ${i <= metCount ? 
                  metCount <= 1 ? 'bg-red-500' : 
                  metCount === 2 ? 'bg-orange-500' : 
                  metCount === 3 ? 'bg-yellow-500' : 
                  metCount === 4 ? 'bg-blue-500' : 'bg-green-500' 
                  : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* =====================================================
   ID NUMBER FORMATTING (00-00000 format)
===================================================== */
const formatIDNumber = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return numbers;
  return `${numbers.slice(0, 2)}-${numbers.slice(2, 7)}`;
};

/* =====================================================
   EMAIL VALIDATION
===================================================== */
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export default function AuthPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // API Base URL
  const API_BASE_URL = 'https://msu-tcto-backend-oh2j.onrender.com/api/auth';
  
  // FORGOT PASSWORD STATES (EMAIL ONLY - FACEBOOK STYLE)
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotUserId, setForgotUserId] = useState(null);
  const [resetToken, setResetToken] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  
  // Enter Code States
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [showEnterCode, setShowEnterCode] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // EMAIL VERIFICATION STATES (after signup)
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationUserId, setVerificationUserId] = useState(null);
  const [verificationCodeInput, setVerificationCodeInput] = useState(["", "", "", "", "", ""]);
  const [verificationError, setVerificationError] = useState('');
  const [verificationResendTimer, setVerificationResendTimer] = useState(60);
  const [verificationCanResend, setVerificationCanResend] = useState(false);

  /* =====================================================
     FORM STATE MANAGEMENT
  ===================================================== */
  const [formData, setFormData] = useState({
    role: 'student',
    id_number: '',
    last_name: '',
    first_name: '',
    middle_name: '',
    year_level: '',
    department: '',
    course: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  /* =====================================================
     DEBUG: CHECK TOKEN ON PAGE LOAD
  ===================================================== */
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    const response = localStorage.getItem('authResponse');
    
    console.log('🔍 AuthPage - localStorage check:');
    console.log('  - authToken:', token ? '✅ Present' : '❌ Missing');
    console.log('  - currentUser:', user ? '✅ Present' : '❌ Missing');
    console.log('  - authResponse:', response ? '✅ Present' : '❌ Missing');
    
    if (token) {
      console.log('  - Token preview:', token.substring(0, 30) + '...');
    }
  }, []);

  // Timer for resend code (forgot password)
  useEffect(() => {
    let timer;
    if (showEnterCode && resendTimer > 0 && !canResend) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [showEnterCode, resendTimer, canResend]);

  // Timer for verification resend (email verification)
  useEffect(() => {
    let timer;
    if (showVerificationModal && verificationResendTimer > 0 && !verificationCanResend) {
      timer = setTimeout(() => setVerificationResendTimer(verificationResendTimer - 1), 1000);
    } else if (verificationResendTimer === 0 && showVerificationModal) {
      setVerificationCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [showVerificationModal, verificationResendTimer, verificationCanResend]);

  /* =====================================================
     INPUT HANDLERS
  ===================================================== */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  /* =====================================================
     FORGOT PASSWORD HANDLERS (EMAIL ONLY - FACEBOOK STYLE)
  ===================================================== */
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setIsLoading(true);

    try {
      const payload = { email: forgotEmail };

      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send code');
      }

      setForgotSubmitted(true);
      setShowEnterCode(true);
      setResendTimer(60);
      setCanResend(false);
      setVerificationCode(["", "", "", "", "", ""]);
      setForgotUserId(data.userId);
      
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotEmail("");
    setForgotSubmitted(false);
    setForgotError("");
    setShowEnterCode(false);
    setShowResetPassword(false);
    setVerificationCode(["", "", "", "", "", ""]);
    setCodeError("");
    setResendTimer(60);
    setCanResend(false);
    setForgotUserId(null);
    setResetToken('');
    setNewPassword('');
    setConfirmNewPassword('');
    setResetError('');
    setIsLoading(false);
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...verificationCode];
    newCode[index] = value.replace(/\D/g, '');
    setVerificationCode(newCode);
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    if (codeError) setCodeError("");
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setCodeError("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: forgotUserId, otpCode: code })
      });

      const data = await response.json();

      if (!response.ok) {
        setCodeError(data.message || 'Invalid code');
        throw new Error(data.message || 'Invalid code');
      }

      setResetToken(data.resetToken);
      setShowResetPassword(true);
      setShowEnterCode(false);
      
    } catch (err) {
      setCodeError(err.message);
      setVerificationCode(["", "", "", "", "", ""]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    try {
      const payload = { email: forgotEmail };

      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend code');
      }

      setResendTimer(60);
      setCanResend(false);
      setVerificationCode(["", "", "", "", "", ""]);
      alert(`✅ New code sent to ${forgotEmail}`);
      
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setResetError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setResetError("Password must be at least 8 characters");
      return;
    }

    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
    
    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setResetError("Password must contain uppercase, lowercase, number, and special character");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: forgotUserId,
          resetToken: resetToken,
          newPassword: newPassword,
          confirmPassword: confirmNewPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      alert('✅ Password reset successfully! You can now login with your new password.');
      resetForgotPassword();
      navigate('/');
      
    } catch (err) {
      setResetError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // =============================================
  // VERIFY EMAIL (after signup)
  // =============================================
  const handleVerifyEmail = async () => {
    const code = verificationCodeInput.join('');
    if (code.length !== 6) {
      setVerificationError("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: verificationUserId, otpCode: code })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid verification code');
      }

      alert('✅ Email verified successfully! You can now login.');
      setShowVerificationModal(false);
      setVerificationCodeInput(["", "", "", "", "", ""]);
      setIsSignUp(false); // Switch to login mode
      
    } catch (err) {
      setVerificationError(err.message);
      setVerificationCodeInput(["", "", "", "", "", ""]);
    } finally {
      setIsLoading(false);
    }
  };

  // =============================================
  // RESEND VERIFICATION CODE
  // =============================================
  const handleResendVerification = async () => {
    if (!verificationCanResend) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: verificationUserId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend code');
      }

      setVerificationResendTimer(60);
      setVerificationCanResend(false);
      setVerificationCodeInput(["", "", "", "", "", ""]);
      setVerificationError('');
      
      alert('✅ New verification code sent to your email!');
      
    } catch (err) {
      setVerificationError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* =====================================================
     VALIDATION FUNCTIONS
  ===================================================== */
  const validateIdNumber = (id) => {
    const cleanId = id.replace(/[-\s]/g, '');
    return /^\d{7}$/.test(cleanId);
  };

  const validateYearGraduated = (year) => {
    const currentYear = new Date().getFullYear();
    const gradYear = parseInt(year);
    return gradYear >= 1980 && gradYear <= currentYear;
  };

  const validatePassword = (password) => {
    const requirements = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ];
    return requirements.every(req => req);
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch(field) {
      case 'id_number':
        if (isSignUp && !value) {
          newErrors.id_number = 'ID Number is required';
        } else if (isSignUp && !validateIdNumber(value)) {
          newErrors.id_number = 'ID Number must be in format: 00-00000 (7 digits)';
        } else {
          delete newErrors.id_number;
        }
        break;

      case 'email':
        if (isSignUp && value && !validateEmail(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'year_level':
        if (formData.role === 'alumni' && !validateYearGraduated(value)) {
          newErrors.year_level = `Enter a valid graduation year (1980-${new Date().getFullYear()})`;
        } else {
          delete newErrors.year_level;
        }
        break;

      case 'password':
        if (isSignUp && !validatePassword(value)) {
          newErrors.password = 'Password must meet all requirements below';
        } else if (value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else {
          delete newErrors.password;
        }
        break;

      case 'confirmPassword':
        if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      default:
        if (!value && field !== 'middle_name' && field !== 'email') {
          newErrors[field] = 'This field is required';
        } else {
          delete newErrors[field];
        }
    }

    setErrors(newErrors);
  };

  /* =====================================================
     COURSE & DEPARTMENT LOGIC
  ===================================================== */
  const handleCourseChange = (e) => {
    const value = e.target.value;
    handleInputChange('course', value);
    
    if (courseDepartmentMap[value]) {
      handleInputChange('department', courseDepartmentMap[value]);
    }
  };

  const handleDepartmentChange = (e) => {
    const value = e.target.value;
    handleInputChange('department', value);
    
    if (value && formData.course) {
      const validCourses = departmentCourseMap[value] || [];
      if (!validCourses.includes(formData.course)) {
        handleInputChange('course', '');
      }
    }
  };

  /* =====================================================
     FORMAT MIDDLE NAME TO SINGLE LETTER
  ===================================================== */
  const formatMiddleName = (name) => {
    if (!name) return '';
    const trimmed = name.trim();
    if (!trimmed) return '';
    return trimmed.charAt(0).toUpperCase();
  };

  /* =====================================================
     API CALL FUNCTIONS
  ===================================================== */
  const signUpUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return data;
  };

  const signInUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  };

  /* =====================================================
     SAVE USER DATA AND TOKEN
  ===================================================== */
  const saveUserToLocalStorage = (response) => {
    console.log('💾 Saving to localStorage:', response);
    
    if (!response.token) {
      console.error('❌ CRITICAL: No token in login response!', response);
      return false;
    }
    
    localStorage.setItem("authToken", response.token);
    console.log('✅ Token saved:', response.token.substring(0, 20) + '...');
    
    localStorage.setItem("authResponse", JSON.stringify(response));
    
    if (response.user) {
      localStorage.setItem("currentUser", JSON.stringify(response.user));
      console.log('✅ User data saved from response.user:', response.user);
    } else if (response.id_number) {
      localStorage.setItem("currentUser", JSON.stringify(response));
      console.log('✅ User data saved from response (direct):', response);
    } else {
      console.error('❌ No user data found in response');
      return false;
    }
    
    const verifyUser = localStorage.getItem('currentUser');
    if (!verifyUser) {
      console.error('❌ CRITICAL: currentUser not saved!');
      return false;
    }
    
    console.log('✅ All data saved successfully');
    return true;
  };

  /* =====================================================
     SIGN IN HANDLER
  ===================================================== */
  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      if (!formData.id_number || !formData.password) {
        setErrors({ general: 'Please enter your ID and password.' });
        setIsLoading(false);
        return;
      }

      const credentials = {
        id_number: formData.id_number,
        password: formData.password
      };

      console.log('🚀 Sending login request for:', formData.id_number);
      
      const response = await signInUser(credentials);
      
      console.log('📦 Login response received:', {
        hasToken: !!response.token,
        hasUser: !!response.user,
        userId: response.user?.id_number
      });
      
      if (!response.token) {
        throw new Error('No authentication token received from server');
      }
      
      const saved = saveUserToLocalStorage(response);
      
      if (!saved) {
        throw new Error('Failed to save authentication data');
      }
      
      const savedToken = localStorage.getItem('authToken');
      console.log('💾 Token verification:', savedToken ? '✅ Saved' : '❌ Not saved');
      
      setSuccessMessage('Login successful! Redirecting...');
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
      
    } catch (error) {
      console.error('❌ Login error:', error);
      // Check if error is due to unverified email
      if (error.message.includes('verify your email')) {
        setErrors({ general: 'Please verify your email first. Check your inbox for the verification code.' });
      } else {
        setErrors({ general: error.message || 'Login failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* =====================================================
     SIGN UP HANDLER (with email verification)
  ===================================================== */
  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Check basic required fields
      if (!formData.last_name) setErrors(prev => ({ ...prev, last_name: 'Last name is required' }));
      if (!formData.first_name) setErrors(prev => ({ ...prev, first_name: 'First name is required' }));
      if (!formData.id_number) setErrors(prev => ({ ...prev, id_number: 'ID Number is required' }));
      if (!formData.password) setErrors(prev => ({ ...prev, password: 'Password is required' }));
      if (!formData.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: 'Please confirm your password' }));

      if (formData.role === 'student' && !formData.year_level) {
        setErrors(prev => ({ ...prev, year_level: 'Please select your year level.' }));
      }
      
      if (formData.role === 'alumni' && !formData.year_level) {
        setErrors(prev => ({ ...prev, year_level: 'Please enter your graduation year.' }));
      }

      if (Object.keys(errors).length > 0) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.email || !validateEmail(formData.email)) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
        throw new Error('Valid email address is required for notifications');
      }

      if (!validateIdNumber(formData.id_number)) {
        setErrors(prev => ({ ...prev, id_number: 'ID Number must be in format: 00-00000 (7 digits)' }));
        throw new Error('Invalid ID number format');
      }

      if (!validatePassword(formData.password)) {
        setErrors(prev => ({ ...prev, password: 'Password must meet all requirements' }));
        throw new Error('Password does not meet requirements');
      }

      if (formData.password !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
        throw new Error('Passwords do not match');
      }

      const formattedMiddleName = formatMiddleName(formData.middle_name);

      const userData = {
        role: formData.role,
        id_number: formData.id_number,
        last_name: formData.last_name.trim(),
        first_name: formData.first_name.trim(),
        middle_name: formattedMiddleName,
        year_level: formData.role === 'student' ? formData.year_level : null,
        year_graduated: formData.role === 'alumni' ? formData.year_level : null,
        department: formData.department,
        course: formData.course,
        email: formData.email.trim().toLowerCase(),
        notification_preferences: {
          email: true
        },
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };

      console.log('📦 Sending user data:', userData);

      const response = await signUpUser(userData);

      // Clear form
      setFormData({
        role: 'student',
        id_number: '',
        last_name: '',
        first_name: '',
        middle_name: '',
        year_level: '',
        department: '',
        course: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      setShowPassword({ password: false, confirmPassword: false });
      
      // Show verification modal instead of auto-login
      if (response.userId && response.requiresVerification) {
        setVerificationUserId(response.userId);
        setShowVerificationModal(true);
        setVerificationResendTimer(60);
        setVerificationCanResend(false);
        setSuccessMessage('Account created! Please verify your email.');
      } else {
        setSuccessMessage('Account created successfully! You can now login.');
        // Auto switch to login mode after 2 seconds
        setTimeout(() => {
          setIsSignUp(false);
          setSuccessMessage('');
        }, 2000);
      }

    } catch (error) {
      if (!errors.general) {
        setErrors(prev => ({ ...prev, general: error.message || 'Signup failed. Please try again.' }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setErrors({});
    setSuccessMessage('');
  };

  /* =====================================================
     STYLES
  ===================================================== */
  const inputClass =
    "flex-1 py-2 px-3 bg-[#fafafa] rounded-r-lg outline-none text-sm border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:opacity-50";

  const selectClass =
  "flex-1 py-2 px-3 bg-[#fafafa] rounded-r-lg outline-none text-sm border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 max-h-40 overflow-y-auto disabled:opacity-50 truncate";

  const iconClass = "text-gray-400 p-2 bg-[#fafafa] rounded-l-lg";

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-white to-blue-50 text-gray-800 py-8 px-4">
      {/* HEADER */}
      <div className="w-full max-w-md text-center">
        <img src="/Msu-Tcto_Logo.jpg" alt="MSU Logo" className="w-24 h-24 mx-auto mb-3" />
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#7A0019] to-[#0038A8] bg-clip-text text-transparent">MSU-TCTO REQUEST</h1>
        <p className="text-blue-900 font-medium mb-6">Registrar Queuing System with Notifications</p>
      </div>

      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-2xl ring-1 ring-gray-200 p-6 mb-6 shadow-sm">
        {/* TOGGLE */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-5">
          <button
            onClick={() => {
              setIsSignUp(false);
              resetForm();
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition ${
              !isSignUp ? "bg-white shadow text-[#7A0019]" : "text-gray-500"
            }`}
            disabled={isLoading}
          >
            Sign In
          </button>

          <button
            onClick={() => {
              setIsSignUp(true);
              resetForm();
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition ${
              isSignUp ? "bg-white shadow text-[#7A0019]" : "text-gray-500"
            }`}
            disabled={isLoading}
          >
            Sign Up
          </button>
        </div>

        {/* ERROR MESSAGES */}
        {errors.general && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
            {errors.general}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="mb-3 text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
            {successMessage}
          </div>
        )}

        {/* SIGN UP FORM */}
        {isSignUp ? (
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* ROLE SELECTOR */}
            <div className="mt-6 flex justify-center gap-6">
              {["student", "alumni"].map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={formData.role === r}
                    onChange={() => handleInputChange('role', r)}
                    className="accent-blue-600"
                    disabled={isLoading}
                  />
                  {r === 'student' ? 'Student' : 'Alumni'}
                </label>
              ))}
            </div>

            {/* ID NUMBER */}
            <div>
              <label className="block text-sm font-medium text-gray-700">ID Number</label>
              <div className="flex items-center mt-1">
                <FaUser className={iconClass} />
                <input
                  value={formatIDNumber(formData.id_number)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    handleInputChange('id_number', raw.slice(0, 7));
                  }}
                  onBlur={() => validateField('id_number', formData.id_number)}
                  placeholder="00-00000"
                  className={inputClass}
                  disabled={isLoading}
                  maxLength={8}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Format: 00-00000</p>
              {errors.id_number && (
                <p className="text-xs text-red-600 mt-1">{errors.id_number}</p>
              )}
            </div>

            {/* LAST NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <div className="flex items-center mt-1">
                <FaUser className={iconClass} />
                <input
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  onBlur={() => validateField('last_name', formData.last_name)}
                  placeholder="Enter Last Name"
                  className={inputClass}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.last_name && (
                <p className="text-xs text-red-600 mt-1">{errors.last_name}</p>
              )}
            </div>

            {/* FIRST NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <div className="flex items-center mt-1">
                <FaUser className={iconClass} />
                <input
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  onBlur={() => validateField('first_name', formData.first_name)}
                  placeholder="Enter First Name"
                  className={inputClass}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.first_name && (
                <p className="text-xs text-red-600 mt-1">{errors.first_name}</p>
              )}
            </div>

            {/* MIDDLE NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Middle Name <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <div className="flex items-center mt-1">
                <FaUser className={iconClass} />
                <input
                  value={formData.middle_name}
                  onChange={(e) => handleInputChange('middle_name', e.target.value)}
                  placeholder="Enter Middle Name"
                  className={inputClass}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* YEAR LEVEL - for students */}
            {formData.role === "student" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Year Level</label>
                <div className="flex items-center mt-1">
                  <FaGraduationCap className={iconClass} />
                  <select
                    value={formData.year_level}
                    onChange={(e) => handleInputChange('year_level', e.target.value)}
                    onBlur={() => validateField('year_level', formData.year_level)}
                    className={selectClass}
                    disabled={isLoading}
                    required
                  >
                    <option value="" disabled>Select Year Level</option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
                {errors.year_level && (
                  <p className="text-xs text-red-600 mt-1">{errors.year_level}</p>
                )}
              </div>
            )}

            {/* YEAR GRADUATED - for alumni */}
            {formData.role === "alumni" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Year Graduated</label>
                <div className="flex items-center mt-1">
                  <FaGraduationCap className={iconClass} />
                  <input
                    type="number"
                    value={formData.year_level}
                    onChange={(e) => handleInputChange('year_level', e.target.value)}
                    onBlur={() => validateField('year_level', formData.year_level)}
                    placeholder="ex. 2020"
                    className={inputClass}
                    disabled={isLoading}
                    min="1980"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
                {errors.year_level && (
                  <p className="text-xs text-red-600 mt-1">{errors.year_level}</p>
                )}
              </div>
            )}

            {/* DEPARTMENT */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <div className="flex items-center mt-1">
                <FaBuilding className={iconClass} />
                <select
                  value={formData.department}
                  onChange={handleDepartmentChange}
                  onBlur={() => validateField('department', formData.department)}
                  className={selectClass}
                  disabled={isLoading}
                  required
                >
                  <option value="" disabled>Select Department</option>
                  {departments.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.department && (
                <p className="text-xs text-red-600 mt-1">{errors.department}</p>
              )}
            </div>

            {/* COURSE */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <div className="flex items-center mt-1">
                <FaBookOpen className={iconClass} />
                <select
                  value={formData.course}
                  onChange={handleCourseChange}
                  onBlur={() => validateField('course', formData.course)}
                  className={selectClass}
                  disabled={isLoading || !formData.department}
                  required
                >
                  <option value="" disabled>Select Course</option>
                  {formData.department &&
                    departmentCourseMap[formData.department]?.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>
              {errors.course && (
                <p className="text-xs text-red-600 mt-1">{errors.course}</p>
              )}
            </div>

            {/* EMAIL ADDRESS - REQUIRED */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center mt-1">
                <FaGoogle className={`${iconClass} text-maroon-600`} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => validateField('email', formData.email)}
                  placeholder="your.email@example.com"
                  className={inputClass}
                  disabled={isLoading}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Required for request updates and notifications
              </p>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="flex items-center mt-1">
                <FaLock className={iconClass} />
                <input
                  type={showPassword.password ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={() => validateField('password', formData.password)}
                  placeholder="Create a strong password"
                  className={inputClass}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => handlePasswordVisibility('password')}
                  className="ml-2 text-gray-500"
                  disabled={isLoading}
                >
                  {showPassword.password ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {isSignUp && formData.password && (
                <PasswordRequirements password={formData.password} />
              )}
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="flex items-center mt-1">
                <FaLock className={iconClass} />
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onBlur={() => validateField('confirmPassword', formData.confirmPassword)}
                  placeholder="Re-enter your password"
                  className={inputClass}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => handlePasswordVisibility('confirmPassword')}
                  className="ml-2 text-gray-500"
                  disabled={isLoading}
                >
                  {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 mt-1 rounded-xl bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white font-semibold shadow-md hover:shadow-lg transition ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        ) : (
          /* SIGN IN FORM */
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* ID NUMBER */}
            <div>
              <label className="block text-sm font-medium text-gray-700">ID Number</label>
              <div className="flex items-center mt-1">
                <FaUser className={iconClass} />
                <input
                  value={formatIDNumber(formData.id_number)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    handleInputChange('id_number', raw.slice(0, 7));
                  }}
                  placeholder="00-00000"
                  className={inputClass}
                  disabled={isLoading}
                  maxLength={8}
                  required
                />
              </div>
              {errors.id_number && (
                <p className="text-xs text-red-600 mt-1">{errors.id_number}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-blue-700 hover:underline focus:outline-none"
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="flex items-center mt-1">
                <FaLock className={iconClass} />
                <input
                  type={showPassword.password ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter password"
                  className={inputClass}
                  disabled={isLoading}
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-sm mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword.password}
                  onChange={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                  disabled={isLoading}
                  className="accent-blue-600"
                />
                <span className="text-gray-700">Show Password</span>
              </label>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white font-semibold shadow-md hover:shadow-lg transition ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
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
          © 2026{" "}
          <span className="font-semibold text-gray-700">
            Mindanao State University
          </span>
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Tawi-Tawi College of Technology and Oceanography
        </p>
      </div>

      {/* FORGOT PASSWORD MODAL - FACEBOOK STYLE (EMAIL ONLY) */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Reset Your Password</h3>
                <button onClick={resetForgotPassword} className="text-white text-2xl hover:opacity-80" disabled={isLoading}>×</button>
              </div>
              <p className="text-white/80 text-sm mt-1">
                {!forgotSubmitted 
                  ? 'Enter your email to reset your password'
                  : showEnterCode 
                    ? 'Enter the 6-digit code sent to your email'
                    : showResetPassword
                    ? 'Create new password'
                    : 'Code sent!'}
              </p>
            </div>

            <div className="p-6">
              {!forgotSubmitted ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      value={forgotEmail} 
                      onChange={(e) => setForgotEmail(e.target.value)} 
                      placeholder="your.email@example.com" 
                      className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600" 
                      disabled={isLoading} 
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Enter the email address associated with your account.
                    </p>
                  </div>

                  {forgotError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-600 text-center">{forgotError}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button 
                      type="button" 
                      onClick={resetForgotPassword} 
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition" 
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleForgotPassword} 
                      disabled={isLoading || !forgotEmail} 
                      className="flex-1 py-3 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
                    >
                      {isLoading ? 'Sending...' : 'Send Code'}
                    </button>
                  </div>
                </div>
              ) : showEnterCode ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <FaCheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 mb-1">Check Your Email</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                      <p className="text-sm text-gray-600 mb-1">We sent a code to:</p>
                      <p className="font-semibold text-blue-700">{forgotEmail}</p>
                    </div>
                    <p className="text-sm text-gray-600">Enter the 6-digit verification code below.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                      Verification Code
                    </label>
                    <div className="flex justify-center gap-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <input 
                          key={index} 
                          id={`code-${index}`} 
                          type="text" 
                          inputMode="numeric" 
                          pattern="[0-9]*" 
                          maxLength="1" 
                          value={verificationCode[index]} 
                          onChange={(e) => handleCodeChange(index, e.target.value)} 
                          onKeyDown={(e) => handleCodeKeyDown(index, e)} 
                          className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none" 
                          disabled={isLoading} 
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>
                    {codeError && <p className="text-sm text-red-600 text-center mt-2">{codeError}</p>}
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                    {canResend ? (
                      <button onClick={handleResendCode} disabled={isLoading} className="text-blue-600 font-medium hover:underline">
                        Resend Code
                      </button>
                    ) : (
                      <p className="text-sm text-gray-500">Resend available in {resendTimer} seconds</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        setForgotSubmitted(false);
                        setShowEnterCode(false);
                        setVerificationCode(["", "", "", "", "", ""]);
                      }} 
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition" 
                      disabled={isLoading}
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleVerifyCode} 
                      disabled={isLoading || verificationCode.join('').length !== 6} 
                      className="flex-1 py-3 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
                    >
                      {isLoading ? 'Verifying...' : 'Verify Code'}
                    </button>
                  </div>
                </div>
              ) : showResetPassword ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">Create New Password</h4>
                    <p className="text-sm text-gray-600">Enter your new password below</p>
                  </div>

                  {resetError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-600 text-center">{resetError}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input 
                        type={showNewPassword ? "text" : "password"} 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        placeholder="Enter new password" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
                        autoFocus
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowNewPassword(!showNewPassword)} 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">At least 8 characters with uppercase, lowercase, number, and special character</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input 
                        type={showConfirmNewPassword ? "text" : "password"} 
                        value={confirmNewPassword} 
                        onChange={(e) => setConfirmNewPassword(e.target.value)} 
                        placeholder="Confirm new password" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={handleResetPassword} 
                    disabled={isLoading} 
                    className="w-full py-3 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
                  >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* EMAIL VERIFICATION MODAL (AFTER SIGNUP) */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Verify Your Email</h3>
                <button onClick={() => setShowVerificationModal(false)} className="text-white text-2xl hover:opacity-80">×</button>
              </div>
              <p className="text-white/80 text-sm mt-1">Enter the 6-digit code sent to your email</p>
            </div>

            <div className="p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <FaEnvelope className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">
                  We sent a code to your email address.
                </p>
              </div>

              <div className="flex justify-center gap-2 mb-6">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    id={`verify-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="1"
                    value={verificationCodeInput[index]}
                    onChange={(e) => {
                      const newCode = [...verificationCodeInput];
                      newCode[index] = e.target.value.replace(/\D/g, '');
                      setVerificationCodeInput(newCode);
                      if (e.target.value && index < 5) {
                        document.getElementById(`verify-${index + 1}`)?.focus();
                      }
                      if (verificationError) setVerificationError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !verificationCodeInput[index] && index > 0) {
                        document.getElementById(`verify-${index - 1}`)?.focus();
                      }
                    }}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                    disabled={isLoading}
                  />
                ))}
              </div>

              {verificationError && (
                <p className="text-red-600 text-sm text-center mb-4">{verificationError}</p>
              )}

              <button
                onClick={handleVerifyEmail}
                disabled={isLoading || verificationCodeInput.join('').length !== 6}
                className="w-full py-3 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Didn't receive code?{' '}
                  {verificationCanResend ? (
                    <button onClick={handleResendVerification} className="text-[#7A0019] font-medium hover:underline">
                      Resend Code
                    </button>
                  ) : (
                    <span className="text-gray-400">Resend available in {verificationResendTimer}s</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}