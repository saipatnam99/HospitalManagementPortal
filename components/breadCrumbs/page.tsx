import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, separator = ">>" }) => {
  return (
    <nav
      aria-label="breadcrumbs"
      className="bg-blue-700 text-white text-sm py-2 px-4 rounded-sm"
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href} className="flex items-center">
              {!isLast ? (
                <Link href={item.href} className="hover:underline capitalize">
                  {item.label}
                </Link>
              ) : (
                <span className="capitalize">{item.label}</span>
              )}
              {!isLast && <span className="mx-2">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
