"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/navbar/page";
import Sidebar from "@/components/sidebar/page";
import Breadcrumbs from "@/components/breadCrumbs/page";
import PhoneInput from "react-phone-input-2";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/doctors", label: "Doctors", active: true },
  { href: "/patients", label: "Patients" },
  { href: "/appointments", label: "Appointments" },
  { href: "/services", label: "Services" },
  { href: "/billing", label: "Billing" },
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
  "Urology",
];

const EditDoctorForm = () => {
  const [formData, setFormData] = useState<Doctor>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    experience: 0,
    specialization: "",
  });

  const router = useRouter();
  const { id } = useParams(); // Use useParams to get the id from the URL
  const breadcrumbItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Doctors", href: "/doctors" },
    { label: "Edit Doctor", href: `/doctors/${id}` },
  ];

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get(`/api/doctors/${id}`);
        const doctorData = response.data;

        setFormData({
          ...doctorData,
          experience: doctorData.experience.toString(),
        });
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    if (id) {
      fetchDoctorData();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhoneNumber = `+${formData.phone}`;

    const updatedData = {
      ...formData,
      phone: formattedPhoneNumber,
      experience: Number(formData.experience),
    };
  

   
    try {
      const response = await axios.patch(`/api/doctors/${id}`, updatedData);
      console.log(response.data);
      router.push("/doctors");
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Breadcrumbs items={breadcrumbItems} separator=">>" />
      <div className="bg-gray-100 flex flex-row">
        <Sidebar sidebarItems={sidebarItems} />

        <div className="max-w-lg mx-auto mt-10">
          <h1 className="text-2xl font-bold mb-5">Edit Doctor</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-2 flex-row">
              <div className="mr-2">
                <label htmlFor="fullName" className="block text-sm font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
            </div>
         
                <div>
              <label htmlFor="phone" className="block text-sm font-medium">
                Phone Number
              </label>
              <PhoneInput
                country={"in"} // Set default country
                value={formData.phone}
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

            {/* <div>
              <label htmlFor="phone" className="block text-sm font-medium">
                Phone
              </label>
              <PhoneInput
                    country={"in"} // Set default country
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    inputClass="w-full mt-1 p-2 border rounded-md"
                    containerClass="w-full"
                    inputProps={{
                      name: "phone",
                      required: true,
                      autoFocus: true,
                    }}
                  />
            </div> */}

            <div>
              <label htmlFor="address" className="block text-sm font-medium">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium">
                Experience (Years)
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience.toString()}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="specialization"
                className="block text-sm font-medium"
              >
                Specialization
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border rounded-md"
              >
                <option value="" disabled>
                  Select Specialization
                </option>
                {specializations.map((specialization) => (
                  <option key={specialization} value={specialization}>
                    {specialization}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md"
            >
              Update Doctor
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDoctorForm;
