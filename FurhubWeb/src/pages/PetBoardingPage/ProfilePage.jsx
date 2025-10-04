import React, { useState, useEffect, useRef } from "react";
import { UserLayoutPage } from "../../components/Layout/UserLayoutPage";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PreviewDialog } from "../../components/Modals/PreviewDialog";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile } from "../../context/useProfile";
import { Eye, EyeOff } from "lucide-react";
import { userDetailsAPI } from "../../api/Users";
import { changePasswordAPI } from "@/api/authAPI";
import { uploadImageAPI } from "@/api/imageUpload";
import { LottieSpinner } from "@/components/LottieSpinner";
import { parseError } from "@/utils/parseError";
import { toast } from "sonner";
import { getInitials } from "@/utils/formatName";

const personalInfoSchema = yup.object().shape({
  first_name: yup.string().required(""),
  last_name: yup.string().required(""),
  phone_no: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^09[0-9]{9}$/,
      "Phone number must start with 09 and be 11 digits"
    ),
  email: yup.string().email().notRequired(),
});

const passwordSchema = yup.object().shape({
  old_password: yup.string().required(""),
  new_password: yup
    .string()
    .required("")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must have at least one uppercase letter")
    .matches(/[a-z]/, "Password must have at least one lowercase letter")
    .matches(/[0-9]/, "Password must have at least one number")
    .matches(
      /[!@#$%^&*]/,
      "Password must have at least one special character (!@#$%^&*)"
    ),
  confirm_password: yup
    .string()
    .required("")
    .oneOf([yup.ref("new_password")], "Passwords do not match"),
});

export const ProfilePage = () => {
  const { userDetails, profilePicture, refreshProfile } = useProfile();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register: registerPersonal,
    handleSubmit: handlePersonal,
    formState: { errors: personalErrors },
    watch: watchInfo,
    reset: resetInfo,
  } = useForm({
    resolver: yupResolver(personalInfoSchema),
    defaultValues: {
      first_name: userDetails?.first_name || "",
      last_name: userDetails?.last_name || "",
      phone_no: userDetails?.phone_no || "",
      email: userDetails?.email || "",
    },
    mode: "onChange",
  });

  // Watch all fields
  const personalValues = watchInfo();
  const isPersonalChanged =
    personalValues.first_name !== userDetails?.first_name ||
    personalValues.last_name !== userDetails?.last_name ||
    personalValues.phone_no !== userDetails?.phone_no;

  const {
    register: registerPassword,
    handleSubmit: handlePassword,
    control: controlPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch: watchPassword,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    mode: "onChange", // important: validate as user types
  });

  // Watch all password fields
  const oldPassword = watchPassword("old_password");
  const newPassword = watchPassword("new_password");
  const confirmPassword = watchPassword("confirm_password");

  // Button enabled only if all fields are filled
  const isPasswordFilled = oldPassword && newPassword && confirmPassword;

  const passwordValue = useWatch({
    control: controlPassword,
    name: "new_password",
  });

  const passwordChecks = [
    { label: "At least 8 characters long", test: (val) => val?.length >= 8 },
    {
      label: "Must include an uppercase letter (A-Z)",
      test: (val) => /[A-Z]/.test(val),
    },
    {
      label: "Must include a lowercase letter (a-z)",
      test: (val) => /[a-z]/.test(val),
    },
    { label: "Must include a number (0-9)", test: (val) => /[0-9]/.test(val) },
    {
      label: "Must include a special character (@$!%*?&)",
      test: (val) => /[@$!%*?&]/.test(val),
    },
  ];

  const personalForm = async (data) => {
    setLoading(true);
    try {
      await userDetailsAPI.updateUser(data);
      await refreshProfile();
      // modal message for successfull update
      toast.success("Update successfully");
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      setLoading(false);
    }
  };

  const passwordForm = async (data) => {
    setLoading(true);
    try {
      if (data.new_password !== data.confirm_password) {
        toast.error("New password and Confirm password does not match");
        setLoading(false);
      }
      await changePasswordAPI(data);
      resetPassword({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    //Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const isTypeValid =
      allowedTypes.includes(file.type) ||
      ["jpg", "jpeg", "png"].includes(fileExtension);

    if (!isTypeValid) {
      toast.error("Please select a valid image file (JPG, JPEG, or PNG)");
      e.target.value = ""; // Clear the input
      return;
    }

    // Validate file size (15MB = 15 * 1024 * 1024 bytes)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 15MB");
      e.target.value = ""; // Clear the input
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setOpen(true); // open preview dialog
  };

  const handleConfirm = async () => {
    if (!selectedFile) return;
    try {
      const profileImage = new FormData();
      profileImage.append("category", "profile_picture");
      // profileImage.append("label", "Profile Picture");
      profileImage.append("image", selectedFile);

      await uploadImageAPI(profileImage);
      await refreshProfile();
      toast.success("Image upload successfully");
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      setOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);

    // reset file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const name = `${userDetails?.first_name} ${userDetails?.last_name}`;

  useEffect(() => {
    if (userDetails) {
      resetInfo({
        first_name: userDetails.first_name || "",
        last_name: userDetails.last_name || "",
        phone_no: userDetails.phone_no || "",
        email: userDetails.email || "",
      });
    }
  }, [userDetails, resetInfo]);

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
          <h1 className="text-3xl font-bold text-[#212121]">Profile Page</h1>
          <p className="text-[#757575]">Manage your account information</p>
        </div>
      </div>
      <div className="max-w-4xl space-y-6">
        {/* Profile picture */}
        <Card className="border-[#E0E0E0]">
          <CardHeader>
            <CardTitle className="text-[#212121] text-2xl">
              Profile Picture
            </CardTitle>
            <CardDescription className="text-[#757575] text-md">
              Update your profile photo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profilePicture || ""} />
                  <AvatarFallback className="bg-[#4285F4] text-white text-2xl">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-2 mt-10">
                <Button
                  className="bg-[#4285F4] hover:bg-[#1976D2] text-white"
                  onClick={handleFileClick}>
                  Upload new photo
                </Button>
                <Input
                  id="picture"
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-[#9E9E9E]">
                  JPG, JPEG, PNG Max size 15MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <PreviewDialog
          open={open}
          setOpen={setOpen}
          previewURL={previewUrl}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#212121]">
              Personal Information
            </CardTitle>
            <CardDescription className="text-[#757575]">
              Update your personal details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePersonal(personalForm)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[#424242]">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    {...registerPersonal("first_name")}
                    autoCapitalize="characters"
                    autoComplete="off"
                    className={`bg-[#FAFAFA] ${
                      personalErrors.first_name
                        ? "border-red-400"
                        : "border-[#E0E0E0]"
                    } focus:border-[#4285F4] text-[#212121]`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[#424242]">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    {...registerPersonal("last_name")}
                    autoCapitalize="characters"
                    autoComplete="off"
                    className={`bg-[#FAFAFA] ${
                      personalErrors.last_name
                        ? "border-red-400"
                        : "border-[#E0E0E0]"
                    } focus:border-[#4285F4] text-[#212121]`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#424242]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  readOnly
                  {...registerPersonal("email")}
                  className="bg-[#FAFAFA] border-[#E0E0E0] focus:border-[#4285F4] text-[#212121]"
                />
              </div>

              <div className="space-y-2 h-20">
                <Label htmlFor="phone" className="text-[#424242]">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  autoCapitalize="characters"
                  autoComplete="off"
                  maxLength={11}
                  pattern="[0-9]*"
                  {...registerPersonal("phone_no")}
                  className={`bg-[#FAFAFA] ${
                    personalErrors.phone_no
                      ? "border-red-400"
                      : "border-[#E0E0E0]"
                  } focus:border-[#4285F4] text-[#212121]`}
                />
                {personalErrors.phone_no && (
                  <p className="text-red-500 text-sm">
                    {personalErrors.phone_no.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  className="bg-[#4285F4] hover:bg-[#1976D2] text-white"
                  type="submit"
                  disabled={!isPersonalChanged}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Section */}
        <Card className="border-[#E0E0E0]">
          <CardHeader>
            <CardTitle className="text-[#212121]">Change Password</CardTitle>
            <CardDescription className="text-[#757575]">
              Update your account password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePassword(passwordForm)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-[#424242]">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    maxLength={16}
                    {...registerPassword("old_password")}
                    type={showCurrentPassword ? "text" : "password"}
                    className="bg-[#FAFAFA] border-[#E0E0E0] focus:border-[#4285F4] text-[#212121] pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-[#616161] hover:bg-transparent"
                    tabIndex={-1}
                    onClick={() =>
                      setShowCurrentPassword(!showCurrentPassword)
                    }>
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-[#424242]">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    maxLength={16}
                    {...registerPassword("new_password")}
                    type={showNewPassword ? "text" : "password"}
                    className="bg-[#FAFAFA] border-[#E0E0E0] focus:border-[#4285F4] text-[#212121] pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-[#616161] hover:bg-transparent"
                    tabIndex={-1}
                    onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#424242]">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    maxLength={16}
                    {...registerPassword("confirm_password")}
                    type={showConfirmPassword ? "text" : "password"}
                    className={`bg-[#FAFAFA] ${
                      passwordErrors.confirm_password
                        ? "border-red-500"
                        : "border-[#E0E0E0]"
                    } focus:border-[#4285F4] text-[#212121] pr-10`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-[#616161] hover:bg-transparent"
                    tabIndex={-1}
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }>
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-[#E3F2FD] p-4 rounded-lg">
                <p className="text-sm text-[#1976D2] font-semibold">
                  Password requirements:
                </p>
                <ul className="text-sm mt-2 space-y-1">
                  {passwordChecks.map((check, idx) => {
                    const passed = check.test(passwordValue || "");
                    return (
                      <li
                        key={idx}
                        className={
                          passed ? "text-green-600" : "text-[#1976D2]"
                        }>
                        {passed ? "•" : "•"} {check.label}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  className="bg-[#4285F4] hover:bg-[#1976D2] text-white"
                  disabled={!isPasswordFilled}
                  type="submit">
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </UserLayoutPage>
  );
};
