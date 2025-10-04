import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Edit, Trash2, MoreHorizontal, Star, Phone, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserLayoutPage } from "../../components/Layout/UserLayoutPage";

// Mock Data
const mockLocations = [
  {
    id: 1,
    name: "Paws & Hearts Boarding",
    address: "123 Oak Street, New York, NY 10001",
    phone: "(555) 123-4567",
    avatar: "/pet-boarding-facility.png",
    fallback: "PH",
    rating: 4.8,
    reviews: 124,
    status: "Active",
  },
  {
    id: 2,
    name: "Happy Tails Hotel",
    address: "456 Maple Ave, Los Angeles, CA 90001",
    phone: "(555) 987-6543",
    avatar: "/pet-hotel.png",
    fallback: "HT",
    rating: 4.6,
    reviews: 89,
    status: "Active",
  },
  {
    id: 3,
    name: "Cozy Paws Inn",
    address: "789 Pine Road, Chicago, IL 60601",
    phone: "(555) 555-1212",
    avatar: "/pet-inn.png",
    fallback: "CP",
    rating: 4.2,
    reviews: 42,
    status: "Inactive",
  },
];

export const ManageLocation = () => {
  return (
    <UserLayoutPage>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            Location Management
          </h1>
          <p className="text-[#757575]">
            Manage all pet boarding facilities and service locations
          </p>
        </div>
      </div>

      {/* Locations List */}
      <Card className="border-[#E0E0E0]">
        <CardHeader>
          <div className="border-b-[#8a8989] border-b-2 space-y-1">
            <CardTitle className="text-[#212121]">All Locations</CardTitle>
            <CardDescription className="text-[#757575] mb-4">
              Manage and monitor all registered facilities
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {mockLocations.map((location) => (
              <div
                key={location.id}
                className="flex items-center justify-between p-6 border-b border-[#E0E0E0] hover:bg-[#FAFAFA]">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={location.avatar} />
                    <AvatarFallback className="bg-[#4285F4] text-white">
                      {location.fallback}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-[#212121]">
                      {location.name}
                    </h3>
                    <p className="text-sm text-[#757575]">{location.address}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-[#757575]">
                        <Phone className="h-3 w-3" />
                        {location.phone}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-4 w-4 text-[#FF9800] fill-current" />
                      <span className="text-sm font-medium text-[#212121]">
                        {location.rating}
                      </span>
                      <span className="text-sm text-[#757575]">
                        ({location.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          location.status === "Active"
                            ? "bg-[#E8F5E8] text-[#4CAF50] hover:bg-[#E8F5E8]"
                            : "bg-[#FFEBEE] text-[#F44336] hover:bg-[#FFEBEE]"
                        }>
                        {location.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#616161] hover:bg-[#F5F5F5]">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-[#424242]">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[#424242]">
                        <Globe className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[#F44336]">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </UserLayoutPage>
  );
};