import React from "react";

export const UserTable = ({ headers, data = [], isLoading, isError }) => {
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full divide-y divide-gray-200 overflow-auto">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={headers.length} className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : isError || !Array.isArray(data) ? (
            <tr>
              <td
                colSpan={headers.length}
                className="text-center py-4 text-red-500">
                Error fetching data.
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="text-center py-4">
                No data available.
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr key={idx}>
                {headers.map((header, hIdx) => (
                  <td key={hIdx} className="px-6 py-4 whitespace-nowrap">
                    {getNestedValue(item, header.key)}
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
