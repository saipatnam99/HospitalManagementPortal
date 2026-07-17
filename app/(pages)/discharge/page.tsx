"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
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
  { href: "/discharge", label: "Discharge", active: true },
  { href: "/schedule", label: "Schedule" },
  { href: "/admin", label: "Admin" },
];

export default function DischargePage() {
  const [reports, setReports] = useState([{ id: 1, patient: "Nikhil R", summary: "Recovered after orthopedic care", status: "Ready for discharge" }]);
  const [form, setForm] = useState({ patient: "", summary: "", status: "Ready for discharge" });
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("/api/patients");
        setPatients(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPatients();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReports((prev) => [{ id: Date.now(), ...form }, ...prev]);
    setForm({ patient: "", summary: "", status: "Ready for discharge" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-row">
        <Sidebar sidebarItems={sidebarItems} />
        <div className="flex-1 p-6 md:p-8">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-800 p-6 text-white shadow-lg">
            <h1 className="text-2xl font-semibold">Patient discharge summary and reports</h1>
            <p className="mt-2 text-sm text-slate-300">Document discharge details and generate patient summaries for care teams.</p>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold">Create discharge summary</h2>
              <div className="mt-4 space-y-3">
                <select value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2" required>
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={`${patient.firstName} ${patient.lastName}`}>{patient.firstName} {patient.lastName}</option>
                  ))}
                </select>
                <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Summary" className="w-full rounded-xl border border-slate-300 px-3 py-2" required />
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2">
                  <option>Ready for discharge</option>
                  <option>Follow-up required</option>
                  <option>Transferred</option>
                </select>
                <button className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">Save summary</button>
              </div>
            </form>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold">Discharge reports</h2>
              <div className="mt-4 space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{report.patient}</p>
                        <p className="text-sm text-slate-500">{report.summary}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{report.status}</span>
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
