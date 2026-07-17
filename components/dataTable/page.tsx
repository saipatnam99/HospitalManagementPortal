import React from "react";
import { BeatLoader } from "react-spinners";

interface DataTableProps {
  columns: {
    header: () => string | JSX.Element;
    accessorKey: string;
    cell?: ({ row }: { row: any }) => JSX.Element | null;
  }[];
  data: any[];
  isLoading: any;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, isLoading }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="max-h-[520px] overflow-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              {columns.map((column, columnIndex) => (
                <th
                  key={columnIndex}
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {column.header()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                  <BeatLoader color="#2563eb" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-slate-50">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-5 py-3 text-sm text-slate-700">
                      {column.cell ? column.cell({ row }) : row[column.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
