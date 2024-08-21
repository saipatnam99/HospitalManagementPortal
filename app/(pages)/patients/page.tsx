"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/sidebar/page";
import Navbar from "@/components/navbar/page";
import DataTable from "@/components/dataTable/page";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/breadCrumbs/page";

interface SidebarItem {
  href: string;
  label: string;
  active?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/doctors", label: "Doctors" },
  { href: "/patients", label: "Patients", active: true },
  { href: "/appointment", label: "Appointments" },
  { href: "/services", label: "Services" },
  { href: "/billing", label: " Billing" },
  { href: "/insurance", label: "Insurance" },
  { href: "/policies", label: "Policies" },
  { href: "/faq", label: "FAQ" },
  { href: "/notifications", label: "Notifications" },
];

interface Patient {
  id?: string;
  firstName: string;
  lastName: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  paymentMethod: string;
  cashAmount: string;
  cardType: string;
  cardDetails: string;
  upiReceived: string;
}

interface EditPatientFormProps {
  patient: Patient | null;
}

export default function Patients() {
  // const [showAddModal, setShowAddModal] = useState(false);
  // const [showEditModal, setShowEditModal] = useState(false);
  // const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router=useRouter()

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/patients");
        console.log(response.data);
        setPatients(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);
  const breadcrumbItems = [
   
    { label: "Home", href: "/dashboard" },
    { label: "Patients", href: "/patients" },
    {label : "Patients List", href: "/patients"}
  ];


  const columns = [
    { header: () => "First Name", accessorKey: "firstName" },
    { header: () => "Last Name", accessorKey: "lastName" },
    { header: () => "Email", accessorKey: "email" },
    { header: () => "Phone", accessorKey: "phone" },
    { header: () => "Address", accessorKey: "address " ,
    cell: ({ row }: { row: any }) => (
      <>
        {`${row.address},${row.city}, ${row.state}, ${row.postalCode}`}
      </>
    )
  },
    { header: () => "Age", accessorKey: "age" },
    { header: () => "Gender", accessorKey: "gender" },
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
            className="px-6 py-2 bg-blue-500 text-white rounded"
            onClick={() => handleCreateAppointment(row.id)}
          >
            Create Appointment
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
    const patientToEdit = patients.find((patient) => patient.id === id);
    console.log(patientToEdit)
    if (patientToEdit) {
      router.push(
        `/patients/${id}`
      );
    }
  };
  const handleCreateAppointment = (id: string) => {
    router.push(`/appointment/newAppointment?patientId=${id}`);
  };

  
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this patient!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          await axios.delete(`/api/patients/${id}`);
          Swal.fire("Deleted!", "The patient has been deleted.", "success");
          setPatients((prevPatients) =>
            prevPatients.filter((patient) => patient.id !== id)
          );
          setIsLoading(false);
        } catch (error) {
          console.error("Error deleting doctor:", error);
          setIsLoading(false);
        }
      }
    });
  };

  return (
    <div className="flex flex-col">
         <Navbar />
         <Breadcrumbs items={breadcrumbItems} separator=">>"/>
      <div className=" flex flex-row">
   
        <Sidebar sidebarItems={sidebarItems} />
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-semibold">Patients</h1>
            <button className="px-4 py-2 bg-green-500 text-white rounded">
              <Link href={"/patients/addPatient"}> Add Patient</Link>
            </button>
          </div>

          <DataTable data={patients} columns={columns} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
