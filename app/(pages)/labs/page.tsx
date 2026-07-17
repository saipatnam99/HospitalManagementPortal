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
  { href: "/labs", label: "Labs", active: true },
  { href: "/pharmacy", label: "Pharmacy" },
  { href: "/billing", label: "Billing" },
  { href: "/insurance", label: "Insurance" },
  { href: "/medicines", label: "Medicines" },
  { href: "/beds", label: "Beds" },
  { href: "/discharge", label: "Discharge" },
  { href: "/schedule", label: "Schedule" },
  { href: "/admin", label: "Admin" },
];

const labTests = ["CBC", "Lipid Profile", "MRI", "X-Ray", "Blood Sugar"];

export default function LabsPage() {
  const [requests, setRequests] = useState([{ id: 1, patient: "Asha K", test: "CBC", status: "Pending" }]);
  const [form, setForm] = useState({ patient: "", test: labTests[0] });
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
    setRequests((prev) => [{ id: Date.now(), ...form, status: "Pending" }, ...prev]);
    setForm({ patient: "", test: labTests[0] });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-row">
        <Sidebar sidebarItems={sidebarItems} />
        <div className="flex-1 p-6 md:p-8">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-800 p-6 text-white shadow-lg">
            <h1 className="text-2xl font-semibold">Lab test requests</h1>
            <p className="mt-2 text-sm text-slate-300">Track diagnostics requests and status across departments.</p>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold">Create lab request</h2>
              <div className="mt-4 space-y-3">
                <select value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2" required>
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={`${patient.firstName} ${patient.lastName}`}>{patient.firstName} {patient.lastName}</option>
                  ))}
                </select>
                <select value={form.test} onChange={(e) => setForm({ ...form, test: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2">
                  {labTests.map((test) => <option key={test}>{test}</option>)}
                </select>
                <button className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">Request test</button>
              </div>
            </form>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold">Pending diagnostics</h2>
              <div className="mt-4 space-y-3">
                {requests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div>
                      <p className="font-semibold">{request.patient}</p>
                      <p className="text-sm text-slate-500">{request.test}</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">{request.status}</span>
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
