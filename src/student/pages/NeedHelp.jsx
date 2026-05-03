import React, { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Users,
  FileText,
  Shield,
  HelpCircle,
  Download,
  Printer,
  CreditCard,
  Bell
} from "lucide-react";

export default function NeedHelp() {
  const [openCategory, setOpenCategory] = useState(null);

  const helpCategories = [
    {
      title: "Common Problems & Solutions",
      icon: <AlertCircle className="w-5 h-5" />,
      color: "from-red-600 to-orange-600",
      items: [
        {
          problem: "Can't login to my account",
          solution: "1. Check if your ID number (00-00000) and password are correct\n2. Use 'Forgot Password?' feature to reset via Email\n3. If still issues, visit Registrar's Office with valid ID",
          icon: <AlertCircle className="w-5 h-5 text-red-500" />
        },
        {
          problem: "Not receiving email notifications",
          solution: "1. Check your email address in Profile settings\n2. Check spam/junk folder\n3. Add registrar@msutcto.edu.ph to contacts\n4. Update email at Registrar's Office",
          icon: <Mail className="w-5 h-5 text-red-500" />
        },
        {
          problem: "Document request not submitting",
          solution: "1. Check internet connection\n2. Make sure all required fields are filled\n3. Check if copies is within limit (max 5)\n4. Try using Chrome or Edge browser",
          icon: <FileText className="w-5 h-5 text-orange-500" />
        },
        {
          problem: "Payment confirmation issues",
          solution: "1. Wait 24 hours for system update\n2. Bring payment receipt to Cashier's Office\n3. Contact Registrar with payment reference number\n4. Check email for payment confirmation",
          icon: <CreditCard className="w-5 h-5 text-green-500" />
        },
        {
          problem: "Wrong document requested",
          solution: "1. Contact Registrar immediately if still pending\n2. Provide Request ID and correction needed\n3. Visit office if processing has started\n4. May need to submit new request",
          icon: <AlertCircle className="w-5 h-5 text-yellow-500" />
        }
      ]
    },
    {
      title: "When to Visit the Office",
      icon: <Users className="w-5 h-5" />,
      color: "from-purple-600 to-pink-600",
      items: [
        {
          problem: "First-time registration",
          solution: "For new students needing account verification. Bring valid school ID and registration form.",
          number: "1"
        },
        {
          problem: "Document authentication",
          solution: "For documents requiring official stamps, signatures, and CAV authentication.",
          number: "2"
        },
        {
          problem: "Special requests",
          solution: "For requests not available in the online system or urgent/priority requests.",
          number: "3"
        },
        {
          problem: "Alumni verification",
          solution: "For graduates needing account setup and verification of records.",
          number: "4"
        },
        {
          problem: "Payment issues",
          solution: "If online payment confirmation fails or receipt verification needed.",
          number: "5"
        },
        {
          problem: "Authorized representatives",
          solution: "To register SPA (Special Power of Attorney) for document claiming.",
          number: "6"
        }
      ]
    },
    {
      title: "Quick Tips & Best Practices",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "from-green-600 to-emerald-600",
      items: [
        {
          problem: "Account Security",
          solution: "• Never share your password\n• Use strong passwords with special characters\n• Logout from public computers\n• Update password regularly",
          tip: "Security First"
        },
        {
          problem: "Email Notification Management",
          solution: "• Keep email address updated\n• Check spam folder regularly\n• Save Request ID for tracking\n• Respond to emails promptly",
          tip: "Stay Updated"
        },
        {
          problem: "Document Requests",
          solution: "• Double-check document type before submitting\n• Save payment receipts\n• Track requests online\n• Request early before deadlines",
          tip: "Plan Ahead"
        },
        {
          problem: "Office Visits",
          solution: "• Come during office hours (8AM-4:45PM)\n• Bring valid ID and requirements\n• Avoid peak hours (lunch, 3-5PM)\n• Check status online first",
          tip: "Be Prepared"
        },
        {
          problem: "Payment Tips",
          solution: "• Pay exact amount when possible\n• Keep official receipt safe\n• Check if payment reflected online\n• Inquire about payment options",
          tip: "Payment Wise"
        },
        {
          problem: "Tracking Requests",
          solution: "• Use Request ID for tracking\n• Check email for status updates\n• Monitor estimated completion date\n• Claim immediately when ready",
          tip: "Track Smart"
        }
      ]
    }
  ];

  const contactInfo = [
    { 
      icon: <Phone className="w-6 h-6" />, 
      title: "Phone Hotline", 
      detail: "(068) 268-4231",
      sub: "For urgent concerns",
      gradient: "from-blue-600 to-cyan-600"
    },
    { 
      icon: <Mail className="w-6 h-6" />, 
      title: "Email Support", 
      detail: "registraroffice@msutcto.edu.ph",
      sub: "For email inquiries",
      gradient: "from-green-600 to-emerald-600"
    },
    { 
      icon: <MapPin className="w-6 h-6" />, 
      title: "Office Location", 
      detail: "Registrar's Office, MSU-TCTO",
      sub: "Sanga-Sanga, Bongao Tawi-Tawi",
      gradient: "from-purple-600 to-pink-600"
    },
    { 
      icon: <Clock className="w-6 h-6" />, 
      title: "Office Hours", 
      detail: "Mon-Fri: 8:00 AM - 4:45 PM",
      sub: "Closed on weekends & holidays",
      gradient: "from-orange-600 to-red-600"
    },
  ];

  const toggleCategory = (index) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#8B0000] to-[#0056A6] rounded-full mb-4 shadow-lg">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#8B0000] to-[#0056A6] bg-clip-text text-transparent mb-3">
            Need Help?
          </h1>
          <p className="text-gray-600 text-lg">We're here to assist you with the MSU-TCTO Registrar Queuing System</p>
        </div>

        {/* Contact Information Cards - Removed SMS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {contactInfo.map((item, index) => (
            <div 
              key={index} 
              className={`bg-gradient-to-r ${item.gradient} rounded-xl shadow-lg p-5 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  {item.icon}
                </div>
                <div className="font-bold text-lg">{item.title}</div>
              </div>
              <div className="text-white/90 font-medium">{item.detail}</div>
              <div className="text-white/70 text-xs mt-1">{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Help Categories */}
        <div className="space-y-6">
          {helpCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <button
                onClick={() => toggleCategory(categoryIndex)}
                className={`w-full bg-gradient-to-r ${category.color} text-white p-5 flex justify-between items-center hover:opacity-95 transition-opacity`}
                aria-expanded={openCategory === categoryIndex}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {category.icon}
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-bold">{category.title}</h2>
                    <p className="text-white/80 text-sm mt-1">
                      {category.items.length} helpful solutions
                    </p>
                  </div>
                </div>
                {openCategory === categoryIndex ? (
                  <ChevronUp className="w-6 h-6 text-white" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-white" />
                )}
              </button>
              
              {openCategory === categoryIndex && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex} 
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-start gap-3">
                          {item.icon && (
                            <div className="mt-1 flex-shrink-0">
                              {item.icon}
                            </div>
                          )}
                          {item.number && (
                            <div className="w-8 h-8 bg-gradient-to-r from-[#8B0000] to-[#0056A6] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {item.number}
                            </div>
                          )}
                          {item.tip && (
                            <div className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-xs font-semibold">
                              {item.tip}
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-2">{item.problem}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                              {item.solution}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Important Notice - Removed SMS */}
        <div className="mt-8 bg-gradient-to-r from-[#8B0000] to-[#0056A6] rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Important Notice</h3>
                <p className="text-white/90">
                  <strong>For immediate assistance:</strong> Visit the Registrar's Office in person with your valid ID and relevant documents. Bring your Request ID and payment receipts for faster processing.
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-semibold">📞 Phone Support</p>
                    <p className="text-sm text-white/80">(068) 268-4231 (8AM-5PM)</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-semibold">📧 Email Support</p>
                    <p className="text-sm text-white/80">registrar@msutcto.edu.ph</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-8 text-center">
          <div className="inline-flex flex-col items-center bg-gradient-to-r from-[#8B0000]/10 to-[#0056A6]/10 rounded-xl p-6 border border-[#8B0000]/20">
            <h3 className="font-bold text-gray-800 mb-2">Check our FAQ Section</h3>
            <p className="text-gray-700 mb-4 max-w-md">
              Many common questions about document requests, fees, and notifications are already answered.
            </p>
            <a 
              href="/faq" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8B0000] to-[#0056A6] text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm hover:shadow"
            >
              Go to FAQ Section
              <ChevronUp className="w-4 h-4 rotate-90" />
            </a>
          </div>
        </div>

        {/* Footer - Removed SMS */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            Mindanao State University - Tawi-Tawi College of Technology and Oceanography<br/>
            Office of the Campus Registrar • Sanga-Sanga, Bongao, Tawi-Tawi
          </p>
          <p className="text-gray-400 text-xs mt-2">
            For system-related concerns: (068) 268-4231 | registrar@msutcto.edu.ph
          </p>
        </div>
      </div>
    </div>
  );
}