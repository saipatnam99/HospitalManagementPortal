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

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/navbar/page";
import Sidebar from "@/components/sidebar/page";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", active: true },
  { href: "/doctors", label: "Doctors" },
  { href: "/patients", label: "Patients" },
  { href: "/appointment", label: "Appointments" },
  { href: "/services", label: "Services" },
  { href: "/billing", label: "Billing" },
  { href: "/insurance", label: "Insurance" },
  { href: "/policies", label: "Policies" },
  { href: "/faq", label: "FAQ" },
  { href: "/notifications", label: "Notifications" },
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🔥 Dashboard Data
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
  });

  const [recentAppointments, setRecentAppointments] = useState([]);

  // 🔥 Fetch Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [patientsRes, doctorsRes, appointmentsRes] =
          await Promise.all([
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

        setRecentAppointments(appointments.slice(0, 5));
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        You must be logged in to view this page.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex flex-1">
        
        {/* Sidebar */}
        <div className="hidden md:block w-64 bg-white shadow-lg">
          <Sidebar sidebarItems={sidebarItems} />
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 bg-blue-600 text-white"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          Menu
        </button>

        {isSidebarOpen && (
          <div className="absolute z-20 w-64 bg-white shadow-lg md:hidden">
            <Sidebar sidebarItems={sidebarItems} />
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 p-6 space-y-6">

          {/* HEADER */}
          <div>
            <h1 className="text-2xl font-bold">
              Welcome, {session.user?.username || "User"} 👋
            </h1>
            <p className="text-gray-500">{session.user?.email}</p>
          </div>

          {/* 🔥 STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500">Total Patients</p>
              <h2 className="text-2xl font-bold">{stats.patients}</h2>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500">Total Doctors</p>
              <h2 className="text-2xl font-bold">{stats.doctors}</h2>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500">Appointments</p>
              <h2 className="text-2xl font-bold">{stats.appointments}</h2>
            </div>

          </div>

          {/* 🔥 RECENT APPOINTMENTS */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">
              Recent Appointments
            </h2>

            {recentAppointments.length === 0 ? (
              <p className="text-gray-500">No appointments found</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500 border-b">
                  <tr>
                    <th className="py-2">Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {recentAppointments.map((appt: any, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{appt.patientName}</td>
                      <td>{appt.doctorName}</td>
                      <td>{appt.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}