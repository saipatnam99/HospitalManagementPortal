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

export default function AddDoctorForm() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router= useRouter()
    
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
            router.push("/doctors")
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
                <div>
              <label htmlFor="phone" className="block text-sm font-medium">
                Phone Number
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
                  {/* <div className="flex-1">
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
                  </div> */}
                     <div className="mb-4 flex space-x-4">
                <div className="flex-1">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="specialization"
                  >
                    Specialization
                  </label>
                  <select
                    id="specialization"
                    name="specialization"
                    value={newDoctor.specialization}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  >
                    <option value="" disabled>Select Specialization</option>
                    {specializations.map((specialization) => (
                      <option key={specialization} value={specialization}>
                        {specialization}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => router.push("/doctors")}
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
