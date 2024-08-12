"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/navbar/page";
import Sidebar from "@/components/sidebar/page";

const sidebarItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: "/doctors", label: "Doctors" },
  { href: "/patients", label: "Patients" },
  { href: "/appointment", label: "Appointments", active: true },
  { href: "/services", label: "Services" },
  { href: "/billing", label: "Billing" },
  { href: "/insurance", label: "Insurance" },
  { href: "/policies", label: "Policies" },
  { href: "/faq", label: "FAQ" },
  { href: "/notifications", label: "Notifications" },
];

interface Appointment {
  id?: string;
  date: string;
  time: string;
  patientId: string;
  doctorId: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Doctor {
  id: string;
  fullName: string;
  specialization: string;
}

const EditAppointmentForm = () => {
  const [formData, setFormData] = useState<Appointment>({
    date: "",
    time: "",
    patientId: "",
    doctorId: "",
  });
  const [patientDetails, setPatientDetails] = useState<Patient | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams(); // Use useParams to get the id from the URL

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await axios.get(`/api/appointments/${id}`);
        const appointmentData = response.data;

        setFormData({
          date: appointmentData.date.slice(0, 10),
          time: appointmentData.time,
          patientId: appointmentData.patientId,
          doctorId: appointmentData.doctorId,
        });

        // Fetch patient details
        const patientResponse = await axios.get(`/api/patients/${appointmentData.patientId}`);
        setPatientDetails(patientResponse.data);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`/api/doctors`);
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    if (id) {
      fetchAppointmentData();
      fetchDoctors();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updatedData = {
        ...formData,
        date: new Date(formData.date),
      };

      await axios.patch(`/api/appointments/${id}`, updatedData);
      router.push("/appointment");
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-gray-100 flex flex-row">
        <Sidebar sidebarItems={sidebarItems} />

        <div className="max-w-lg mx-auto mt-10">
          <h1 className="text-2xl font-bold mb-5">Edit Appointment</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="mb-4">
              <label htmlFor="patientDetails" className="block text-sm font-medium">
                Patient Details
              </label>
              {patientDetails ? (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {patientDetails.firstName} {patientDetails.lastName}</p>
                  <p><strong>Email:</strong> {patientDetails.email}</p>
                  <p><strong>Phone:</strong> {patientDetails.phone}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="doctorId" className="block text-sm font-medium">
                Select Doctor
              </label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border rounded-md"
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.fullName} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="time" className="block text-sm font-medium">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md"
            >
              Update Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAppointmentForm;
