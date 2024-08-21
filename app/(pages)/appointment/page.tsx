"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "@/components/dataTable/page";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import Navbar from "@/components/navbar/page";
import Sidebar from "@/components/sidebar/page";
import Breadcrumbs from "@/components/breadCrumbs/page";

interface SidebarItem {
  href: string;
  label: string;
  active?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/doctors", label: "Doctors"},
  { href: "/patients", label: "Patients" },
  { href: "/appointment", label: "Appointments", active: true  },
  { href: "/services", label: "Services" },
  { href: "/billing", label: " Billing" },
  { href: "/insurance", label: "Insurance" },
  { href: "/policies", label: "Policies" },
  { href: "/faq", label: "FAQ" },
  { href: "/notifications", label: "Notifications" },
];

interface Appointment {
  id?: string;
  date: string;
  time: string;
  patient: {
    firstName: string;
    lastName: string;
    email: string;
  };
  doctor: {
    // firstName: string;
    fullName: string;
    specialization: string;
  };
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router=useRouter()
  const breadcrumbItems = [
   
    { label: "Home", href: "/dashboard" },
    { label: "Appointments", href: "/appointment" },
    {label : "Appoinment list", href: "/appoinment"}
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/appointments");
        console.log(response.data);
        setAppointments(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);
  const columns = [
    {
      header: () => "Patient Name",
      accessorKey: "patient",
      cell: ({ row }: { row: any }) => (
        <>
          {row.patient.firstName} {row.patient.lastName}
        </>
      ),
    },
    {
      header: () => "Patient phone",
      accessorKey: "phone",
      cell: ({ row }: { row: any }) => (
        <>
          {row.patient.phone} 
        </>
      ),
    },

    {
      header: () => "Doctor Name",
      accessorKey: "doctor",
      cell: ({ row }: { row: any }) => <>{row.doctor.fullName}</>,
    },
    {
      header: () => "Specialization",
      accessorKey: "specialization",
      cell: ({ row }: { row: any }) => <>{row.doctor.specialization}</>,
    },
    { header: () => "Procedure", accessorKey: "procedure" },
    {
      header: () => "Preferred Date",
      accessorKey: "date",
    },
    { header: () => "Preferred Time", accessorKey: "time" },
    {
      header: () => "Actions",
      accessorKey: "actions",
      cell: ({ row }: { row: any }) => (
        <>
          <button
            className="mb-2 mr-2 px-6 py-2 bg-yellow-500 text-white rounded"
            onClick={() => handleEdit(row.id)}
          >
            Edit
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
             onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  const handleEdit = (id: string) => {
    const AppointmentToEdit = appointments.find((appointment) => appointment.id === id);
    console.log(AppointmentToEdit)
    if (AppointmentToEdit) {
      router.push(
        `/appointment/${id}`
      );
    }
  };

  const handleDelete = async (appointmentId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this appointment!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          await axios.delete(`/api/appointments/${appointmentId}`);
          Swal.fire("Deleted!", "The appointment has been deleted.", "success");
          setAppointments((prevAppointments) =>
            prevAppointments.filter(
              (appointment) => appointment.id !== appointmentId
            )
          );
          setIsLoading(false);
        } catch (error) {
          console.error("Error deleting appointment:", error);
          setIsLoading(false);
        }
      }
    });
  };



  return (
    <div className="flex">
      <Sidebar sidebarItems={sidebarItems} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <Breadcrumbs items={breadcrumbItems} />
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-semibold">Appointments</h1>
            {/* <button className="px-4 py-2 bg-green-500 text-white rounded">
              <Link href={`/appointment/newAppointment`}> Add Appointment</Link>
            </button> */}
          </div>

          <DataTable data={appointments} columns={columns} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}


