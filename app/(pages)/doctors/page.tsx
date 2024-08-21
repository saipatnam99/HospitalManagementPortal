"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/sidebar/page";
import Navbar from "@/components/navbar/page";
import DataTable from "@/components/dataTable/page";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
//import Loader from "@/components/loader/page";

interface SidebarItem {
  href: string;
  label: string;
  active?: boolean;
}



// Specialization options
const specializations = [
"Cardiology",
"Dermatology",
"Emergency Medicine",
"Endocrinology",
"Family Medicine",
"Gastroenterology",
"General Surgery",
"Geriatrics",
"Hematology",
"Internal Medicine",
"Neurology",
"Obstetrics and Gynecology",
"Oncology",
"Ophthalmology",
"Orthopedic Surgery",
"Pediatrics",
"Psychiatry",
"Pulmonology",
"Radiology",
"Rheumatology",
"Urology"
];

const sidebarItems: SidebarItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/doctors", label: "Doctors", active: true },
  { href: "/patients", label: "Patients" },
  { href: "/appointment", label: "Appointments" },
  { href: "/services", label: "Services" },
  { href: "/billing", label: " Billing" },
  { href: "/insurance", label: "Insurance" },
  { href: "/policies", label: "Policies" },
  { href: "/faq", label: "FAQ" },
  { href: "/notifications", label: "Notifications" },
];

interface Doctor {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  experience: number;
  specialization: string;
}

interface EditDoctorFormProps {
  doctor: Doctor | null;
}

export default function Doctors() {
 
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router=useRouter()

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/doctors");
        console.log(response.data)
        setDoctors(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const columns = [
    { header: () => "Full Name", accessorKey: "fullName" },
    { header: () => "Email", accessorKey: "email" },
    { header: () => "Phone", accessorKey: "phone" },
    { header: () => "Address", accessorKey: "address" },
    { header: () => "Experience", accessorKey: "experience" },
    { header: () => "Specialization", accessorKey: "specialization" },
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

  const handleEdit = (doctorId: string) => {
    const doctorToEdit = doctors.find((doctor) => doctor.id === doctorId);
    setSelectedDoctor(doctorToEdit || null);
    router.push(`/doctors/${doctorId}`)
   
  };

  const handleDelete = async (doctorId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this doctor!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          await axios.delete(`/api/doctors/${doctorId}`);
          Swal.fire("Deleted!", "The doctor has been deleted.", "success");
          setDoctors((prevDoctors) =>
            prevDoctors.filter((doctor) => doctor.id !== doctorId)
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
    <div className="flex">
      <Sidebar sidebarItems={sidebarItems} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-semibold">Doctors</h1>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={() =>router.push("/doctors/addDoctor") }
            >
              Add Doctor
            </button>
          </div>

          <DataTable data={doctors} columns={columns} isLoading={undefined} />
        </div>
      </div>
      
    </div>
  );
}
