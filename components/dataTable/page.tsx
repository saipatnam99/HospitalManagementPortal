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

const DataTable: React.FC<DataTableProps> = ({ columns, data ,isLoading}) => {
  return (
    <div className="h-auto max-h-[480px] overflow-auto border border-gray-300 rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            {columns.map((column, columnIndex) => (
              <th
                key={columnIndex}
                scope="col"
                className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider"
              >
                {column.header()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {isLoading ? (
          <tr>
            <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500 ">
             
              <BeatLoader color="red" style={{textAlign: "center"}}/>
             
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500 ">
              No data available
            </td>
          </tr>
        ) : (
          data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  {column.cell ? column.cell({ row }) : row[column.accessorKey]}
                </td>
              ))}
            </tr>
          ))
        )}
        
         
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
