import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCopy, FaCheckCircle, FaEnvelope, FaPhone, FaHome, FaList } from 'react-icons/fa';

export default function Submitted() {
  const location = useLocation();
  const navigate = useNavigate();
  const request = location.state || {};

  const queueNumber = request.queue_number;
  const showQueueCard = queueNumber && queueNumber !== '—';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#7A0019] to-[#0038A8] rounded-full mb-4 shadow-lg">
            <FaCheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7A0019] to-[#0038A8] bg-clip-text text-transparent">
            Request Submitted!
          </h1>
          <p className="text-gray-500 mt-2">Your request has been received and is now in queue.</p>
        </div>

        {/* Success Alert - Email only */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">Request submitted successfully!</p>
              <p className="text-sm text-green-700 mt-1">
                You will receive <strong>Email notifications</strong> for status updates.
              </p>
            </div>
          </div>
        </div>

        {/* 🆕 QUEUE NUMBER CARD - Actual from backend */}
        {showQueueCard && (
          <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-100 shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full -ml-12 -mb-12 opacity-50"></div>
            
            <div className="relative p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-md">
                <FaList className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Your Queue Number</h3>
              <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                #{queueNumber}
              </p>
              <p className="text-sm text-gray-600">
                You are <span className="font-semibold text-blue-600">#{queueNumber}</span> in line for today
              </p>
            </div>
          </div>
        )}

        {/* Request Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
            <h3 className="font-semibold text-gray-800">Request Summary</h3>
          </div>
          
          <div className="p-6 space-y-5">
            {/* Tracking Code */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tracking Code</p>
                  <p className="font-mono font-medium text-gray-800">{request.tracking_code || 'REQ-20260331-001'}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(request.tracking_code || 'REQ-20260331-001')}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition"
                  title="Copy Tracking Code"
                >
                  <FaCopy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Use this code to check your request status</p>
            </div>

            {/* Document Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Document Type</p>
                <p className="font-medium text-gray-800">{request.request_type || 'Transcript of Records (TOR)'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Purpose</p>
                <p className="font-medium text-gray-800">{request.purpose || 'Board Exam Application'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Copies</p>
                <p className="font-medium text-gray-800">{request.copies || 3}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Fee</p>
                <p className="font-bold text-[#7A0019]">{request.fee || '₱150.00'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Submitted</p>
                <p className="text-sm text-gray-700">{formatDate(request.date_submitted) || 'Mar 31, 2026, 10:30 AM'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Est. Completion</p>
                <p className="text-sm font-medium text-[#7A0019]">{request.estimated_completion || 'Apr 6, 2026'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps - Email only */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
            <h3 className="font-semibold text-gray-800">Next Steps</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-800">Wait for Email Notification</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    You will receive an <strong>email</strong> when your request status changes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-800">Payment</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Proceed to the Cashier's Office for payment
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-800">Pickup</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Bring your official receipt and valid ID when picking up
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Need Assistance - Email only */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Need Assistance?</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <FaEnvelope className="text-[#7A0019] w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium">registrar@msutcto.edu.ph</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <FaPhone className="text-[#0038A8] w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium">(068) 268-4231</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-200">
            Office Hours: Monday to Friday, 8:00 AM - 4:45 PM
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white rounded-xl font-medium hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <FaHome className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => navigate(`/track/${request.tracking_code || 'REQ-20260331-001'}`)}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
          >
            Track Status
          </button>
        </div>
      </div>
    </div>
  );
}