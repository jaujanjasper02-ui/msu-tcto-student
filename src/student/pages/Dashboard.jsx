import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaFileAlt, 
  FaChartBar, 
  FaCheckCircle, 
  FaTicketAlt, 
  FaUsers,
  FaExclamationTriangle,
  FaSpinner,
  FaClock,
  FaEnvelope
} from "react-icons/fa";
import { SCHOOL, THEME, OFFICE, SYSTEM } from "../../config/trac.config";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    id_number: "",
    role: ""
  });

  const [queueData, setQueueData] = useState({
    current_serving: null,
    last_queue_number: null,
    pending_count: 0,
    has_carry_over: false,
    last_updated: new Date()
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [avgProcessingTime, setAvgProcessingTime] = useState(SYSTEM.queue.avgProcessingTime);
  const [officeHours, setOfficeHours] = useState(OFFICE.schedule.display);
  
  const API_BASE_URL = `${SYSTEM.apiBaseUrl}`;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/public/settings`);
        if (response.ok) {
          const data = await response.json();
          if (data.avg_processing_time) setAvgProcessingTime(data.avg_processing_time);
          if (data.office_hours) setOfficeHours(data.office_hours);
        }
      } catch (err) {
        console.warn('Using default settings from TRAC config');
      }
    };
    fetchSettings();
  }, []);

  const estimatedWait = useMemo(() => {
    const totalMinutes = queueData.pending_count * avgProcessingTime;
    if (totalMinutes === 0) return "No waiting time";
    if (totalMinutes < 60) return `${totalMinutes} mins`;
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }, [queueData.pending_count, avgProcessingTime]);

  useEffect(() => {
    const savedData = localStorage.getItem("currentUser");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        const user = parsedData.user || parsedData;
        setUserData({
          name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || "Student",
          id_number: user.id_number || user.studentId || "N/A",
          role: user.role || "student"
        });
      } catch (err) {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchQueueData = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return setError("Not authenticated");
      
      const response = await fetch(`${API_BASE_URL}/queue/status`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch");
      
      const data = await response.json();
      setQueueData({
        current_serving: data.current_serving,
        last_queue_number: data.last_queue_number,
        pending_count: data.pending_count || 0,
        has_carry_over: data.has_carry_over || false,
        last_updated: new Date()
      });
      setError(null);
    } catch (err) {
      setError("Unable to load queue status.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchQueueData();
    const interval = setInterval(fetchQueueData, SYSTEM.queue.refreshInterval);
    return () => clearInterval(interval);
  }, [fetchQueueData]);

  const formatStudentId = (id) => {
    const clean = id.toString().replace(/[-\s]/g, '');
    return clean.length >= 7 ? `${clean.substring(0, 2)}-${clean.substring(2, 7)}` : id;
  };

  return (
    <div className="min-h-screen bg-[#F1F8E9] flex flex-col items-center py-8 px-4 font-sans">
      
      {/* Header */}
      <section className="w-full max-w-4xl bg-white rounded-2xl p-8 mb-6 shadow-sm border border-green-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Welcome, <span className="text-[#1B5E20]">{userData.name}</span>!
            </h2>
            <p className="text-slate-500 font-medium">
              ID Number: <span className="font-mono text-slate-700">{formatStudentId(userData.id_number)}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">{SCHOOL.fullName}</p>
          </div>
          <div className="flex flex-col items-center md:items-end">
             <span className="bg-[#F1F8E9] text-[#1B5E20] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-green-200 mb-2">
                {userData.role}
             </span>
             <div className="flex items-center gap-2 text-[#2E7D32] text-sm font-semibold">
                <FaCheckCircle className="animate-pulse" /> System Online
             </div>
          </div>
        </div>
      </section>

      {/* Real-Time Queue Monitor - TRAC Theme */}
      <section className="w-full max-w-4xl mb-6">
        <div className="bg-white rounded-2xl shadow-md border border-green-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-6 py-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaTicketAlt className="text-white text-xl" />
              <h2 className="text-white font-bold text-lg tracking-tight">Real-Time Queue Monitor</h2>
            </div>
            <button 
              onClick={() => { setIsRefreshing(true); fetchQueueData(); }}
              disabled={isRefreshing}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs backdrop-blur-md transition flex items-center gap-2"
            >
              <svg className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
          
          <div className="p-8">
            {loading ? (
              <div className="flex justify-center py-10"><FaSpinner className="animate-spin text-[#1B5E20] text-4xl" /></div>
            ) : error ? (
              <div className="text-center py-10 text-rose-500">
                <FaExclamationTriangle className="text-4xl mx-auto mb-3" />
                <p className="font-semibold">{error}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-[#F1F8E9] rounded-2xl p-6 border border-green-100 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform"><FaUsers size={60} /></div>
                    <p className="text-[#1B5E20] text-xs font-black uppercase tracking-widest mb-2">Now Serving</p>
                    <div className="text-6xl font-black text-[#1B5E20] drop-shadow-sm">
                      #{queueData.current_serving || '—'}
                    </div>
                  </div>
                  
                  <div className="bg-[#FFF8E1] rounded-2xl p-6 border border-amber-100 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform"><FaTicketAlt size={60} /></div>
                    <p className="text-[#F57F17] text-xs font-black uppercase tracking-widest mb-2">Last Issued</p>
                    <div className="text-6xl font-black text-[#F9A825] drop-shadow-sm">
                      #{queueData.last_queue_number || '—'}
                    </div>
                  </div>
                </div>

                <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span>
                    <span className="text-slate-600 text-sm font-medium">
                      <strong>{queueData.pending_count}</strong> requests in line
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-green-200 shadow-sm">
                    <FaClock className="text-[#2E7D32] text-xs" />
                    <span className="text-[#1B5E20] text-xs font-bold">
                      EST. WAIT TIME: {estimatedWait}
                    </span>
                  </div>
                </div>

                {queueData.has_carry_over && (
                  <div className="flex items-center gap-3 p-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 text-xs font-medium">
                    <FaExclamationTriangle className="text-amber-500 text-lg flex-shrink-0" />
                    Pending requests from previous days are being prioritized.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Action Grid - TRAC Theme */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl mb-8">
        <button onClick={() => navigate("/request")} className="bg-white p-8 rounded-2xl border border-green-100 shadow-sm hover:shadow-xl hover:border-[#1B5E20] transition-all group text-left">
          <div className="w-14 h-14 bg-[#1B5E20] text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
            <FaFileAlt size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Request Document</h3>
          <p className="text-sm text-slate-500">Order TOR, COR, COG, CAV and more.</p>
          <p className="text-[10px] text-[#2E7D32] mt-2 font-bold uppercase tracking-widest">TRAC Registrar</p>
        </button>

        <button onClick={() => navigate("/track")} className="bg-white p-8 rounded-2xl border border-green-100 shadow-sm hover:shadow-xl hover:border-[#F9A825] transition-all group text-left">
          <div className="w-14 h-14 bg-[#F9A825] text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
            <FaChartBar size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Track Status</h3>
          <p className="text-sm text-slate-500">Real-time update on your requests.</p>
          <p className="text-[10px] text-[#F57F17] mt-2 font-bold uppercase tracking-widest">Queue Tracking</p>
        </button>
      </section>

      {/* Office Information - DYNAMIC from TRAC config */}
      <section className="w-full max-w-4xl bg-white rounded-2xl p-8 shadow-sm border border-green-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-[#1B5E20] rounded-full"></div>
          Office Information - {SCHOOL.shortName}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#F1F8E9] rounded-lg text-[#1B5E20]"><FaClock /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Office Hours</p>
              <p className="text-sm font-bold text-slate-700">{officeHours}</p>
              <p className="text-xs text-slate-500">{OFFICE.schedule.days}</p>
              <p className="text-[10px] text-amber-600 mt-1">{OFFICE.schedule.closedNote}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#FFF8E1] rounded-lg text-[#F57F17]"><FaSpinner /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing</p>
              <p className="text-sm font-bold text-slate-700">{OFFICE.processing.regular}</p>
              <p className="text-xs text-slate-500">Regular Requests</p>
              <p className="text-[10px] text-slate-400 mt-1">First-come, first-served</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-50 rounded-lg text-[#2E7D32]"><FaEnvelope /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notifications</p>
              <p className="text-sm font-bold text-[#2E7D32]">Email System Active</p>
              <p className="text-xs text-slate-500">Check your inbox</p>
              <p className="text-[10px] text-slate-400 mt-1">{SCHOOL.contact.email}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-green-50">
          <p className="text-xs text-gray-500 text-center">
            <strong>Programs:</strong> BSIT, BSIS, BSCRIM, BTVTED, BTLED, BSHM, BSHRRM, BSHT, BSA, BSF, BSAB, MAEd, MSA, MSAgEd, MSAg.Mgt.
          </p>
        </div>
      </section>
    </div>
  );
}
