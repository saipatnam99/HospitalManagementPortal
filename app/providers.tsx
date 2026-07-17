// app/providers.tsx
// 'use client';

// import { SessionProvider } from 'next-auth/react';
// import { ReactNode } from 'react';

// type ProvidersProps = {
//   children: ReactNode;
// };

// export default function Providers({ children }: ProvidersProps) {
//   return <SessionProvider>{children}</SessionProvider>;
// }

"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
// @ts-ignore
import "react-toastify/dist/ReactToastify.min.css";

type ProvidersProps = { children: ReactNode };

type PatientStatus = {
  id: number;
  name: string;
  status: string;
  location: string;
  pulse: string;
  color: string;
};

type BillingItem = {
  id: number;
  patient: string;
  treatment: string;
  amount: number;
  status: string;
  paymentMethod?: string;
  insuranceCompany?: string;
  medicine?: string;
  invoiceNumber?: string;
};

type InsuranceCompany = {
  id: number;
  name: string;
  coverage: string;
  discount: number;
};

type MedicineItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
};

type HospitalEvent = {
  id: string;
  type: "appointment" | "billing" | "status" | "reminder";
  message: string;
  timestamp: string;
};

type HospitalContextValue = {
  events: HospitalEvent[];
  addEvent: (event: HospitalEvent) => void;
  refreshSignal: number;
  bumpRefresh: () => void;
  patientStatuses: PatientStatus[];
  setPatientStatuses: React.Dispatch<React.SetStateAction<PatientStatus[]>>;
  billingItems: BillingItem[];
  addBillingItem: (item: BillingItem) => void;
  updateBillingStatus: (id: number, paymentMethod?: string) => void;
  insuranceCompanies: InsuranceCompany[];
  addInsuranceCompany: (company: InsuranceCompany) => void;
  medicines: MedicineItem[];
  addMedicine: (medicine: MedicineItem) => void;
};

const HospitalContext = createContext<HospitalContextValue | undefined>(undefined);

export function useHospitalContext() {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error("useHospitalContext must be used inside Providers");
  }
  return context;
}

export default function Providers({ children }: ProvidersProps) {
  const [events, setEvents] = useState<HospitalEvent[]>([]);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [patientStatuses, setPatientStatuses] = useState<PatientStatus[]>([
    { id: 1, name: "Ava Patel", status: "Critical", location: "ER-12", pulse: "118 bpm", color: "bg-rose-500" },
    { id: 2, name: "Rohan Sethi", status: "Stable", location: "Ward-A", pulse: "78 bpm", color: "bg-emerald-500" },
    { id: 3, name: "Meera Rao", status: "Monitoring", location: "ICU-02", pulse: "92 bpm", color: "bg-amber-500" },
  ]);
  const [billingItems, setBillingItems] = useState<BillingItem[]>([
    { id: 1, patient: "Ava Patel", treatment: "Cardiology consult", amount: 2400, status: "Paid", paymentMethod: "Card", invoiceNumber: "INV-1001" },
    { id: 2, patient: "Rohan Sethi", treatment: "Lab package", amount: 980, status: "Pending", paymentMethod: "Cash", invoiceNumber: "INV-1002" },
    { id: 3, patient: "Meera Rao", treatment: "Pharmacy refill", amount: 540, status: "Approved", paymentMethod: "Insurance", invoiceNumber: "INV-1003" },
  ]);
  const [insuranceCompanies, setInsuranceCompanies] = useState<InsuranceCompany[]>([
    { id: 1, name: "BlueCross", coverage: "General care", discount: 10 },
    { id: 2, name: "Aetna", coverage: "Specialist care", discount: 8 },
    { id: 3, name: "MediCare Plus", coverage: "Critical care", discount: 5 },
  ]);
  const [medicines, setMedicines] = useState<MedicineItem[]>([
    { id: 1, name: "Paracetamol", category: "Pain relief", price: 120, stock: 200 },
    { id: 2, name: "Amoxicillin", category: "Antibiotic", price: 260, stock: 125 },
    { id: 3, name: "Insulin", category: "Endocrine", price: 480, stock: 64 },
  ]);

  const addEvent = useCallback((event: HospitalEvent) => {
    setEvents((prev) => [event, ...prev].slice(0, 12));
  }, []);

  const bumpRefresh = useCallback(() => {
    setRefreshSignal((prev) => prev + 1);
  }, []);

  const addBillingItem = useCallback((item: BillingItem) => {
    setBillingItems((prev) => [item, ...prev].slice(0, 8));
    addEvent({
      id: `billing-${Date.now()}`,
      type: "billing",
      message: `New invoice generated for ${item.patient}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
    bumpRefresh();
  }, [addEvent, bumpRefresh]);

  const updateBillingStatus = useCallback((id: number, paymentMethod = "Cash") => {
    setBillingItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: "Paid", paymentMethod } : item)));
    addEvent({
      id: `billing-${Date.now()}`,
      type: "billing",
      message: `Invoice updated for patient ${id}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
    bumpRefresh();
  }, [addEvent, bumpRefresh]);

  const addInsuranceCompany = useCallback((company: InsuranceCompany) => {
    setInsuranceCompanies((prev) => [company, ...prev]);
    addEvent({
      id: `insurance-${Date.now()}`,
      type: "billing",
      message: `${company.name} added to provider list`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  }, [addEvent]);

  const addMedicine = useCallback((medicine: MedicineItem) => {
    setMedicines((prev) => [medicine, ...prev]);
    addEvent({
      id: `medicine-${Date.now()}`,
      type: "billing",
      message: `${medicine.name} added to inventory`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  }, [addEvent]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPatientStatuses((prev) => prev.map((item, index) => (index === 0 ? { ...item, status: item.status === "Critical" ? "Monitoring" : item.status } : item)));
      const liveEvent: HospitalEvent = {
        id: `live-${Date.now()}`,
        type: "status",
        message: "Patient monitor refreshed automatically",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setEvents((prev) => [liveEvent, ...prev].slice(0, 12));
      bumpRefresh();
    }, 20000);

    return () => window.clearInterval(timer);
  }, []);

  const value = useMemo(() => ({ events, addEvent, refreshSignal, bumpRefresh, patientStatuses, setPatientStatuses, billingItems, addBillingItem, updateBillingStatus, insuranceCompanies, addInsuranceCompany, medicines, addMedicine }), [events, refreshSignal, patientStatuses, billingItems, addBillingItem, updateBillingStatus, insuranceCompanies, addInsuranceCompany, medicines, addMedicine]);

  return (
    <SessionProvider>
      <HospitalContext.Provider value={value}>
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </HospitalContext.Provider>
    </SessionProvider>
  );
}

