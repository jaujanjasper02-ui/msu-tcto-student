import React, { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqList = [
    {
      question: "How do I submit a document request?",
      answer: "Go to the Request Document page, fill in your details, select the document type, and click submit.",
    },
    {
      question: "How do I track my request?",
      answer: "Go to the Track Status page, enter your Student ID and request number, then click Search.",
    },
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot?' on the login page and follow the instructions to reset your password via SMS.",
    },
    {
      question: "How will I be notified of my request status?",
      answer: "You will receive SMS notifications to the mobile number you provided during signup.",
    },
    {
      question: "Can I update my mobile number or other information?",
      answer: "Yes, update your details in your profile or contact support for assistance.",
    },
    {
      question: "How is my personal data protected?",
      answer: "All student data is stored securely with restricted access and is processed according to the Data Privacy Act of 2012.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-[#7A0019] mb-6">
          Frequently Asked Questions
        </h1>
        
        {/* FAQ List - Ultra Simple */}
        <div className="bg-white rounded-lg">
          {faqList.map((faq, index) => (
            <div key={index} className="mb-1">
              <div 
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="p-5 cursor-pointer border-l-4 border-transparent hover:border-[#7A0019] hover:bg-gray-50 transition-all"
              >
                <div className="flex">
                  <div className="mr-4 font-bold text-[#7A0019]">
                    {index + 1}.
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-gray-900">
                      {faq.question}
                    </h3>
                    
                    {openIndex === index && (
                      <div className="mt-3 text-gray-700">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}