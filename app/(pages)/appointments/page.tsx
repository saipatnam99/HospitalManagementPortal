"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/sidebar/page";
import Navbar from "@/components/navbar/page";
import DataTable from "@/components/dataTable/page";
import Swal from "sweetalert2";
//import Loader from "@/components/loader/page";

interface SidebarItem {
  href: string;
  label: string;
  active?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/appointments", label: "Appointments", active: true },
  { href: "/doctors", label: "Doctors" },
  { href: "/patients", label: "Patients" },
  { href: "/services", label: "Services" },
  { href: "/billing", label: "Billing" },
  { href: "/insurance", label: "Insurance" },
  { href: "/policies", label: "Policies" },
  { href: "/faq", label: "FAQ" },
  { href: "/notifications", label: "Notifications" },
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
  appliedBefore: boolean;
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/appointments");
        setAppointments(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const columns = [
    { header: () => "First Name", accessorKey: "firstName" },
    { header: () => "Last Name", accessorKey: "lastName" },
    { header: () => "Gender", accessorKey: "gender" },
    { header: () => "Phone", accessorKey: "phone" },
    { header: () => "Address", accessorKey: "address" },
    { header: () => "City", accessorKey: "city" },
    { header: () => "State", accessorKey: "state" },
    { header: () => "Email", accessorKey: "email" },
    { header: () => "Department", accessorKey: "department" },
    { header: () => "Procedure", accessorKey: "procedure" },
    { header: () => "Preferred Date", accessorKey: "preferredDate" },
    { header: () => "Preferred Time", accessorKey: "preferredTime" },
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

  const handleEdit = (appointmentId: string) => {
    const appointmentToEdit = appointments.find((appointment) => appointment.id === appointmentId);
    setSelectedAppointment(appointmentToEdit || null);
    setShowEditModal(true);
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
            prevAppointments.filter((appointment) => appointment.id !== appointmentId)
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
      appliedBefore: false,
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
      console.log(newAppointment)
      try {
        const response = await axios.post("/api/appointments", newAppointment);
        const newModifiedAppointment = response.data.appointment;
        console.log(newModifiedAppointment)
        setAppointments((prevAppointments) => [...prevAppointments, newModifiedAppointment]);

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
          appliedBefore: false,
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
                <input
                  id="gender"
                  name="gender"
                  type="text"
                  value={newAppointment.gender}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
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
                Applied Before
              </label>
              <input
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
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="department"
              >
                Department
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
                Procedure
              </label>
              <input
                id="procedure"
                name="procedure"
                type="text"
                value={newAppointment.procedure}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              />
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
                onClick={() => setShowAddModal(false)}
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
        appliedBefore: false,
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
      try {
        const response = await axios.put(
          `/api/appointments/${updatedAppointment.id}`,
          updatedAppointment
        );
        const updatedAppointmentData = response.data.appointment;

        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === updatedAppointmentData.id ? updatedAppointmentData : appointment
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
                <input
                  id="gender"
                  name="gender"
                  type="text"
                  value={updatedAppointment.gender}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
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
                Applied Before
              </label>
              <input
                id="appliedBefore"
                name="appliedBefore"
                type="checkbox"
                checked={updatedAppointment.appliedBefore}
                onChange={(e) =>
                  setUpdatedAppointment((prev) => ({
                    ...prev,
                    appliedBefore: e.target.checked,
                  }))
                }
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="department"
              >
                Department
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
                Procedure
              </label>
              <input
                id="procedure"
                name="procedure"
                type="text"
                value={updatedAppointment.procedure}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              />
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
                  type="dateTime"
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
    <div className="flex">
    <Sidebar sidebarItems={sidebarItems} />
    <div className="flex-1 flex flex-col">
      <Navbar />
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-semibold">Doctors</h1>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={() => setShowAddModal(true)}
          >
            Add Doctor
          </button>
        </div>

        <DataTable data={appointments} columns={columns} isLoading={undefined} />
      </div>
    </div>
    {showAddModal && <AddAppointmentForm />}
    {showEditModal && <EditAppointmentForm appointment={selectedAppointment} />}
  </div>
  );
};


