"use client";

import { useSession } from 'next-auth/react';
import Navbar from '@/components/navbar/page';
import Sidebar from '@/components/sidebar/page';

const sidebarItems = [
  { href: '/dashboard', label: 'Dashboard', active: true },
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
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center">You must be logged in to view this page.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-gray-100 flex flex-row">
        <Sidebar sidebarItems={sidebarItems} />
        <div className="flex-1 p-8">
          <h1 className="text-3xl mb-4">Welcome to Hospitals</h1>
          <div className="mb-4">
            <p className="text-lg">Welcome, {session.user?.username || 'User'}!</p>
            <p className="text-gray-600">Email: {session.user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
