import Card from '../components/Card'

export default function Help(){
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <h3 className="font-semibold">Need Help?</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-4">
            <div className="text-[#70121b] text-xl">📞</div>
            <div>
              <h4 className="font-semibold">Call Registrar</h4>
              <p className="text-sm text-gray-600">(068) 555-0123</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="text-[#70121b] text-xl">✉️</div>
            <div>
              <h4 className="font-semibold">Email Registrar</h4>
              <p className="text-sm text-gray-600">registrar@msutcto.edu.ph</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h4 className="font-semibold">Office Hours</h4>
        <div className="mt-2 text-sm text-gray-600">Monday to Friday: 8:00 AM – 5:00 PM</div>
      </Card>
    </div>
  )
}
