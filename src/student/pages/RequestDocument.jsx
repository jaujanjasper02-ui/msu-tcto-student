import Card from '../components/Card'
import Button from '../components/Button'
import { useState, useEffect, useMemo } from 'react'
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
  FaSpinner,
  FaUserGraduate,
  FaUserTie,
  FaWifi,
  FaBan
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
  const nav = useNavigate()

  // 🆕 REMOVED: todaysRequests state (no longer needed)
  // 🆕 REMOVED: alreadyRequestedTypes and isDuplicateSelected

  // DYNAMIC SETTINGS — lahat galing sa public API
  const [maxCopies, setMaxCopies] = useState(5)
  const [dynamicDocuments, setDynamicDocuments] = useState([])
  const [dynamicForms, setDynamicForms] = useState([])
  const [settingsLoading, setSettingsLoading] = useState(true)

  const API_BASE_URL = 'https://msu-tcto-backend-oh2j.onrender.com/api'

  // ===========================================
  // GET CURRENT USER ROLE
  // ===========================================
  useEffect(() => {
    const userStr = localStorage.getItem('currentUser')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setCurrentUser(user)
      } catch (error) {
        console.error('Error parsing user:', error)
      }
    }
  }, [])

  // ===========================================
  // FETCH PUBLIC SETTINGS — DYNAMIC DOCUMENTS & FORMS
  // ===========================================
  useEffect(() => {
    const fetchPublicSettings = async () => {
      setSettingsLoading(true)
      try {
        const response = await fetch(`${API_BASE_URL}/public/settings`)
        if (response.ok) {
          const data = await response.json()
          setMaxCopies(data.max_copies_per_request || 5)
          
          if (data.document_settings && data.document_settings.length > 0) {
            const docList = []
            const formList = []
            
            data.document_settings.forEach(doc => {
              const item = {
                value: doc.name,
                label: doc.name,
                days: doc.processing_days || 1,
                fee: doc.fee || 0,
                feeDisplay: `₱${(doc.fee || 0).toFixed(2)}`,
                allowedRoles: doc.allowedRoles || ['student', 'alumni'],
                allowsMultiple: doc.name === 'INC Form',
                multipleLabel: doc.name === 'INC Form' ? 'subject' : null
              }
              
              // Category: Document or Form
              if (doc.category === 'Forms' || 
                  doc.name.includes('Form') || 
                  doc.name.includes('Clearance') || 
                  doc.name.includes('INC') || 
                  doc.name.includes('Advance Credit') || 
                  doc.name.includes('Graduation')) {
                item.category = 'Form'
                formList.push(item)
              } else {
                item.category = 'Document'
                docList.push(item)
              }
            })
            
            setDynamicDocuments(docList)
            setDynamicForms(formList)
          }
        } else {
          console.warn('⚠️ Could not fetch public settings, using defaults')
        }
      } catch (err) {
        console.warn('⚠️ Using default settings')
      } finally {
        setSettingsLoading(false)
      }
    }
    fetchPublicSettings()
  }, [])

  // ===========================================
  // FILTER DOCUMENTS/FORMS BY USER ROLE (DYNAMIC)
  // ===========================================
  const documentTypes = useMemo(() => {
    if (!currentUser) return []
    return dynamicDocuments.filter(doc => 
      doc.allowedRoles.includes(currentUser.role)
    )
  }, [currentUser, dynamicDocuments])

  const formTypes = useMemo(() => {
    if (!currentUser) return []
    return dynamicForms.filter(form => 
      form.allowedRoles.includes(currentUser.role)
    )
  }, [currentUser, dynamicForms])

  // 🆕 REMOVED: fetchTodayRequests and related useEffect

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

  const getAuthToken = () => localStorage.getItem('authToken')

  const submitRequest = async (requestData) => {
    const token = getAuthToken()
    if (!token) throw new Error('AUTH_NO_TOKEN')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(`${API_BASE_URL}/requests/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(requestData),
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw new Error('AUTH_FAILED')
      // 🆕 REMOVED: DUPLICATE_REQUEST handling (no longer needed)
      if (response.status === 0 || response.status === 500) throw new Error('SERVER_ERROR')
      throw new Error(data.message || data.error || 'Failed to submit request')
    }
    return data
  }

  const handleInputChange = (field, value) => {
    if (field === 'category') {
      setFormData(prev => ({ ...prev, [field]: value, request_type: '', copies: 1 }))
    } else if (field === 'copies') {
      setFormData(prev => ({ ...prev, [field]: parseInt(value) || 1 }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    if (errors[field]) {
      setErrors(prev => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors })
    }
    if (submitError) { setSubmitError(''); setNetworkError(false) }
  }

  const handleDocumentSelect = (e) => handleInputChange('request_type', e.target.value)
  const handleFormSelect = (e) => handleInputChange('request_type', e.target.value)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.category) newErrors.category = 'Select request type.'
    if (!formData.request_type) newErrors.request_type = 'Select a document or form.'
    // 🆕 REMOVED: duplicate check validation
    if (!formData.copies || formData.copies < 1) newErrors.copies = 'Invalid number of copies.'
    if (formData.copies > maxCopies) newErrors.copies = `Maximum ${maxCopies} copies allowed.`
    
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
    if (formData.category === 'Document') return documentTypes.find(doc => doc.value === formData.request_type)
    if (formData.category === 'Form') return formTypes.find(form => form.value === formData.request_type)
    return null
  }, [formData.category, formData.request_type, documentTypes, formTypes])

  const allowsMultipleCopies = useMemo(() => {
    if (!getSelectedItem) return false
    if (formData.category === 'Document') return true
    if (formData.category === 'Form') return getSelectedItem.allowsMultiple || false
    return false
  }, [getSelectedItem, formData.category])

  const calculateTotalFee = useMemo(() => {
    if (!getSelectedItem) return '₱0.00'
    const total = getSelectedItem.fee * formData.copies
    return `₱${total.toFixed(2)}`
  }, [getSelectedItem, formData.copies])

  const getEstimatedCompletionDate = useMemo(() => {
    if (!getSelectedItem) return null
    let daysToAdd = getSelectedItem.days
    let currentDate = new Date()
    let workingDaysAdded = 0
    while (workingDaysAdded < daysToAdd) {
      currentDate.setDate(currentDate.getDate() + 1)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) workingDaysAdded++
    }
    return {
      formatted: currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }
  }, [getSelectedItem])

  const handleAuthError = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    nav('/', { state: { error: 'Your session has expired. Please login again.' } })
  }

  const copiesArray = useMemo(() => {
    return Array.from({ length: maxCopies }, (_, i) => i + 1)
  }, [maxCopies])

  async function submit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    setAuthError(false)
    setNetworkError(false)
    if (!validateForm()) { setIsSubmitting(false); return }

    try {
      const requestData = {
        category: formData.category,
        request_type: formData.request_type,
        purpose: formData.purpose?.trim() || 'Not specified',
        copies: formData.copies,
        processing_days: getSelectedItem?.days || 1
      }
      const response = await submitRequest(requestData)
      
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
        queue_number: response.queue_number
      }
      localStorage.setItem('currentRequest', JSON.stringify(successData))
      nav('/submitted', { state: successData })
      
    } catch (error) {
      if (error.message === 'AUTH_NO_TOKEN') { setAuthError(true); setSubmitError('You are not logged in.') }
      else if (error.message === 'AUTH_FAILED') { setAuthError(true); setSubmitError('Session expired.'); localStorage.removeItem('authToken') }
      // 🆕 REMOVED: DUPLICATE_REQUEST handling
      else if (error.message === 'NETWORK_ERROR') { setNetworkError(true); setSubmitError('Network error.') }
      else if (error.message === 'SERVER_ERROR') { setNetworkError(true); setSubmitError('Server error.') }
      else { setSubmitError(error.message || 'Failed to submit.') }
    } finally {
      setIsSubmitting(false)
      // 🆕 REMOVED: fetchTodayRequests refresh
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

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#7A0019] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7A0019] to-[#0038A8] bg-clip-text text-transparent">
          Document/Form Request
        </h1>
        <div className="flex justify-center mt-3"><RoleBadge /></div>
      </div>

      {/* Error Messages */}
      {authError && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
            <FaExclamationTriangle className="text-red-600 text-xl mt-1" />
            <div>
              <h3 className="font-bold text-red-800 text-lg">Authentication Required</h3>
              <p className="text-red-700">{submitError || 'Please sign in to submit requests.'}</p>
              <button onClick={handleAuthError} className="mt-3 px-4 py-2 bg-[#7A0019] text-white rounded-lg text-sm">Go to Login</button>
            </div>
          </div>
        </div>
      )}

      {networkError && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 flex items-start gap-4">
            <FaWifi className="text-orange-600 text-xl mt-1" />
            <div>
              <h3 className="font-bold text-orange-800 text-lg">Connection Error</h3>
              <p className="text-orange-700">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      {!authError && !networkError && submitError && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <FaExclamationTriangle className="text-red-600 mt-0.5" />
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        </div>
      )}

      {/* 🆕 REMOVED: Duplicate warning message block */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Request Details</h3>
            
            <form className="space-y-6" onSubmit={submit}>
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => handleInputChange('category', 'Document')}
                    disabled={authError || isSubmitting || networkError}
                    className={`p-5 border-2 rounded-xl text-center transition ${formData.category === 'Document' ? 'border-[#7A0019] bg-[#7A0019]/5 shadow-lg' : 'border-gray-300 hover:bg-gray-50'} ${(authError || isSubmitting || networkError) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${formData.category === 'Document' ? 'bg-[#7A0019] text-white' : 'bg-gray-100 text-gray-600'}`}>
                      <FaFileAlt className="text-xl" />
                    </div>
                    <div className="font-bold text-gray-800">Document</div>
                    <div className="text-xs text-gray-600">Transcripts, Certificates</div>
                    {formData.category === 'Document' && <FaCheckCircle className="inline text-green-600 mt-2" />}
                  </button>
                  
                  <button type="button" onClick={() => handleInputChange('category', 'Form')}
                    disabled={authError || isSubmitting || networkError}
                    className={`p-5 border-2 rounded-xl text-center transition ${formData.category === 'Form' ? 'border-[#0038A8] bg-[#0038A8]/5 shadow-lg' : 'border-gray-300 hover:bg-gray-50'} ${(authError || isSubmitting || networkError) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${formData.category === 'Form' ? 'bg-[#0038A8] text-white' : 'bg-gray-100 text-gray-600'}`}>
                      <FaFileSignature className="text-xl" />
                    </div>
                    <div className="font-bold text-gray-800">Form</div>
                    <div className="text-xs text-gray-600">Clearance, Graduation</div>
                    {formData.category === 'Form' && <FaCheckCircle className="inline text-blue-600 mt-2" />}
                  </button>
                </div>
                {errors.category && <p className="text-red-600 text-sm mt-2"><FaExclamationTriangle className="inline mr-1" />{errors.category}</p>}
              </div>

              {/* Document Type Dropdown — DYNAMIC (NO DISABLED OPTIONS) */}
              {formData.category === 'Document' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Document</label>
                  <select value={formData.request_type || ''} onChange={handleDocumentSelect}
                    disabled={authError || isSubmitting || networkError || documentTypes.length === 0}
                    className={`w-full p-3 bg-white border rounded-xl outline-none ${errors.request_type ? 'border-red-500' : 'border-gray-300'} ${(authError || isSubmitting || networkError || documentTypes.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <option value="">Choose document...</option>
                    {documentTypes.map(doc => (
                      // 🆕 REMOVED: disabled attribute for already requested docs
                      <option key={doc.value} value={doc.value}>
                        {doc.label}
                      </option>
                    ))}
                  </select>
                  {errors.request_type && <p className="text-red-600 text-sm mt-2"><FaExclamationTriangle className="inline mr-1" />{errors.request_type}</p>}
                  {documentTypes.length === 0 && currentUser && <p className="text-amber-600 text-sm mt-2"><FaInfoCircle className="inline mr-1" />No documents available for your role.</p>}
                </div>
              )}

              {/* Form Type Dropdown — DYNAMIC (NO DISABLED OPTIONS) */}
              {formData.category === 'Form' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Form</label>
                  <select value={formData.request_type || ''} onChange={handleFormSelect}
                    disabled={authError || isSubmitting || networkError}
                    className={`w-full p-3 bg-white border rounded-xl outline-none ${errors.request_type ? 'border-red-500' : 'border-gray-300'} ${(authError || isSubmitting || networkError) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <option value="">Choose form...</option>
                    {formTypes.map(form => (
                      // 🆕 REMOVED: disabled attribute for already requested forms
                      <option key={form.value} value={form.value}>
                        {form.label}
                      </option>
                    ))}
                  </select>
                  {errors.request_type && <p className="text-red-600 text-sm mt-2"><FaExclamationTriangle className="inline mr-1" />{errors.request_type}</p>}
                </div>
              )}

              {/* Number of Copies */}
              {formData.request_type && allowsMultipleCopies && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.category === 'Form' && getSelectedItem?.multipleLabel ? `Number of ${getSelectedItem.multipleLabel}s` : 'Number of Copies'}
                  </label>
                  <div className="flex items-center gap-4">
                    <select value={formData.copies} onChange={(e) => handleInputChange('copies', e.target.value)}
                      disabled={authError || isSubmitting || networkError}
                      className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none disabled:opacity-50">
                      {copiesArray.map(num => <option key={num} value={num}>{num} {num > 1 ? 'copies' : 'copy'}</option>)}
                    </select>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Total Fee:</div>
                      <div className="text-xl font-bold text-[#7A0019]">{calculateTotalFee}</div>
                    </div>
                  </div>
                  {errors.copies && <p className="text-red-600 text-sm mt-2"><FaExclamationTriangle className="inline mr-1" />{errors.copies}</p>}
                </div>
              )}

              {/* Single-copy forms notice */}
              {formData.request_type && formData.category === 'Form' && !allowsMultipleCopies && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
                  <FaInfoCircle className="inline mr-2" />This form is issued as a single copy only.
                </div>
              )}

              {/* Item Info Display — DYNAMIC */}
              {getSelectedItem && (
                <div className="p-4 rounded-xl border bg-gradient-to-r from-[#7A0019]/5 to-[#0038A8]/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-800">{getSelectedItem.label}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${formData.category === 'Document' ? 'bg-[#7A0019]' : 'bg-[#0038A8]'}`}>
                      {formData.category}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><FaClock className="inline text-gray-500 mr-1" />Processing: <strong>{getSelectedItem.days} day(s)</strong></div>
                    <div className="text-right"><FaMoneyBillWave className="inline text-gray-500 mr-1" />Fee: <strong className="text-[#7A0019]">{getSelectedItem.feeDisplay}/copy</strong></div>
                  </div>
                  {getEstimatedCompletionDate && (
                    <div className="mt-3 pt-3 border-t">
                      <FaCalendarAlt className="inline text-[#7A0019] mr-1" />
                      <span className="text-xs text-gray-600">Estimated: <strong>{getEstimatedCompletionDate.formatted}</strong></span>
                    </div>
                  )}
                </div>
              )}

              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose <span className="text-gray-400 text-xs">(Optional)</span></label>
                <textarea value={formData.purpose} onChange={(e) => handleInputChange('purpose', e.target.value)}
                  disabled={authError || isSubmitting || networkError} rows={3}
                  className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none resize-none disabled:opacity-50" />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button type="submit"
                  disabled={authError || isSubmitting || networkError || !formData.category || !formData.request_type}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#7A0019] via-[#8B0033] to-[#0038A8] text-white font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? <><FaSpinner className="animate-spin inline mr-2" />Submitting...</> : 'Submit Request'}
                </button>
              </div>

              {/* Pickup Notice */}
              <div className="p-4 bg-gradient-to-r from-[#7A0019]/5 to-[#0038A8]/5 border border-[#7A0019]/20 rounded-xl text-sm">
                <FaBuilding className="inline text-[#7A0019] mr-2" /><strong>Office Pickup Required</strong> — Bring valid ID and receipt.
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-sm rounded-xl p-6 border border-gray-200">
            <h4 className="font-bold text-gray-800 text-lg mb-4">Processing Info</h4>
            <div className="space-y-3 text-sm">
              <div><FaClock className="inline text-[#7A0019] mr-2" />Documents: 1-6 working days<br />Forms: 1 working day</div>
              <div><FaEnvelope className="inline text-[#0038A8] mr-2" />Email notifications for status updates</div>
              <div><FaBuilding className="inline text-[#7A0019] mr-2" />Pickup at Registrar's Office</div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <h5 className="font-bold text-gray-700 mb-2">Required for Pickup:</h5>
              <ul className="space-y-1 text-sm">
                <li>• Valid ID</li><li>• Official Receipt</li><li>• Authorization Letter (if representative)</li>
              </ul>
            </div>
          </Card>
          <Card className="shadow-sm rounded-xl p-6 border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4">Office Hours</h4>
            <div className="space-y-3 text-sm">
              <div><strong>Monday - Friday:</strong> 8AM - 4:45PM</div>
              <div className="text-red-600"><strong>Weekends:</strong> Closed</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}