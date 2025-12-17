export default function StatusTimeline({status}) {
  const steps = ['Requested', 'Processing', 'Ready for Pickup']
  const idx = steps.indexOf(status)
  return (
    <div className="space-y-6">
      {steps.map((s,i)=>(
        <div key={s} className="flex items-start gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center
            ${i < idx ? 'bg-green-200 text-green-700' : i === idx ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
            {i+1}
          </div>
          <div>
            <h4 className="font-semibold">{s}</h4>
            <p className="text-sm text-gray-500">
              {i===0 ? 'Request received' : i===1 ? 'Being processed' : 'Ready for pickup'}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
