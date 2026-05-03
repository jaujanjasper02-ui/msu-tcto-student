import Card from '../components/Card'
import Button from '../components/Button'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaInfoCircle, 
  FaClock, 
  FaEnvelope,
  FaBuilding, 
  FaFileAlt, 
  FaFileSignature, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaDownload, 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaUserCheck,
  FaSpinner,
  FaUserGraduate,
  FaUserTie,
  FaWifi,
  FaServer
} from 'react-icons/fa'

export default function RequestDocument() {
  const [formData, setFormData] = useState({
    category: '',
    request_type: '',
    purpose: '',
    copies: 1
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [authError, setAuthError] = useState(false)
  const [networkError, setNetworkError] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const nav = useNavigate()

  // ===========================================
  // GET CURRENT USER ROLE
  // ===========================================
  useEffect(() => {
    const userStr = localStorage.getItem('currentUser')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setCurrentUser(user)
        console.log('👤 Current user:', user)
      } catch (error) {
        console.error('Error parsing user:', error)
      }
    }
  }, [])

  // ===========================================
  // DOCUMENT TYPES - FILTERED BY ROLE
  // ===========================================
  const allDocumentTypes = [
    { value: 'Transcript of Records (TOR)', label: 'Transcript of Records (TOR)', days: 6, fee: 50.00, feeDisplay: '₱50.00', category: 'Document', allowedRoles: ['alumni'] },
    { value: 'Authentication', label: 'Authentication', days: 2, fee: 50.00, feeDisplay: '₱50.00', category: 'Document', allowedRoles: ['alumni'] },
    { value: 'Transfer Credential/Honorable Dismissal', label: 'Transfer Credential/Honorable Dismissal', days: 3, fee: 50.00, feeDisplay: '₱50.00', category: 'Document', allowedRoles: ['student', 'alumni'] },
    { value: 'Report of Grade (ROG)', label: 'Report of Grade (ROG)', days: 1, fee: 20.00, feeDisplay: '₱20.00', category: 'Document', allowedRoles: ['student', 'alumni'] },
    { value: 'Evaluation of Grades', label: 'Evaluation of Grades', days: 1, fee: 20.00, feeDisplay: '₱20.00', category: 'Document', allowedRoles: ['student', 'alumni'] },
    { value: 'Certificate of Registration(COR)', label: 'Certificate of Registration(COR)', days: 1, fee: 5.00, feeDisplay: '₱5.00', category: 'Document', allowedRoles: ['student'] },
    { value: 'Reprinting Fee and (Grade)', label: 'Reprinting Fee', days: 1, fee: 5.00, feeDisplay: '₱5.00', category: 'Document', allowedRoles: ['student', 'alumni'] },
    { value: 'Certificate of Grade by semester Reprinting', label: 'Certificate of Grade by semester', days: 1, fee: 5.00, feeDisplay: '₱5.00', category: 'Document', allowedRoles: ['student', 'alumni'] },
    { value: 'Certification', label: 'Certification', days: 2, fee: 50.00, feeDisplay: '₱50.00', category: 'Document', allowedRoles: ['student', 'alumni'] },
    { value: 'CAV', label: 'CAV', days: 2, fee: 150.00, feeDisplay: '₱150.00', category: 'Document', allowedRoles: ['alumni'] }
  ]

  const documentTypes = useMemo(() => {
    if (!currentUser) return []
    return allDocumentTypes.filter(doc => 
      doc.allowedRoles.includes(currentUser.role)
    )
  }, [currentUser])

  const formTypes = [
    { value: 'University Clearance Form', label: 'University Clearance Form', days: 1, fee: 5.00, feeDisplay: '₱5.00', category: 'Form', allowsMultiple: false },
    { value: 'INC Form', label: 'INC Form', days: 1, fee: 20.00, feeDisplay: '₱20.00', category: 'Form', allowsMultiple: true, multipleLabel: 'subject' },
    { value: 'Advance Credit/s Form and Substitution Form', label: 'Advance Credit/s Form and Substitution Form', days: 1, fee: 20.00, feeDisplay: '₱20.00', category: 'Form', allowsMultiple: false },
    { value: 'Application for Graduation Form', label: 'Application for Graduation Form', days: 1, fee: 50.00, feeDisplay: '₱50.00', category: 'Form', allowsMultiple: false }
  ]

  const API_BASE_URL = 'http://localhost:5000/api'

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('currentUser')
    
    if (!token || !user) {
      setAuthError(true)
      setSubmitError('You are not logged in. Please sign in to make requests.')
    } else {
      setAuthError(false)
      setNetworkError(false)
    }
  }, [])

  const getAuthToken = () => {
    return localStorage.getItem('authToken')
  }

  const submitRequest = async (requestData) => {
    const token = getAuthToken()
    
    if (!token) {
      throw new Error('AUTH_NO_TOKEN')
    }

    console.log('📤 Submitting to backend:', {
      url: `${API_BASE_URL}/requests/request`,
      requestData: requestData
    })

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(`${API_BASE_URL}/requests/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      const data = await response.json()
      console.log('📥 Backend response:', { status: response.status, data })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('AUTH_FAILED')
        }
        if (response.status === 0 || response.status === 500) {
          throw new Error('SERVER_ERROR')
        }
        throw new Error(data.message || data.error || 'Failed to submit request')
      }

      return data
    } catch (error) {
      console.error('❌ Fetch error:', error)
      if (error.name === 'AbortError') {
        throw new Error('TIMEOUT_ERROR')
      }
      if (error.message === 'Failed to fetch') {
        throw new Error('NETWORK_ERROR')
      }
      throw error
    }
  }

  const handleInputChange = (field, value) => {
    if (field === 'category') {
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        request_type: '',
        copies: 1
      }))
    } else if (field === 'copies') {
      setFormData(prev => ({ 
        ...prev, 
        [field]: parseInt(value) || 1 
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
    
    if (submitError) {
      setSubmitError('')
      setNetworkError(false)
    }
  }

  const handleDocumentSelect = (e) => {
    const selectedValue = e.target.value
    handleInputChange('request_type', selectedValue)
  }

  const handleFormSelect = (e) => {
    const selectedValue = e.target.value
    handleInputChange('request_type', selectedValue)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.category) {
      newErrors.category = 'Select request type.'
    }
    
    if (!formData.request_type) {
      newErrors.request_type = 'Select a document or form.'
    }
    
    if (!formData.copies || formData.copies < 1) {
      newErrors.copies = 'Invalid number of copies.'
    }
    if (formData.copies > 5) {
      newErrors.copies = 'Maximum 5 copies allowed.'
    }
    
    if (formData.category === 'Form') {
      const selectedForm = formTypes.find(f => f.value === formData.request_type)
      if (selectedForm && !selectedForm.allowsMultiple && formData.copies > 1) {
        newErrors.copies = 'This form only allows 1 copy.'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getSelectedItem = useMemo(() => {
    if (formData.category === 'Document') {
      return documentTypes.find(doc => doc.value === formData.request_type)
    } else if (formData.category === 'Form') {
      return formTypes.find(form => form.value === formData.request_type)
    }
    return null
  }, [formData.category, formData.request_type, documentTypes])

  const allowsMultipleCopies = useMemo(() => {
    if (!getSelectedItem) return false
    if (formData.category === 'Document') return true
    if (formData.category === 'Form') return getSelectedItem.allowsMultiple || false
    return false
  }, [getSelectedItem, formData.category])

  const calculateTotalFee = useMemo(() => {
    if (!getSelectedItem) return '₱0.00'
    const total = getSelectedItem.fee * formData.copies
    return `₱${total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  }, [getSelectedItem, formData.copies])

  const getEstimatedCompletionDate = useMemo(() => {
    if (!getSelectedItem) return null
    
    const today = new Date()
    const estimatedDate = new Date(today)
    estimatedDate.setDate(today.getDate() + getSelectedItem.days)
    
    let daysToAdd = getSelectedItem.days
    let currentDate = new Date(today)
    let workingDaysAdded = 0
    
    while (workingDaysAdded < daysToAdd) {
      currentDate.setDate(currentDate.getDate() + 1)
      const dayOfWeek = currentDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDaysAdded++
      }
    }
    
    return {
      iso: currentDate.toISOString(),
      formatted: currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      short: currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).split('/').join('-')
    }
  }, [getSelectedItem])

  const handleAuthError = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    localStorage.removeItem('authResponse')
    nav('/', { 
      state: { 
        error: 'Your session has expired. Please login again.' 
      } 
    })
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    setSubmitError('')
    setNetworkError(false)
    setAuthError(false)
  }

  async function submit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setAuthError(false);
    setNetworkError(false);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const requestData = {
        category: formData.category,
        request_type: formData.request_type,
        purpose: formData.purpose?.trim() || 'Not specified',
        copies: formData.copies,
        processing_days: getSelectedItem?.days || 1
      };

      console.log('🚀 Sending request to backend:', requestData);

      const response = await submitRequest(requestData);
      
      console.log('✅ Request successful:', response);

      const successData = {
        request_id: response.request_id,
        request_type: response.request_type,
        purpose: response.purpose,
        date_submitted: response.date_submitted,
        copies: response.copies,
        estimated_completion: response.estimated_completion?.formatted || getEstimatedCompletionDate?.formatted,
        tracking_code: response.tracking_code,
        display_name: getSelectedItem?.label || formData.request_type,
        category: formData.category,
        fee: calculateTotalFee,
        queue_number: response.queue_number  // ✅ FIXED: Added queue_number
      };

      console.log('📦 Success data for UI:', successData);

      localStorage.setItem('currentRequest', JSON.stringify(successData));
      
      nav('/submitted', { 
        state: successData
      });
      
    } catch (error) {
      console.error('❌ Submission error:', error);
      
      if (error.message === 'AUTH_NO_TOKEN') {
        setAuthError(true)
        setSubmitError('You are not logged in. Please sign in to make requests.')
      } else if (error.message === 'AUTH_FAILED') {
        setAuthError(true)
        setSubmitError('Your session has expired. Please login again.')
        localStorage.removeItem('authToken')
      } else if (error.message === 'NETWORK_ERROR') {
        setNetworkError(true)
        setSubmitError('Network connection error. Please check your internet connection.')
      } else if (error.message === 'TIMEOUT_ERROR') {
        setNetworkError(true)
        setSubmitError('Request timeout. The server is taking too long to respond.')
      } else if (error.message === 'SERVER_ERROR') {
        setNetworkError(true)
        setSubmitError('Server error. Please try again later.')
      } else {
        setSubmitError(error.message || 'Failed to submit request. Please try again.')
      }
      
      localStorage.setItem('failedRequest', JSON.stringify({
        ...formData,
        error: error.message,
        timestamp: new Date().toISOString()
      }))
    } finally {
      setIsSubmitting(false);
    }
  }

  const RoleBadge = () => {
    if (!currentUser) return null
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
        currentUser.role === 'student' 
          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
          : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
      }`}>
        {currentUser.role === 'student' ? <FaUserGraduate /> : <FaUserTie />}
        <span>{currentUser.role === 'student' ? 'Student' : 'Alumni'}</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7A0019] to-[#0038A8] bg-clip-text text-transparent">
            Document/Form Request
          </h1>
        </div>
        
        <div className="flex justify-center mb-3">
          <RoleBadge />
        </div>
      </div>

      {/* Error messages */}
      {authError && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
            <div className="p-2 bg-red-100 rounded-full">
              <FaExclamationTriangle className="text-red-600 text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-800 text-lg mb-2">Authentication Required</h3>
              <p className="text-red-700 mb-4">{submitError || 'Please sign in to submit requests.'}</p>
              <div className="flex gap-3">
                <button
                  onClick={handleAuthError}
                  className="px-6 py-2 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white rounded-lg font-medium hover:shadow-md transition"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => setAuthError(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {networkError && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 flex items-start gap-4">
            <div className="p-2 bg-orange-100 rounded-full">
              <FaWifi className="text-orange-600 text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-orange-800 text-lg mb-2">Connection Error</h3>
              <p className="text-orange-700 mb-4">{submitError}</p>
              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white rounded-lg font-medium hover:shadow-md transition"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setNetworkError(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!authError && !networkError && submitError && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <FaExclamationTriangle className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-red-800">Submission Failed</h3>
              <p className="text-sm text-red-700 mt-1">{submitError}</p>
              <button 
                onClick={() => setSubmitError('')}
                className="text-sm text-red-600 hover:text-red-800 underline mt-2"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className={`shadow-sm rounded-xl p-6 border border-gray-200 ${authError ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Request Details</h3>
            </div>
            
            <form className="space-y-6" onSubmit={submit}>
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('category', 'Document')}
                    disabled={authError || isSubmitting || networkError}
                    className={`p-5 border-2 rounded-xl text-center transition-all duration-300 transform hover:scale-[1.02] ${
                      formData.category === 'Document'
                        ? 'border-[#7A0019] bg-gradient-to-br from-[#7A0019]/10 to-[#0038A8]/5 shadow-lg'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    } ${(authError || isSubmitting || networkError) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                      formData.category === 'Document'
                        ? 'bg-gradient-to-r from-[#7A0019] to-[#9A0029] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <FaFileAlt className="text-xl" />
                    </div>
                    <div className="font-bold text-gray-800">Document</div>
                    <div className="text-xs text-gray-600 mt-1">Transcripts, Certificates</div>
                    {formData.category === 'Document' && (
                      <div className="mt-2">
                        <FaCheckCircle className="inline text-green-600 mr-1" />
                        <span className="text-xs text-green-600 font-medium">Selected</span>
                      </div>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleInputChange('category', 'Form')}
                    disabled={authError || isSubmitting || networkError}
                    className={`p-5 border-2 rounded-xl text-center transition-all duration-300 transform hover:scale-[1.02] ${
                      formData.category === 'Form'
                        ? 'border-[#0038A8] bg-gradient-to-br from-[#0038A8]/10 to-[#7A0019]/5 shadow-lg'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    } ${(authError || isSubmitting || networkError) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                      formData.category === 'Form'
                        ? 'bg-gradient-to-r from-[#0038A8] to-[#0058C8] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <FaFileSignature className="text-xl" />
                    </div>
                    <div className="font-bold text-gray-800">Form</div>
                    <div className="text-xs text-gray-600 mt-1">Clearance, Graduation</div>
                    {formData.category === 'Form' && (
                      <div className="mt-2">
                        <FaCheckCircle className="inline text-blue-600 mr-1" />
                        <span className="text-xs text-blue-600 font-medium">Selected</span>
                      </div>
                    )}
                  </button>
                </div>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <FaExclamationTriangle className="mr-2" /> {errors.category}
                  </p>
                )}
              </div>

              {/* Document Type Dropdown */}
              {formData.category === 'Document' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Document
                  </label>
                  <select
                    value={formData.request_type || ''}
                    onChange={handleDocumentSelect}
                    disabled={authError || isSubmitting || networkError || documentTypes.length === 0}
                    className={`w-full p-3 bg-white border rounded-xl outline-none transition duration-200 ${
                      errors.request_type 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-[#7A0019] focus:ring-2 focus:ring-[#7A0019]'
                    } ${(authError || isSubmitting || networkError || documentTypes.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Choose document...</option>
                    {documentTypes.map(doc => (
                      <option key={doc.value} value={doc.value}>
                        {doc.label}
                      </option>
                    ))}
                  </select>
                  {errors.request_type && formData.category === 'Document' && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <FaExclamationTriangle className="mr-2" /> {errors.request_type}
                    </p>
                  )}
                  {documentTypes.length === 0 && currentUser && (
                    <p className="text-amber-600 text-sm mt-2 flex items-center">
                      <FaInfoCircle className="mr-2" /> No documents available for your role.
                    </p>
                  )}
                </div>
              )}

              {/* Form Type Dropdown */}
              {formData.category === 'Form' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Form
                  </label>
                  <select
                    value={formData.request_type || ''}
                    onChange={handleFormSelect}
                    disabled={authError || isSubmitting || networkError}
                    className={`w-full p-3 bg-white border rounded-xl outline-none transition duration-200 ${
                      errors.request_type 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-[#0038A8] focus:ring-2 focus:ring-[#0038A8]'
                    } ${(authError || isSubmitting || networkError) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Choose form...</option>
                    {formTypes.map(form => (
                      <option key={form.value} value={form.value}>
                        {form.label}
                      </option>
                    ))}
                  </select>
                  {errors.request_type && formData.category === 'Form' && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <FaExclamationTriangle className="mr-2" /> {errors.request_type}
                    </p>
                  )}
                </div>
              )}

              {/* Number of Copies */}
              {(formData.request_type) && allowsMultipleCopies && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.category === 'Form' && getSelectedItem?.multipleLabel 
                      ? `Number of ${getSelectedItem.multipleLabel}s` 
                      : 'Number of Copies'}
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <select
                        value={formData.copies}
                        onChange={(e) => handleInputChange('copies', e.target.value)}
                        disabled={authError || isSubmitting || networkError}
                        className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-[#7A0019] focus:ring-2 focus:ring-[#7A0019] transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>
                            {num} {formData.category === 'Form' && getSelectedItem?.multipleLabel 
                              ? getSelectedItem.multipleLabel + (num > 1 ? 's' : '')
                              : 'cop' + (num > 1 ? 'ies' : '')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Total Fee:</div>
                      <div className="text-xl font-bold text-[#7A0019]">{calculateTotalFee}</div>
                    </div>
                  </div>
                  {errors.copies && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <FaExclamationTriangle className="mr-2" /> {errors.copies}
                    </p>
                  )}
                </div>
              )}

              {/* Single-copy forms notice */}
              {(formData.request_type && formData.category === 'Form' && !allowsMultipleCopies) && (
                <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <FaInfoCircle className="text-blue-600" />
                    <span className="text-sm text-blue-800">
                      This form is issued as a single copy only.
                    </span>
                  </div>
                  {formData.copies > 1 && handleInputChange('copies', 1)}
                </div>
              )}

              {/* Item Info Display */}
              {getSelectedItem && (
                <div className={`mt-3 p-4 rounded-xl border ${
                  formData.category === 'Document' 
                    ? 'bg-gradient-to-r from-[#7A0019]/5 to-[#0038A8]/5 border-[#7A0019]/20'
                    : 'bg-gradient-to-r from-[#0038A8]/5 to-[#7A0019]/5 border-[#0038A8]/20'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        formData.category === 'Document' 
                          ? 'bg-gradient-to-r from-[#7A0019] to-[#9A0029] text-white'
                          : 'bg-gradient-to-r from-[#0038A8] to-[#0058C8] text-white'
                      }`}>
                        {formData.category === 'Document' ? <FaFileAlt /> : <FaFileSignature />}
                      </div>
                      <span className="font-bold text-gray-800">{getSelectedItem.label}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      formData.category === 'Document' 
                        ? 'bg-gradient-to-r from-[#7A0019] to-[#9A0029] text-white'
                        : 'bg-gradient-to-r from-[#0038A8] to-[#0058C8] text-white'
                    }`}>
                      {formData.category}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-500" />
                      <div>
                        <div className="text-gray-600">Processing Time</div>
                        <div className="font-semibold">{getSelectedItem.days} working day(s)</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <FaMoneyBillWave className="text-gray-500" />
                      <div className="text-right">
                        <div className="text-gray-600">Fee per copy</div>
                        <div className="font-semibold text-lg text-[#7A0019]">{getSelectedItem.feeDisplay}</div>
                      </div>
                    </div>
                  </div>
                  
                  {getEstimatedCompletionDate && (
                    <div className="mt-3 pt-3 border-t border-[#7A0019]/20">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#7A0019]" />
                        <div>
                          <div className="text-xs text-gray-600">Estimated completion date:</div>
                          <div className="font-bold text-[#7A0019]">{getEstimatedCompletionDate.formatted}</div>
                          <div className="text-xs text-gray-500 mt-1">(Excludes weekends and holidays)</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {formData.copies > 1 && (
                    <div className="mt-2 pt-2 border-t border-[#7A0019]/20 text-right">
                      <div className="text-sm text-gray-600">
                        Total for {formData.copies} {
                          formData.category === 'Form' && getSelectedItem?.multipleLabel
                            ? getSelectedItem.multipleLabel + 's'
                            : 'copies'
                        }:
                      </div>
                      <div className="text-xl font-bold text-[#7A0019]">{calculateTotalFee}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  placeholder=""
                  disabled={authError || isSubmitting || networkError}
                  className={`w-full p-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-[#7A0019] focus:ring-2 focus:ring-[#7A0019] transition resize-none ${
                    (authError || isSubmitting || networkError) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={authError || isSubmitting || networkError || !formData.category || !formData.request_type}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#7A0019] via-[#8B0033] to-[#0038A8] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-3 text-xl" />
                      <span className="text-lg">Submitting...</span>
                    </div>
                  ) : networkError ? (
                    <div className="flex items-center justify-center">
                      <FaWifi className="mr-3 text-xl" />
                      <span className="text-lg">Check Connection</span>
                    </div>
                  ) : authError ? (
                    <div className="flex items-center justify-center">
                      <FaExclamationTriangle className="mr-3 text-xl" />
                      <span className="text-lg">Sign in to Request</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <FaDownload className="mr-3 text-xl group-hover:animate-bounce" />
                      <span className="text-lg">Submit Request</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Pickup Notice */}
              <div className="mt-4 p-4 bg-gradient-to-r from-[#7A0019]/5 to-[#0038A8]/5 border border-[#7A0019]/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#7A0019] to-[#0038A8] rounded-lg">
                    <FaBuilding className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-[#7A0019]">Office Pickup Required</p>
                    <p className="text-sm text-gray-700 mt-1">
                      Pick up at Registrar's Office. Bring valid ID and receipt.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar - Processing Information */}
        <div className="space-y-6">
          {/* Processing Info Card */}
          <Card className="shadow-sm rounded-xl p-6 border border-gray-200">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-r from-[#7A0019] to-[#0038A8] rounded-lg">
                  <FaInfoCircle className="text-white" />
                </div>
                <h4 className="font-bold text-gray-800 text-lg">Processing Info</h4>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-[#7A0019]/5 to-[#0038A8]/5 rounded-lg">
                  <FaClock className="text-[#7A0019]" />
                  <div>
                    <p className="font-semibold text-gray-800">Processing Time</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Documents: 1-6 working days<br />
                      Forms: 1 working day
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-[#0038A8]/5 to-[#7A0019]/5 rounded-lg">
                  <FaEnvelope className="text-[#0038A8]" />
                  <div>
                    <p className="font-semibold text-gray-800">Email Updates</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Receive email notifications for status updates
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-[#7A0019]/5 to-[#0038A8]/5 rounded-lg">
                  <FaBuilding className="text-[#7A0019]" />
                  <div>
                    <p className="font-semibold text-gray-800">Pickup Location</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Registrar's Office
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <h5 className="font-bold text-gray-700 mb-3">Required for Pickup:</h5>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-[#7A0019] rounded-full"></div>
                  <span>Valid ID</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-[#7A0019] rounded-full"></div>
                  <span>Official Receipt</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-[#7A0019] rounded-full"></div>
                  <span>Authorization Letter (if representative)</span>
                </li>
              </ul>
            </div>
          </Card>

          {/* Office Hours Card */}
          <Card className="shadow-sm rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-gradient-to-r from-[#7A0019] to-[#0038A8] rounded-lg">
                  <FaClock className="text-white" />
                </div>
                <h4 className="font-bold text-gray-800">Office Hours</h4>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-[#7A0019]/10 to-[#0038A8]/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monday - Friday:</span>
                    <span className="text-sm font-bold text-[#7A0019]">8AM - 4:45PM</span>
                  </div>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Weekends:</span>
                    <span className="text-sm font-bold text-red-600">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}