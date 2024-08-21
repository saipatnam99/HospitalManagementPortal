"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/navbar/page";
import Sidebar from "@/components/sidebar/page";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";  // Import the CSS for the phone input
import Breadcrumbs from "@/components/breadCrumbs/page";

const sidebarItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: "/doctors", label: "Doctors" },
  { href: "/patients", label: "Patients", active: true },
  { href: "/appointment", label: "Appointments" },
  { href: "/services", label: "Services" },
  { href: "/billing", label: " Billing" },
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
  const [showQRCode, setShowQRCode] = useState(false); // To 
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone: value });
  };

  const breadcrumbItems = [
   
    { label: "Home", href: "/dashboard" },
    { label: "Patients", href: "/patients" },
    {label : " Add Patient", href: "/addPatient"}
  ];
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.paymentMethod === "UPI" && !paymentReceived) {
      alert("Please confirm the UPI payment before submitting.");
      return;
    }
    const formattedPhoneNumber = `+${formData.phone}`; // Assuming the phoneNumber field includes the country code
    const newModifiedData={
      ...formData,
      phone: formattedPhoneNumber,
      dateofBirth : new Date(formData.dateOfBirth),
      age: Number(formData.age),
      upiReceived: Boolean(formData.upiReceived)
    }
    console.log(newModifiedData)
    try {
      console.log(formData)
      const response = await axios.post("/api/patients", newModifiedData);
      console.log(response.data);
     // const newModifiedData = response.data.patient;
      //setFormData((prevData) => [...prevData, newModifiedData]);

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

      router.push("/patients")
      // setShowAddModal(false);
      // setIsLoading(false);
    } catch (error) {
      console.error("Error adding doctor:", error);
      // setIsLoading(false);
    }

    // try {
    //   const response = await axios.post('/api/patients', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData),
    //   });

    //   // if (response.ok) {
    //   //   router.push('/');
    //   // } else {
    //   //   console.error('Failed to register patient');
    //   // }
    // } catch (error) {
    //   console.error('An error occurred', error);
    // }
  };

  // const handleUPIPayment = () => {
  //   setTimeout(() => {
  //     setPaymentReceived(true);
  //     setFormData({ ...formData, upiReceived: true });
  //     alert("UPI Payment received!");
  //   }, 2000);
  // };
  const handleUPIPayment = () => {
    setShowQRCode(true); // Show the QR code when the button is clicked
  };

  const handlePaymentReceived = () => {
    setTimeout(() => {
      setFormData({ ...formData, upiReceived: true });
      alert('UPI Payment received!');
      setShowQRCode(false); // Hide the QR code after payment is received
    }, 2000); // Simulate a delay in payment processing
  };

  return (
    <div className="min-h-screen flex flex-col">
    <Navbar />
    <Breadcrumbs items={breadcrumbItems} separator=">>"/>
    <div className="bg-gray-100 flex flex-row">
      <Sidebar sidebarItems={sidebarItems} />
    
        
   

    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Patient Registration</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-2 flex-row">
        <div>
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
        </div> */}

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

        {/* <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium">
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
        </div> */}
             {/* Payment Method Section */}
             <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium">Payment Method</label>
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

        {/* Conditional Fields Based on Payment Method */}
        {formData.paymentMethod === 'Cash' && (
          <div>
            <label htmlFor="cashAmount" className="block text-sm font-medium">Enter Cash Amount</label>
            <input
              type="text"
              name="cashAmount"
              value={formData.cashAmount}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
        )}

        {formData.paymentMethod === 'Card' && (
          <>
            <div>
              <label htmlFor="cardType" className="block text-sm font-medium">Select Card Type</label>
              <select
                name="cardType"
                value={formData.cardType}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border rounded-md"
              >
                <option value="Debit">Debit Card</option>
                <option value="Credit">Credit Card</option>
              </select>
            </div>
            <div>
              <label htmlFor="cardDetails" className="block text-sm font-medium">Enter Card Details</label>
              <input
                type="text"
                name="cardDetails"
                value={formData.cardDetails}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
          </>
        )}

        {formData.paymentMethod === 'UPI' && (
          <div>
            <label htmlFor="upiAmount" className="block text-sm font-medium">Amount to Pay</label>
            <input
              type="text"
              name="upiAmount"
              value={formData.cashAmount} // Display the amount set in Cash
             
              className="mt-1 p-2 w-full border rounded-md"
            />
            <button
              type="button"
              onClick={handleUPIPayment}
              className="w-full bg-green-500 text-white p-2 rounded-md mt-2"
            >
              Scan QR Code and Confirm Payment
            </button>
            {showQRCode && (
              <div className="mt-4">
                <img
                  src="/path-to-your-qr-code-image.png" // Replace with the actual path to your QR code image
                  alt="QR Code"
                  className="mx-auto"
                />
                <button
                  type="button"
                  onClick={handlePaymentReceived}
                  className="w-full bg-blue-500 text-white p-2 rounded-md mt-2"
                >
                  Confirm Payment Received
                </button>
              </div>
            )}
            {formData.upiReceived && (
              <p className="text-green-600 font-semibold mt-2">Payment received via UPI!</p>
            )}
          </div>
        )}

        {/* Conditional Fields Based on Payment Method */}
        {/* {formData.paymentMethod === "Cash" && (
          <div>
            <label htmlFor="cashAmount" className="block text-sm font-medium">
              Enter Cash Amount
            </label>
            <input
              type="text"
              name="cashAmount"
              value={formData.cashAmount}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
        )} */}

        {/* {formData.paymentMethod === "Card" && (
          <>
            <div>
              <label htmlFor="cardType" className="block text-sm font-medium">
                Select Card Type
              </label>
              <select
                name="cardType"
                value={formData.cardType}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border rounded-md"
              >
                <option value="Debit">Debit Card</option>
                <option value="Credit">Credit Card</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="cardDetails"
                className="block text-sm font-medium"
              >
                Enter Card Details
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
          </>
        )} */}

        {/* {formData.paymentMethod === "UPI" && (
          <div>
            <button
              type="button"
              onClick={handleUPIPayment}
              className="w-full bg-green-500 text-white p-2 rounded-md"
            >
              Scan QR Code and Confirm Payment
            </button>
            {paymentReceived && (
              <p className="text-green-600 font-semibold mt-2">
                Payment received via UPI!
              </p>
            )}
          </div>
        )} */}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md"
        >
          Register
        </button>
      </form>
    </div>
    </div>
    </div>
  );
}
