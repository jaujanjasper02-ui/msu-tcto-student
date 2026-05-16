import { useState, useEffect } from 'react'
import { 
  FaSearch, 
  FaSpinner, 
  FaInfoCircle, 
  FaPhone, 
  FaEnvelope, 
  FaCopy, 
  FaBuilding, 
  FaClock, 
  FaFileAlt, 
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaUserTie,
  FaCheckCircle,
  FaArrowLeft,
  FaList,
  FaCalendarAlt,
  FaFileSignature
} from 'react-icons/fa'
import { useParams, useNavigate, Link } from 'react-router-dom'

// =============================================
// DOCUMENT PRICE LIST (Fallback)
// =============================================
const DOCUMENT_PRICES = {
  'Transcript of Records (TOR)': 50.00,
  'Authentication': 50.00,
  'Transfer Credential/Honorable Dismissal': 50.00,
  'Report of Grade (ROG)': 20.00,
  'Evaluation of Grades': 20.00,
  'Certificate of Registration(COR)': 5.00,
  'Reprinting Fee and (Grade)': 5.00,
  'Certificate of Grade by semester Reprinting': 5.00,
  'Certification': 50.00,
  'CAV': 150.00,
  'University Clearance Form': 5.00,
  'INC Form': 20.00,
  'Advance Credit/s Form and Substitution Form': 20.00,
  'Application for Graduation Form': 50.00
}

const DEFAULT_PRICE = 0.00

export default function TrackStatus() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [searchInput, setSearchInput] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [requestData, setRequestData] = useState(null)
  const [error, setError] = useState('')
  const [userRequests, setUserRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    pending: 0,
    processing: 0,
    ready: 0,
    claimed: 0,
    rejected: 0,
    total: 0
  })

  // 🆕 DYNAMIC SETTINGS FROM DATABASE
  const [officeHours, setOfficeHours] = useState("Monday-Friday, 8:00 AM - 4:45 PM")
  const [contactNumber, setContactNumber] = useState("(068) 123-4567")
  const [locationInfo, setLocationInfo] = useState("Registrar Office, MSU-TCTO, Sanga-Sanga, Bongao Tawi-Tawi")

  const API_BASE_URL = 'https://msu-tcto-backend-nta0.onrender.com/api/requests'
  const ADMIN_API_URL = 'https://msu-tcto-backend-nta0.onrender.com/api'

  // 🆕 FETCH PUBLIC SETTINGS
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${ADMIN_API_URL}/admin/settings/public`);
        if (response.ok) {
          const data = await response.json()
          if (data.office_hours) setOfficeHours(data.office_hours)
          // Kung may contact_email o iba pang settings, maaari ring i-set dito
        }
      } catch (err) {
        console.warn('Using default settings')
      }
    }
    fetchSettings()
  }, [])

  // =============================================
  // HELPER FUNCTIONS
  // =============================================
  const calculateAmount = (docType, copies = 1) => {
    const price = DOCUMENT_PRICES[docType] || DEFAULT_PRICE
    return (price * copies).toFixed(2)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    try {
      let date;
      if (dateString instanceof Date) date = dateString;
      else if (typeof dateString === 'string') {
        if (dateString.includes('T')) date = new Date(dateString);
        else if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const [year, month, day] = dateString.split('-');
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else date = new Date(dateString);
      } else if (typeof dateString === 'number') date = new Date(dateString);
      if (date && !isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      }
      return '—';
    } catch (e) { return '—'; }
  }

  const formatFullDate = (dateString) => {
    if (!dateString) return null
    try {
      let date;
      if (dateString instanceof Date) date = dateString;
      else if (typeof dateString === 'string') {
        if (dateString.includes('T')) date = new Date(dateString);
        else if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const [year, month, day] = dateString.split('-');
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else date = new Date(dateString);
      } else if (typeof dateString === 'number') date = new Date(dateString);
      if (date && !isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      }
      return null;
    } catch (e) { return null; }
  }

  const fetchUserRequests = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('You are not logged in. Please login to continue.')
        setLoading(false)
        return
      }
      const response = await fetch(`${API_BASE_URL}/user/requests`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || data.error || 'Failed to fetch requests')
      const transformedRequests = data.requests.map(req => ({
        id: req.tracking_code,
        docType: req.document,
        requestDate: formatDate(req.date_submitted),
        status: req.status,
        queue_number: req.queue_number
      }))
      setUserRequests(transformedRequests)
      setStats(data.stats || { pending: 0, processing: 0, ready: 0, claimed: 0, rejected: 0, total: data.pagination?.total || 0 })
    } catch (err) {
      console.error('❌ Error fetching user requests:', err)
      setError(err.message || 'Failed to load your requests')
    } finally { setLoading(false) }
  }

  const fetchRequestDetails = async (trackingCode) => {
    setLoading(true)
    setIsSearching(true)
    setError('')
    setRequestData(null)
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('You are not logged in. Please login to continue.')
        setLoading(false)
        return
      }
      const response = await fetch(`${API_BASE_URL}/user/requests/${trackingCode}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || data.error || 'Request not found')
      const calculatedAmount = calculateAmount(data.request_type, data.copies)
      const transformedData = {
        id: data.tracking_code,
        trackingCode: data.tracking_code,
        docType: data.request_type,
        purpose: 'Document Request',
        status: data.status,
        amount: calculatedAmount,
        paymentStatus: 'Unpaid',
        orNumber: '—',
        copies: data.copies,
        requestDate: formatFullDate(data.date_sent) || data.date_sent,
        processingTime: getProcessingTime(data.request_type),
        estimatedCompletion: formatFullDate(data.estimated_completion_date) || data.estimated_completion_date,
        processed_date: data.processed_date,
        approvedDate: formatFullDate(data.processed_date),
        readyDate: formatFullDate(data.ready_date),
        claimedDate: formatFullDate(data.claimed_date),
        rejectedDate: formatFullDate(data.rejected_date),
        rejectedReason: data.rejected_reason,
        queue_number: data.queue_number,
        officerInCharge: 'Registrar Office',
        contact: contactNumber,
        location: locationInfo,
        officeHours: officeHours,
        requirements: ['Valid ID', 'Official Receipt from Cashier', 'Authorization Letter (if representative)']
      }
      setRequestData(transformedData)
    } catch (err) {
      console.error('❌ Error fetching request details:', err)
      setError(err.message || `Request not found: ${trackingCode}`)
    } finally { setLoading(false); setIsSearching(false) }
  }

  useEffect(() => { fetchUserRequests() }, [])
  useEffect(() => { if (id) { setSearchInput(id); fetchRequestDetails(id) } }, [id])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchInput.trim()) { setError('Please enter a Request ID'); return }
    navigate(`/track/${searchInput.trim()}`)
  }

  const clearSearch = () => {
    setSearchInput('')
    setRequestData(null)
    setError('')
    navigate('/track', { replace: true })
  }

  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); alert('✓ Copied to clipboard!') }

  const getProcessingTime = (docType) => {
    const times = {
      'Transcript of Records (TOR)': '3-6 working days',
      'Authentication': '2 working days',
      'Transfer Credential/Honorable Dismissal': '3 working days',
      'Report of Grade (ROG)': '1 working day',
      'Evaluation of Grades': '1 working day',
      'Certificate of Registration(COR)': '1 working day',
      'Reprinting Fee and (Grade)': '1 working day',
      'Certificate of Grade by semester Reprinting': '1 working day',
      'Certification': '2 working days',
      'CAV': '2 working days',
      'University Clearance Form': '1 working day',
      'INC Form': '1 working day',
      'Advance Credit/s Form and Substitution Form': '1 working day',
      'Application for Graduation Form': '1 working day'
    }
    return times[docType] || '3-5 working days'
  }

  const getStatusConfig = (status) => {
    const config = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ Pending' },
      'processing': { bg: 'bg-indigo-100', text: 'text-indigo-800', label: '⚙️ Processing' },
      'approved': { bg: 'bg-indigo-100', text: 'text-indigo-800', label: '⚙️ Processing' },
      'ready': { bg: 'bg-purple-100', text: 'text-purple-800', label: '📦 Ready' },
      'claimed': { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Claimed' },
      'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Rejected' }
    }
    return config[status] || config.pending
  }

  const getPaymentStatusBadge = (status) => status === 'Paid' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'

  const getTimeline = (status, request) => {
    const baseTimeline = [{ title: 'Request Submitted', description: 'Your request has been received by the system', date: request.requestDate, status: 'completed' }]
    if (status === 'pending') return [...baseTimeline, { title: 'Pending Approval', description: 'Waiting for registrar staff to review your request', date: '—', status: 'pending' }]
    if (request.processed_date || status !== 'pending') baseTimeline.push({ title: 'Approved and Processing', description: `Your request has been approved and is now being processed. Amount to pay: ₱${request.amount}`, date: formatFullDate(request.processed_date) || request.requestDate, status: 'completed' })
    if (status === 'ready' || status === 'claimed') baseTimeline.push({ title: 'Ready for Pickup', description: 'Your document is now ready for pickup at the Registrar Office', date: formatFullDate(request.ready_date) || request.requestDate, status: 'completed' })
    if (status === 'claimed') baseTimeline.push({ title: 'Claimed', description: `Document claimed. OR Number: ${request.orNumber || 'OR-12345'}`, date: formatFullDate(request.claimed_date) || request.requestDate, status: 'completed' })
    if (status === 'rejected') baseTimeline.push({ title: 'Request Rejected', description: request.rejectedReason || 'Your request was rejected. Please contact the Registrar Office.', date: formatFullDate(request.rejected_date) || request.requestDate, status: 'rejected' })
    return baseTimeline
  }

  const StatusBadge = ({ status }) => { const config = getStatusConfig(status); return <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>{config.label}</span> }
  const TimelineIcon = ({ status }) => status === 'completed' ? <FaCheckCircle className="w-5 h-5 text-green-500" /> : status === 'rejected' ? <FaExclamationTriangle className="w-5 h-5 text-red-500" /> : <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
  const TimelineItem = ({ title, description, date, status, isLast, request }) => (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center"><TimelineIcon status={status} /></div>
        {!isLast && <div className="w-0.5 h-full bg-gray-300 mt-2"></div>}
      </div>
      <div className={`pb-6 flex-1 ${isLast ? '' : 'border-b border-gray-100'}`}>
        <div className="flex items-center justify-between mb-2"><h4 className="font-bold text-gray-800">{title}</h4><div className="text-sm text-gray-500">{date && date !== '—' ? formatFullDate(date) : 'Pending'}</div></div>
        <p className="text-gray-600 text-sm">{description}</p>
        {title === 'Approved and Processing' && <div className="mt-2 p-2 bg-blue-50 rounded-lg inline-block"><p className="text-xs text-blue-700 font-medium">💰 Amount to pay: ₱{request.amount}</p></div>}
      </div>
    </div>
  )

  const RequestCard = ({ request }) => {
    const config = getStatusConfig(request.status)
    return (
      <Link to={`/track/${request.id}`} className="block bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition hover:border-[#0038A8]/30 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaFileAlt className="text-blue-600 text-lg" />
            <div>
              <h3 className="font-semibold text-gray-800">{request.docType}</h3>
              <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>{config.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaCalendarAlt className="text-gray-400" />
            <span>{request.requestDate}</span>
          </div>
        </div>
        {request.queue_number && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
            <span className="text-xs text-gray-500">Queue #:</span>
            <span className="inline-flex items-center justify-center w-7 h-7 bg-gradient-to-r from-[#7A0019]/10 to-[#0038A8]/10 rounded-full text-sm font-bold text-[#7A0019]">
              {request.queue_number}
            </span>
          </div>
        )}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl mx-auto">
        {id && <button onClick={clearSearch} className="mb-4 flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition"><FaArrowLeft className="text-sm" /><span>Back to All Requests</span></button>}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-[#7A0019] to-[#0038A8] bg-clip-text text-transparent">
            Track Your Requests
          </h1>
          <p className="text-gray-600">{requestData ? '' : 'View and track all your document requests'}</p>
        </div>
        
        {!requestData && !id && !loading && userRequests.length > 0 && (
          <div className="grid grid-cols-5 gap-2 mb-4 text-center text-xs">
            <div className="bg-yellow-50 p-2 rounded-lg"><span className="font-bold text-yellow-800">{stats.pending}</span><p className="text-yellow-600">Pending</p></div>
            <div className="bg-indigo-50 p-2 rounded-lg"><span className="font-bold text-indigo-800">{stats.processing}</span><p className="text-indigo-600">Processing</p></div>
            <div className="bg-purple-50 p-2 rounded-lg"><span className="font-bold text-purple-800">{stats.ready}</span><p className="text-purple-600">Ready</p></div>
            <div className="bg-green-50 p-2 rounded-lg"><span className="font-bold text-green-800">{stats.claimed}</span><p className="text-green-600">Claimed</p></div>
            <div className="bg-red-50 p-2 rounded-lg"><span className="font-bold text-red-800">{stats.rejected}</span><p className="text-red-600">Rejected</p></div>
          </div>
        )}
        
        {!requestData && !isSearching && !id && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      value={searchInput} 
                      onChange={(e) => setSearchInput(e.target.value)} 
                      placeholder="Enter Request ID to track (e.g., REQ-20260212-933)" 
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A0019] focus:border-transparent outline-none" 
                    />
                  </div>
                </div>
                <button type="submit" disabled={!searchInput.trim()} className="px-6 py-3 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
                  <FaSearch /> Track Request
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">You can find your Request ID in your Email</p>
            </form>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-700">{error}</p>
                    <p className="text-sm text-red-600 mt-1">Please check your Request ID and try again</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FaSpinner className="animate-spin text-3xl text-[#7A0019] mx-auto mb-4" />
            <p className="text-gray-600">Loading your requests...</p>
          </div>
        )}
        
        {!loading && !requestData && !id && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><FaList className="text-[#7A0019]" /> Your Recent Requests</h2>
              <span className="text-sm text-gray-500">{userRequests.length} {userRequests.length === 1 ? 'request' : 'requests'}</span>
            </div>
            {userRequests.length > 0 ? (
              <div>{userRequests.map(request => <RequestCard key={request.id} request={request} />)}</div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileSignature className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">You haven't made any document requests. Start by requesting a document or form.</p>
                <button onClick={() => navigate('/request')} className="px-6 py-3 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white rounded-lg font-medium hover:opacity-90 transition">Make a Request</button>
              </div>
            )}
          </div>
        )}
        
        {requestData && !loading && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <FaFileAlt className="text-[#7A0019] text-xl" />
                      <h2 className="text-xl font-semibold text-gray-900">{requestData.docType}</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-mono bg-gray-100 px-3 py-1 rounded-md text-gray-700">{requestData.id}</span>
                      <button onClick={() => copyToClipboard(requestData.id)} className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded" title="Copy Request ID">
                        <FaCopy className="text-xs" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Requested on {requestData.requestDate} • {requestData.purpose}</p>
                    {requestData.status === 'rejected' && requestData.rejectedReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                        <p className="text-sm text-red-700">{requestData.rejectedReason}</p>
                      </div>
                    )}
                  </div>
                  <StatusBadge status={requestData.status} />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {requestData.queue_number && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Queue Position</p>
                  <p className="font-bold text-[#7A0019] text-3xl">#{requestData.queue_number}</p>
                 </div>
              )}
              
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Amount</p>
                <p className="font-bold text-[#7A0019] text-lg">₱{requestData.amount}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${getPaymentStatusBadge(requestData.paymentStatus)}`}>{requestData.paymentStatus}</span>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Est. Completion</p>
                <p className="font-medium text-gray-900">{requestData.estimatedCompletion || '—'}</p>
                <p className="text-xs text-gray-500">{requestData.processingTime}</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Copies</p>
                <p className="font-medium text-gray-900">{requestData.copies}</p>
                <p className="text-xs text-gray-500">{requestData.copies === 1 ? 'copy' : 'copies'}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2"><FaClock className="text-[#7A0019]" /> Request Timeline</h3>
              <div className="space-y-4">{getTimeline(requestData.status, requestData).map((item, index, arr) => <TimelineItem key={index} title={item.title} description={item.description} date={item.date} status={item.status} isLast={index === arr.length - 1} request={requestData} />)}</div>
            </div>
            
            {requestData.status === 'ready' && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg"><FaCheckCircle className="text-purple-700 text-xl" /></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-purple-900 mb-3">📦 READY FOR PICKUP!</h4>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border border-purple-200">
                        <p className="font-medium text-gray-800 mb-2">📍 CLAIM INSTRUCTIONS:</p>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li className="text-gray-700"><span className="font-medium">Go to Cashier Office</span> - Pay ₱{requestData.amount} and get Official Receipt</li>
                          <li className="text-gray-700"><span className="font-medium">Go to Registrar Office</span> - Present Official Receipt and Valid ID</li>
                          <li className="text-gray-700"><span className="font-medium">Claim your document</span> - Sign the release form</li>
                        </ol>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-purple-800">
                        <FaInfoCircle className="mt-0.5 flex-shrink-0" />
                        <p>Claim within 30 days, otherwise the document will be forfeited.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {requestData.status === 'claimed' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg"><FaCheckCircle className="text-green-700 text-xl" /></div>
                  <div>
                    <h4 className="font-bold text-green-900 mb-1">✓ Document Claimed</h4>
                    <p className="text-green-800 text-sm">Your document has been successfully claimed. Thank you for using MSU-TCTO Registrar System.</p>
                  </div>
                </div>
              </div>
            )}
            
            {requestData.status === 'rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg"><FaExclamationTriangle className="text-red-700 text-xl" /></div>
                  <div>
                    <h4 className="font-bold text-red-900 mb-1">Request Rejected</h4>
                    <p className="text-red-800 text-sm">{requestData.rejectedReason || 'Your request was rejected. Please contact the Registrar Office for more information.'}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* 🆕 PICKUP INFORMATION - WITH DYNAMIC OFFICE HOURS */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><FaBuilding className="text-[#7A0019]" /> Pickup Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location</p>
                      <p className="text-sm text-gray-600">{locationInfo}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaClock className="text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Office Hours</p>
                      <p className="text-sm text-gray-600">{officeHours}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FaPhone className="text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Contact</p>
                      <p className="text-sm text-gray-600">{contactNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Required for Pickup:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li className="text-sm text-gray-600">Valid ID</li>
                  <li className="text-sm text-gray-600">Official Receipt from Cashier</li>
                  <li className="text-sm text-gray-600">Authorization Letter (if representative)</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button onClick={() => navigate('/request')} className="flex-1 py-3 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white rounded-xl font-medium hover:opacity-90 transition">New Request</button>
              <button onClick={clearSearch} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">Back to All Requests</button>
            </div>
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">© {new Date().getFullYear()} Mindanao State University - Tawi-Tawi College of Technology and Oceanography</p>
        </div>
      </div>
    </div>
  )
}