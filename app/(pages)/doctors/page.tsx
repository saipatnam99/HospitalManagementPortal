"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/sidebar/page";
import Navbar from "@/components/navbar/page";
import DataTable from "@/components/dataTable/page";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-input-2";
//import Loader from "@/components/loader/page";

interface SidebarItem {
  href: string;
  label: string;
  active?: boolean;
}

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    setShowEditModal(true);
  };

   const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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

  const AddDoctorForm = () => {
    const [newDoctor, setNewDoctor] = useState<Doctor>({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      experience: 0,
      specialization: "",
    });

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setNewDoctor((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (value: string) => {
      setNewDoctor({ ...newDoctor, phone: value });
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const formattedPhoneNumber = `+${newDoctor.phone}`;

      const modifiedDoctor = {
        ...newDoctor,
        phone:formattedPhoneNumber,
        experience: Number(newDoctor.experience),
      };
      setIsLoading(true);
      console.log(modifiedDoctor)
      try {
        // console.log(response.data)
        const response = await axios.post("/api/doctors", modifiedDoctor);
        console.log(response.data)
        const newModifiedDoctor = response.data.doctor;
        setDoctors((prevDoctors) => [...prevDoctors, newModifiedDoctor]);
       
        setNewDoctor({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          experience: 0,
          specialization: "",
        })
        setShowAddModal(false);
        setIsLoading(false);
      } catch (error) {
        console.error("Error adding doctor:", error);
        setIsLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl min-h-[500px]">
          <h2 className="text-xl mb-6">Add New Doctor</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={newDoctor.fullName}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={newDoctor.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
            </div>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <PhoneInput
                country={"in"} // Set default country
                value={newDoctor.phone}
                onChange={handlePhoneChange}
                inputClass="w-full mt-1 p-2 border rounded-md"
                containerClass="w-full"
                inputProps={{
                  name: "phone",
                  required: true,
                  autoFocus: true,
                }}
              />
                {/* <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={newDoctor.phone}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                /> */}
              </div>
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="address"
                >
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={newDoctor.address}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
            </div>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="experience"
                >
                  Experience (Years)
                </label>
                <input
                  id="experience"
                  name="experience"
                  type="number"
                  value={newDoctor.experience}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="specialization"
                >
                  Specialization
                </label>
                <input
                  id="specialization"
                  name="specialization"
                  type="text"
                  value={newDoctor.specialization}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Add Doctor
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EditDoctorForm = ({ doctor }: EditDoctorFormProps) => {
    const [updatedDoctor, setUpdatedDoctor] = useState<Doctor>(
      doctor || {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        experience: 0,
        specialization: "",
      }
    );
    if (!updatedDoctor) return null;

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setUpdatedDoctor((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

     const  newUpdatedDoctor= {
            ...updatedDoctor,
            experience: Number(updatedDoctor.experience)
      }
      setIsLoading(true);
      try {
       const response= await axios.patch(`/api/doctors/${updatedDoctor.id}`, newUpdatedDoctor);
       console.log(response.data)
       const updatedDoctorData =response.data.updatedDoctor;
        setDoctors((prevDoctors) =>
          prevDoctors.map((doc) =>
            doc.id === updatedDoctor.id ? updatedDoctorData : doc
          )
        );
        setShowEditModal(false);
        setIsLoading(false);
      } catch (error) {
        console.error("Error updating doctor:", error);
        setIsLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl min-h-[500px]">
          <h2 className="text-xl mb-6">Edit Doctor</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={updatedDoctor.fullName}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={updatedDoctor.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
            </div>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={updatedDoctor.phone}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="address"
                >
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={updatedDoctor.address}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
            </div>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="experience"
                >
                  Experience (Years)
                </label>
                <input
                  id="experience"
                  name="experience"
                  type="number"
                  value={updatedDoctor.experience}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="specialization"
                >
                  Specialization
                </label>
                <input
                  id="specialization"
                  name="specialization"
                  type="text"
                  value={updatedDoctor.specialization}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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
        <div className="flex-1 p-4 overflow-x-auto">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-semibold">Doctors</h1>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => setShowAddModal(true)}
            >
              Add Doctor
            </button>
          </div>

          <DataTable data={doctors} columns={columns} isLoading={undefined} />
        </div>
      </div>
      {showAddModal && <AddDoctorForm />}
      {showEditModal && <EditDoctorForm doctor={selectedDoctor} />}
    </div>
  );
}
