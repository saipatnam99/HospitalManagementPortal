"use client";

import React, { useState } from "react";
import Navbar from "@/components/navbar/page";
import Sidebar from "@/components/sidebar/page";
import { useHospitalContext } from "@/app/providers";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/doctors", label: "Doctors" },
  { href: "/patients", label: "Patients" },
  { href: "/appointment", label: "Appointments" },
  { href: "/outpatient", label: "Outpatient" },
  { href: "/labs", label: "Labs" },
  { href: "/pharmacy", label: "Pharmacy" },
  { href: "/billing", label: "Billing" },
  { href: "/insurance", label: "Insurance", active: true },
  { href: "/medicines", label: "Medicines" },
  { href: "/beds", label: "Beds" },
  { href: "/discharge", label: "Discharge" },
  { href: "/schedule", label: "Schedule" },
  { href: "/admin", label: "Admin" },
];

export default function InsurancePage() {
  const { insuranceCompanies, addInsuranceCompany } = useHospitalContext();
  const [name, setName] = useState("");
  const [coverage, setCoverage] = useState("");
  const [discount, setDiscount] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addInsuranceCompany({ id: Date.now(), name: name.trim(), coverage, discount });
    setName("");
    setCoverage("");
    setDiscount(5);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-row">
        <Sidebar sidebarItems={sidebarItems} />
        <div className="flex-1 p-6 md:p-8">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-800 p-6 text-white shadow-lg">
            <h1 className="text-2xl font-semibold">Insurance management</h1>
            <p className="mt-2 text-sm text-slate-300">Manage provider coverage and discount tiers for multi-specialty care.</p>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Add insurance company</h2>
              <div className="mt-4 space-y-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Company name
                  <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" required />
                </label>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Coverage type
                  <input value={coverage} onChange={(e) => setCoverage(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" required />
                </label>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Discount %
                  <input type="number" min="0" max="30" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" required />
                </label>
                <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">Save provider</button>
              </div>
            </form>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Provider catalog</h2>
              <div className="mt-4 space-y-3">
                {insuranceCompanies.map((company) => (
                  <div key={company.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/70">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{company.name}</p>
                        <p className="text-sm text-slate-500">{company.coverage}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{company.discount}% off</span>
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
