import React, { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/Input";
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

const validationSchema = yup.object().shape({
  email: yup.string().email("invalid email").required(""),
  facility_name: yup.string().required(""),
});

export const PreRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [submissionAttempt, setSubmissionAttempt] = useState(false);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  // const debounceCheckEmail = useCallback(
  //   debounce(async (emailToCheck) => {
  //     try {
  //       const isTaken = await checkEmailAvailable(emailToCheck);
  //       if (isTaken) {
  //         setEmailError("Email is already in use");
  //       } else {
  //         setEmailError("");
  //       }
  //     } catch (error) {
  //       console.log("unexpected Error occured");
  //     }
  //   }, 1000),
  //   []
  // );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const preRegistrationForm = async (data) => {
    setSubmissionAttempt(true);
    if (files.length < 2) {
      toast.error("Please upload 2 files (Valid ID and Selfie with ID)");
      return;
    }

    const { email, facility_name } = data;
    const provider_type = "boarding";
    const checkEmail = await checkEmailAvailable(email);
    if (checkEmail) {
      toast.warning("Email is already in use");
      return;
    }
    setLoading(true);
    try {
      const result = await preRegisterAPI(email, facility_name, provider_type);
      const application_id = result.application_id;

      // documents upload
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("application", application_id);
        formData.append(
          "document_type",
          i === 0 ? "valid_id" : "selfie_with_id" // just map index -> type
        );
        formData.append("image", files[i]);
        await requirementsUpload(formData);
      }

      toast.success(result.message);
      // toast.success("Application sent successfully");
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      let selected = Array.from(e.target.files);

      // Filter only jpg/jpeg/png
      selected = selected.filter((file) => {
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validTypes.includes(file.type)) {
          toast.error(`${file.name} is not a valid image (jpeg/png only).`);
          return false;
        }
        return true;
      });

      // Prevent more than 2
      if (files.length + selected.length > 2) {
        // alert("You can only upload up to 2 files.");
        return;
      }

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
            onClick={() => {
              navigate("/", { replace: true });
            }}
            className="flex flex-row hover:bg-gray-200/55 pr-2 rounded-sm cursor-pointer">
            <FiChevronLeft size={25} />
            Back to Login
          </button>
          <h1 className="text-[2rem] font-open-sans font-semibold">
            Pre-Registration
          </h1>
        </div>

        {/* Loading screen */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 flex-col">
            <LottieSpinner size={120} />
            <p className="text-xl font-Fugaz">Loading...</p>
          </div>
        )}
        {/* Pre Registration form */}
        <div className="flex-1 w-full h-full">
          <form
            className="flex flex-col"
            onSubmit={handleSubmit(preRegistrationForm)}>
            <div className="flex flex-row gap-6">
              {/* Column 1 */}
              <div className="flex-1 border-t-2 border-gray-400 py-2">
                <div className="mb-2 grid grid-cols-2 gap-4">
                  {/* email */}
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

                  {/* Facility name */}
                  <div className="flex-1 flex-col">
                    <Label
                      htmlFor="facility_name"
                      className="text-black block mb-2">
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
                    <Select>
                      <SelectTrigger className="w-full border border-black rounded-md h-9 px-3 py-2">
                        <SelectValue placeholder="Province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Cebu">Cebu</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* city */}
                  <div className="flex-1 flex-col">
                    <Label htmlFor="city" className="text-black block mb-2">
                      City
                    </Label>
                    <Select>
                      <SelectTrigger className="w-full border border-black rounded-md h-9 px-3 py-2">
                        <SelectValue placeholder="City" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Cebu">Cebu</SelectItem>
                          <SelectItem value="Mandaue">Mandaue</SelectItem>
                          <SelectItem value="Lapu-Lapu">Lapu-Lapu</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Street */}
                  <div className="flex-1 flex-col">
                    <Label htmlFor="city" className="text-black block mb-2">
                      Street Address
                    </Label>
                    <Input placeholder="street" className="border-black" />
                  </div>

                  {/* location to open map */}
                  <div className="flex-1 flex-col">
                    <Label className="text-black block mb-2">
                      Pinpoint Location
                    </Label>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-[#adabab] flex flex-row justify-center h-9 cursor-pointer"
                      type="button">
                      <MapPin className="h-4 w-4 mr-1" />
                      Location
                    </Button>
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="flex-1 border-t-2 border-gray-400 py-2">
                {/* Title */}
                <div className="mb-4">
                  <h2 className="text-black block text-md font-semibold">
                    Upload Required Document
                  </h2>
                  <p className="text-[#757575] text-sm">
                    Upload 2 ID's (Valid ID and Selfie with ID)
                  </p>
                </div>

                {/* Upload Area */}
                <Label
                  htmlFor="upload"
                  className={`cursor-pointer border-2 border-dashed rounded-lg p-6 flex flex-col 
                    items-center justify-center text-center transition-colors h-36
                    ${
                      submissionAttempt && files.length < 2
                        ? "border-red-500"
                        : "border-[#E0E0E0] hover:border-[#4285F4]"
                    }`}>
                  {/* Icon and text */}
                  {files.length < 2 && (
                    <>
                      <Upload className="h-8 w-8 text-[#9E9E9E] mb-2" />
                      <p className="text-sm text-[#757575]">Click to upload</p>
                    </>
                  )}

                  {/* Hidden input */}
                  <Input
                    id="upload"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    className="hidden"
                    disabled={files.length >= 2} // disable if already 2
                    onChange={handleFileChange}
                  />

                  {/* File names inside box */}
                  {files.length > 0 && (
                    <ul className="mt-3 w-full text-sm text-gray-700 space-y-2">
                      {files.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between px-3 py-1 rounded-md">
                          <span className="truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-[#F44336] border text-[#F44336] hover:bg-[#FFEBEE] bg-transparent flex-row flex"
                            onClick={(e) => {
                              e.preventDefault(); // prevent label click
                              handleRemoveFile(index);
                            }}>
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

            {/* Submit Button at the bottom */}
            <div className="mt-6 flex justify-center">
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="w-64  bg-blue-500 text-white p-5 rounded hover:bg-blue-600 transition duration-200 mt-2 text-lg cursor-pointer">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
