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
  { href: "/outpatient", label: "Outpatient", active: true },
  { href: "/labs", label: "Labs" },
  { href: "/pharmacy", label: "Pharmacy" },
  { href: "/billing", label: "Billing" },
  { href: "/insurance", label: "Insurance" },
  { href: "/medicines", label: "Medicines" },
  { href: "/beds", label: "Beds" },
  { href: "/discharge", label: "Discharge" },
  { href: "/schedule", label: "Schedule" },
  { href: "/admin", label: "Admin" },
];

const departments = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General"];

export default function OutpatientPage() {
  const [form, setForm] = useState({ name: "", age: "", department: departments[0], phone: "", complaint: "" });
  const [registrations, setRegistrations] = useState([{ id: 1, name: "Riya Shah", department: "Cardiology", complaint: "Chest pain" }]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientRes, doctorRes] = await Promise.all([axios.get("/api/patients"), axios.get("/api/doctors")]);
        setPatients(patientRes.data);
        setDoctors(doctorRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrations((prev) => [{ id: Date.now(), ...form }, ...prev]);
    setForm({ name: "", age: "", department: departments[0], phone: "", complaint: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-row">
        <Sidebar sidebarItems={sidebarItems} />
        <div className="flex-1 p-6 md:p-8">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-800 p-6 text-white shadow-lg">
            <h1 className="text-2xl font-semibold">Outpatient registration</h1>
            <p className="mt-2 text-sm text-slate-300">Register patients for specialist consultations and track queue flow.</p>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold">New outpatient</h2>
              <div className="mt-4 space-y-3">
                <select value={form.name} onChange={(e) => {
                  const selectedPatient = patients.find((patient) => `${patient.firstName} ${patient.lastName}` === e.target.value);
                  setForm({ ...form, name: e.target.value, phone: selectedPatient?.phone || "", age: selectedPatient?.age?.toString() || "" });
                }} className="w-full rounded-xl border border-slate-300 px-3 py-2" required>
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={`${patient.firstName} ${patient.lastName}`}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
                <input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Age" className="w-full rounded-xl border border-slate-300 px-3 py-2" required />
                <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2">
                  {departments.map((department) => <option key={department}>{department}</option>)}
                </select>
                <select value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2" required>
                  <option value="">Select doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.phone}>{doctor.fullName} • {doctor.specialization}</option>
                  ))}
                </select>
                <textarea value={form.complaint} onChange={(e) => setForm({ ...form, complaint: e.target.value })} placeholder="Complaint" className="w-full rounded-xl border border-slate-300 px-3 py-2" required />
                <button className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">Register patient</button>
              </div>
            </form>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold">Today&apos;s outpatient queue</h2>
              <div className="mt-4 space-y-3">
                {registrations.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-slate-500">{item.department}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{item.complaint}</span>
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
