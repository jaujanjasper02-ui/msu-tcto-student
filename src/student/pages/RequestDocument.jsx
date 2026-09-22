import Card from '../components/Card'
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
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaSpinner,
  FaUserGraduate,
  FaUserTie,
  FaWifi,
} from 'react-icons/fa'
import { SCHOOL, OFFICE, SYSTEM, DOCUMENTS, FORMS, THEME } from '../../config/trac.config'

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

  const [maxCopies, setMaxCopies] = useState(SYSTEM.requests.maxCopies)
  const [dynamicDocuments, setDynamicDocuments] = useState([])
  const [dynamicForms, setDynamicForms] = useState([])
  const [settingsLoading, setSettingsLoading] = useState(true)

  const API_BASE_URL = SYSTEM.apiBaseUrl

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

  // FETCH PUBLIC SETTINGS — with TRAC fallback
  useEffect(() => {
    const fetchPublicSettings = async () => {
      setSettingsLoading(true)
      try {
        const response = await fetch(`${API_BASE_URL}/public/settings`)
        if (response.ok) {
          const data = await response.json()
          setMaxCopies(data.max_copies_per_request || SYSTEM.requests.maxCopies)
          
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
                allowsMultiple: doc.name === 'INC Form' || doc.name === 'Incomplete (INC) Form',
                multipleLabel: doc.name.includes('INC') ? 'subject' : null
              }
              
              if (doc.category === 'Forms' || 
                  doc.name.includes('Form') || 
                  doc.name.includes('Clearance') || 
                  doc.name.includes('INC') || 
                  doc.name.includes('Advance Credit') || 
                  doc.name.includes('Graduation') ||
                  doc.name.includes('Honorable') ||
                  doc.name.includes('Dismissal')) {
                item.category = 'Form'
                formList.push(item)
              } else {
                item.category = 'Document'
                docList.push(item)
              }
            })
            
            setDynamicDocuments(docList)
            setDynamicForms(formList)
          } else {
            // Fallback to TRAC config
            const tracDocs = DOCUMENTS.map(d => ({
              value: d.name,
              label: d.label,
              days: d.processing_days,
              fee: d.fee,
              feeDisplay: d.feeDisplay,
              allowedRoles: d.allowedRoles,
              category: 'Document'
            }))
            const tracForms = FORMS.filter(f => f.category !== 'Add-on').map(f => ({
              value: f.name,
              label: f.label,
              days: f.processing_days,
              fee: f.fee,
              feeDisplay: f.feeDisplay,
              allowedRoles: f.allowedRoles,
              allowsMultiple: f.allowsMultiple || false,
              multipleLabel: f.multipleLabel || null,
              category: 'Form'
            }))
            setDynamicDocuments(tracDocs)
            setDynamicForms(tracForms)
          }
        } else {
          // API failed - use TRAC config fallback
          const tracDocs = DOCUMENTS.map(d => ({
            value: d.name,
            label: d.label,
            days: d.processing_days,
            fee: d.fee,
            feeDisplay: d.feeDisplay,
            allowedRoles: d.allowedRoles,
            category: 'Document'
          }))
          const tracForms = FORMS.filter(f => f.category !== 'Add-on').map(f => ({
            value: f.name,
            label: f.label,
            days: f.processing_days,
            fee: f.fee,
            feeDisplay: f.feeDisplay,
            allowedRoles: f.allowedRoles,
            allowsMultiple: f.allowsMultiple || false,
            multipleLabel: f.multipleLabel || null,
            category: 'Form'
          }))
          setDynamicDocuments(tracDocs)
          setDynamicForms(tracForms)
        }
      } catch (err) {
        console.warn('Using TRAC default settings from config')
        const tracDocs = DOCUMENTS.map(d => ({
          value: d.name,
          label: d.label,
          days: d.processing_days,
          fee: d.fee,
          feeDisplay: d.feeDisplay,
          allowedRoles: d.allowedRoles,
          category: 'Document'
        }))
        const tracForms = FORMS.filter(f => f.category !== 'Add-on').map(f => ({
          value: f.name,
          label: f.label,
          days: f.processing_days,
          fee: f.fee,
          feeDisplay: f.feeDisplay,
          allowedRoles: f.allowedRoles,
          allowsMultiple: f.allowsMultiple || false,
          multipleLabel: f.multipleLabel || null,
          category: 'Form'
        }))
        setDynamicDocuments(tracDocs)
        setDynamicForms(tracForms)
      } finally {
        setSettingsLoading(false)
      }
    }
    fetchPublicSettings()
  }, [])

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
      else if (error.message === 'NETWORK_ERROR') { setNetworkError(true); setSubmitError('Network error.') }
      else if (error.message === 'SERVER_ERROR') { setNetworkError(true); setSubmitError('Server error.') }
      else { setSubmitError(error.message || 'Failed to submit.') }
    } finally {
      setIsSubmitting(false)
    }
  }

  const RoleBadge = () => {
    if (!currentUser) return null
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
        currentUser.role === 'student' 
          ? 'bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white'
          : 'bg-gradient-to-r from-[#F9A825] to-[#F57F17] text-white'
      }`}>
        {currentUser.role === 'student' ? <FaUserGraduate /> : <FaUserTie />}
        <span>{currentUser.role === 'student' ? 'Student' : 'Alumni'}</span>
      </div>
    )
  }

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-[#F1F8E9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1B5E20] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading TRAC settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8 px-4">
      {/* Header - TRAC Theme */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1B5E20] to-[#F9A825] bg-clip-text text-transparent">
          Document/Form Request
        </h1>
        <p className="text-sm text-gray-500 mt-1">{SCHOOL.fullName}</p>
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
              <button onClick={handleAuthError} className="mt-3 px-4 py-2 bg-[#1B5E20] text-white rounded-lg text-sm">Go to Login</button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm rounded-xl p-6 border border-green-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#1B5E20] rounded-full"></span>
              Request Details
            </h3>
            
            <form className="space-y-6" onSubmit={submit}>
              {/* Category Selection - TRAC Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => handleInputChange('category', 'Document')}
                    disabled={authError || isSubmitting || networkError}
                    className={`p-5 border-2 rounded-xl text-center transition ${formData.category === 'Document' ? 'border-[#1B5E20] bg-[#1B5E20]/5 shadow-lg' : 'border-gray-300 hover:bg-gray-50'} ${(authError || isSubmitting || networkError) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${formData.category === 'Document' ? 'bg-[#1B5E20] text-white' : 'bg-gray-100 text-gray-600'}`}>
                      <FaFileAlt className="text-xl" />
                    </div>
                    <div className="font-bold text-gray-800">Document</div>
                    <div className="text-xs text-gray-600">TOR, COR, COG, CAV</div>
                    {formData.category === 'Document' && <FaCheckCircle className="inline text-green-600 mt-2" />}
                  </button>
                  
                  <button type="button" onClick={() => handleInputChange('category', 'Form')}
                    disabled={authError || isSubmitting || networkError}
                    className={`p-5 border-2 rounded-xl text-center transition ${formData.category === 'Form' ? 'border-[#F9A825] bg-[#F9A825]/10 shadow-lg' : 'border-gray-300 hover:bg-gray-50'} ${(authError || isSubmitting || networkError) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${formData.category === 'Form' ? 'bg-[#F9A825] text-white' : 'bg-gray-100 text-gray-600'}`}>
                      <FaFileSignature className="text-xl" />
                    </div>
                    <div className="font-bold text-gray-800">Form</div>
                    <div className="text-xs text-gray-600">INC, Shifting, Adding</div>
                    {formData.category === 'Form' && <FaCheckCircle className="inline text-amber-600 mt-2" />}
                  </button>
                </div>
                {errors.category && <p className="text-red-600 text-sm mt-2"><FaExclamationTriangle className="inline mr-1" />{errors.category}</p>}
              </div>

              {formData.category === 'Document' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Document</label>
                  <select value={formData.request_type || ''} onChange={handleDocumentSelect}
                    disabled={authError || isSubmitting || networkError || documentTypes.length === 0}
                    className={`w-full p-3 bg-white border rounded-xl outline-none ${errors.request_type ? 'border-red-500' : 'border-gray-300 focus:border-[#1B5E20]'} ${(authError || isSubmitting || networkError || documentTypes.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <option value="">Choose document...</option>
                    {documentTypes.map(doc => (
                      <option key={doc.value} value={doc.value}>{doc.label}</option>
                    ))}
                  </select>
                  {errors.request_type && <p className="text-red-600 text-sm mt-2"><FaExclamationTriangle className="inline mr-1" />{errors.request_type}</p>}
                  {documentTypes.length === 0 && currentUser && <p className="text-amber-600 text-sm mt-2"><FaInfoCircle className="inline mr-1" />No documents available for your role.</p>}
                </div>
              )}

              {formData.category === 'Form' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Form</label>
                  <select value={formData.request_type || ''} onChange={handleFormSelect}
                    disabled={authError || isSubmitting || networkError}
                    className={`w-full p-3 bg-white border rounded-xl outline-none ${errors.request_type ? 'border-red-500' : 'border-gray-300 focus:border-[#F9A825]'} ${(authError || isSubmitting || networkError) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <option value="">Choose form...</option>
                    {formTypes.map(form => (
                      <option key={form.value} value={form.value}>{form.label}</option>
                    ))}
                  </select>
                  {errors.request_type && <p className="text-red-600 text-sm mt-2"><FaExclamationTriangle className="inline mr-1" />{errors.request_type}</p>}
                </div>
              )}

              {formData.request_type && allowsMultipleCopies && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.category === 'Form' && getSelectedItem?.multipleLabel ? `Number of ${getSelectedItem.multipleLabel}s` : 'Number of Copies'}
                  </label>
                  <div className="flex items-center gap-4">
                    <select value={formData.copies} onChange={(e) => handleInputChange('copies', e.target.value)}
                      disabled={authError || isSubmitting || networkError}
                      className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-[#1B5E20] disabled:opacity-50">
                      {copiesArray.map(num => <option key={num} value={num}>{num} {num > 1 ? 'copies' : 'copy'}</option>)}
                    </select>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Total Fee:</div>
                      <div className="text-xl font-bold text-[#1B5E20]">{calculateTotalFee}</div>
                    </div>
                  </div>
                  {errors.copies && <p className="text-red-600 text-sm mt-2"><FaExclamationTriangle className="inline mr-1" />{errors.copies}</p>}
                </div>
              )}

              {formData.request_type && formData.category === 'Form' && !allowsMultipleCopies && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                  <FaInfoCircle className="inline mr-2" />This form is issued as a single copy only.
                </div>
              )}

              {getSelectedItem && (
                <div className="p-4 rounded-xl border bg-gradient-to-r from-[#1B5E20]/5 to-[#F9A825]/10 border-green-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-800">{getSelectedItem.label}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${formData.category === 'Document' ? 'bg-[#1B5E20]' : 'bg-[#F9A825]'}`}>
                      {formData.category}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><FaClock className="inline text-gray-500 mr-1" />Processing: <strong>{getSelectedItem.days} day(s)</strong></div>
                    <div className="text-right"><FaMoneyBillWave className="inline text-gray-500 mr-1" />Fee: <strong className="text-[#1B5E20]">{getSelectedItem.feeDisplay}/copy</strong></div>
                  </div>
                  {getEstimatedCompletionDate && (
                    <div className="mt-3 pt-3 border-t border-green-100">
                      <FaCalendarAlt className="inline text-[#1B5E20] mr-1" />
                      <span className="text-xs text-gray-600">Estimated: <strong>{getEstimatedCompletionDate.formatted}</strong></span>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose <span className="text-gray-400 text-xs">(Optional)</span></label>
                <textarea value={formData.purpose} onChange={(e) => handleInputChange('purpose', e.target.value)}
                  disabled={authError || isSubmitting || networkError} rows={3}
                  placeholder="e.g. For employment, scholarship, board exam..."
                  className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none resize-none focus:border-[#1B5E20] disabled:opacity-50" />
              </div>

              <div className="pt-4">
                <button type="submit"
                  disabled={authError || isSubmitting || networkError || !formData.category || !formData.request_type}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? <><FaSpinner className="animate-spin inline mr-2" />Submitting...</> : 'Submit Request'}
                </button>
              </div>

              <div className="p-4 bg-gradient-to-r from-[#1B5E20]/5 to-[#F9A825]/10 border border-green-100 rounded-xl text-sm">
                <FaBuilding className="inline text-[#1B5E20] mr-2" /><strong>Office Pickup Required</strong> — Bring valid ID and receipt at {SCHOOL.contact.location}.
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm rounded-xl p-6 border border-green-100">
            <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#1B5E20] rounded-full"></span>Processing Info
            </h4>
            <div className="space-y-3 text-sm">
              <div><FaClock className="inline text-[#1B5E20] mr-2" />Documents: {OFFICE.processing.documents}<br />Forms: {OFFICE.processing.forms}</div>
              <div><FaEnvelope className="inline text-[#2E7D32] mr-2" />Email notifications for status updates</div>
              <div><FaBuilding className="inline text-[#1B5E20] mr-2" />Pickup at Registrar's Office</div>
            </div>
            <div className="mt-4 pt-4 border-t border-green-50">
              <h5 className="font-bold text-gray-700 mb-2">Required for Pickup:</h5>
              <ul className="space-y-1 text-sm">
                {OFFICE.pickup.required.map((item, idx) => <li key={idx}>• {item}</li>)}
              </ul>
            </div>
          </Card>

          <Card className="shadow-sm rounded-xl p-6 border border-green-100">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#F9A825] rounded-full"></span>Office Hours
            </h4>
            <div className="space-y-3 text-sm">
              <div><strong>{OFFICE.schedule.days}:</strong><br />{OFFICE.schedule.morning}<br />{OFFICE.schedule.afternoon}</div>
              <div className="text-amber-600 text-xs">{OFFICE.schedule.closedNote}</div>
              <div className="text-red-600"><strong>Weekends:</strong> {OFFICE.schedule.weekends}</div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
              <strong>Fee Reference:</strong><br />
              TOR ₱100/page, COR ₱20, COG ₱20, GWA ₱70, CAV ₱50, INC ₱15/subject, Honorable Dismissal ₱50
            </div>
          </Card>

          <Card className="shadow-sm rounded-xl p-6 border border-green-100 bg-[#F1F8E9]/50">
            <h4 className="font-bold text-[#1B5E20] mb-2 text-sm">TRAC Institutes</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>ICS</strong> - Computing Studies</p>
              <p><strong>ISCJS</strong> - Criminal Justice</p>
              <p><strong>IVTES</strong> - Vocational & Tech Ed</p>
              <p><strong>IAS</strong> - Agricultural Sciences</p>
              <p><strong>GS</strong> - Graduate Studies</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
