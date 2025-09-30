import React, { useEffect, useState } from "react";
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
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LottieSpinner } from "@/components/LottieSpinner";
import { UserLayoutPage } from "../../components/Layout/UserLayoutPage";
import { Clock, PhilippinePeso, MapPin } from "lucide-react";
import { PolicyCard } from "@/components/PolicyCard";
import { toast } from "sonner";
import { petBoardingAPI } from "../../api/Users";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const validationSchema = yup.object().shape({
  hotel_name: yup.string().required(""),
  max_capacity: yup.number().required(""),
  facility_phone: yup
    .string()
    .matches(
      /^09[0-9]{9}$/, // Remove the "or empty" option
      "Phone number must start with 09 and be 11 digits"
    )
    .required("Phone number is required"),

  // Pricing section - fix the types
  boarding_rate: yup.object({
    hourly_rate: yup
      .mixed()
      .test("is-number-or-empty", "Must be a positive number", (value) => {
        if (value === "" || value === null || value === undefined) return true;
        const num = Number(value);
        return !isNaN(num) && num >= 0;
      })
      .nullable(),
    daily_rate: yup
      .mixed()
      .test("is-number-or-empty", "Must be a positive number", (value) => {
        if (value === "" || value === null || value === undefined) return true;
        const num = Number(value);
        return !isNaN(num) && num >= 0;
      })
      .nullable(),
    weekly_rate: yup
      .mixed()
      .test("is-number-or-empty", "Must be a positive number", (value) => {
        if (value === "" || value === null || value === undefined) return true;
        const num = Number(value);
        return !isNaN(num) && num >= 0;
      })
      .nullable(),
  }),

  // Policy section (array if multiple policies allowed)
  boarding_policy: yup
    .array()
    .of(
      yup.object({
        policy_type: yup.string().required(),
        description: yup.string().required(),
        fee: yup.number().min(0).notRequired(),
        grace_period_minutes: yup.number().min(0).notRequired(),
        active: yup.boolean().required(),
      })
    )
    .min(0),

  // In your validation schema, simplify the operational hours validation:
  operational_hours: yup.array().of(
    yup.object({
      day: yup.string().required(),
      is_open: yup.boolean().required(),
      open_time: yup.string().nullable(),
      close_time: yup.string().nullable(),
    })
  ),
});

const handleDecimalInput = (e) => {
  let value = e.currentTarget.value;

  // Allow only digits and decimal point
  value = value.replace(/[^0-9.]/g, "");

  // Prevent multiple decimals
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }

  // Restrict to 2 decimal places
  if (parts[1]?.length > 2) {
    value = parts[0] + "." + parts[1].slice(0, 2);
  }

  // Prevent leading "-"
  if (value.startsWith("-")) {
    value = value.replace("-", "");
  }

  e.currentTarget.value = value;
};

export const FacilityProfile = () => {
  // const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: facility, isLoading } = useQuery({
    queryKey: ["facilityProfile"],
    queryFn: petBoardingAPI.getDetails,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors, isDirty, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
    defaultValues: facility || {
      hotel_name: "",
      max_capacity: 1,
      facility_phone: "",
      boarding_rate: {
        hourly_rate: "",
        daily_rate: "",
        weekly_rate: "",
        rate_type: "",
      },
      boarding_policy: [], // Empty array by default
      operational_hours: [
        { day: "monday", open_time: null, close_time: null, is_open: false },
        { day: "tuesday", open_time: null, close_time: null, is_open: false },
        { day: "wednesday", open_time: null, close_time: null, is_open: false },
        { day: "thursday", open_time: null, close_time: null, is_open: false },
        { day: "friday", open_time: null, close_time: null, is_open: false },
        { day: "saturday", open_time: null, close_time: null, is_open: false },
        { day: "sunday", open_time: null, close_time: null, is_open: false },
      ],
    },
  });

  // useFieldArray to manage dynamic boarding_policy
  const { fields, append } = useFieldArray({
    control,
    name: "boarding_policy",
  });

  // replace previous local policies handlers with field array ops
  const addPolicyHandler = () => {
    fields.length > 1
      ? toast.warning("maximum policy 2 only")
      : append({
          policy_type: "",
          description: "",
          fee: "",
          grace_period_minutes: "",
          active: true,
        });
  };

  const handlePolicyChangeHandler = (index, field, value) => {
    // use setValue to update a single nested field so Controllers don't lose focus
    setValue(`boarding_policy.${index}.${field}`, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    });
  };

  const togglePolicyHandler = (index) => {
    // read current active from the form and flip it
    const currentActive = watch(`boarding_policy.${index}.active`);
    setValue(`boarding_policy.${index}.active`, !currentActive, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  useEffect(() => {
    if (facility) {
      const defaultDays = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];

      const apiHours = facility.operational_hours || [];

      // Merge API hours with default day names so every item always has a 'day'
      const mergedHours = defaultDays.map((dayName) => {
        // try to find matching API entry by day string (case-insensitive)
        const match =
          apiHours.find(
            (h) =>
              h && typeof h.day === "string" && h.day.toLowerCase() === dayName
          ) || null;

        return {
          day: dayName,
          is_open: Boolean(match?.is_open),
          open_time: match?.open_time ?? null,
          close_time: match?.close_time ?? null,
        };
      });

      const facilityData = {
        ...facility,
        boarding_policy: facility.boarding_policy || [],
        operational_hours: mergedHours,
      };

      reset(facilityData);
    }
  }, [facility, reset]);

  const mutation = useMutation({
    mutationFn: petBoardingAPI.createOrUpdateDetails,
    onSuccess: (data) => {
      queryClient.setQueriesData(["facilityProfile"], data); // refresh cache
      console.log("hello1");
      toast.success("Save successfully");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Failed to save: " + error.message);
    },
  });

  const onSubmit = async (formData) => {
    if (!isValid) {
      console.log("❌ Form is not valid, preventing submission");
      toast.error("Please fix validation errors before submitting");
      return;
    }
    // Normalize payload so backend receives arrays and proper types
    const payload = {
      ...formData,
      boarding_policy: (formData.boarding_policy || []).map((p) => ({
        policy_type: p.policy_type || null,
        description: p.description || null,
        fee:
          p.fee === "" || p.fee === null || p.fee === undefined
            ? null
            : Number(p.fee),
        grace_period_minutes:
          p.grace_period_minutes === "" ||
          p.grace_period_minutes === null ||
          p.grace_period_minutes === undefined
            ? null
            : Number(p.grace_period_minutes),
        active: !!p.active,
      })),
      boarding_rate: {
        hourly_rate:
          formData.boarding_rate?.hourly_rate === "" ||
          formData.boarding_rate?.hourly_rate === null ||
          formData.boarding_rate?.hourly_rate === undefined
            ? null
            : Number(formData.boarding_rate.hourly_rate),
        daily_rate:
          formData.boarding_rate?.daily_rate === "" ||
          formData.boarding_rate?.daily_rate === null ||
          formData.boarding_rate?.daily_rate === undefined
            ? null
            : Number(formData.boarding_rate.daily_rate),
        weekly_rate:
          formData.boarding_rate?.weekly_rate === "" ||
          formData.boarding_rate?.weekly_rate === null ||
          formData.boarding_rate?.weekly_rate === undefined
            ? null
            : Number(formData.boarding_rate.weekly_rate),
      },
      operational_hours: (formData.operational_hours || []).map((h) => ({
        day: h.day,
        is_open: !!h.is_open,
        open_time: h.open_time || null,
        close_time: h.close_time || null,
      })),
    };

    console.log("Sanitized payload:", payload);
    mutation.mutate(payload);
  };

  if (isLoading)
    return (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 flex-col">
          <LottieSpinner size={120} />
          <p className="text-xl font-Fugaz">Loading...</p>
        </div>
      </>
    );

  return (
    <UserLayoutPage>
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

      <form className="block" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6 max-w-3xl">
            {/*Facility Info setup*/}
            <Card className="border-[#E0E0E0]">
              <CardHeader>
                <CardTitle className="text-[#212121]">Facility Setup</CardTitle>
                <CardDescription className="text-[#757575]">
                  Setup Facility info
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div className="space-y-2">
                    <Label htmlFor="hotel_name" className="text-[#424242]">
                      Facility Name
                    </Label>
                    <Input
                      id="hotel_name"
                      placeholder="Enter Name"
                      {...register("hotel_name")}
                      className={`bg-[#FAFAFA] ${
                        errors.hotel_name
                          ? "border-red-400"
                          : "border-[#E0E0E0]"
                      } focus:border-[#4285F4] text-[#212121]`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-[#424242]">
                      Province
                    </Label>
                    <Select>
                      <SelectTrigger className="border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA] w-full">
                        <SelectValue placeholder="Select Province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cebu">Cebu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-[#424242]">
                      City
                    </Label>
                    <Select>
                      <SelectTrigger className="border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA] w-full">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cebu">Cebu City</SelectItem>
                        <SelectItem value="mandaue">Mandaue City</SelectItem>
                        <SelectItem value="lapu-lapu">
                          Lapu-Lapu City
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-[#424242]">
                      Barangay
                    </Label>
                    <Select>
                      <SelectTrigger className="border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA] w-full">
                        <SelectValue placeholder="Select Barangay" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tejero">Tejero</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* emergency phone number */}
                  <div className="space-y-2">
                    <Label htmlFor="facility-phone" className="text-[#424242]">
                      Emergency contact no.
                    </Label>
                    <Input
                      id="facility_phone"
                      placeholder="+63"
                      {...register("facility_phone")}
                      maxLength={11}
                      inputMode="tel"
                      type="text"
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      }}
                      className={`bg-[#FAFAFA] ${
                        errors.facility_phone
                          ? "border-red-400"
                          : "border-[#E0E0E0]"
                      } focus:border-[#4285F4] text-[#212121]`}
                    />
                    {errors.facility_phone && (
                      <p className="text-red-500 text-sm">
                        {errors.facility_phone.message}
                      </p>
                    )}
                  </div>

                  {/* max capacity */}
                  <div className="space-y-2">
                    <Label htmlFor="max_capacity" className="text-[#424242]">
                      Max capacity
                    </Label>
                    <Input
                      id="max_capacity"
                      placeholder="Enter Capacity"
                      {...register("max_capacity", {
                        setValueAs: (v) => Number(v), // keep numeric
                      })}
                      type="text"
                      maxLength={2}
                      inputMode="numeric"
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /\D/g,
                          ""
                        ); // remove non-digits
                      }}
                      className="border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Policy setup */}
            <Card>
              <CardHeader>
                <CardTitle>Set Policy</CardTitle>
                <CardDescription>Setup your Facility Policy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Add Policy Button */}
                <Button
                  variant="outline"
                  type="button"
                  disabled={fields.length > 1}
                  onClick={addPolicyHandler}
                  className="bg-[#4285F4] hover:bg-[#1976D2] text-white">
                  Add Policy
                </Button>

                {/* Dynamic Policy Containers - Only show when policies exist */}
                {fields.length > 0 ? (
                  fields.map((policy, index) => (
                    <PolicyCard
                      key={policy.id}
                      policy={policy}
                      index={index}
                      control={control}
                      errors={errors}
                      togglePolicy={togglePolicyHandler}
                      handlePolicyChange={handlePolicyChangeHandler}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No policies added yet. Click "Add Policy" to create one.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing setup */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#212121] flex items-center gap-2">
                  <PhilippinePeso className="h-5 w-5" />
                  Pricing
                </CardTitle>
                <CardDescription className="text-[#757575]">
                  Set your service rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rates Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label
                      htmlFor="hourly"
                      className="text-sm text-[#424242] w-28">
                      Hourly Rate
                    </Label>
                    <Input
                      type="text"
                      {...register("boarding_rate.hourly_rate", {
                        setValueAs: (v) => (v === "" ? "" : Number(v)),
                      })}
                      onInput={(e) => {
                        handleDecimalInput(e);
                      }}
                      maxLength={10}
                      inputMode="decimal"
                      placeholder="Enter amount"
                      className="border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA] w-40"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <Label
                      htmlFor="daily"
                      className="text-sm text-[#424242] w-28">
                      Daily Rate
                    </Label>
                    <Input
                      type="text"
                      {...register("boarding_rate.daily_rate", {
                        setValueAs: (v) => (v === "" ? "" : Number(v)),
                      })}
                      onInput={(e) => {
                        handleDecimalInput(e);
                      }}
                      maxLength={10}
                      inputMode="decimal"
                      placeholder="Enter amount"
                      className="border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA] w-40"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <Label
                      htmlFor="weekly"
                      className="text-sm text-[#424242] w-28">
                      Weekly Rate
                    </Label>
                    <Input
                      type="text"
                      {...register("boarding_rate.weekly_rate", {
                        setValueAs: (v) => (v === "" ? "" : Number(v)),
                      })}
                      onInput={(e) => {
                        handleDecimalInput(e);
                      }}
                      maxLength={10}
                      inputMode="decimal"
                      placeholder="Enter amount"
                      className="border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA] w-40"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operational Hours setup */}
            <Card className="border-[#E0E0E0]">
              <CardHeader>
                <CardTitle className="text-[#212121] flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Operational Hours
                </CardTitle>
                <CardDescription className="text-[#757575]">
                  Select days your facility is open and set times
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {watch("operational_hours")?.map((day, index) => (
                  <div
                    key={day.day}
                    className="flex flex-col md:flex-row items-start md:items-center gap-3 border-b pb-3">
                    {/* Day label */}
                    <Label className="capitalize w-28">{day.day}</Label>

                    {/* Open/Closed toggle */}
                    <Controller
                      control={control}
                      name={`operational_hours.${index}.is_open`}
                      render={({ field }) => (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(val) => field.onChange(!!val)}
                          />
                          <span className="text-sm text-[#424242]">Open</span>
                        </div>
                      )}
                    />

                    {/* Time inputs (enabled only if open) */}
                    <div className="flex items-center gap-3">
                      <Controller
                        control={control}
                        name={`operational_hours.${index}.open_time`}
                        render={({ field }) => (
                          <Input
                            type="time"
                            value={field.value || ""}
                            disabled={
                              !watch(`operational_hours.${index}.is_open`)
                            }
                            onChange={field.onChange}
                            className="w-32"
                          />
                        )}
                      />

                      <span className="text-[#757575]">to</span>

                      <Controller
                        control={control}
                        name={`operational_hours.${index}.close_time`}
                        render={({ field }) => (
                          <Input
                            type="time"
                            value={field.value || ""}
                            disabled={
                              !watch(`operational_hours.${index}.is_open`)
                            }
                            onChange={field.onChange}
                            className="w-32"
                          />
                        )}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-7 md:col-span-1">
            {/* Location Map */}
            <Card className="border-[#E0E0E0]">
              <CardHeader>
                <CardTitle className="text-[#212121]">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[260px] bg-[#FAFAFA] rounded-lg flex items-center justify-center border border-[#E0E0E0]">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-[#4285F4] mx-auto mb-2" />
                    <p className="text-[#757575] text-sm">Interactive Map</p>
                    <p className="text-[#9E9E9E] text-xs mt-1"></p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save changes*/}
            <Card className="border-[#E0E0E0]">
              <CardContent className="pt-6 space-y-3">
                <Button
                  variant="outline"
                  type="submit"
                  disabled={!isDirty || isSubmitting}
                  className={`w-full bg-[#4285F4] hover:bg-[#1976D2] text-white disabled:opacity-60`}>
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </form>
    </UserLayoutPage>
  );
};
