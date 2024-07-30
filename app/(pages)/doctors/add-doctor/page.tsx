"use client";
import React from "react";

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  // setFormData({ ...formData, [e.target.name]: e.target.value });
};

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  // onSubmit(formData);
  };

const AddDoctor = () => {
  return (
    <form onSubmit= {handleSubmit}className="max-w-lg mx-auto p-6 bg-white rounded shadow-md space-y-6">
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
          // value={formData.fullName}
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
          //  value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
      </div>

      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="phoneNumber"
        >
          Phone Number
        </label>
        <input
          type="tel"
          name="phoneNumber"
          // value={formData.phoneNumber}
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
          // value={formData.specialization}
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
          // value={formData.yearsOfExperience}
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
          //value={formData.clinicAddress}
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
