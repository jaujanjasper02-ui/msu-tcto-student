import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, FaEnvelope, FaGraduationCap, FaBuilding, 
  FaLock, FaEye, FaEyeSlash, FaSave, FaCheckCircle,
  FaExclamationTriangle, FaSpinner, FaEdit, FaTimes,
  FaIdCard, FaUserTag, FaSchool, FaCalendarAlt, FaInfoCircle
} from "react-icons/fa";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [profile, setProfile] = useState({
    id_number: '',
    full_name: '',
    email: '',
    course: '',
    year_level: '',
    year_graduated: '',
    department: '',
    role: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    email: '',
    course: '',
    year_level: '',
    year_graduated: '',
    department: ''
  });
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : 'https://msu-tcto-backend-nta0.onrender.com/api/auth';

  // Listahan ng mga department sa MSU-TCTO
  const departments = [
    { code: 'CCS', name: 'College of Computer Studies (CCS)' },
    { code: 'COED', name: 'College of Education (COED)' },
    { code: 'CAS', name: 'College of Arts and Sciences (CAS)' },
    { code: 'COF', name: 'College of Fisheries (COF)' },
    { code: 'CIAS', name: 'College of Islamic and Arabic Studies (CIAS)' },
    { code: 'IOES', name: 'Institute of Oceanography (IOES)' }
  ];

  const getUserInitials = () => {
    if (!profile.full_name) return '?';
    const nameParts = profile.full_name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return profile.full_name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      const userProfile = data.profile;

      setProfile(userProfile);
      setEditData({
        email: userProfile.email || '',
        course: userProfile.course || '',
        year_level: userProfile.year_level || '',
        year_graduated: userProfile.year_graduated || '',
        department: userProfile.department || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setMessage({ type: 'error', text: 'Failed to load profile' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setProfile(prev => ({ ...prev, ...data.profile }));
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setPasswordLoading(false);
    }
  };

  const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 45 }, (_, i) => currentYear - i);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8"></div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Toast Notification */}
        {message.text && (
          <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in ${
            message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Profile Header with Avatar */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-28 h-28 bg-gradient-to-r from-[#7A0019] to-[#0038A8] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl font-bold text-white">{getUserInitials()}</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <FaCheckCircle className="text-white text-sm" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">{profile.full_name}</h1>
          <p className="text-gray-500 capitalize">{profile.role}</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaUser className="text-[#7A0019]" />
                Personal Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#7A0019] hover:bg-[#7A0019]/10 rounded-lg transition"
                >
                  <FaEdit />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {!isEditing ? (
              /* ========== DISPLAY MODE ========== */
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <FaIdCard className="text-gray-400 mt-1" />
                    <div>
                      <label className="block text-xs text-gray-500 uppercase tracking-wider">Student ID</label>
                      <p className="text-gray-900 font-medium mt-1">{profile.id_number}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaUserTag className="text-gray-400 mt-1" />
                    <div>
                      <label className="block text-xs text-gray-500 uppercase tracking-wider">Full Name</label>
                      <p className="text-gray-900 font-medium mt-1">{profile.full_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaSchool className="text-gray-400 mt-1" />
                    <div>
                      <label className="block text-xs text-gray-500 uppercase tracking-wider">Department</label>
                      <p className="text-gray-900 font-medium mt-1">{departments.find(d => d.code === profile.department)?.name || profile.department || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 uppercase tracking-wider">Email Address</label>
                      <p className="text-gray-900 mt-1 break-all">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaGraduationCap className="text-gray-400 mt-1" />
                    <div>
                      <label className="block text-xs text-gray-500 uppercase tracking-wider">Course</label>
                      <p className="text-gray-900 mt-1">{profile.course || 'N/A'}</p>
                    </div>
                  </div>
                  {profile.role === 'student' && (
                    <div className="flex items-start gap-3">
                      <FaBuilding className="text-gray-400 mt-1" />
                      <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider">Year Level</label>
                        <p className="text-gray-900 mt-1">{profile.year_level || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                  {profile.role === 'alumni' && (
                    <div className="flex items-start gap-3">
                      <FaCalendarAlt className="text-gray-400 mt-1" />
                      <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider">Year Graduated</label>
                        <p className="text-gray-900 mt-1">{profile.year_graduated || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* ========== EDIT MODE ========== */
              <div className="space-y-5">
                {/* ID Number at Full Name: Read-only */}
<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-1">
        <FaIdCard /> Student ID
      </div>
      <p className="text-gray-900 font-medium">{profile.id_number}</p>
    </div>
    <div>
      <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-1">
        <FaUserTag /> Full Name
      </div>
      <p className="text-gray-900 font-medium">{profile.full_name}</p>
    </div>
  </div>
</div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleEditChange('email', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A0019] focus:border-transparent outline-none transition"
                  />
                </div>
                
                {/* DEPARTMENT — EDITABLE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={editData.department}
                    onChange={(e) => handleEditChange('department', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A0019] focus:border-transparent outline-none transition"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.code} value={dept.code}>{dept.name}</option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                    <FaInfoCircle className="w-3 h-3" />
                    Changing your department may affect your pending requests.
                  </p>
                </div>

                {/* Course */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                  <input
                    type="text"
                    value={editData.course}
                    onChange={(e) => handleEditChange('course', e.target.value)}
                    placeholder="e.g., Bachelor of Science in Information Technology"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A0019] focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Year Level (for students) o Year Graduated (for alumni) */}
                {profile.role === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year Level</label>
                    <select
                      value={editData.year_level}
                      onChange={(e) => handleEditChange('year_level', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A0019] focus:border-transparent outline-none transition"
                    >
                      <option value="">Select Year Level</option>
                      {yearLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                )}

                {profile.role === 'alumni' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year Graduated</label>
                    <select
                      value={editData.year_graduated}
                      onChange={(e) => handleEditChange('year_graduated', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A0019] focus:border-transparent outline-none transition"
                    >
                      <option value="">Select Year Graduated</option>
                      {graduationYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Save / Cancel */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <FaTimes />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaLock className="text-[#7A0019]" />
                Security
              </h2>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-sm text-[#7A0019] hover:underline"
              >
                {showPasswordForm ? 'Cancel' : 'Change Password'}
              </button>
            </div>
          </div>
          
          {showPasswordForm && (
            <div className="p-6">
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A0019] focus:border-transparent outline-none transition pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A0019] focus:border-transparent outline-none transition pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="text-green-600">✓ At least 8 characters</span>
                    <span className="text-green-600">✓ Uppercase & lowercase</span>
                    <span className="text-green-600">✓ Number & special character</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A0019] focus:border-transparent outline-none transition pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                  {passwordLoading ? <FaSpinner className="animate-spin mx-auto" /> : 'Update Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}