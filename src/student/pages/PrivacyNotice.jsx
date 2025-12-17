import React from "react";

export default function PrivacyNotice() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-[#7A0019] mb-4">Privacy Notice</h1>
        <p className="text-gray-700 mb-6">
          The MSU-TCTO Request System is a web-based application designed to enable students to submit document requests, track their status, and receive SMS notifications for updates.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Data Collection</h2>
        <p className="text-gray-700 mb-4">
          We collect personal data for processing student requests, including your Student ID, full name, course, year level, department, mobile number, and request history. Your data may also be used for research, reports, and system improvement.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Data Protection</h2>
        <p className="text-gray-700 mb-4">
          Your personal information is secured and will not be shared with any third party except as required by law. Once data is no longer needed, it will be deleted, anonymized, or de-identified.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Your Rights</h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Right to be informed</li>
          <li>Right to access</li>
          <li>Right to object to processing</li>
          <li>Right to rectification or erasure</li>
          <li>Right to lodge a complaint</li>
        </ul>

        <p className="text-gray-700">
          For any data privacy concerns, contact our Data Privacy Officer at{" "}
          <a href="mailto:dpo@msu-tct.edu.ph" className="text-blue-700 hover:underline">
            registraroffice@msutawi-tawi.edu.ph
          </a>.
        </p>
      </div>
    </div>
  );
}