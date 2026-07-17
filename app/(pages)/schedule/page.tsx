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
  { href: "/beds", label: "Beds" },
  { href: "/discharge", label: "Discharge" },
  { href: "/schedule", label: "Schedule", active: true },
  { href: "/admin", label: "Admin" },
];

const departments = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function SchedulePage() {
  const [appointments, setAppointments] = useState([
    { id: 1, patient: "Asha", department: "Cardiology", day: "Mon", time: "09:00" },
    { id: 2, patient: "Nikhil", department: "Neurology", day: "Wed", time: "14:00" },
  ]);
  const [form, setForm] = useState({ patient: "", department: departments[0], day: days[0], time: "09:00" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointments((prev) => [{ id: Date.now(), ...form }, ...prev]);
    setForm({ patient: "", department: departments[0], day: days[0], time: "09:00" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-row">
        <Sidebar sidebarItems={sidebarItems} />
        <div className="flex-1 p-6 md:p-8">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-800 p-6 text-white shadow-lg">
            <h1 className="text-2xl font-semibold">Appointment scheduling calendar</h1>
            <p className="mt-2 text-sm text-slate-300">Organize department-based appointments with a live scheduling board.</p>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold">Create appointment</h2>
              <div className="mt-4 space-y-3">
                <input value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} placeholder="Patient name" className="w-full rounded-xl border border-slate-300 px-3 py-2" required />
                <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2">
                  {departments.map((department) => <option key={department}>{department}</option>)}
                </select>
                <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2">
                  {days.map((day) => <option key={day}>{day}</option>)}
                </select>
                <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
                <button className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">Save appointment</button>
              </div>
            </form>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold">Department schedule</h2>
              <div className="mt-4 space-y-3">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div>
                      <p className="font-semibold">{appointment.patient}</p>
                      <p className="text-sm text-slate-500">{appointment.department}</p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">{appointment.day} {appointment.time}</span>
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
