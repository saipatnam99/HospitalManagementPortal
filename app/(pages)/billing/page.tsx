"use client";

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const paymentOptions = ['Cash', 'Card', 'UPI', 'Insurance'];

import Navbar from '@/components/navbar/page';
import Sidebar from '@/components/sidebar/page';
import { useHospitalContext } from '@/app/providers';

const sidebarItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/patients', label: 'Patients' },
  { href: '/appointment', label: 'Appointments' },
  { href: '/outpatient', label: 'Outpatient' },
  { href: '/labs', label: 'Labs' },
  { href: '/pharmacy', label: 'Pharmacy' },
  { href: '/billing', label: 'Billing', active: true },
  { href: '/insurance', label: 'Insurance' },
  { href: '/medicines', label: 'Medicines' },
  { href: '/beds', label: 'Beds' },
  { href: '/discharge', label: 'Discharge' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/admin', label: 'Admin' },
];

const treatmentOptions = [
  { label: 'General Consultation', price: 1200 },
  { label: 'Cardiology Checkup', price: 2400 },
  { label: 'MRI Scan', price: 6800 },
  { label: 'Orthopedic Procedure', price: 5400 },
  { label: 'Emergency Care', price: 3600 },
];

const medicineOptions = [
  { label: 'Paracetamol', price: 120 },
  { label: 'Amoxicillin', price: 260 },
  { label: 'Insulin', price: 480 },
  { label: 'Vitamin D', price: 180 },
  { label: 'Salbutamol', price: 220 },
];

const insuranceCompanies = ['BlueCross', 'Aetna', 'MediCare Plus', 'HealthShield'];

export default function Billing() {
  const { refreshSignal, billingItems, updateBillingStatus, addBillingItem } = useHospitalContext();
  const [patientName, setPatientName] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState(treatmentOptions[0].label);
  const [selectedMedicine, setSelectedMedicine] = useState(medicineOptions[0].label);
  const [insuranceCompany, setInsuranceCompany] = useState(insuranceCompanies[0]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0]);
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [patientRes, doctorRes] = await Promise.all([axios.get('/api/patients'), axios.get('/api/doctors')]);
        setPatients(patientRes.data);
        setDoctors(doctorRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const pendingBilling = billingItems.find((item) => item.status === 'Pending');
      if (pendingBilling) {
        updateBillingStatus(pendingBilling.id);
      }
    }, 15000);
    return () => window.clearInterval(timer);
  }, [billingItems, refreshSignal, updateBillingStatus]);

  const treatmentPrice = useMemo(() => treatmentOptions.find((option) => option.label === selectedTreatment)?.price || 0, [selectedTreatment]);
  const medicinePrice = useMemo(() => medicineOptions.find((option) => option.label === selectedMedicine)?.price || 0, [selectedMedicine]);
  const subtotal = treatmentPrice + medicinePrice;
  const insuranceDiscount = insuranceCompany === 'BlueCross' ? 0.1 : insuranceCompany === 'Aetna' ? 0.08 : insuranceCompany === 'MediCare Plus' ? 0.05 : 0;
  const discountedAmount = subtotal * (1 - Math.max(discountPercent, insuranceDiscount));
  const grandTotal = Math.round(discountedAmount);

  const handleGenerateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    addBillingItem({
      id: Date.now(),
      patient: patientName.trim(),
      treatment: `${selectedTreatment} + ${selectedMedicine}`,
      amount: grandTotal,
      status: 'Pending',
      paymentMethod,
      insuranceCompany,
      medicine: selectedMedicine,
      invoiceNumber: `INV-${Date.now().toString().slice(-4)}`,
    });

    setPatientName('');
    setSelectedTreatment(treatmentOptions[0].label);
    setSelectedMedicine(medicineOptions[0].label);
    setInsuranceCompany(insuranceCompanies[0]);
    setDiscountPercent(0);
    setPaymentMethod(paymentOptions[0]);
  };

  const handlePaymentUpdate = (id: number) => {
    updateBillingStatus(id, paymentMethod);
  };

  const handleExportInvoice = (item: typeof billingItems[number]) => {
    const content = `Invoice ${item.invoiceNumber}\nPatient: ${item.patient}\nTreatment: ${item.treatment}\nAmount: $${item.amount}\nPayment method: ${item.paymentMethod || 'Pending'}\nStatus: ${item.status}`;
    const printWindow = window.open('', '_blank', 'width=700,height=800');
    if (printWindow) {
      printWindow.document.write(`<pre>${content}</pre>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-row">
        <Sidebar sidebarItems={sidebarItems} />
        <div className="flex-1 p-6 md:p-8">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-800 p-6 text-white shadow-lg">
            <h1 className="text-2xl font-semibold">Billing and payment operations</h1>
            <p className="mt-2 text-sm text-slate-300">Create live invoices with treatment charges, medicines, and insurance support.</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { label: 'Pending invoices', value: billingItems.filter((item) => item.status === 'Pending').length.toString(), tone: 'bg-amber-50 text-amber-700' },
              { label: 'Paid today', value: `$${billingItems.filter((item) => item.status === 'Paid').reduce((sum, item) => sum + item.amount, 0)}`, tone: 'bg-emerald-50 text-emerald-700' },
              { label: 'Insurance claims', value: insuranceCompanies.length.toString(), tone: 'bg-sky-50 text-sky-700' },
            ].map((card) => (
              <div key={card.label} className={`rounded-2xl border border-slate-200 p-4 ${card.tone} dark:border-slate-800 dark:bg-slate-900`}>
                <p className="text-sm">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <form onSubmit={handleGenerateBill} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Generate invoice</h2>
                <p className="text-sm text-slate-500">Select treatment, medicine, and insurance to calculate the bill instantly.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Patient name
                  <select value={patientName} onChange={(e) => setPatientName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" required>
                    <option value="">Select patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={`${patient.firstName} ${patient.lastName}`}>{patient.firstName} {patient.lastName}</option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Insurance company
                  <select value={insuranceCompany} onChange={(e) => setInsuranceCompany(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
                    {insuranceCompanies.map((company) => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Assigned doctor
                  <select className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
                    <option value="">Select doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>{doctor.fullName} • {doctor.specialization}</option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Treatment
                  <select value={selectedTreatment} onChange={(e) => setSelectedTreatment(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
                    {treatmentOptions.map((option) => (
                      <option key={option.label} value={option.label}>{option.label}</option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Medicine
                  <select value={selectedMedicine} onChange={(e) => setSelectedMedicine(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
                    {medicineOptions.map((option) => (
                      <option key={option.label} value={option.label}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Additional discount %
                <input type="number" min="0" max="30" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
              </label>

              <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Payment method
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
                  {paymentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <button type="submit" className="mt-5 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">Generate bill</button>
            </form>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Live bill preview</h2>
              <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                <div className="flex items-center justify-between text-sm">
                  <span>Treatment</span>
                  <span>${treatmentPrice}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Medicine</span>
                  <span>${medicinePrice}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Insurance discount</span>
                  <span>-{Math.round(subtotal * insuranceDiscount)}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Extra discount</span>
                  <span>-{discountPercent}%</span>
                </div>
                <div className="border-t border-slate-200 pt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span>${grandTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Invoice tracker</h2>
              <span className="soft-pill">Live status</span>
            </div>
            {selectedInvoice ? (
              <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                <p className="font-semibold">Receipt preview</p>
                <p>{billingItems.find((item) => item.id === selectedInvoice)?.patient} • {billingItems.find((item) => item.id === selectedInvoice)?.treatment}</p>
                <p>Amount: ${billingItems.find((item) => item.id === selectedInvoice)?.amount}</p>
                <p>Payment method: {billingItems.find((item) => item.id === selectedInvoice)?.paymentMethod || 'Pending'}</p>
              </div>
            ) : null}
            <div className="space-y-3">
              {billingItems.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-950/70">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{item.patient}</p>
                    <p className="text-sm text-slate-500">{item.treatment}</p>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">${item.amount}</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.status}</div>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedInvoice(item.id)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                      Receipt view
                    </button>
                    <button onClick={() => handleExportInvoice(item)} className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white">
                      Print invoice
                    </button>
                    <button onClick={() => handlePaymentUpdate(item.id)} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                      Mark paid
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
