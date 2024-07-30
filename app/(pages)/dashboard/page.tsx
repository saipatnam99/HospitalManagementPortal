"use client";

import Navbar from "@/components/navbar/page";
import Sidebar from "@/components/sidebar/page";


const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", active: true },
  { href: "/doctors", label: "Doctors" },
  { href: "/patients", label: "Patients" },
  { href: "/appointments", label: "Appointments" },
  { href: "/services", label: "Services" },
  { href: "/billing", label: " Billing" },
  { href: "/insurance", label: "Insurance" },
  { href: "/policies", label: "Policies" },
  { href: "/faq", label: "FAQ" },
  { href: "/notifications", label: "Notifications" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-gray-100 flex flex-row">
        <Sidebar sidebarItems={sidebarItems} />
        <h1 className="text-3xl mb-4">Welcome to Hospitals</h1>
      </div>
    </div>
  );
}
