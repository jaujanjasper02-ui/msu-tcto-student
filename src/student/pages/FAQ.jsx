import React, { useState, useEffect } from "react";
import { 
  Mail, 
  MapPin, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  FileText,
  CreditCard,
  Users,
  AlertCircle,
  Shield,
  Bell
} from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  
  // 🆕 Dynamic contact email from Settings
  const [contactEmail, setContactEmail] = useState("registraroffice@msutcto.edu.ph");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('https://msu-tcto-backend-oh2j.onrender.com/api/public/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.contact_email) setContactEmail(data.contact_email);
        }
      } catch (err) {
        console.warn('Using default contact email');
      }
    };
    fetchSettings();
  }, []);

  const faqList = [
    {
      category: "Account & Login",
      icon: <Users className="w-5 h-5" />,
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click 'Sign Up' on the login page. You'll need:\n\n• Your MSU-TCTO Student ID Number (00-00000 format)\n• Personal information (Last Name, First Name, Middle Name)\n• Year Level (for students) or Year Graduated (for alumni)\n• Department and Course\n• Email address (required for email notifications)\n• A secure password that meets the requirements"
        },
        {
          question: "How do I reset my password?",
          answer: "Click 'Forgot Password?' on the login page. Enter your registered email address to receive a verification code. Enter the code to set a new password. If you no longer have access to your registered email, visit the Registrar's Office with a valid ID for a manual reset."
        },
        {
          question: "Can I update my email address?",
          answer: "Yes. You can update your email address directly from your Profile page. Log in, go to Profile, click 'Edit Profile', change your email, and save. Your notifications will then be sent to your new email address."
        },
        {
          question: "I'm an alumnus, how do I register?",
          answer: "Alumni can register online by:\n1. Selecting 'Alumni' as the role during sign up\n2. Providing their student ID and graduation year\n3. Filling in their department, course, and email address\n4. Creating a secure password\nOnce registered and verified via email, you can request TOR, CAV, Authentication, and other alumni documents."
        }
      ]
    },
    {
      category: "Document Requests & Processing",
      icon: <FileText className="w-5 h-5" />,
      questions: [
        {
          question: "What documents and forms can I request?",
          answer: "You can request the following:\n\n📄 Documents\n• Transcript of Records (TOR) – ₱50.00 | 6 working days\n• Authentication – ₱50.00 | 2 working days\n• Transfer Credential / Honorable Dismissal – ₱50.00 | 3 working days\n• Report of Grade (ROG) / Evaluation – ₱20.00 | 1 day\n• Certificate of Registration (COR) – ₱5.00 | 1 day\n• Reprinting Fee (Grade) – ₱5.00 | 1 day\n• Certificate of Grade (per semester) – ₱5.00 | 1 day\n• Certification – ₱50.00 | 2 working days\n• CAV – ₱150.00 | 2 working days\n\n📋 Forms\n• University Clearance Form – ₱5.00 | 1 day\n• INC Form – ₱20.00 | 1 day\n• Advance Credit/s Form – ₱20.00 | 1 day\n• Application for Graduation Form – ₱50.00 | 1 day\n\nNote: TOR, CAV, and Authentication are for alumni only. The complete list with current fees is always available on the request form."
        },
        {
          question: "How long does processing take?",
          answer: "Processing times vary by document:\n\n• Transcript of Records (TOR) – up to 6 working days\n• Authentication – 2 working days\n• Transfer Credential / Honorable Dismissal – 3 working days\n• Report of Grade / Evaluation – 1 day\n• Certificate of Registration (COR) – 1 day\n• Certifications – 2 working days\n• CAV – 2 working days\n• All Forms – 1 working day\n\nProcessing days exclude weekends and holidays."
        },
        {
          question: "What are the requirements for claiming my document?",
          answer: "When picking up your document, bring:\n• Valid ID (school ID, passport, driver's license, etc.)\n• Official Receipt from the Cashier's Office\n• Your Request ID or Tracking Code\n\nIf a representative will claim on your behalf:\n• Authorization letter signed by you\n• Valid ID of both you and your representative\n• Official Receipt\n• Your Request ID or Tracking Code"
        },
        {
          question: "Can I cancel my request?",
          answer: `Yes, but it depends on the current status:\n\n• If your request is still Pending, you can contact the Registrar's Office to cancel it.\n• If it is already Processing, cancellation may no longer be possible.\n• If it is Ready for Pickup, you can simply choose not to claim it. Unclaimed documents are kept for 30 days.\n\nTo cancel, email ${contactEmail} with your Request ID and reason.`
        },
        {
          question: "What if I received the wrong document or it is damaged?",
          answer: "Report it immediately:\n1. Notify the releasing officer at the counter before leaving.\n2. If discovered after leaving, contact the Registrar's Office within 3 days.\n3. Provide your Request ID and official receipt.\n4. The document will be corrected or replaced at no additional cost."
        }
      ]
    },
    {
      category: "Payment & Fees",
      icon: <CreditCard className="w-5 h-5" />,
      questions: [
        {
          question: "How do I pay for my request?",
          answer: "Payment Process:\n1. Submit your request online – you will receive a Request ID.\n2. Proceed to the University Cashier's Office.\n3. Present your Request ID or Tracking Code.\n4. Pay the exact amount shown on your request confirmation.\n5. Keep the official receipt – you will need it to claim your document.\n\nNote: Online payment is not yet available. All payments must be made in person at the Cashier's Office."
        },
        {
          question: "What are the current fees?",
          answer: "Documents:\n• TOR: ₱50.00 per page\n• Authentication: ₱50.00\n• Transfer Credential / HD: ₱50.00\n• Report of Grade / Evaluation: ₱20.00\n• Certificate of Registration: ₱5.00\n• Reprinting Fee (Grade): ₱5.00\n• Certificate of Grade: ₱5.00\n• Certification: ₱50.00\n• CAV: ₱150.00\n\nForms:\n• University Clearance: ₱5.00\n• INC Form: ₱20.00\n• Advance Credit/s: ₱20.00\n• Application for Graduation: ₱50.00\n\nThe total fee is automatically calculated when you select a document and the number of copies on the request form."
        }
      ]
    },
    {
      category: "Email Notifications",
      icon: <Bell className="w-5 h-5" />,
      questions: [
        {
          question: "What email notifications will I receive?",
          answer: "You will receive an email when:\n\n• Your request has been submitted (confirmation)\n• Your request is being processed\n• Your document is ready for pickup\n• Your request has been rejected (with reason)\n\nNotifications are sent to the email address registered in your profile. Please check your inbox regularly."
        },
        {
          question: "Why am I not receiving email notifications?",
          answer: `Please check the following:\n1. Make sure the email address in your profile is correct.\n2. Check your spam or junk folder.\n3. Add ${contactEmail} to your contacts.\n4. Ensure your email inbox is not full.\n\nIf the problem persists, update your email address in your Profile page or contact the Registrar's Office.`
        },
        {
          question: "Can I receive notifications on multiple email addresses?",
          answer: "Currently, notifications are sent to only one email address per account — the one registered in your profile. You can change this email anytime from your Profile page."
        }
      ]
    },
    {
      category: "Tracking & Claiming",
      icon: <MapPin className="w-5 h-5" />,
      questions: [
        {
          question: "How do I track my request?",
          answer: "There are two ways:\n1. Log in to your dashboard – your recent requests are listed there.\n2. Go to the 'Track Status' page and enter your Request ID.\n\nThe statuses you will see are:\n• Pending – Awaiting staff review\n• Processing – Your document is being prepared\n• Ready – Your document is ready for pickup\n• Claimed – You have picked up your document\n• Rejected – The request was declined (reason provided)"
        },
        {
          question: "Where do I claim my documents?",
          answer: "Claim your documents at the Registrar's Office, MSU-TCTO, Sanga-Sanga, Bongao, Tawi‑Tawi. Office hours are Monday to Friday, 8:00 AM to 4:45 PM. Bring a valid ID, your official receipt, and your Request ID. Documents must be claimed within 30 days after they become Ready."
        },
        {
          question: "Can someone else claim my documents?",
          answer: "Yes, with these requirements:\n• An authorization letter signed by you\n• A valid ID of both you and your representative\n• The original official receipt\n• The Request ID or Tracking Code"
        },
        {
          question: "What if I lost my tracking information?",
          answer: "If you misplaced your Request ID or tracking details, log in to your dashboard. All your requests are listed there. You can also check your email for the original confirmation message. If you still cannot find it, contact the Registrar's Office with your student ID."
        },
        {
          question: "How long will my documents be kept?",
          answer: "Documents that are Ready for Pickup are kept for 30 days. After that, they are returned to storage. It is best to claim them as soon as possible once you receive the Ready notification."
        }
      ]
    },
    {
      category: "Technical Support",
      icon: <AlertCircle className="w-5 h-5" />,
      questions: [
        {
          question: "What browsers are supported?",
          answer: "The system works best on up‑to‑date versions of Google Chrome (recommended), Mozilla Firefox, Microsoft Edge, and Safari. Mobile browsers on smartphones and tablets are also supported."
        },
        {
          question: "Is there a mobile app?",
          answer: "No separate app is needed. The system is a mobile‑responsive website that adjusts automatically to your phone or tablet screen. Simply open your browser and log in as usual."
        },
        {
          question: "What should I do if I encounter an error?",
          answer: "Try these steps:\n1. Refresh the page.\n2. Clear your browser cache.\n3. Try a different browser.\n4. Check your internet connection.\n\nIf the error continues, contact the Registrar's Office and provide:\n• A screenshot of the error\n• Your Request ID (if applicable)\n• The time the error occurred\n• The browser you are using"
        },
        {
          question: "How is my data protected?",
          answer: "Your information is protected through:\n• Encrypted data transmission\n• Secure password storage\n• Strict role‑based access controls\n• Compliance with the Data Privacy Act of 2012 (RA 10173)\n\nOnly authorized registrar staff have access to your request details."
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#7A0019] to-[#0038A8] rounded-full mb-4 shadow-lg">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7A0019] to-[#0038A8] bg-clip-text text-transparent mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-lg">MSU-TCTO Registrar Queuing System with Notification</p>
        </div>

        {/* FAQ by Category */}
        <div className="space-y-6">
          {faqList.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">{category.icon}</div>
                  <div><h2 className="text-xl font-bold">{category.category}</h2></div>
                </div>
              </div>
              
              <div className="divide-y">
                {category.questions.map((faq, questionIndex) => {
                  const key = `${categoryIndex}-${questionIndex}`;
                  return (
                    <div key={key} className="border-b last:border-b-0">
                      <button onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                        className="w-full p-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                        aria-expanded={openIndex === key}>
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {questionIndex + 1}
                          </div>
                          <div className="text-left"><h3 className="font-semibold text-gray-800">{faq.question}</h3></div>
                        </div>
                        {openIndex === key ? <ChevronUp className="w-5 h-5 text-[#7A0019]" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </button>
                      
                      {openIndex === key && (
                        <div className="px-5 pb-5 ml-12">
                          <div className="bg-gradient-to-r from-[#7A0019]/5 to-[#0038A8]/5 p-4 rounded-lg border-l-4 border-[#7A0019]">
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{faq.answer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-12 bg-gradient-to-r from-[#7A0019] to-[#0038A8] rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Still need help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0"><MapPin className="w-6 h-6 text-white" /></div>
                  <div>
                    <p className="font-semibold text-lg">Location</p>
                    <p className="text-white/80 mt-2">Office of the Campus Registrar<br />MSU-TCTO, Sanga-Sanga<br />Bongao, Tawi-Tawi</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0"><Clock className="w-6 h-6 text-white" /></div>
                  <div>
                    <p className="font-semibold text-lg">Office Hours</p>
                    <p className="text-white/80 mt-2">Monday – Friday<br />8:00 AM – 4:45 PM<br />(Closed on weekends and holidays)</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0"><Mail className="w-6 h-6 text-white" /></div>
                  <div>
                    <p className="font-semibold text-lg">Email Support</p>
                    <p className="text-white/80 mt-2">{contactEmail}</p>
                    <p className="text-white/60 text-xs mt-1">Response within 1–2 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0"><Shield className="w-6 h-6 text-white" /></div>
                  <div>
                    <p className="font-semibold text-lg">Data Privacy</p>
                    <p className="text-white/80 mt-2">Your information is protected under<br />Data Privacy Act of 2012 (RA 10173)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">MSU-TCTO Registrar Queuing System with Notification</p>
          <p className="text-gray-400 text-xs mt-2">Based on Official MSU-TCTO Registrar Request Form</p>
          <p className="text-gray-400 text-xs mt-1">Last Updated: {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}