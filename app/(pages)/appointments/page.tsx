"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/sidebar/page";
import Navbar from "@/components/navbar/page";
import DataTable from "@/components/dataTable/page";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { useHospitalContext } from "@/app/providers";
//import Loader from "@/components/loader/page";

interface SidebarItem {
  href: string;
  label: string;
  active?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/doctors", label: "Doctors"},
  { href: "/patients", label: "Patients" },
  { href: "/appointment", label: "Appointments", active: true  },
  // { href: "/services", label: "Services" },
  { href: "/billing", label: " Billing" },
  // { href: "/insurance", label: "Insurance" },
  // { href: "/policies", label: "Policies" },
  // { href: "/faq", label: "FAQ" },
  // { href: "/notifications", label: "Notifications" },
];

interface Appointment {
  id?: string;
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  email: string;
  appliedBefore: string;
  department: string;
  procedure: string;
  preferredDate: string;
  preferredTime: string;
}

interface EditAppointmentFormProps {
  appointment: Appointment | null;
}

export default function Appointments() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { addEvent, refreshSignal, bumpRefresh } = useHospitalContext();

  const normalizeAppointments = (items: any[]) =>
    items.map((appointment) => ({
      id: appointment.id,
      patientName: `${appointment.patient?.firstName ?? ""} ${appointment.patient?.lastName ?? ""}`.trim() || "Unknown patient",
      doctorName: appointment.doctor?.fullName || "Unassigned",
      department: appointment.doctor?.specialization || "General",
      phone: appointment.patient?.phone || "",
      preferredDate: appointment.date
        ? new Date(appointment.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Pending",
      preferredTime: appointment.time || "TBD",
      status: appointment.time ? "Scheduled" : "Pending",
      raw: appointment,
    }));

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/appointments");
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [refreshSignal]);

  const filteredAppointments = normalizeAppointments(appointments).filter((appointment) => {
    const haystack = `${appointment.patientName} ${appointment.doctorName} ${appointment.department}`.toLowerCase();
    return haystack.includes(searchTerm.toLowerCase());
  });

  const columns = [
    { header: () => "Patient", accessorKey: "patientName" },
    { header: () => "Doctor", accessorKey: "doctorName" },
    { header: () => "Department", accessorKey: "department" },
    { header: () => "Date", accessorKey: "preferredDate" },
    { header: () => "Time", accessorKey: "preferredTime" },
    {
      header: () => "Status",
      accessorKey: "status",
      cell: ({ row }: { row: any }) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
            row.status === "Scheduled"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: () => "Actions",
      accessorKey: "actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-white"
            onClick={() => handleEdit(row.id)}
          >
            Edit
          </button>
          <button
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
            onClick={() => handleSendReminder(row)}
          >
            Reminder
          </button>
          <button
            className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (appointmentId: string) => {
    const appointmentToEdit = appointments.find((appointment) => appointment.id === appointmentId);
    if (appointmentToEdit) {
      const patient = appointmentToEdit.patient || {};
      const doctor = appointmentToEdit.doctor || {};
      const mappedAppointment: Appointment = {
        id: appointmentToEdit.id,
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        gender: "",
        phone: patient.phone || "",
        address: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        email: patient.email || "",
        appliedBefore: "no",
        department: doctor.specialization || "",
        procedure: "",
        preferredDate: appointmentToEdit.date ? format(new Date(appointmentToEdit.date), "yyyy-MM-dd'T'HH:mm") : "",
        preferredTime: appointmentToEdit.time || "",
      };
      setSelectedAppointment(mappedAppointment);
      setShowEditModal(true);
    }
  };

  const handleSendReminder = async (appointment: any) => {
    try {
      const response = await fetch("/api/sendSms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumbers: appointment.phone ? [appointment.phone] : [],
          message: `Hello ${appointment.patientName}, this is a reminder for your upcoming appointment at ${appointment.preferredTime || "the scheduled time"}. Please arrive 15 minutes early.`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to send reminder");
      }

      addEvent({ id: `appointment-${Date.now()}`, type: "reminder", message: `Reminder queued for ${appointment.patientName}`, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
      bumpRefresh();
      Swal.fire({ title: "Reminder sent", text: data.message || "The reminder was queued successfully.", icon: "success" });
    } catch (error) {
      Swal.fire({ title: "Reminder failed", text: error instanceof Error ? error.message : "Please try again later.", icon: "error" });
    }
  };

  const handleDelete = async (appointmentId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this appointment!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          await axios.delete(`/api/appointments/${appointmentId}`);
          Swal.fire("Deleted!", "The appointment has been deleted.", "success");
          setAppointments((prevAppointments) =>
            prevAppointments.filter(
              (appointment) => appointment.id !== appointmentId
            )
          );
          setIsLoading(false);
        } catch (error) {
          console.error("Error deleting appointment:", error);
          setIsLoading(false);
        }
      }
    });
  };

  const AddAppointmentForm = () => {
    const [newAppointment, setNewAppointment] = useState<Appointment>({
      firstName: "",
      lastName: "",
      gender: "",
      phone: "",
      address: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      email: "",
      appliedBefore: "",
      department: "",
      procedure: "",
      preferredDate: "",
      preferredTime: "",
    });

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setNewAppointment((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      setIsLoading(true);
      console.log(newAppointment);
      try {
        const response = await axios.post("/api/appointments", newAppointment);
        const newModifiedAppointment = response.data.appointment;
        console.log(newModifiedAppointment);
        setAppointments((prevAppointments) => [
          ...prevAppointments,
          newModifiedAppointment,
        ]);

        setNewAppointment({
          firstName: "",
          lastName: "",
          gender: "",
          phone: "",
          address: "",
          addressLine2: "",
          city: "",
          state: "",
          postalCode: "",
          email: "",
          appliedBefore: "",
          department: "",
          procedure: "",
          preferredDate: "",
          preferredTime: "",
        });
        setShowAddModal(false);
        setIsLoading(false);
      } catch (error) {
        console.error("Error adding appointment:", error);
        setIsLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl min-h-[500px]">
          <h2 className="text-xl mb-6">Add New Appointment</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="firstName"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={newAppointment.firstName}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={newAppointment.lastName}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
            </div>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="gender"
                >
                  Gender
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 "
                  id="gender"
                  name="gender"
                  value={newAppointment.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {/* <input
                  id="gender"
                  name="gender"
                  type="text"
                  value={newAppointment.gender}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                /> */}
              </div>
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
                  value={newAppointment.phone}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
            </div>
            <div className="mb-4 flex space-x-4">
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
                  value={newAppointment.address}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="addressLine2"
                >
                  Address Line 2
                </label>
                <input
                  id="addressLine2"
                  name="addressLine2"
                  type="text"
                  value={newAppointment.addressLine2}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
            </div>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="city"
                >
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={newAppointment.city}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="state"
                >
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={newAppointment.state}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="postalCode"
                >
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={newAppointment.postalCode}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
            </div>
            <div className="mb-4">
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
                value={newAppointment.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Have you ever applied to our facility before?
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="appliedBefore"
                  value="yes"
                  checked={newAppointment.appliedBefore === "yes"}
                  onChange={handleChange}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="appliedBefore"
                  value="no"
                  checked={newAppointment.appliedBefore === "no"}
                  onChange={handleChange}
                />
                <span className="ml-2">No</span>
              </label>
              {/* <input
                id="appliedBefore"
                name="appliedBefore"
                type="checkbox"
                checked={newAppointment.appliedBefore}
                onChange={(e) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    appliedBefore: e.target.checked,
                  }))
                }
              /> */}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="department"
              >
                Which department would you like to get an appointment from?
              </label>
              <input
                id="department"
                name="department"
                type="text"
                value={newAppointment.department}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="procedure"
              >
                Which procedure do you want to make an appointment for?
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 "
                id="procedure"
                name="procedure"
                value={newAppointment.procedure}
                onChange={handleChange}
              >
                <option value="">Select Procedure</option>
                <option value="medicalExamination">Medical Examination</option>
                <option value="checkup">Check-up</option>
                <option value="doctorCheck">Doctor Check</option>
                <option value="resultAnalysis">Result Analysis</option>
              </select>
              {/* <input
                id="procedure"
                name="procedure"
                type="text"
                value={newAppointment.procedure}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              /> */}
            </div>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="preferredDate"
                >
                  Preferred Date
                </label>
                <input
                  id="preferredDate"
                  name="preferredDate"
                  type="dateTime-local"
                  value={newAppointment.preferredDate}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="preferredTime"
                >
                  Preferred Time
                </label>
                <input
                  id="preferredTime"
                  name="preferredTime"
                  type="time"
                  value={newAppointment.preferredTime}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                // onClick={() => setShowAddModal(false)}
                className="mr-4 px-6 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded"
              >
                Add Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EditAppointmentForm = ({ appointment }: EditAppointmentFormProps) => {
    const [updatedAppointment, setUpdatedAppointment] = useState<Appointment>(
      appointment || {
        firstName: "",
        lastName: "",
        gender: "",
        phone: "",
        address: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        email: "",
        appliedBefore: "",
        department: "",
        procedure: "",
        preferredDate: "",
        preferredTime: "",
      }
    );

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setUpdatedAppointment((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!updatedAppointment.id) return;

      setIsLoading(true);
    const  newUpdatedAppointment ={
              ...updatedAppointment,
              preferredDate: new Date(updatedAppointment.preferredDate),
              appliedBefore: Boolean(updatedAppointment.appliedBefore)
      }
      try {
        const response = await axios.patch(
          `/api/appointments/${updatedAppointment.id}`,
          newUpdatedAppointment
        );
        console.log(response.data)
        const updatedAppointmentData = response.data.updatedAppointment;

        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === updatedAppointment.id
              ? updatedAppointmentData
              : appointment
          )
        );

        setShowEditModal(false);
        setIsLoading(false);
      } catch (error) {
        console.error("Error updating appointment:", error);
        setIsLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl min-h-[500px]">
          <h2 className="text-xl mb-6">Edit Appointment</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="firstName"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={updatedAppointment.firstName}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={updatedAppointment.lastName}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
            </div>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="gender"
                >
                  Gender
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 "
                  id="gender"
                  name="gender"
                  value={updatedAppointment.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {/* <input
                  id="gender"
                  name="gender"
                  type="text"
                  value={updatedAppointment.gender}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                /> */}
              </div>
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
                  value={updatedAppointment.phone}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
            </div>
            <div className="mb-4 flex space-x-4">
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
                  value={updatedAppointment.address}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="addressLine2"
                >
                  Address Line 2
                </label>
                <input
                  id="addressLine2"
                  name="addressLine2"
                  type="text"
                  value={updatedAppointment.addressLine2}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
            </div>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="city"
                >
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={updatedAppointment.city}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="state"
                >
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={updatedAppointment.state}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="postalCode"
                >
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={updatedAppointment.postalCode}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
            </div>
            <div className="mb-4">
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
                value={updatedAppointment.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Have you ever applied to our facility before?
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="appliedBefore"
                  value="yes"
                  checked={updatedAppointment.appliedBefore === "yes"}
                  onChange={handleChange}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="appliedBefore"
                  value="no"
                  checked={updatedAppointment.appliedBefore === "no"}
                  onChange={handleChange}
                />
                <span className="ml-2">No</span>
              </label>
              {/* <input
                id="appliedBefore"
                name="appliedBefore"
                type="checkbox"
                checked={newAppointment.appliedBefore}
                onChange={(e) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    appliedBefore: e.target.checked,
                  }))
                }
              /> */}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="department"
              >
                Which department would you like to get an appointment from?
              </label>
              <input
                id="department"
                name="department"
                type="text"
                value={updatedAppointment.department}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="procedure"
              >
                Which procedure would you like to get an appointment from?
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 "
                id="procedure"
                name="procedure"
                value={updatedAppointment.procedure}
                onChange={handleChange}
              >
                <option value="">Select Procedure</option>
                <option value="medicalCheckup">Medical Examination</option>
                <option value="checkUp">Check-up</option>
                <option value="doctorCheckup">Doctor Check</option>
                <option value="resultAnalysis">Result Analysis</option>
              </select>
              {/* <input
                id="procedure"
                name="procedure"
                type="text"
                value={updatedAppointment.procedure}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              /> */}
            </div>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="preferredDate"
                >
                  Preferred Date
                </label>
                <input
                  id="preferredDate"
                  name="preferredDate"
                  type="dateTime-local"
                  value={updatedAppointment.preferredDate}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="preferredTime"
                >
                  Preferred Time
                </label>
                <input
                  id="preferredTime"
                  name="preferredTime"
                  type="time"
                  value={updatedAppointment.preferredTime}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="mr-4 px-6 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded"
              >
                Update Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    // <div className="p-4">
    //   <div className="flex justify-between items-center mb-4">
    //     <h1 className="text-xl">Appointments</h1>
    //     <button
    //       className="bg-blue-500 text-white px-4 py-2 rounded"
    //       onClick={() => setShowAddModal(true)}
    //     >
    //       Add Appointment
    //     </button>
    //   </div>
    //   {/* <div className="overflow-x-auto">
    //     <table className="min-w-full bg-white border border-gray-200">
    //       <thead>
    //         <tr>
    //           <th className="border border-gray-200 px-4 py-2">ID</th>
    //           <th className="border border-gray-200 px-4 py-2">Name</th>
    //           <th className="border border-gray-200 px-4 py-2">Gender</th>
    //           <th className="border border-gray-200 px-4 py-2">Phone</th>
    //           <th className="border border-gray-200 px-4 py-2">Email</th>
    //           <th className="border border-gray-200 px-4 py-2">Department</th>
    //           <th className="border border-gray-200 px-4 py-2">Procedure</th>
    //           <th className="border border-gray-200 px-4 py-2">Preferred Date</th>
    //           <th className="border border-gray-200 px-4 py-2">Preferred Time</th>
    //           <th className="border border-gray-200 px-4 py-2">Actions</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {appointments.map((appointment) => (
    //           <tr key={appointment.id}>
    //             <td className="border border-gray-200 px-4 py-2">{appointment.id}</td>
    //             <td className="border border-gray-200 px-4 py-2">{`${appointment.firstName} ${appointment.lastName}`}</td>
    //             <td className="border border-gray-200 px-4 py-2">{appointment.gender}</td>
    //             <td className="border border-gray-200 px-4 py-2">{appointment.phone}</td>
    //             <td className="border border-gray-200 px-4 py-2">{appointment.email}</td>
    //             <td className="border border-gray-200 px-4 py-2">{appointment.department}</td>
    //             <td className="border border-gray-200 px-4 py-2">{appointment.procedure}</td>
    //             <td className="border border-gray-200 px-4 py-2">{appointment.preferredDate}</td>
    //             <td className="border border-gray-200 px-4 py-2">{appointment.preferredTime}</td>
    //             <td className="border border-gray-200 px-4 py-2 space-x-2">
    //               <button
    //                 className="bg-green-500 text-white px-4 py-2 rounded"
    //                 onClick={() => handleEdit(appointment)}
    //               >
    //                 Edit
    //               </button>
    //               <button
    //                 className="bg-red-500 text-white px-4 py-2 rounded"
    //                 onClick={() => handleDelete(appointment.id)}
    //               >
    //                 Delete
    //               </button>
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div> */}
    //   {showAddModal && <AddAppointmentForm />}
    //   {/* {showEditModal && currentAppointment && (
    //     <EditAppointmentForm appointment={currentAppointment} />
    //   )} */}
    // </div>
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar sidebarItems={sidebarItems} />

        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-800 p-6 text-white shadow-lg">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
                  Appointment management
                </p>
                <h1 className="mt-2 text-2xl font-semibold">Schedule and track visits</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-300">
                  Keep consultations organized with a clear, searchable care schedule.
                </p>
              </div>
              <button
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                onClick={() => setShowAddModal(true)}
              >
                Add appointment
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="card-surface p-4">
              <p className="text-sm text-slate-500">Scheduled visits</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{appointments.length}</p>
            </div>
            <div className="card-surface p-4">
              <p className="text-sm text-slate-500">Search care records</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">Fast lookup</p>
            </div>
            <div className="card-surface p-4">
              <p className="text-sm text-slate-500">Hospital readiness</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">Always on</p>
            </div>
          </div>

          <div className="mt-6 card-surface p-4">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Appointment list</h2>
                <p className="text-sm text-slate-500">Search by patient, doctor, or department.</p>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search appointments"
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none ring-0 md:w-72"
              />
            </div>

            <DataTable data={filteredAppointments} columns={columns} isLoading={isLoading} />
          </div>
        </div>
      </div>
      {showAddModal && <AddAppointmentForm />}
      {showEditModal && <EditAppointmentForm appointment={selectedAppointment} />}
    </div>
  );
}
