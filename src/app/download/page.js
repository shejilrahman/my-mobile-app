"use client";
import React from "react";

const DownloadForms = () => {
  // Array of form names
  const forms = [
    "Transfer Form",
    "Medical Reimbursement Form",
    "LTC Claim Form",
    "LTC Application Form",
    "Leave Application Form",
    "Travel Allowance Form",
    "Salary Advance Form",
    "Performance Appraisal Form",
    "Grievance Redressal Form",
    "No Objection Certificate Form",
  ];

  return (
    <div className="p-5 text-center">
      <h1 className="text-2xl font-bold">Download Forms</h1>
      <p>Select a form to download:</p>
      <ul className="list-none p-0">
        {forms.map((form, index) => (
          <li
            key={index}
            className="my-2 text-lg cursor-pointer border border-gray-300 rounded-lg p-2 hover:bg-gray-800 hover:shadow-md transition duration-200"
          >
            {form}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DownloadForms;
