"use client";

import axios from "axios";
import  { useEffect, useState } from "react";

interface Doctors {
  id?: string;
  fullName: string;
  phone: number;
  email: string;
  experience: number;
  specialization: string;
  address: string;
}

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





const AddDoctor = () => {
  const[isLoading,setIsLoading]= useState(false)
  const[doctors,setDoctors]=useState<Doctors[]>([])

  const [newDoctor,setNewDoctor]= useState<Doctors>({
    fullName: "",
    phone: 0,
    specialization:"",
    experience: 0,
    email: "",
    address: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value}= e.target;
    setNewDoctor((prev)=> ({...prev, [name]: value}))
    // setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
console.log(newDoctor)
    try {
      const response = await axios.post("/api/doctors",newDoctor)
      console.log(response.data)
      const newDoctorData= response.data.doctor;
      console.log(newDoctorData)
      setDoctors((prevDoctors)=> [...prevDoctors, newDoctorData])
      setNewDoctor({
        fullName: "",
        phone: 0,
        specialization:"",
        experience: 0,
        email: "",
        address: "",
      })
      
    } catch (error) {
      console.log("Error adding Doctor", error)
    }

    // onSubmit(formData);
  };

  

 
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded shadow-md space-y-6"
    >
      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="fullName"
        >
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          value={newDoctor.fullName}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
      </div>

      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
           value={newDoctor.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
      </div>

      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="phone"
        >
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={newDoctor.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
      </div>

      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="specialization"
        >
          Specialization
        </label>
        <input
          type="text"
          name="specialization"
           value={newDoctor.specialization}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
      </div>

      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="experience"
        >
          Experience
        </label>
        <input
          type="number"
          name="experience"
          value={newDoctor.experience}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
      </div>

      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="address"
        >
          Address
        </label>
        <textarea
          name="address"
          value={newDoctor.address}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        ></textarea>
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Register
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
