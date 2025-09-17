import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaginationButton } from "../../components/Buttons/PaginationButton";
import { UserLayoutPage } from "../../components/Layout/UserLayoutPage";

// Generate Mock Data
const generateData = (prefix, total) =>
  Array.from({ length: total }, (_, i) => ({
    id: i + 1,
    name: `${prefix} ${i + 1}`,
    email: `${prefix.toLowerCase()}${i + 1}@example.com`,
    phone_no: `09${Math.floor(100000000 + Math.random() * 899999999)}`,
  }));

const transactionLogs = generateData("User", 50);
const bookingHistory = generateData("Client", 50);

export const BoardingReports = () => {
  const [page, setPage] = useState(1);
  const [transactionPage, setTransactionPage] = useState(1);
  const [bookingPage, setBookingPage] = useState(1);
  const pageSize = 5;

  // Paginated Data
  const paginatedTransactions = transactionLogs.slice(
    (transactionPage - 1) * pageSize,
    transactionPage * pageSize
  );

  const paginatedBookings = bookingHistory.slice(
    (bookingPage - 1) * pageSize,
    bookingPage * pageSize
  );

  // Build `data` object for PaginationButton (mimics API style)
  const buildPaginationData = (page, totalItems) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      previous: page > 1,
      next: page < totalPages,
    };
  };

  const header = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone_no", label: "Phone No." },
    { key: "action", label: "Action" },
  ];
  return (
    <UserLayoutPage>
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#212121]">Reports</h1>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transaction" className="w-full px-3">
        <div className="flex justify-between">
          <TabsList className="gap-1">
            <TabsTrigger
              value="transaction"
              className="text-md p-5 cursor-pointer data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600 rounded-md transition">
              Transaction Logs
            </TabsTrigger>
            <TabsTrigger
              value="bookingHistory"
              className="text-md p-5 cursor-pointer data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600 rounded-md transition">
              Booking History
            </TabsTrigger>
          </TabsList>

          {/* Transaction Logs pagination button */}
          <TabsContent value="transaction" className="m-0 p-0">
            <div className="mt-4 flex items-start justify-end px-14">
              <PaginationButton
                page={transactionPage}
                setPage={setTransactionPage}
                data={Math.ceil(transactionLogs.length / pageSize)}
              />
            </div>
          </TabsContent>

          {/* Booking History pagination button*/}
          <TabsContent value="bookingHistory" className="m-0 p-0">
            <div className="mt-4 flex items-start justify-end px-14">
              <PaginationButton
                page={bookingPage}
                setPage={setBookingPage}
                data={Math.ceil(bookingHistory.length / pageSize)}
              />
            </div>
          </TabsContent>
        </div>

        {/* Transaction Logs Table */}
        <TabsContent value="transaction">
          <Card className="border-[#E0E0E0] ">
            <CardContent className="px-6 py-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    {header.map((h, idx) => (
                      <TableHead key={idx} className="text-center">
                        {h.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-center">{log.id}</TableCell>
                      <TableCell className="text-center">{log.name}</TableCell>
                      <TableCell className="text-center">{log.email}</TableCell>
                      <TableCell className="text-center">
                        {log.phone_no}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => console.log("View log:", log)}>
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking History Table */}
        <TabsContent value="bookingHistory">
          <Card className="border-[#E0E0E0] ">
            <CardContent className="px-6 py-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    {header.map((h, idx) => (
                      <TableHead key={idx} className="text-center">
                        {h.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBookings.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell className="text-center">
                        {history.id}
                      </TableCell>
                      <TableCell className="text-center">
                        {history.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {history.email}
                      </TableCell>
                      <TableCell className="text-center">
                        {history.phone_no}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => console.log("View booking:", history)}>
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transaction Logs Table */}
        {/* <TabsContent value="transaction">
          <Card className="border-[#E0E0E0] ">
            <CardContent className="px-6 py-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    {header.map((header, idx) => (
                      <TableHead key={idx}>{header.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* bookingHistory  Table */}
        {/* <TabsContent value="bookingHistory">
          <Card className="border-[#E0E0E0] ">
            <CardContent className="px-6 py-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    {header.map((header, idx) => (
                      <TableHead key={idx}>{header.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </UserLayoutPage>
  );
};
