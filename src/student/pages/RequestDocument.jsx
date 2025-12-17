import Card from '../components/Card'
import Button from '../components/Button'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RequestDocument() {
  const [docType, setDocType] = useState('')
  const [purpose, setPurpose] = useState('')
  const [remarks, setRemarks] = useState('')
  const [docTypeError, setDocTypeError] = useState('')
  const nav = useNavigate()

  function submit(e) {
    e.preventDefault()

    // Reset error
    setDocTypeError('')

    // Validation
    if (!docType) {
      setDocTypeError('Please select a document type.')
      return
    }

    if (!purpose) {
      // Optional: you can add purpose validation too
      return
    }

    // TODO: POST to backend: create request and trigger SMS
    nav('/submitted')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      {/* Request Form Card */}
      <Card className="shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-2xl p-6">
        <h3 className="font-semibold text-lg mb-4">Document Request Form</h3>
        <form className="space-y-4" onSubmit={submit}>
          {/* Document Type */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Document Type</label>
            <select
              value={docType}
              onChange={e => setDocType(e.target.value)}
              className={`w-full mt-1 p-3 bg-[#f8f8f8] rounded-xl outline-none focus:ring-2 focus:ring-[#7A0019] ${docTypeError ? 'border border-red-500' : ''}`}
            >
              <option value="">Select document type</option>
              <option value="TOR">Transcript of Records (TOR)</option>
              <option value="Authentication">Authentication</option>
              <option value="Transfer Credential/Honorable Dismissal">Transfer Credential/Honorable Dismissal</option>
              <option value="ROG/Evaluation of Grades">Report of Grade (ROG)/Evaluation of Grades</option>
              <option value="COR">Certificate of Registration (COR)</option>
              <option value="Certificate of Grade">Certificate of Grade by semester Reprinting</option>
              <option value="Certificate">Certificate</option>
              <option value="CAV">CAV</option>
              <option value="Clearance Form">University Clearance Form</option>
              <option value="INC">INC Form</option>
              <option value="FORM">Advance Credit/s Form and Substition Form</option>
              <option value="APP Graduation Form">Application for Graduation Form</option>
            </select>
            {docTypeError && <p className="text-red-600 text-sm mt-1">{docTypeError}</p>}
          </div>

          {/* Purpose */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Purpose</label>
            <input
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              placeholder="e.g., Job application"
              className="w-full mt-1 p-3 bg-[#f8f8f8] rounded-xl outline-none focus:ring-2 focus:ring-[#7A0019]"
              required
            />
          </div>

          {/* Additional Remarks */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Additional Remarks (Optional)</label>
            <textarea
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="Any special instructions or request"
              className="w-full mt-1 p-3 bg-[#f8f8f8] rounded-xl outline-none focus:ring-2 focus:ring-[#7A0019] resize-none"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7A0019] to-[#3B0A45] text-white font-semibold shadow"
          >
            Submit Request
          </Button>
        </form>
      </Card>

      {/* Processing Info Card */}
      <Card className="shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-2xl p-6">
        <h4 className="font-semibold mb-2">Processing Information</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Processing time: 3-5 business days</p>
          <p>• You'll receive SMS updates on progress</p>
          <p>• Documents ready for pickup at the Registrar's Office</p>
        </div>
      </Card>
    </div>
  )
}
