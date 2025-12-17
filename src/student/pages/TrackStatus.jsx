import Card from '../components/Card'
import StatusTimeline from '../components/StatusTimeline'
import { useState } from 'react'

export default function TrackStatus() {
  const [req, setReq] = useState('REQ-001234')
  const [status, setStatus] = useState('Processing')

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      {/* Request ID Input Card */}
      <Card className="shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-2xl p-6">
        <h3 className="font-semibold text-lg mb-4">Track Request Status</h3>
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Request ID</label>
          <input
            value={req}
            onChange={e => setReq(e.target.value)}
            className="w-full mt-1 p-3 bg-[#f8f8f8] rounded-xl outline-none focus:ring-2 focus:ring-[#7A0019]"
          />
        </div>
      </Card>

      {/* Status Card */}
      <Card className="shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">Transcript of Records (TOR)</h4>
            <p className="text-sm text-gray-500">Request ID: {req}</p>
            <p className="text-sm mt-2">Requested: Jan 15, 2024</p>
          </div>
          <div className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full font-semibold">
            Ready for Pickup
          </div>
        </div>

        <div className="mt-4">
          <StatusTimeline status={status} />
        </div>
      </Card>
    </div>
  )
}
