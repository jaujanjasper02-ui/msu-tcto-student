import React, { useState } from "react";
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

  const faqList = [
    {
      category: "Account & Login",
      icon: <Users className="w-5 h-5" />,
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click 'Sign Up' on the login page. You'll need:\n\n• Your MSU-TCTO Student ID Number (00-00000 format)\n• Personal information (Last Name, First Name, Middle Name)\n• Year Level (for students) or Year Graduated (for alumni)\n• Department and Course\n• Email address (required for email notifications)\n• Secure password meeting requirements\n"
        },
        {
          question: "How do I reset my password?",
          answer: "Click 'Forgot Password?' on the login page. Enter your registered email address to receive a verification code. Enter the code to reset your password. If you no longer have access to your registered email, visit the Registrar's Office with a valid ID for manual reset."
        },
        {
          question: "Can I update my email address?",
          answer: "Currently, email updates must be done at the Registrar's Office for security verification. Bring valid ID and fill out the update form. This ensures your email notifications reach the correct recipient."
        },
        {
          question: "I'm an alumnus, how do I register?",
          answer: "Alumni can register by:\n1. Selecting 'Alumni' as role during sign up\n2. Providing student ID and graduation year\n3. Visiting Registrar's Office for verification\n4. Bringing old student records if needed\nOnce verified, you can request TOR, Diploma, and other alumni documents."
        }
      ]
    },
    {
      category: "Document Requests & Processing",
      icon: <FileText className="w-5 h-5" />,
      questions: [
        {
          question: "What documents can I request online?",
          answer: "You can request:\n\n📄 School Records\n• Transcript of Records (TOR) - ₱50.00 (Alumni only)\n• Authentication - ₱50.00 (Alumni only)\n• Transfer Credential/Honorable Dismissal - ₱50.00\n• Report of Grade (ROG)/Evaluation - ₱20.00\n• Certificate of Registration (COR) - ₱5.00 (Students only)\n• Certificate of Grade - ₱5.00\n• Certification - ₱50.00\n• CAV - ₱150.00 (Alumni only)\n\n📋 Forms\n• University Clearance Form - ₱5.00\n• INC Form - ₱20.00 (can request multiple copies per subject)\n• Advance Credit/s Form - ₱20.00\n• Application for Graduation Form - ₱50.00\n\nSee complete list in the online request form."
        },
        {
          question: "How long does processing take?",
          answer: "Processing times vary by document:\n\n• Transcript of Records (TOR) - 3-6 working days\n• Authentication/CAV - 2 working days\n• Transfer Credential/HD - 3 working days\n• Report of Grade/Evaluation - 1 day\n• Certificate of Registration (COR) - 1 day\n• Certifications - 2 working days\n• Forms (INC, Clearance, etc.) - 1 day\n\nNote: Processing days exclude weekends and holidays."
        },
        {
          question: "What are the requirements for document requests?",
          answer: "Basic Requirements:\n• Valid MSU-TCTO Student ID\n• Completed online request form\n• Payment receipt\n• Valid ID for claiming\n\nFor TOR:\n• Application form\n• 2x2 picture\n\nFor Authorized Representatives:\n• Special Power of Attorney (SPA)\n• Valid ID of both parties\n• Authorization letter"
        },
        {
          question: "Can I cancel my request?",
          answer: "**Cancellation Policy:**\n\n• If request is still **Pending**: Contact the Registrar's Office immediately to cancel\n• If request is **Approved/Processing**: Cancellation may not be possible as processing has started\n• If request is **Ready**: You can choose not to claim, but document will be kept for 30 days only\n\nTo cancel, email registrar@msutcto.edu.ph with your Request ID and reason."
        },
        {
          question: "What if I received the wrong document or it's damaged?",
          answer: "If you received the wrong document or it is damaged:\n\n1. **Do not leave the counter** - Report immediately to the releasing officer\n2. Bring the document back within **3 days** of claiming\n3. Provide your Request ID and official receipt\n4. The document will be corrected or replaced at **no additional cost**\n\nFor issues discovered after leaving, contact the Registrar's Office immediately."
        }
      ]
    },
    {
      category: "Payment & Fees",
      icon: <CreditCard className="w-5 h-5" />,
      questions: [
        {
          question: "How do I pay for my request?",
          answer: "Payment Process:\n1. Submit request online → Get Request ID\n2. Wait for Email with payment instructions\n3. Go to University Cashier's Office\n4. Present your Request ID\n5. Pay the exact amount shown\n6. Keep official receipt for claiming\n\nNote: Online payment is not currently available. Payment must be made in person."
        },
        {
          question: "What are the current fees?",
          answer: "School Records:\n• TOR: ₱50.00\n• Authentication: ₱50.00\n• Transfer Credential/HD: ₱50.00\n• ROG/Evaluation: ₱20.00\n• COR: ₱5.00\n• Certifications: ₱50.00\n• CAV: ₱150.00\n\nForms:\n• University Clearance: ₱5.00\n• INC Form: ₱20.00 (per subject)\n• Advance Credits: ₱20.00\n• Graduation Form: ₱50.00"
        },
      ]
    },
    {
      category: "Email Notifications",
      icon: <Bell className="w-5 h-5" />,
      questions: [
        {
          question: "What email notifications will I receive?",
          answer: "You'll receive email notifications for:\n\n📧 Email Updates:\n• Request submitted confirmation\n• Status changes (Approved, Processing, Ready, Rejected)\n• Payment instructions\n• Claim reminders\n• Official communications\n\nMake sure to check your email regularly for updates on your request status."
        },
        {
          question: "Why am I not receiving email notifications?",
          answer: "Check these:\n1. Email address correct in profile\n2. Check spam/junk folder\n3. Add registrar@msutcto.edu.ph to your contacts\n4. Email inbox is not full\n5. Update email at Registrar's Office if changed\n6. Check your internet connection"
        },
        {
          question: "How do I update my email address?",
          answer: "To update your email address:\n1. Visit the Registrar's Office in person\n2. Bring a valid ID for verification\n3. Fill out the Email Update Form\n4. Wait for confirmation email on your new address\n\nThis security measure ensures your notifications reach the right person."
        },
        {
          question: "Can I receive notifications to multiple emails?",
          answer: "Currently, notifications are sent to only one primary email address per account. If you need to change your email, please update it at the Registrar's Office."
        }
      ]
    },
    {
      category: "Tracking & Claiming",
      icon: <MapPin className="w-5 h-5" />,
      questions: [
        {
          question: "How do I track my request?",
          answer: "**Two ways to track:**\n1. Login → Dashboard → Track Status\n2. Use 'Track Request' page with your Request ID\n\n**Status meanings:**\n• **Pending** - Waiting for admin review\n• **Approved** - Request approved, processing soon\n• **Processing** - Document being prepared\n• **Ready** - Ready for pickup\n• **Claimed** - Document claimed\n• **Rejected** - Request declined (reason provided)"
        },
        {
          question: "Where do I claim my documents?",
          answer: "**Claim at:**\n• **Location:** Registrar's Office, MSU-TCTO\n• **Window:** Document Releasing Window\n• **Hours:** Monday-Friday, 8:00 AM - 4:45 PM\n• **Bring:** Valid ID, official receipt, and your tracking code\n\nDocuments must be claimed within 30 days of 'Ready' status."
        },
        {
          question: "Can someone else claim my documents?",
          answer: "Yes, with these requirements:\n• Special Power of Attorney (SPA) or authorization letter\n• Valid ID of both student and representative\n• Official receipt of payment\n• Request ID/Tracking Code\n\nAll documents must be original and valid."
        },
        {
          question: "What if I lost my claim stub?",
          answer: "If you lost your claim stub:\n1. Bring valid ID to Registrar's Office\n2. Provide your Request ID\n3. Fill out affidavit of loss (if required)\n4. Present payment receipt\nAlternative identification will be accepted with proper verification."
        },
        {
          question: "How long are documents kept?",
          answer: "Documents are kept for **30 days** after 'Ready' status. After 30 days, documents are returned to storage and may require additional processing fee for retrieval."
        }
      ]
    },
    {
      category: "Technical Support",
      icon: <AlertCircle className="w-5 h-5" />,
      questions: [
        {
          question: "What browsers are supported?",
          answer: "The system works best on:\n• Google Chrome (recommended)\n• Mozilla Firefox\n• Microsoft Edge\n• Safari\n\nEnsure your browser is updated to the latest version. Mobile browsers are also supported."
        },
        {
          question: "Is there a mobile app?",
          answer: "Currently, we offer a **mobile-responsive website** that works on all devices. No separate app download needed. Simply access via browser on your phone. The interface automatically adjusts for optimal mobile viewing."
        },
        {
          question: "What if I encounter system errors?",
          answer: "If you encounter errors:\n1. Refresh the page\n2. Clear browser cache\n3. Try different browser\n4. Check internet connection\n5. Contact support with:\n   • Screenshot of error\n   • Your Request ID\n   • Time of error\n   • Browser used"
        },
        {
          question: "How is my data protected?",
          answer: "**Security measures:**\n• SSL encryption for all data transmission\n• Password hashing for account security\n• Role-based access control\n• Regular security updates\n• Limited staff access\n• Compliance with Data Privacy Act (RA 10173)\n\nSee our Privacy Notice for complete details."
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
          <p className="text-gray-600 text-lg">MSU-TCTO Registrar Queuing System Notifications</p>
        </div>

        {/* FAQ by Category */}
        <div className="space-y-6">
          {faqList.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Category Header */}
              <div className="bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{category.category}</h2>
                    <p className="text-white/80 text-sm mt-1">{category.questions.length} frequently asked questions</p>
                  </div>
                </div>
              </div>
              
              {/* Questions */}
              <div className="divide-y">
                {category.questions.map((faq, questionIndex) => {
                  const key = `${categoryIndex}-${questionIndex}`;
                  return (
                    <div key={key} className="border-b last:border-b-0">
                      <button
                        onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                        className="w-full p-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                        aria-expanded={openIndex === key}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#7A0019] to-[#0038A8] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {questionIndex + 1}
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-800">{faq.question}</h3>
                          </div>
                        </div>
                        {openIndex === key ? (
                          <ChevronUp className="w-5 h-5 text-[#7A0019]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
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

        {/* Contact Info - Updated to Email Only */}
        <div className="mt-12 bg-gradient-to-r from-[#7A0019] to-[#0038A8] rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Still need help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Location</p>
                    <p className="text-white/80 mt-2">Office of the Campus Registrar<br />MSU-TCTO, Sanga-Sanga<br />Bongao, Tawi-Tawi</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Office Hours</p>
                    <p className="text-white/80 mt-2">Monday - Friday<br />8:00 AM - 4:45 PM<br />(Closed weekends & holidays)</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Email Support</p>
                    <p className="text-white/80 mt-2">registraroffice@msutawitawi.edu.ph<br />registrar@msutcto.edu.ph</p>
                    <p className="text-white/60 text-xs mt-1">Response within 1-2 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Data Privacy</p>
                    <p className="text-white/80 mt-2">Your information is protected under<br />Data Privacy Act of 2012 (RA 10173)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20 text-center">
              <p className="text-white/80 text-sm">
                For document inquiries: registrar@msutcto.edu.ph | For account issues: support@msutcto.edu.ph
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            MSU-TCTO Registrar Queuing System with Email Notifications
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Based on Official MSU-TCTO Registrar Request Form • Version 2.3.0
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Last Updated: April 2026
          </p>
        </div>
      </div>
    </div>
  );
}