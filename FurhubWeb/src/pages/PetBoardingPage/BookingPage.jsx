import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Phone,
  Mail,
  Check,
  X,
  Eye,
  Loader2,
  Calendar,
  CalendarDays,
  ImageIcon,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingAPI } from "../../api/bookings";
import { UserLayoutPage } from "../../components/Layout/UserLayoutPage";
import { formatDateRange, formatDate } from "@/utils/formatDateTime";
import { getInitials } from "@/utils/formatName";
import { toast } from "sonner";
import { LottieSpinner } from "@/components/LottieSpinner";
import { parseError } from "@/utils/parseError";

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
  const [activeTab, setActiveTab] = useState("requests");
  const [confirmedPage, setConfirmedPage] = useState(1);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 2; // Reduced for demonstration
  const queryClient = useQueryClient();

  const totalConfirmedPages = Math.ceil(confirmedMock.length / itemsPerPage);

  const confirmed = confirmedMock.slice(
    (confirmedPage - 1) * itemsPerPage,
    confirmedPage * itemsPerPage
  );

  const {
    data: bookingList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookings", activeTab, requestPage],
    queryFn: () => bookingAPI.listBookingAPI(requestPage, activeTab),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  const totalRequestPages = bookingList ? Math.ceil(bookingList.count / 3) : 1; // assuming 10 items

  const handleDialog = (booking) => {
    console.log("booking id:", booking);
    setSelectedBooking(booking);
    setViewDialog(true);
  };

  const declineBooking = async (booking_id) => {
    setLoading(true);
    try {
      const result = await bookingAPI.declineBookingAPI(booking_id);
      toast.success(`${result.message}`);
      queryClient.invalidateQueries(["bookings"]);
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      setLoading(false);
    }
  };
  const approveBooking = async (booking_id) => {
    setLoading(true);
    try {
      const result = await bookingAPI.approveBookingAPI(booking_id);
      toast.success(`${result.message}`);
      queryClient.invalidateQueries(["bookings"]);
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayoutPage>
      {/* loading state */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 flex-col">
          <LottieSpinner size={120} />
          <p className="text-xl font-Fugaz">Loading...</p>
        </div>
      )}

      {/* headers */}
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
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6"> */}
      {/* <Card className="border-[#E0E0E0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#757575]">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212121]">5</div>
            <div className="text-sm text-[#FF9800]">Needs attention</div>
          </CardContent>
        </Card> */}
      {/* revenue Card*/}
      {/* <Card className="border-[#E0E0E0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#757575]">
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212121]">$2,450</div>
            <div className="text-sm text-[#4CAF50]">This month</div>
          </CardContent>
        </Card> */}
      {/* </div> */}

      {/* Tabs */}
      {/* <Tabs defaultValue="requests" className="w-full"> */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between  mb-4">
          <div>
            <TabsList>
              <TabsTrigger value="requests">New Requests</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed Bookings</TabsTrigger>
              <TabsTrigger value="ongoing">Active Bookings</TabsTrigger>
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

        {/* View Dialog */}
        <Dialog open={viewDialog} onOpenChange={setViewDialog}>
          <DialogContent className="max-w-3xl bg-neutral-50">
            {" "}
            {/* wider dialog */}
            <DialogHeader>
              <DialogTitle>View Details</DialogTitle>
              <DialogDescription>Pet Profile</DialogDescription>
            </DialogHeader>
            {/* Pets Carousel */}
            {selectedBooking && (
              <div className="relative w-full max-w-2xl mx-auto">
                {/* center container */}
                <Carousel className="w-full px-5">
                  <CarouselContent>
                    {selectedBooking.pets.map((p, index) => (
                      <CarouselItem key={index}>
                        <Card className="overflow-hidden shadow-md rounded-2xl">
                          <CardContent className="p-0">
                            {/* Pet Image or Placeholder */}
                            {p.pet?.image ? (
                              <img
                                src={p.pet.image}
                                alt={p.pet.name}
                                className="w-full h-48 object-cover"
                              />
                            ) : (
                              <div className="w-full h-48 flex items-center justify-center bg-muted text-muted-foreground">
                                <ImageIcon className="w-12 h-12" />
                              </div>
                            )}

                            {/* Pet Info */}
                            <div className="p-4 space-y-1">
                              <h3 className="text-lg font-semibold">
                                {p.pet.name}
                              </h3>
                              <div className="flex flex-row gap-2">
                                <p className="text-sm text-muted-foreground">
                                  Breed:
                                </p>
                                <p className="text-sm">{p.pet.breed}</p>
                              </div>
                              <div className="flex flex-row gap-2">
                                <p className="text-sm text-muted-foreground">
                                  Age:
                                </p>
                                <p className="text-sm">{p.pet.age} yr(s)</p>
                              </div>
                              <div className="flex flex-row gap-2">
                                <p className="text-sm text-muted-foreground">
                                  Size:
                                </p>
                                <p className="text-sm">{p.pet.size} kg</p>
                              </div>
                              <div className="flex flex-row gap-2">
                                <p className="text-sm text-muted-foreground">
                                  Welfare Note:
                                </p>
                                <p className="text-sm">
                                  {p.welfare_note || "No welfare note"}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* Navigation buttons positioned inside the carousel */}
                  <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
                </Carousel>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Requests */}
        <TabsContent value="requests">
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
              </div>
            ) : isError ? (
              <div className="text-center py-4 text-red-500">
                Failed to get data
              </div>
            ) : !bookingList.results || bookingList.results.length === 0 ? (
              <div className="flex justify-center items-center py-4 h-[23rem] font-bold text-xl text-[#757575]">
                No booking available
              </div>
            ) : (
              bookingList.results.map((booking) => {
                return (
                  <Card key={booking.booking_id} className="border-[#E0E0E0]">
                    <CardContent className="px-6">
                      {/* Owner name & status*/}
                      <div className="flex items-center gap-2 ml-15 justify-between">
                        <h3 className="font-semibold text-[#212121] text-lg">
                          {booking.customer_name}
                        </h3>
                        <Badge className="bg-[#FFF3E0] text-[#E65100] hover:bg-[#FFF3E0] text-[13px]">
                          {booking.status_display}
                        </Badge>
                      </div>
                      <div className="flex items-start justify-between mt-2">
                        {/* Avatar + details */}
                        <div className="flex gap-4 w-full">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="" />
                            <AvatarFallback>
                              {getInitials(booking.customer_name)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex flex-col gap-2 w-full">
                            {/* Info row */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-x-6 gap-y-1 text-[15px] text-[#464545]">
                              <div>
                                <p className="flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  {booking.customer_phone}
                                </p>
                                <p className="flex items-center gap-1">
                                  <CalendarDays className="h-4 w-4" />
                                  Duration:{" "}
                                  {formatDateRange(
                                    booking.start_at,
                                    booking.end_at
                                  )}{" "}
                                  ({booking.duration})
                                </p>
                              </div>
                              <div>
                                <p className="flex items-center gap-1">
                                  <Mail className="h-4 w-4" />
                                  {booking.customer_email}
                                </p>

                                <p className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {booking.address}
                                </p>
                              </div>
                              <p className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Created at: {formatDate(booking.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#E0E0E0] text-[#424242] hover:bg-[#F5F5F5]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDialog(booking);
                            }}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#F44336] text-[#F44336] hover:bg-[#FFEBEE] bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation();
                              declineBooking(booking.booking_id);
                            }}>
                            <X className="h-4 w-4 mr-1" /> Decline
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#4285F4] hover:bg-[#1e6ce9] text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              approveBooking(booking.booking_id);
                            }}>
                            <Check className="h-4 w-4 mr-1" /> Accept
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
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
                        <AvatarImage src="" />
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
