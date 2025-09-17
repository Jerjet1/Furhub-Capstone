import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Mail, Check, X, Eye } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { UserLayoutPage } from "../../components/Layout/UserLayoutPage";

// ---- Mock Data ----
const requestsMock = [
  {
    id: 1,
    pet: "Max - Golden Retriever",
    owner: "Sarah Johnson",
    phone: "(555) 123-4567",
    email: "sarah@email.com",
    dates: "Dec 15-20, 2024",
    duration: "5 days",
    distance: "2.3 miles",
    special: "Needs medication twice daily, prefers indoors.",
  },
  {
    id: 2,
    pet: "Luna - Husky",
    owner: "Mark Evans",
    phone: "(555) 222-1111",
    email: "mark@email.com",
    dates: "Jan 2-6, 2025",
    duration: "4 days",
    distance: "1.8 miles",
    special: "Very energetic, loves walks.",
  },
  {
    id: 3,
    pet: "Bella - Beagle",
    owner: "Alice Brown",
    phone: "(555) 333-2222",
    email: "alice@email.com",
    dates: "Jan 10-12, 2025",
    duration: "2 days",
    distance: "3.5 miles",
    special: "Needs hypoallergenic food.",
  },
  {
    id: 4,
    pet: "Rocky - German Shepherd",
    owner: "Tom Green",
    phone: "(555) 444-3333",
    email: "tom@email.com",
    dates: "Feb 1-7, 2025",
    duration: "6 days",
    distance: "4.1 miles",
    special: "Guard-trained, requires secure space.",
  },
  {
    id: 5,
    pet: "Milo - Pug",
    owner: "Sophie White",
    phone: "(555) 555-4444",
    email: "sophie@email.com",
    dates: "Feb 12-15, 2025",
    duration: "3 days",
    distance: "0.9 miles",
    special: "Snores loudly, prefers soft bed.",
  },
];

const confirmedMock = [
  {
    id: 1,
    pet: "Buddy - Maltese",
    owner: "Emma Wilson",
    checkin: "Tomorrow 9:00 AM",
    dates: "Dec 12-14, 2024",
    duration: "2 days",
  },
  {
    id: 2,
    pet: "Charlie - Shih Tzu",
    owner: "David Miller",
    checkin: "Next Monday 2:00 PM",
    dates: "Jan 5-7, 2025",
    duration: "2 days",
  },
  {
    id: 3,
    pet: "Daisy - Labrador",
    owner: "Olivia Harris",
    checkin: "Jan 15, 10:00 AM",
    dates: "Jan 15-20, 2025",
    duration: "5 days",
  },
  {
    id: 4,
    pet: "Coco - Chihuahua",
    owner: "Lucas King",
    checkin: "Feb 2, 1:00 PM",
    dates: "Feb 2-4, 2025",
    duration: "2 days",
  },
  {
    id: 5,
    pet: "Bailey - Bulldog",
    owner: "Sophia Martinez",
    checkin: "Feb 10, 11:00 AM",
    dates: "Feb 10-14, 2025",
    duration: "4 days",
  },
];

export const BookingPage = () => {
  const [requestPage, setRequestPage] = useState(1);
  const [confirmedPage, setConfirmedPage] = useState(1);
  const itemsPerPage = 2; // Reduced for demonstration

  const totalRequestPages = Math.ceil(requestsMock.length / itemsPerPage);
  const totalConfirmedPages = Math.ceil(confirmedMock.length / itemsPerPage);

  const requests = requestsMock.slice(
    (requestPage - 1) * itemsPerPage,
    requestPage * itemsPerPage
  );
  const confirmed = confirmedMock.slice(
    (confirmedPage - 1) * itemsPerPage,
    confirmedPage * itemsPerPage
  );

  return (
    <UserLayoutPage>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            Booking Requests
          </h1>
          <p className="text-[#757575]">
            Manage incoming and scheduled pet boarding requests
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="border-[#E0E0E0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#757575]">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212121]">5</div>
            <div className="text-sm text-[#FF9800]">Needs attention</div>
          </CardContent>
        </Card>
        {/* revenue Card*/}
        <Card className="border-[#E0E0E0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#757575]">
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212121]">$2,450</div>
            <div className="text-sm text-[#4CAF50]">This month</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="requests" className="w-full">
        <div className="flex justify-between  mb-4">
          <div>
            <TabsList>
              <TabsTrigger value="requests">New Requests</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed Bookings</TabsTrigger>
            </TabsList>
          </div>

          {/* Pagination placed between tabs and content */}
          <div>
            <TabsContent value="requests" className="m-0 p-0">
              <Pagination className="m-0">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setRequestPage((p) => Math.max(1, p - 1));
                      }}
                      className={
                        requestPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from(
                    { length: totalRequestPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setRequestPage(page);
                        }}
                        isActive={page === requestPage}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setRequestPage((p) =>
                          Math.min(totalRequestPages, p + 1)
                        );
                      }}
                      className={
                        requestPage === totalRequestPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>

            <TabsContent value="confirmed" className="m-0 p-0">
              <Pagination className="m-0">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setConfirmedPage((p) => Math.max(1, p - 1));
                      }}
                      className={
                        confirmedPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from(
                    { length: totalConfirmedPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setConfirmedPage(page);
                        }}
                        isActive={page === confirmedPage}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setConfirmedPage((p) =>
                          Math.min(totalConfirmedPages, p + 1)
                        );
                      }}
                      className={
                        confirmedPage === totalConfirmedPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>
          </div>
        </div>

        {/* Requests */}
        <TabsContent value="requests">
          <div className="space-y-4">
            {requests.map((req) => (
              <Card key={req.id} className="border-[#E0E0E0]">
                <CardContent className="px-6 py-3">
                  <div className="flex items-start justify-between">
                    {/* Avatar + details */}
                    <div className="flex gap-4 w-full">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/dog.png" />
                        <AvatarFallback>{req.pet[0]}</AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col gap-2 w-full">
                        {/* Pet Name */}
                        <h3 className="font-semibold">{req.pet}</h3>

                        {/* Info row */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm text-[#757575]">
                          <p>Owner: {req.owner}</p>
                          <p className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {req.phone}
                          </p>
                          <p className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {req.email}
                          </p>
                          <p>
                            {req.dates} ({req.duration})
                          </p>
                          <p className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {req.distance}
                          </p>
                        </div>

                        {/* Note section */}
                        <div className="mt-3 p-2 bg-[#eeeeee] rounded">
                          <strong className="text-md text-[#424242]">
                            Note
                          </strong>
                          <p className="text-sm text-[#757575]">
                            {req.special}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#F44336] text-[#F44336]">
                        <X className="h-4 w-4 mr-1" /> Decline
                      </Button>
                      <Button size="sm" className="bg-[#4285F4] text-white">
                        <Check className="h-4 w-4 mr-1" /> Accept
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Confirmed */}
        <TabsContent value="confirmed">
          <div className="space-y-4">
            {confirmed.map((book) => (
              <Card key={book.id} className="border-[#E0E0E0]">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/dog.png" />
                        <AvatarFallback>{book.pet[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{book.pet}</h3>
                        <p className="text-sm text-[#757575]">
                          Owner: {book.owner}
                        </p>
                        <p className="text-sm text-[#757575]">
                          Check-in: {book.checkin}
                        </p>
                        <p className="text-sm text-[#757575]">
                          {book.dates} ({book.duration})
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" /> Details
                      </Button>
                      <Button size="sm" className="bg-[#4CAF50] text-white">
                        Check In
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </UserLayoutPage>
  );
};
