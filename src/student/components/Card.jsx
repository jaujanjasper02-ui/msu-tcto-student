export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl p-6 border border-gray-200 shadow-sm ${className}`}>
      {children}
    </div>
  )
}
