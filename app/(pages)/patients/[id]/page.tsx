"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/navbar/page";
import Sidebar from "@/components/sidebar/page";

const sidebarItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: "/doctors", label: "Doctors" },
  { href: "/patients", label: "Patients", active: true },
  { href: "/appointments", label: "Appointments" },
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

const EditPatientForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    dateOfBirth: "",
    gender: "Male",
    phone: "",
    email: "",
    address: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const router = useRouter();
  const { id } = useParams(); // Use useParams to get the id from the URL

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`/api/patients/${id}`);
        const patientData = response.data;

        setFormData({
          ...patientData,
          age: patientData.age.toString(),
          dateOfBirth: patientData.dateOfBirth.slice(0, 10),
        });
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData = {
      ...formData,
      dateOfBirth: new Date(formData.dateOfBirth),
      age: Number(formData.age),
    };

    try {
      const response = await axios.patch(`/api/patients/${id}`, updatedData);
      console.log(response.data);
      router.push("/patients");
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-gray-100 flex flex-row">
        <Sidebar sidebarItems={sidebarItems} />

        <div className="max-w-lg mx-auto mt-10">
          <h1 className="text-2xl font-bold mb-5">Edit Patient</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-2 flex-row">
              <div className="mr-2">
                <label htmlFor="firstName" className="block text-sm font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border rounded-md"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
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

            <div>
              <label htmlFor="address" className="block text-sm font-medium">
                Address Line 1
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
              <label htmlFor="addressLine2" className="block text-sm font-medium">
                Address Line 2
              </label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md"
            >
              Update Patient
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPatientForm;
