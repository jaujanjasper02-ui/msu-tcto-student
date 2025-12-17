export default function Button({children, className="", ...props}){
  return (
    <button {...props} className={`px-6 py-3 rounded-xl text-white bg-gradient-to-r from-[#8b0000] to-[#1e3a8a] ${className}`}>
      {children}
    </button>
  )
}
