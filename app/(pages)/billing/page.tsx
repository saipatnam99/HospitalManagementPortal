"use client";

import React, { useState } from 'react';

import Navbar from '@/components/navbar/page';
import Sidebar from '@/components/sidebar/page';

const sidebarItems = [
  { href: '/dashboard', label: 'Dashboard'},
  { href: "/doctors", label: "Doctors" },
  { href: "/patients", label: "Patients" },
  { href: "/appointments", label: "Appointments" },
  { href: "/services", label: "Services" },
  { href: "/billing", label: " Billing", active: true  },
  { href: "/insurance", label: "Insurance" },
  { href: "/policies", label: "Policies" },
  { href: "/faq", label: "FAQ" },
  { href: "/notifications", label: "Notifications" },
];

export default function Billing() {

interface BillingFormProps {
  onSubmit: (data: BillingFormData) => void;
}

 interface BillingFormData {
  patientName: string;
  treatment: string;
  amount: number;
}

const BillingForm: React.FC<BillingFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<BillingFormData>({
    patientName: '',
    treatment: '',
    amount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded shadow-lg">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="patientName">Patient Name</label>
        <input
          type="text"
          id="patientName"
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="treatment">Treatment</label>
        <input
          type="text"
          id="treatment"
          name="treatment"
          value={formData.treatment}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
    </form>
  );
};

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-gray-100 flex flex-row">
        <Sidebar sidebarItems={sidebarItems} />
        <div className="flex-1 p-8">
          
         
        </div>
      </div>
    </div>
  );
}
