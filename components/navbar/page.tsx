"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("careflow-theme");
    const isDark = stored === "dark";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("careflow-theme", next ? "dark" : "light");
  };

  const handleLogout = async () => {
    toast.info("Logging out...");
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-600">CareFlow Hospital</p>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Hospital Command Center</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 sm:flex dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <span className="mr-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Live</span>
            24/7 operations
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {(session?.user as any)?.username || (session?.user as any)?.name || "Staff member"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{(session?.user as any)?.email || "Signed in"}</p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 dark:bg-blue-600"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;