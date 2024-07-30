import Link from "next/link";

interface SidebarItem {
  href: string;
  label: string;
  active?: boolean; // active is optional
}

interface SidebarProps {
  sidebarItems: SidebarItem[];
}

export default function Sidebar({ sidebarItems }: SidebarProps) {
  // console.log(sidebarItems);

  return (
    <div className="h-screen w-56 bg-gray-800 text-white border-t-2 border-gray-700">
      <nav className="mt-0">
        <ul>
          {sidebarItems.map((item, index) => (
            <li
              key={index}
              className={` ${
                item.active ? "bg-[#4233cc] " : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <Link href={item.href} className="block p-4">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
