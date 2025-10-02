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
import { Clock, PhilippinePeso } from "lucide-react";
export const FacilityProfile = () => {
  const [loading, setLoading] = useState(false);
  const [hourlyEnabled, setHourlyEnabled] = useState(false);
  const [dailyEnabled, setDailyEnabled] = useState(false);
  const [weeklyEnabled, setWeeklyEnabled] = useState(false);

  const [hourly, setHourly] = useState("");
  const [daily, setDaily] = useState("");
  const [weekly, setWeekly] = useState("");

  const regex = /^\d{0,10}(\.\d{0,2})?$/;

  // Utility: keep value as number-formatted string with max 2 decimals
  const formatTwoDecimals = (val) => {
    if (val === "") return "";
    const num = Number(val);
    if (Number.isNaN(num)) return "";
    return parseFloat(num.toFixed(2)).toString();
  };

  const handleHourlyChange = (e) => {
    const input = e.target.value;
    if (input === "" || regex.test(input)) {
      // allow typing but when possible update formatted values
      setHourly(input);
    }
  };

  const handleDailyChange = (e) => {
    const input = e.target.value;
    if (input === "" || regex.test(input)) {
      setDaily(input);
    }
  };

  const handleWeeklyChange = (e) => {
    const input = e.target.value;
    if (input === "" || regex.test(input)) {
      setWeekly(input);
    }
  };
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
                <PhilippinePeso className="h-5 w-5" />
                Services & Pricing
              </CardTitle>
              <CardDescription className="text-[#757575]">
                Set your service rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    {/* You can add more services later like grooming, daycare, etc. */}
                  </SelectContent>
                </Select>
              </div>

              {/* Rates Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Checkbox
                    id={`hourly-enabled`}
                    checked={hourlyEnabled}
                    onCheckedChange={(checked) =>
                      setHourlyEnabled(checked === true)
                    }
                  />
                  <Label
                    htmlFor={`hourly-enabled`}
                    className="text-sm text-[#424242] w-28">
                    Hourly Rate
                  </Label>
                  <Input
                    type="text"
                    value={hourly}
                    onChange={handleHourlyChange}
                    onBlur={() =>
                      setHourly((v) => (v === "" ? "" : formatTwoDecimals(v)))
                    }
                    placeholder="Enter amount"
                    disabled={!hourlyEnabled}
                    className="border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA] w-40"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Checkbox
                    id={`daily-enabled`}
                    checked={dailyEnabled}
                    onCheckedChange={(checked) =>
                      setDailyEnabled(checked === true)
                    }
                  />
                  <Label
                    htmlFor={`daily-enabled`}
                    className="text-sm text-[#424242] w-28">
                    Daily Rate
                  </Label>
                  <Input
                    type="text"
                    value={daily}
                    onChange={handleDailyChange}
                    onBlur={() =>
                      setDaily((v) => (v === "" ? "" : formatTwoDecimals(v)))
                    }
                    placeholder="Enter amount"
                    disabled={!dailyEnabled}
                    className="border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA] w-40"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Checkbox
                    id={`weekly-enabled`}
                    checked={weeklyEnabled}
                    onCheckedChange={(checked) =>
                      setWeeklyEnabled(checked === true)
                    }
                  />
                  <Label
                    htmlFor={`weekly-enabled`}
                    className="text-sm text-[#424242] w-28">
                    Weekly Rate
                  </Label>
                  <Input
                    type="text"
                    value={weekly}
                    onChange={handleWeeklyChange}
                    onBlur={() =>
                      setWeekly((v) => (v === "" ? "" : formatTwoDecimals(v)))
                    }
                    placeholder="Enter amount"
                    disabled={!weeklyEnabled}
                    className="border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA] w-40"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-[#212121] flex items-center gap-2">
                <PhilippinePeso className="h-5 w-5" />
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
          </Card> */}
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
