"use client";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [selectedDepartment, setSelectedDepartment] = useState(null); // State for selected department

  return (
    <main className="dark min-h-screen p-4">
      <h1 className="text-2xl mb-2 font-bold text-center text-blue-500">
        Welcome to Formy
      </h1>
      <p className="text-white mb-8 text-center text-lg italic">
        Your ultimate solution for all your form and template needs.
      </p>

      {/* Conditional Rendering */}
      {!selectedDepartment ? (
        // Department Selection Grid
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {["Department of Post", "Income Tax", "CBI", "IB", "IFS", "IAS"].map(
            (department) => (
              <div
                key={department}
                onClick={() => setSelectedDepartment(department)} // Update selected department
                className="block cursor-pointer bg-[#1e1e1e] rounded-md p-4 shadow
                           hover:shadow-lg hover:shadow-accent/50
                           hover:text-white transition-all"
              >
                <h2 className="text-xl font-semibold mb-1">{department}</h2>
                <p className="text-sm text-textSecondary">
                  View details for {department}
                </p>
              </div>
            )
          )}
        </div>
      ) : (
        // Download and Upload Forms for Selected Department
        <div className="grid grid-cols-1 gap-4">
          <Link
            href={`/download?department=${encodeURIComponent(
              selectedDepartment
            )}`} // Pass department as query param
            className="block bg-[#1e1e1e] rounded-md p-4 shadow
                       hover:shadow-lg hover:shadow-accent/50
                       hover:text-white transition-all"
          >
            <h2 className="text-xl font-semibold mb-1">Download Forms</h2>
            <p className="text-sm text-textSecondary">
              Access various forms for {selectedDepartment}.
            </p>
          </Link>

          <Link
            href={`/upload?department=${encodeURIComponent(
              selectedDepartment
            )}`} // Pass department as query param
            className="block bg-[#1e1e1e] rounded-md p-4 shadow
                       hover:shadow-lg hover:shadow-accent/50
                       hover:text-white transition-all"
          >
            <h2 className="text-xl font-semibold mb-1">Upload Forms</h2>
            <p className="text-sm text-textSecondary">
              Submit your forms for {selectedDepartment} quickly and securely.
            </p>
          </Link>
        </div>
      )}
    </main>
  );
}
