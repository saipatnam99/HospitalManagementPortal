// "use client";
// import { useState } from "react";
// import { useSession } from "next-auth/react";
// import Navbar from "@/components/navbar/page";
// import Sidebar from "@/components/sidebar/page";

// const sidebarItems = [
//   { href: "/dashboard", label: "Dashboard", active: true },
//   { href: "/doctors", label: "Doctors" },
//   { href: "/patients", label: "Patients" },
//   { href: "/appointment", label: "Appointments" },
//   { href: "/services", label: "Services" },
//   { href: "/billing", label: " Billing" },
//   { href: "/insurance", label: "Insurance" },
//   { href: "/policies", label: "Policies" },
//   { href: "/faq", label: "FAQ" },
//   { href: "/notifications", label: "Notifications" },
// ];

// export default function Dashboard() {
//   const { data: session, status } = useSession();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   if (status === "loading") {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   if (!session) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         You must be logged in to view this page.
//       </div>
//     );
//   }

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <div className="bg-gray-100 flex flex-1 flex-row">
//         {/* Toggle Button for Sidebar */}
//         <button
//           className="md:hidden p-2 text-white bg-blue-600"
//           onClick={toggleSidebar}
//         >
//           {isSidebarOpen ? "Close Menu" : "Menu"}
//         </button>

//         {/* Sidebar component */}
//         <div
//           className={`${
//             isSidebarOpen ? "block" : "hidden"
//           } md:block md:w-64 h-full bg-white shadow-lg`}
//         >
//           <Sidebar sidebarItems={sidebarItems} />
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 p-8">
//           <h1 className="text-3xl mb-4">Welcome to Hospitals</h1>
//           <div className="mb-4">
//             <p className="text-lg">
//               Welcome, {session.user?.username || "User"}!
//             </p>
//             <p className="text-gray-600">Email: {session.user?.email}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/navbar/page";
import Sidebar from "@/components/sidebar/page";
import Swal from "sweetalert2";
import { useHospitalContext } from "@/app/providers";

const pharmacyOrders = [
  { item: "Paracetamol 500mg", qty: 24, status: "Ready" },
  { item: "Insulin Pen", qty: 8, status: "Packing" },
  { item: "IV Fluids", qty: 12, status: "Dispatch" },
];

const labQueue = [
  { test: "CBC Panel", patient: "Mina Joseph", time: "09:20" },
  { test: "Lipid Profile", patient: "Sanjay Kumar", time: "09:45" },
  { test: "COVID PCR", patient: "Nina Shah", time: "10:10" },
];

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", active: true },
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
  { href: "/admin", label: "Admin" },
];

const triageQueue = [
  { name: "Ava Patel", status: "Critical", priority: "Level 1", room: "ER-12", phone: "+919876543210" },
  { name: "Rohan Sethi", status: "Waiting", priority: "Level 2", room: "Ward-A", phone: "+919999888777" },
  { name: "Meera Rao", status: "Stable", priority: "Level 3", room: "OPD-03", phone: "+919555444333" },
];

const doctorAvailability = [
  { name: "Dr. Priya Nair", specialty: "Cardiology", nextSlot: "10:30 AM", status: "Available" },
  { name: "Dr. Arjun Menon", specialty: "Neurology", nextSlot: "11:45 AM", status: "In clinic" },
  { name: "Dr. Sana Verma", specialty: "Pediatrics", nextSlot: "01:15 PM", status: "Available" },
];

const billingHighlights = [
  { label: "Pending invoices", value: "$8,420", tone: "bg-amber-50 text-amber-700" },
  { label: "Collected today", value: "$3,180", tone: "bg-emerald-50 text-emerald-700" },
  { label: "Insurance claims", value: "24", tone: "bg-sky-50 text-sky-700" },
];

interface AppointmentItem {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  department: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { events, refreshSignal, addEvent, patientStatuses } = useHospitalContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0 });
  const [recentAppointments, setRecentAppointments] = useState<AppointmentItem[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
          fetch("/api/patients"),
          fetch("/api/doctors"),
          fetch("/api/appointments"),
        ]);

        const patients = await patientsRes.json();
        const doctors = await doctorsRes.json();
        const appointments = await appointmentsRes.json();

        setStats({
          patients: patients.length,
          doctors: doctors.length,
          appointments: appointments.length,
        });

        const normalizedAppointments = (appointments as any[])
          .slice(0, 5)
          .map((appointment) => ({
            id: appointment.id,
            patientName: `${appointment.patient?.firstName ?? ""} ${appointment.patient?.lastName ?? ""}`.trim() || "Unknown patient",
            doctorName: appointment.doctor?.fullName || "Unassigned",
            date: appointment.date
              ? new Date(appointment.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })
              : "Pending",
            time: appointment.time || "TBD",
            department: appointment.doctor?.specialization || "General",
          }));

        setRecentAppointments(normalizedAppointments);
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchDashboardData();
  }, [refreshSignal]);

  const handleReminder = async (patientName: string, phone: string) => {
    try {
      Swal.fire({ title: "Sending reminder", text: `Preparing a reminder for ${patientName}...`, icon: "info", showConfirmButton: false, timer: 1000 });
      const response = await fetch("/api/sendSms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumbers: [phone],
          message: `Hello ${patientName}, this is a hospital reminder for your upcoming appointment. Please arrive 15 minutes early.`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to send reminder");
      }

      addEvent({ id: `reminder-${Date.now()}`, type: "reminder", message: `Reminder sent to ${patientName}`, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
      Swal.fire({ title: "Reminder sent", text: data.message || "The reminder was queued successfully.", icon: "success" });
    } catch (error) {
      Swal.fire({ title: "Reminder failed", text: error instanceof Error ? error.message : "Please try again later.", icon: "error" });
    }
  };

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <div className="flex min-h-screen items-center justify-center">You must be logged in to view this page.</div>;
  }

  const userName = (session?.user as any)?.username || (session?.user as any)?.name || "User";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex flex-1">
        <div className="hidden md:block">
          <Sidebar sidebarItems={sidebarItems} />
        </div>

        <button
          className="m-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "Close menu" : "Open menu"}
        </button>

        {isSidebarOpen && (
          <div className="absolute z-20 md:hidden">
            <Sidebar sidebarItems={sidebarItems} />
          </div>
        )}

        <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
          <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-800 p-6 text-white shadow-lg">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-blue-200">Hospital command center</p>
                <h1 className="mt-2 text-2xl font-semibold">Welcome back, {userName}.</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-300">
                  Monitor care flow, triage activity, doctor coverage, billing readiness, and reminders from one modern dashboard.
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm backdrop-blur">
                <p className="font-semibold">Care team status</p>
                <p className="text-slate-200">All departments are operating normally</p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Patients enrolled", value: stats.patients, accent: "from-cyan-500 to-blue-600" },
              { label: "Active doctors", value: stats.doctors, accent: "from-violet-500 to-fuchsia-600" },
              { label: "Appointments today", value: stats.appointments, accent: "from-emerald-500 to-teal-600" },
            ].map((card) => (
              <div key={card.label} className="card-surface p-5">
                <div className={`mb-3 h-2 rounded-full bg-gradient-to-r ${card.accent}`} />
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="card-surface p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Upcoming appointments</h2>
                  <p className="text-sm text-slate-500">Priority bookings and care follow-ups</p>
                </div>
                <span className="soft-pill">Priority queue</span>
              </div>

              {recentAppointments.length === 0 ? (
                <p className="text-sm text-slate-500">No appointments found yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div>
                        <p className="font-semibold text-slate-900">{appointment.patientName}</p>
                        <p className="text-sm text-slate-500">{appointment.doctorName} • {appointment.department}</p>
                      </div>
                      <div className="text-right text-sm text-slate-600">
                        <p>{appointment.date}</p>
                        <p>{appointment.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card-surface p-5">
              <h2 className="text-lg font-semibold text-slate-900">Emergency & priority alerts</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
                  <p className="font-semibold text-rose-700">Critical triage</p>
                  <p>One patient requires faster response from the emergency team.</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <p className="font-semibold text-amber-700">High-priority visit</p>
                  <p>Follow-up consultation is approaching in the next hour.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="card-surface p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Real-time patient status widget</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Live view of patient readiness and urgency</p>
                </div>
                <span className="soft-pill">Live feed</span>
              </div>

              <div className="space-y-3">
                {patientStatuses.map((patient) => (
                  <div key={patient.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/70">
                    <div className="flex items-center gap-3">
                      <span className={`status-dot ${patient.color}`} />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{patient.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{patient.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{patient.status}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{patient.pulse}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="card-surface p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Doctor availability</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Upcoming slots and department coverage</p>
                  </div>
                  <span className="soft-pill">This hour</span>
                </div>

                <div className="space-y-3">
                  {doctorAvailability.map((doctor) => (
                    <div key={doctor.name} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/70">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{doctor.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{doctor.specialty}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{doctor.nextSlot}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{doctor.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-surface p-5">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Billing summary</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  {billingHighlights.map((item) => (
                    <div key={item.label} className={`rounded-xl p-3 ${item.tone}`}>
                      <p className="text-sm">{item.label}</p>
                      <p className="mt-1 text-xl font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="card-surface p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Pharmacy & lab module</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Medication fulfillment and diagnostics queue</p>
                </div>
                <span className="soft-pill">Operations</span>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Pharmacy orders</h3>
                  <div className="mt-3 space-y-2">
                    {pharmacyOrders.map((order) => (
                      <div key={order.item} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm dark:bg-slate-900">
                        <span>{order.item}</span>
                        <span className="text-slate-500">Qty {order.qty}</span>
                        <span className="font-semibold text-blue-600">{order.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Lab queue</h3>
                  <div className="mt-3 space-y-2">
                    {labQueue.map((item) => (
                      <div key={item.test} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm dark:bg-slate-900">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{item.test}</p>
                          <p className="text-slate-500">{item.patient}</p>
                        </div>
                        <span className="text-slate-500">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-surface p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Live activity feed</h2>
                <span className="soft-pill">Realtime</span>
              </div>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                {events.length === 0 ? (
                  <p>No live events yet.</p>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/70">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{event.message}</p>
                        <span className="text-xs text-slate-500">{event.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}