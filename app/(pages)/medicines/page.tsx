"use client";

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/navbar/page";
import Sidebar from "@/components/sidebar/page";
import { useHospitalContext } from "@/app/providers";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/doctors", label: "Doctors" },
  { href: "/patients", label: "Patients" },
  { href: "/appointment", label: "Appointments" },
  { href: "/outpatient", label: "Outpatient" },
  { href: "/labs", label: "Labs" },
  { href: "/pharmacy", label: "Pharmacy" },
  { href: "/billing", label: "Billing" },
  { href: "/insurance", label: "Insurance" },
  { href: "/medicines", label: "Medicines", active: true },
  { href: "/beds", label: "Beds" },
  { href: "/discharge", label: "Discharge" },
  { href: "/schedule", label: "Schedule" },
  { href: "/admin", label: "Admin" },
];

export default function MedicinesPage() {
  const { medicines, addMedicine } = useHospitalContext();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(100);
  const [stock, setStock] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiMedicines, setApiMedicines] = useState<any[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setApiLoading(true);
        const response = await fetch("https://api.fda.gov/drug/label.json?limit=20");
        if (!response.ok) throw new Error("Unable to fetch medicine data");
        const data = await response.json();
        const mapped = (data.results || []).map((item: any, index: number) => ({
          id: `${item.id || index}`,
          name: item.openfda?.brand_name?.[0] || item.openfda?.generic_name?.[0] || item.brand_name?.[0] || "Unknown medicine",
          genericName: item.openfda?.generic_name?.[0] || item.generic_name?.[0] || "N/A",
          category: item.openfda?.substance_name?.[0] || item.substance_name?.[0] || "General",
          manufacturer: item.openfda?.manufacturer_name?.[0] || item.manufacturer_name?.[0] || "N/A",
          description: item.indications_and_usage?.[0] || item.purpose?.[0] || "Medication details available from the live medical source.",
          route: item.route?.[0] || "Oral",
        }));
        setApiMedicines(mapped);
      } catch (error) {
        console.error(error);
        setApiError("Live medicine data is temporarily unavailable.");
      } finally {
        setApiLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const filteredApiMedicines = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return apiMedicines;

    return apiMedicines.filter((medicine) => {
      const haystack = `${medicine.name} ${medicine.genericName} ${medicine.category} ${medicine.description}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [apiMedicines, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addMedicine({ id: Date.now(), name: name.trim(), category, price, stock });
    setName("");
    setCategory("");
    setPrice(100);
    setStock(50);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-row">
        <Sidebar sidebarItems={sidebarItems} />
        <div className="flex-1 p-6 md:p-8">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-800 p-6 text-white shadow-lg">
            <h1 className="text-2xl font-semibold">Medicines inventory</h1>
            <p className="mt-2 text-sm text-slate-300">Track pharmacy stock and pricing across departments.</p>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Add medicine</h2>
              <div className="mt-4 space-y-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Medicine name
                  <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" required />
                </label>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Category
                  <input value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" required />
                </label>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Price
                  <input type="number" min="1" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" required />
                </label>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Stock
                  <input type="number" min="0" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" required />
                </label>
                <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">Add medicine</button>
              </div>
            </form>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Pharmacy inventory</h2>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{medicines.length} local items</span>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/70">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Live medical lookup</p>
                    <p className="text-xs text-slate-500">Search real-time medication details from the medical API.</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">Live data</span>
                </div>

                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search medicines by name, category or ingredient"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                />

                <div className="mt-3 max-h-80 space-y-2 overflow-auto pr-1">
                  {apiLoading && <p className="text-sm text-slate-500">Loading live medicine data...</p>}
                  {!apiLoading && apiError && <p className="text-sm text-rose-600">{apiError}</p>}
                  {!apiLoading && !apiError && filteredApiMedicines.length === 0 && (
                    <p className="text-sm text-slate-500">No matching medicines found.</p>
                  )}
                  {!apiLoading && !apiError && filteredApiMedicines.map((medicine) => (
                    <div key={medicine.id} className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{medicine.name}</p>
                          <p className="text-xs text-slate-500">Generic: {medicine.genericName}</p>
                        </div>
                        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
                          {medicine.category}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{medicine.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-slate-100 px-2 py-1">Manufacturer: {medicine.manufacturer}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-1">Route: {medicine.route}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {medicines.map((medicine) => (
                  <div key={medicine.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/70">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{medicine.name}</p>
                        <p className="text-sm text-slate-500">{medicine.category}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">${medicine.price}</p>
                        <p className="text-slate-500">Stock {medicine.stock}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
