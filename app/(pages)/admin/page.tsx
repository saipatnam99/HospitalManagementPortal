"use client";

import React from "react";
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
  { href: "/beds", label: "Beds" },
  { href: "/discharge", label: "Discharge" },
  { href: "/schedule", label: "Schedule" },
  { href: "/admin", label: "Admin", active: true },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-row">
        <Sidebar sidebarItems={sidebarItems} />
        <div className="flex-1 p-6 md:p-8">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-800 p-6 text-white shadow-lg">
            <h1 className="text-2xl font-semibold">Hospital operations admin dashboard</h1>
            <p className="mt-2 text-sm text-slate-300">Executive view of admissions, billing, departments, staffing, and discharge performance.</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { label: "Admissions", value: "184", tone: "bg-emerald-50 text-emerald-700" },
              { label: "Pending bills", value: "29", tone: "bg-amber-50 text-amber-700" },
              { label: "Available beds", value: "42", tone: "bg-sky-50 text-sky-700" },
              { label: "Staff online", value: "126", tone: "bg-violet-50 text-violet-700" },
            ].map((card) => (
              <div key={card.label} className={`rounded-2xl border border-slate-200 p-4 ${card.tone} dark:border-slate-800 dark:bg-slate-900`}>
                <p className="text-sm">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold">ICU and ward analytics</h2>
              <div className="mt-4 space-y-3">
                {[
                  { name: "ICU Occupancy", value: "78%" },
                  { name: "General Ward", value: "63%" },
                  { name: "Emergency", value: "87%" },
                ].map((item) => (
                  <div key={item.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold">Department readiness</h2>
              <div className="mt-4 space-y-3">
                {[
                  { name: "Cardiology", status: "Ready" },
                  { name: "Neurology", status: "Busy" },
                  { name: "Pediatrics", status: "Ready" },
                ].map((item) => (
                  <div key={item.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      <span className="font-semibold">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
