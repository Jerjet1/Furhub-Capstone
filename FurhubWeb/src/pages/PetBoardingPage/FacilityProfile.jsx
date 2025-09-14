import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LottieSpinner } from "@/components/LottieSpinner";
import { UserLayoutPage } from "../../components/Layout/UserLayoutPage";
import {
  Clock,
  FileText,
  CheckCircle,
  Badge,
  AlertCircle,
  Upload,
} from "lucide-react";
export const FacilityProfile = () => {
  const [loading, setLoading] = useState(false);
  return (
    <UserLayoutPage>
      {/* Loading screen */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 flex-col">
          <LottieSpinner size={120} />
          <p className="text-xl font-Fugaz">Loading...</p>
        </div>
      )}

      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#212121]">
            Facility Profile Setup
          </h1>
          <p className="text-[#757575]">
            Create your business profile that pet owners will see
          </p>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6 max-w-3xl">
          <Card className="border-[#E0E0E0]">
            <CardHeader>
              <CardTitle className="text-[#212121]">Facility Setup</CardTitle>
              <CardDescription className="text-[#757575]">
                Setup Facility info
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facility-name" className="text-[#424242]">
                    Facility Name
                  </Label>
                  <Input
                    id="facility-name"
                    placeholder="Enter Name"
                    className="border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-[#424242]">
                    Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="123 Pet Street, City, State 12345"
                    autoComplete="off"
                    className="border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-[#212121] flex items-center gap-2">
                Services & Pricing
              </CardTitle>
              <CardDescription className="text-[#757575]">
                Set your service rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service-type" className="text-[#424242]">
                    Service Type
                  </Label>
                  <Select>
                    <SelectTrigger className="border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boarding">Pet Boarding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type-rate" className="text-[#424242]">
                    Choose type of rate (hourly, Daily, Weekly)
                  </Label>
                  <Select>
                    <SelectTrigger className="border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate" className="text-[#424242]">
                    Rate
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#E0E0E0]">
            <CardHeader>
              <CardTitle className="text-[#212121] flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Operating Hours
              </CardTitle>
              <CardDescription className="text-[#757575]">
                Set your availability for pet owners
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-20">
                    <Label className="text-[#424242]">{day}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`${day}-open`} />
                    <Label
                      htmlFor={`${day}-open`}
                      className="text-sm text-[#424242]">
                      Open
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      defaultValue="08:00"
                      className="border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA] w-32"
                    />
                    <span className="text-[#9E9E9E]">to</span>
                    <Input
                      type="time"
                      defaultValue="18:00"
                      className="border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA] w-32"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar: Required Documents */}
        <aside className="space-y-6 md:col-span-1">
          <Card className="border-[#E0E0E0] md:w-80">
            <CardHeader>
              <CardTitle className="text-[#212121] flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Required Documents
              </CardTitle>
              <CardDescription className="text-[#757575]">
                Upload documents for admin approval
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#FAFAFA] rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#4CAF50]" />
                  <span className="text-sm text-[#424242]">Valid ID</span>
                </div>
                <Badge className="bg-[#E8F5E8] text-[#4CAF50] hover:bg-[#E8F5E8]">
                  Uploaded
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FAFAFA] rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-[#FF9800]" />
                  <span className="text-sm text-[#424242]">Selfie with ID</span>
                </div>
                <Badge className="bg-[#FFF3E0] text-[#E65100] hover:bg-[#FFF3E0]">
                  Pending
                </Badge>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-[#4285F4] hover:bg-[#1976D2] text-white">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-[#212121]">
                      Upload Documents
                    </DialogTitle>
                    <DialogDescription className="text-[#757575]">
                      Upload required documents for admin review and approval
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="document-type" className="text-[#424242]">
                        Document Type
                      </Label>
                      <Select>
                        <SelectTrigger className="border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA]">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="license">
                            Business License
                          </SelectItem>
                          <SelectItem value="insurance">
                            Insurance Certificate
                          </SelectItem>
                          <SelectItem value="permit">Health Permit</SelectItem>
                          <SelectItem value="certification">
                            Professional Certification
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        htmlFor="document-upload"
                        className="text-[#424242]">
                        Choose File
                      </Label>
                      <Input
                        id="document-upload"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA]"
                      />
                      <p className="text-sm text-[#9E9E9E] mt-1">
                        PDF, JPG, PNG up to 10MB
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-[#E0E0E0] text-[#424242] hover:bg-[#F5F5F5] bg-transparent">
                        Cancel
                      </Button>
                      <Button className="flex-1 bg-[#4285F4] hover:bg-[#1976D2] text-white">
                        Upload
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          <Card className="border-[#E0E0E0]">
            <CardContent className="pt-6 space-y-3">
              <Button className="w-full bg-[#4285F4] hover:bg-[#1976D2] text-white">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </UserLayoutPage>
  );
};
