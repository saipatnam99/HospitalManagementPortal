"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/navbar/page";
import Sidebar from "@/components/sidebar/page";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/doctors", label: "Doctors" },
  { href: "/patients", label: "Patients", active: true },
  { href: "/appointment", label: "Appointments" },
  { href: "/services", label: "Services" },
  { href: "/billing", label: "Billing" },
  { href: "/insurance", label: "Insurance" },
  { href: "/policies", label: "Policies" },
  { href: "/faq", label: "FAQ" },
  { href: "/notifications", label: "Notifications" },
];

export default function AddPatientForm() {
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
    paymentMethod: "Cash",
    cashAmount: "",
    cardType: "",
    cardDetails: "",
    upiReceived: false,
  });

  const [paymentReceived, setPaymentReceived] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility
  const router = useRouter();

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

    if (formData.paymentMethod === "UPI" && !paymentReceived) {
      alert("Please confirm the UPI payment before submitting.");
      return;
    }
    const formattedPhoneNumber = `+${formData.phone}`;
    const newModifiedData = {
      ...formData,
      phone: formattedPhoneNumber,
      dateofBirth: new Date(formData.dateOfBirth),
      age: Number(formData.age),
      upiReceived: Boolean(formData.upiReceived),
    };

    try {
      const response = await axios.post("/api/patients", newModifiedData);
      console.log(response.data);

      setFormData({
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
        paymentMethod: "Cash",
        cashAmount: "",
        cardType: "",
        cardDetails: "",
        upiReceived: false,
      });

      router.push("/patients");
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  const handleUPIPayment = () => {
    setShowQRCode(true);
  };

  const handlePaymentReceived = () => {
    setTimeout(() => {
      setFormData({ ...formData, upiReceived: true });
      alert("UPI Payment received!");
      setShowQRCode(false);
    }, 2000);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-row bg-gray-100">
        {/* Sidebar toggle button for mobile view */}
        <button
          className="md:hidden p-1 text-white bg-blue-600"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? "CloseMenu" : "Menu"}
        </button>

        {/* Sidebar component */}
        <div className={`${isSidebarOpen ? "block" : "hidden"} md:block`}>
          <Sidebar sidebarItems={sidebarItems} />
        </div>

        <div className="flex-1 p-4 overflow-x-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Patient Registration</h1>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium"
                  >
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
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium"
                  >
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium"
                  >
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
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <PhoneInput
                      country={"in"}
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      inputClass="p-2 border rounded-md w-full"
                      containerClass="w-full"
                      inputProps={{
                        name: "phone",
                        required: true,
                      }}
                    />
                  </div>
                </div>
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
                  className="mt-1 p-2 w-1/2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium"
                  >
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
                  <label
                    htmlFor="addressLine2"
                    className="block text-sm font-medium"
                  >
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
              </div>

              <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
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
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium"
                  >
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
              </div>
              <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
                <div>
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium"
                  >
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 w-full border rounded-md"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>
                {formData.paymentMethod === "Cash" && (
                  <div>
                    <label
                      htmlFor="cashAmount"
                      className="block text-sm font-medium"
                    >
                      Cash Amount
                    </label>
                    <input
                      type="number"
                      name="cashAmount"
                      value={formData.cashAmount}
                      onChange={handleChange}
                      required
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>
                )}
                {formData.paymentMethod === "Card" && (
                  <div>
                    <label
                      htmlFor="cardType"
                      className="block text-sm font-medium"
                    >
                      Card Type
                    </label>
                    <select
                      name="cardType"
                      value={formData.cardType}
                      onChange={handleChange}
                      required
                      className="mt-1 p-2 w-full border rounded-md"
                    >
                      <option value="Credit">Credit</option>
                      <option value="Debit">Debit</option>
                    </select>
                    <label
                      htmlFor="cardDetails"
                      className="block text-sm font-medium mt-3"
                    >
                      Card Details
                    </label>
                    <input
                      type="text"
                      name="cardDetails"
                      value={formData.cardDetails}
                      onChange={handleChange}
                      required
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>
                )}
                {formData.paymentMethod === "UPI" && (
                  <div>
                    <label htmlFor="upi" className="block text-sm font-medium">
                      UPI Payment
                    </label>
                    {showQRCode ? (
                      <div>
                        <p>Scan the QR code to pay.</p>
                        <button
                          type="button"
                          onClick={handlePaymentReceived}
                          className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md"
                        >
                          I have paid
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleUPIPayment}
                        className="mt-1 px-4 py-2 bg-blue-500 text-white rounded-md"
                      >
                        Show UPI QR Code
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
