import React from 'react';

export default function Button({ 
  children, 
  className = "", 
  variant = "primary",  
  size = "md",         
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  iconPosition = "left", 
  onClick,
  type = "button",
  ...props 
}) {
  
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  

  const variants = {
    primary: "bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white hover:opacity-90 hover:shadow-md focus:ring-[#7A0019]",
    secondary: "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:border-gray-400 focus:ring-gray-400",
    outline: "bg-transparent text-[#7A0019] border-2 border-[#7A0019] hover:bg-[#7A0019]/5 focus:ring-[#7A0019]",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400"
  };
  
  
  const sizes = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
    xl: "px-10 py-4 text-xl"
  };
  
  const widthStyle = fullWidth ? "w-full" : "";
  
  const LoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === "left" && icon}
      {children}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
}