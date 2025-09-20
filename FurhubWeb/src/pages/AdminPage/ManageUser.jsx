import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Search,
  Filter,
  MapPin,
  FileText,
  Eye,
  Check,
  X,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserLayoutPage } from "../../components/Layout/UserLayoutPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fetchUsers } from "../../api/Users";

export const ManageUser = () => {
  const [page, setPage] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [documentView, setDocumentView] = useState(null);

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page),
  });

  const pendingProviders = [
    {
      id: "1",
      name: "Happy Paws Pet Hotel",
      owner: "Sarah Johnson",
      email: "sarah@happypaws.com",
      phone: "+1 (555) 123-4567",
      location: "123 Pet Street, Austin, TX",
      coordinates: { lat: 30.2672, lng: -97.7431 },
      submittedDate: "2024-01-15",
      documents: [
        {
          type: "Business License",
          url: "/business-license.pdf",
          status: "pending",
        },
        { type: "Owner ID", url: "/owner-id.jpg", status: "pending" },
        {
          type: "Insurance Certificate",
          url: "/insurance.pdf",
          status: "pending",
        },
      ],
      services: ["Pet Boarding", "Dog Walking", "Pet Grooming"],
      status: "pending",
    },
    {
      id: "2",
      name: "Cozy Tails Boarding",
      owner: "Michael Chen",
      email: "mike@cozytails.com",
      phone: "+1 (555) 987-6543",
      location: "456 Animal Ave, Dallas, TX",
      coordinates: { lat: 32.7767, lng: -96.797 },
      submittedDate: "2024-01-18",
      documents: [
        {
          type: "Business License",
          url: "/business-license-2.pdf",
          status: "approved",
        },
        { type: "Owner ID", url: "/owner-id-2.jpg", status: "pending" },
        {
          type: "Insurance Certificate",
          url: "/insurance-2.pdf",
          status: "rejected",
        },
      ],
      services: ["Pet Boarding", "Pet Sitting"],
      status: "pending",
    },
    {
      id: "3",
      name: "Furry Friends Resort",
      owner: "Emily Rodriguez",
      email: "emily@furryresort.com",
      phone: "+1 (555) 456-7890",
      location: "789 Doggy Lane, Houston, TX",
      coordinates: { lat: 29.7604, lng: -95.3698 },
      submittedDate: "2024-01-20",
      documents: [
        {
          type: "Business License",
          url: "/business-license-3.pdf",
          status: "pending",
        },
        { type: "Owner ID", url: "/owner-id-3.jpg", status: "pending" },
        {
          type: "Insurance Certificate",
          url: "/insurance-3.pdf",
          status: "pending",
        },
      ],
      services: ["Pet Boarding", "Dog Walking", "Pet Training"],
      status: "pending",
    },
  ];

  const header = [
    { key: "id", label: "ID" },
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone_no", label: "Phone No." },
    { key: "action", label: "Action" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-[#E8F5E8] text-[#4CAF50]";
      case "rejected":
        return "bg-[#FFEBEE] text-[#F44336]";
      default:
        return "bg-[#FFF3E0] text-[#E65100]";
    }
  };

  const approveProvider = (providerId) => {
    console.log("[v0] Approving provider:", providerId);
    // Handle approval logic
  };

  const rejectProvider = (providerId) => {
    console.log("[v0] Rejecting provider:", providerId);
    // Handle rejection logic
  };

  return (
    <UserLayoutPage>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#212121]">User Management</h1>
          <p className="text-[#757575]">
            Review and approve pending service providers
          </p>
        </div>
      </div>
      <Tabs defaultValue="pendingProviders">
        <div className="flex justify-between  mb-4">
          {/* tabs button */}
          <div>
            <TabsList>
              <TabsTrigger
                value="pendingProviders"
                className="text-md p-5 cursor-pointer data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600 rounded-md transition">
                Pending Providers
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="text-md p-5 cursor-pointer data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600 rounded-md transition">
                All Users
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Pagination */}
          <div>
            <TabsContent value="pendingProviders">
              <Pagination className="m-0">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>

            <TabsContent value="users">
              <Pagination className="m-0">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (userData?.previous)
                          setPage((prev) => Math.max(prev - 1, 1));
                      }}
                    />
                  </PaginationItem>

                  {Array.from(
                    { length: Math.ceil((userData?.count || 0) / 10) }, // 10 = page size
                    (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={page === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(i + 1);
                          }}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (userData?.next) setPage((prev) => prev + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>
          </div>
        </div>

        {/* pending providers */}
        <TabsContent value="pendingProviders">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Provider List */}
            <div className="lg:col-span-2">
              <Card className="border-[#E0E0E0]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-[#212121]">
                        Pending Providers
                      </CardTitle>
                      <CardDescription className="text-[#757575]">
                        Review and approve new service providers
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                        <Input
                          placeholder="Search providers..."
                          className="pl-10 w-64 border-[#E0E0E0]"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingProviders.map((provider) => (
                    <div
                      key={provider.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedProvider === provider.id
                          ? "border-[#4285F4] bg-[#E3F2FD]"
                          : "border-[#E0E0E0] hover:border-[#BDBDBD]"
                      }`}
                      onClick={() => setSelectedProvider(provider.id)}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-[#4285F4] text-white">
                              {provider.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-[#212121]">
                              {provider.name}
                            </h3>
                            <p className="text-sm text-[#757575]">
                              {provider.owner}
                            </p>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1 text-sm text-[#757575]">
                                <Mail className="h-3 w-3" />
                                {provider.email}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-[#757575]">
                                <Phone className="h-3 w-3" />
                                {provider.phone}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(provider.status)}>
                          {provider.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-[#757575]" />
                        <span className="text-sm text-[#757575]">
                          {provider.location}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#757575]" />
                          <span className="text-sm text-[#757575]">
                            Submitted: {provider.submittedDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#E0E0E0] text-[#424242] hover:bg-[#F5F5F5]"
                            onClick={(e) => {
                              console.log("open dialog");
                            }}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#4CAF50] hover:bg-[#388E3C] text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              approveProvider(provider.id);
                            }}>
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#F44336] text-[#F44336] hover:bg-[#FFEBEE] bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation();
                              rejectProvider(provider.id);
                            }}>
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Provider Details & Map */}
            <div className="space-y-6">
              {selectedProvider && (
                <>
                  {/* Location Map */}
                  <Card className="border-[#E0E0E0]">
                    <CardHeader>
                      <CardTitle className="text-[#212121]">Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-[#FAFAFA] rounded-lg flex items-center justify-center border border-[#E0E0E0]">
                        <div className="text-center">
                          <MapPin className="h-12 w-12 text-[#4285F4] mx-auto mb-2" />
                          <p className="text-[#757575] text-sm">
                            Interactive Map
                          </p>
                          <p className="text-[#9E9E9E] text-xs mt-1">
                            {(() => {
                              const provider = pendingProviders.find(
                                (p) => p.id === selectedProvider
                              );
                              return provider?.location || "";
                            })()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        {/* table for users */}
        <TabsContent value="users">
          <Card>
            <CardContent>
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
                  {isUserLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={header.length}
                        className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : isUserError ? (
                    <TableRow>
                      <TableCell
                        colSpan={header.length}
                        className="text-center text-red-500">
                        Error fetching data.
                      </TableCell>
                    </TableRow>
                  ) : !userData?.results || userData.results.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={header.length}
                        className="text-center">
                        No data available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    userData.results.map((item, idx) => (
                      <TableRow key={idx}>
                        {header.map((h, hIdx) => (
                          <TableCell key={hIdx} className="text-center">
                            {h.key === "action" ? (
                              <div className="flex justify-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-[#E0E0E0] text-[#424242] hover:bg-[#F5F5F5]"
                                  onClick={(e) => {
                                    console.log("View user", item.id);
                                  }}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-[#F44336] text-[#F44336] hover:bg-[#FFEBEE]"
                                  onClick={() =>
                                    console.log("Delete user", item.id)
                                  }>
                                  Deactivate
                                </Button>
                              </div>
                            ) : (
                              item[h.key] ?? ""
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </UserLayoutPage>
  );
};
