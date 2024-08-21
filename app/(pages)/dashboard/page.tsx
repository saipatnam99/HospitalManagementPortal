"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/navbar/page";
import Sidebar from "@/components/sidebar/page";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", active: true },
  { href: "/doctors", label: "Doctors" },
  { href: "/patients", label: "Patients" },
  { href: "/appointment", label: "Appointments" },
  { href: "/services", label: "Services" },
  { href: "/billing", label: " Billing" },
  { href: "/insurance", label: "Insurance" },
  { href: "/policies", label: "Policies" },
  { href: "/faq", label: "FAQ" },
  { href: "/notifications", label: "Notifications" },
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-gray-100 flex flex-1 flex-row">
        {/* Toggle Button for Sidebar */}
        <button
          className="md:hidden p-2 text-white bg-blue-600"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? "Close Menu" : "Menu"}
        </button>

        {/* Sidebar component */}
        <div
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } md:block md:w-64 h-full bg-white shadow-lg`}
        >
          <Sidebar sidebarItems={sidebarItems} />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <h1 className="text-3xl mb-4">Welcome to Hospitals</h1>
          <div className="mb-4">
            <p className="text-lg">
              Welcome, {session.user?.username || "User"}!
            </p>
            <p className="text-gray-600">Email: {session.user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
