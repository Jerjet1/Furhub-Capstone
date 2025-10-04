import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const UserTable = ({ headers, data = [], isLoading, isError }) => {
  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, part) => acc?.[part], obj);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, idx) => (
              <TableHead key={idx}>{header.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={headers.length} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : isError || !Array.isArray(data) ? (
            <TableRow>
              <TableCell
                colSpan={headers.length}
                className="text-center text-red-500">
                Error fetching data.
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={headers.length} className="text-center">
                No data available.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, idx) => (
              <TableRow key={idx}>
                {headers.map((header, hIdx) => (
                  <TableCell key={hIdx}>
                    {getNestedValue(item, header.key)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
