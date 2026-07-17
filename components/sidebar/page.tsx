import Link from "next/link";

interface SidebarItem {
  href: string;
  label: string;
  active?: boolean;
}

interface SidebarProps {
  sidebarItems: SidebarItem[];
}

const icons: Record<string, string> = {
  Dashboard: "⌂",
  Doctors: "🩺",
  Patients: "👥",
  Appointments: "🗓️",
  Billing: "💳",
  Schedule: "🗓️",
  Outpatient: "🧑‍⚕️",
  Labs: "🧪",
  Pharmacy: "💊",
  Insurance: "🛡️",
  Medicines: "💉",
  Beds: "🛏️",
  Discharge: "🏥",
  Admin: "⚙️",
};

export default function Sidebar({ sidebarItems }: SidebarProps) {
  return (
    <aside className="h-full min-h-screen w-64 border-r border-slate-200 bg-slate-950 text-slate-100">
      <div className="px-5 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
          Navigation
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Manage care, staff, and patients from one place.
        </p>
      </div>

      <nav>
        <ul className="space-y-1 px-3">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  item.active
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="text-base">{icons[item.label] || "•"}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
