"use client";

import React, { useState } from "react";
import Navbar from "@/components/navbar/page";
import Sidebar from "@/components/sidebar/page";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/doctors", label: "Doctors" },
  { href: "/patients", label: "Patients" },
  { href: "/appointment", label: "Appointments" },
  { href: "/outpatient", label: "Outpatient" },
  { href: "/labs", label: "Labs" },
  { href: "/pharmacy", label: "Pharmacy" },
  { href: "/billing", label: "Billing" },
  { href: "/insurance", label: "Insurance" },
  { href: "/medicines", label: "Medicines" },
  { href: "/beds", label: "Beds", active: true },
  { href: "/discharge", label: "Discharge" },
  { href: "/schedule", label: "Schedule" },
  { href: "/admin", label: "Admin" },
];

export default function BedsPage() {
  const [beds, setBeds] = useState([{ id: 1, name: "ICU-01", status: "Occupied" }, { id: 2, name: "Ward-A1", status: "Available" }]);

  const toggleStatus = (id: number) => {
    setBeds((prev) => prev.map((bed) => (bed.id === id ? { ...bed, status: bed.status === "Available" ? "Occupied" : "Available" } : bed)));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-row">
        <Sidebar sidebarItems={sidebarItems} />
        <div className="flex-1 p-6 md:p-8">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-800 p-6 text-white shadow-lg">
            <h1 className="text-2xl font-semibold">Bed and staff management</h1>
            <p className="mt-2 text-sm text-slate-300">Monitor occupancy and update bed availability in real time.</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {beds.map((bed) => (
              <div key={bed.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{bed.name}</p>
                    <p className="text-sm text-slate-500">{bed.status}</p>
                  </div>
                  <button onClick={() => toggleStatus(bed.id)} className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Toggle</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
