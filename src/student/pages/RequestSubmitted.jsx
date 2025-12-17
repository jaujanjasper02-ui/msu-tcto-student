import Card from '../components/Card'
import { Link } from 'react-router-dom'

export default function RequestSubmitted(){
  const id = 'REQ-544202' // demo
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Card className="text-center max-w-md">
        <div className="w-24 h-24 rounded-full mx-auto bg-green-50 flex items-center justify-center mb-4">
          ✓
        </div>
        <h3 className="text-xl font-semibold">Request Submitted Successfully!</h3>
        <p className="mt-2 text-gray-600">Your request has been received.</p>

        <div className="mt-6 p-4 bg-[#f8f9ff] rounded-md">
          <p className="text-sm text-gray-500">Request ID:</p>
          <div className="text-[#70121b] font-semibold mt-2">{id}</div>
        </div>

        <p className="text-sm text-gray-500 mt-4">You will receive SMS notifications about your request status.</p>

        <Link to="/dashboard"><button className="mt-6 px-6 py-3 rounded-lg bg-[#70121b] text-white">Back to Dashboard</button></Link>
      </Card>
    </div>
  )
}
