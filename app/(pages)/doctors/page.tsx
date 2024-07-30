"use client";

import DataTable from "@/components/dataTable/page";
import Navbar from "@/components/navbar/page";
import Sidebar from "@/components/sidebar/page";
import Link from "next/link";
import { useState } from "react";


const sidebarItems = [
  { href: "/dashboard", label: "Dashboard"},
  { href: "/doctors", label: "Doctors", active: true  },
  { href: "/patients", label: "Patients" },
  { href: "/appointments", label: "Appointments" },
  { href: "/services", label: "Services" },
  { href: "/billing", label: " Billing" },
  { href: "/insurance", label: "Insurance" },
  { href: "/policies", label: "Policies" },
  { href: "/faq", label: "FAQ" },
  { href: "/notifications", label: "Notifications" },
];

const columns = [
    { header: () => "Name", accessorKey: "name" },
    { header: () => "Experience", accessorKey: "experience" },
    { header: () => "Specialization", accessorKey: "specialization" },
    { header: () => "Email", accessorKey: "email" },
    { header: () => "Phone", accessorKey: "phone" },

    {
      header: () => "Actions",
      accessorKey: "actions",
      cell: ({ row }: { row: any }) => (
        <>
          <button
            className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded"
          //  onClick={() => handleEdit(row.id)}
          >
            Edit
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
           // onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

export default function Doctors() {
    const [isLoading,setIsLoading]=useState(false)
  return (
   
    <div className="min-h-screen flex flex-col">
    <Navbar />
    <div className="bg-gray-100 flex flex-row">
      <Sidebar sidebarItems={sidebarItems} />
      <div className="flex-grow px-6 py-4">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
          <h1 className="text-3xl font-semibold">Doctors List</h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            //onClick={() => setShowAddModal(true)}
          >
            <Link href={"/doctors/add-doctor"}> Add Doctors</Link>
        
          </button>
        </div>

        <DataTable columns={columns} data={[]} isLoading={isLoading} />       
      </div>
    </div>
  </div>
  );
}
