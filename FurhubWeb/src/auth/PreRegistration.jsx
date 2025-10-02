import React, { useState, useEffect } from "react";
import {
  Input,
} from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Layout } from "../components/Layout/Layout";
import { InputEmail } from "../components/Inputs/InputEmail";
import { InputName } from "../components/Inputs/InputName";
import { Button } from "@/components/ui/button";
import { LottieSpinner } from "../components/LottieSpinner";
import { toast } from "sonner";
import { parseError } from "@/utils/parseError";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MapPin, Upload, X } from "lucide-react";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { checkEmailAvailable } from "../api/authAPI";
import { preRegisterAPI } from "@/api/preRegistrationAPI";
import { requirementsUpload } from "../api/imageUpload";
import LocationModal from "./LocationModal";
import { reverseGeocode } from "../api/geocodeAPI"; 

const validationSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("Email is required"),
  facility_name: yup.string().required("Facility name is required"),
  province: yup.string().required("Province is required"),
  city: yup.string().required("City is required"),
  barangay: yup.string().required("Barangay is required"),
  street: yup.string().required("Street is required"),
  latitude: yup.number().required("Please select your location"),
  longitude: yup.number().required("Please select your location"),
});

export const PreRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [submissionAttempt, setSubmissionAttempt] = useState(false);
  const [files, setFiles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);

  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [barangay, setBarangay] = useState("");
  const [street, setStreet] = useState("");

  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Update form fields when location changes
  useEffect(() => {
    if (location) {
      setValue("latitude", location.lat);
      setValue("longitude", location.lng);

      (async () => {
        const address = await reverseGeocode(location.lat, location.lng);
        if (address) {
          setProvince(address.province || "");
          setCity(address.city || "");
          setBarangay(address.barangay || "");
          setStreet(address.street || "");

          setValue("province", address.province || "");
          setValue("city", address.city || "");
          setValue("barangay", address.barangay || "");
          setValue("street", address.street || "");
        }
      })();
    }
  }, [location, setValue]);

  const preRegistrationForm = async (data) => {
    setSubmissionAttempt(true);

    if (files.length < 2) {
      toast.error("Please upload 2 files (Valid ID and Selfie with ID)");
      return;
    }

    const {
      email,
      facility_name,
      latitude,
      longitude,
      province,
      city,
      barangay,
      street,
    } = data;

    const provider_type = "boarding";

    // Check email availability
    const checkEmail = await checkEmailAvailable(email);
    if (checkEmail) {
      toast.warning("Email is already in use");
      return;
    }

    setLoading(true);
    try {
      // ✅ Wrap location fields in location_data
      const result = await preRegisterAPI(
      email, 
      facility_name, 
      provider_type,      
      latitude,
      longitude,
      province,
      city,
      barangay,
      street,);

      const application_id = result.application_id;

      // Upload documents
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("application", application_id);
        formData.append(
          "document_type",
          i === 0 ? "valid_id" : "selfie_with_id"
        );
        formData.append("image", files[i]);
        await requirementsUpload(formData);
      }

      toast.success(result.message);
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      let selected = Array.from(e.target.files);

      selected = selected.filter((file) => {
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validTypes.includes(file.type)) {
          toast.error(`${file.name} is not a valid image (jpeg/png only).`);
          return false;
        }
        return true;
      });

      if (files.length + selected.length > 2) return;

      setFiles((prev) => [...prev, ...selected]);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Layout>
      <div className="w-[65rem] flex flex-col items-center justify-center p-7 border-1 rounded-2xl bg-white/90 shadow">
        <div className="flex w-full h-fit justify-start items-start flex-col">
          <button
            onClick={() => navigate("/", { replace: true })}
            className="flex flex-row hover:bg-gray-200/55 pr-2 rounded-sm cursor-pointer"
          >
            <FiChevronLeft size={25} />
            Back to Login
          </button>
          <h1 className="text-[2rem] font-open-sans font-semibold">
            Pre-Registration
          </h1>
        </div>

        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 flex-col">
            <LottieSpinner size={120} />
            <p className="text-xl font-Fugaz">Loading...</p>
          </div>
        )}

        <div className="flex-1 w-full h-full">
          <form
            className="flex flex-col"
            onSubmit={handleSubmit(preRegistrationForm)}
          >
            <div className="flex flex-row gap-6">
              {/* Column 1 */}
              <div className="flex-1 border-t-2 border-gray-400 py-2">
                <div className="mb-2 grid grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="flex-1 flex-col">
                    <Label htmlFor="email" className="text-black block mb-2">
                      Email
                    </Label>
                    <InputEmail
                      id="email"
                      name="email"
                      placeholder="sample@mail.com"
                      register={register}
                      errors={errors.email}
                    />
                  </div>

                  {/* Facility Name */}
                  <div className="flex-1 flex-col">
                    <Label
                      htmlFor="facility_name"
                      className="text-black block mb-2"
                    >
                      Facility Name
                    </Label>
                    <InputName
                      id="facility_name"
                      name="facility_name"
                      placeholder="Hotel name"
                      register={register}
                      errors={errors.facility_name}
                    />
                  </div>

                  {/* Province */}
                  <div className="flex-1 flex-col">
                    <Label htmlFor="province" className="text-black block mb-2">
                      Province
                    </Label>
                    <Input
                      id="province"
                      type="text"
                      {...register("province")}
                      value={province}
                      readOnly
                      className="w-full border border-black rounded-md h-9 px-3"
                    />
                  </div>

                  {/* City */}
                  <div className="flex-1 flex-col">
                    <Label htmlFor="city" className="text-black block mb-2">
                      City
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      {...register("city")}
                      value={city}
                      readOnly
                      className="w-full border border-black rounded-md h-9 px-3"
                    />
                  </div>

                  {/* Barangay */}
                  <div className="flex-1 flex-col">
                    <Label htmlFor="barangay" className="text-black block mb-2">
                      Barangay
                    </Label>
                    <Input
                      id="barangay"
                      type="text"
                      {...register("barangay")}
                      value={barangay}
                      readOnly
                      className="w-full border border-black rounded-md h-9 px-3"
                    />
                  </div>

                  {/* Street (Editable) */}
                  <div className="flex-1 flex-col">
                    <Label htmlFor="street" className="text-black block mb-2">
                      Street
                    </Label>
                    <Input
                      id="street"
                      type="text"
                      {...register("street")}
                      value={street}
                      onChange={(e) => {
                        setStreet(e.target.value);
                        setValue("street", e.target.value); // ✅ keep RHF in sync
                      }}
                      className="w-full border border-black rounded-md h-9 px-3"
                    />
                  </div>

                  {/* Location */}
                  <div className="flex-1 flex-col">
                    <Label className="text-black block mb-2">
                      Pinpoint Location
                    </Label>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-[#adabab] flex flex-row justify-center items-center h-9 cursor-pointer"
                      type="button"
                      onClick={() => setModalVisible(true)}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      {location ? "Location Selected" : "Select Location"}
                    </Button>


                    {modalVisible && (
                      <LocationModal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        onSelectLocation={(loc) => setLocation(loc)}
                      />
                    )}
                  </div>

                  {/* Hidden fields */}
                  <input type="hidden" {...register("latitude")} />
                  <input type="hidden" {...register("longitude")} />
                </div>
              </div>

              {/* Column 2 (File Uploads) */}
              <div className="flex-1 border-t-2 border-gray-400 py-2">
                <div className="mb-4">
                  <h2 className="text-black block text-md font-semibold">
                    Upload Required Document
                  </h2>
                  <p className="text-[#757575] text-sm">
                    Upload 2 ID's (Valid ID and Selfie with ID)
                  </p>
                </div>

                <Label
                  htmlFor="upload"
                  className={`cursor-pointer border-2 border-dashed rounded-lg p-6 flex flex-col 
                    items-center justify-center text-center transition-colors h-36
                    ${
                      submissionAttempt && files.length < 2
                        ? "border-red-500"
                        : "border-[#E0E0E0] hover:border-[#4285F4]"
                    }`}
                >
                  {files.length < 2 && (
                    <>
                      <Upload className="h-8 w-8 text-[#9E9E9E] mb-2" />
                      <p className="text-sm text-[#757575]">Click to upload</p>
                    </>
                  )}

                  <Input
                    id="upload"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    className="hidden"
                    disabled={files.length >= 2}
                    onChange={handleFileChange}
                  />

                  {files.length > 0 && (
                    <ul className="mt-3 w-full text-sm text-gray-700 space-y-2">
                      {files.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between px-3 py-1 rounded-md"
                        >
                          <span className="truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-[#F44336] border text-[#F44336] hover:bg-[#FFEBEE] bg-transparent flex-row flex"
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemoveFile(index);
                            }}
                          >
                            <X className="h-5 w-5" />
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </Label>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="w-64 bg-blue-500 text-white p-5 rounded hover:bg-blue-600 transition duration-200 mt-2 text-lg cursor-pointer"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
