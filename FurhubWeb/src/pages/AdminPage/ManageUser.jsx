import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Filter,
  MapPin,
  Eye,
  Check,
  X,
  Phone,
  Mail,
  Calendar,
  Loader2,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserLayoutPage } from "../../components/Layout/UserLayoutPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { fetchUsers } from "../../api/Users";
import {
  fetchPendingProvider,
  approveProviderApplication,
  rejectProviderApplication,
} from "../../api/preRegistrationAPI";
import { formatDateTime } from "@/utils/formatDateTime";
import { PaginationButton } from "@/components/Buttons/PaginationButton";
import { searchDebounce } from "../../utils/searchDebounce";
import { toast } from "sonner";
import { parseError } from "@/utils/parseError";
import { LottieSpinner } from "@/components/LottieSpinner";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Component to smoothly pan the map
const MapPanner = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

export const ManageUser = () => {
  const [page, setPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [filterProvider, setFilterProvider] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [documentView, setDocumentView] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const debounceSearch = searchDebounce(searchQuery, 300);

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // fetch only the first time page mounts
    refetchOnReconnect: false,
  });

  const {
    data: providerData,
    isLoading: isProviderLoading,
    isError: isProviderError,
  } = useQuery({
    queryKey: [
      "providerApplications",
      pendingPage,
      filterProvider,
      debounceSearch,
    ],
    queryFn: () =>
      fetchPendingProvider(
        pendingPage,
        "pending",
        filterProvider,
        debounceSearch
      ),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

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

  const handeView = (provider) => {
    setDocumentView(provider);
    setOpenDialog(true);
  };

  const approveProvider = async (providerId) => {
    setLoading(true);
    // Handle approval logic
    try {
      const result = await approveProviderApplication(providerId);
      toast.success(`${result.message} ${result.email_sent}`);
      queryClient.invalidateQueries(["providerApplications"]);
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      setLoading(false);
    }
  };

  const openRejectDialog = (providerId) => {
    setSelectedProvider(providerId);
    setRejectDialog(true);
  };

  const rejectProvider = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    try {
      const result = await rejectProviderApplication(
        selectedProvider,
        rejectReason
      );
      toast.success(result.message);
      setRejectDialog(false);
      setRejectReason("");
      // Refresh the data
      queryClient.invalidateQueries(["providerApplications"]);
    } catch (error) {
      toast.error(parseError(error));
    }
  };

  // modal for Image
  const CustomModal = () => {
    return (
      <>
        {/* Main Modal */}
        {openDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-full max-w-2xl h-2xl flex flex-col">
              {/* Header */}
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Supporting Documents</h2>
                <p className="text-[#757575]">
                  Application ID: {documentView.application_id}
                </p>
              </div>

              {/* Body */}
              <div className="flex flex-row justify-center gap-8 p-5 flex-1 overflow-auto">
                {/* Valid ID */}
                <div className="text-center">
                  <h3 className="font-medium mb-2">Valid ID</h3>
                  <div
                    className="w-64 h-64 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer"
                    onClick={() =>
                      setPreviewImage(
                        documentView?.documents.find(
                          (doc) => doc.document_type === "valid_id"
                        )?.image_url || null
                      )
                    }>
                    {documentView?.documents.find(
                      (doc) => doc.document_type === "valid_id"
                    )?.image_url ? (
                      <img
                        src={
                          documentView.documents.find(
                            (doc) => doc.document_type === "valid_id"
                          ).image_url
                        }
                        alt="Valid ID"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-500">No Valid ID uploaded</div>
                    )}
                  </div>
                </div>

                {/* Selfie with ID */}
                <div className="text-center">
                  <h3 className="font-medium mb-2">Selfie with ID</h3>
                  <div
                    className="w-64 h-64 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer"
                    onClick={() =>
                      setPreviewImage(
                        documentView?.documents.find(
                          (doc) => doc.document_type === "selfie_with_id"
                        )?.image_url || null
                      )
                    }>
                    {documentView?.documents.find(
                      (doc) => doc.document_type === "selfie_with_id"
                    )?.image_url ? (
                      <img
                        src={
                          documentView.documents.find(
                            (doc) => doc.document_type === "selfie_with_id"
                          ).image_url
                        }
                        alt="Selfie with ID"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-500">
                        No Selfie with ID uploaded
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="px-4 py-2 border rounded-md hover:border-gray-400 dark:hover:bg-neutral-800"
                  onClick={() => setOpenDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Image Preview Modal */}
        {previewImage && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80"
            onClick={() => setPreviewImage(null)} // close when clicking outside
          >
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-lg"
            />
          </div>
        )}
      </>
    );
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
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 flex-col">
          <LottieSpinner size={120} />
          <p className="text-xl font-Fugaz">Loading...</p>
        </div>
      )}
      <Tabs defaultValue="pendingProviders">
        {/* tabs button */}
        <div className="flex justify-between mb-4">
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
          <div>
            <TabsContent value="pendingProviders">
              <PaginationButton
                page={pendingPage}
                setPage={setPendingPage}
                data={Math.ceil(providerData?.count / 5)}
              />
            </TabsContent>
            <TabsContent value="users">
              <PaginationButton
                page={page}
                setPage={setPage}
                data={Math.ceil((userData?.count || 0) / 10)}
              />
            </TabsContent>
          </div>
        </div>

        {/* Pending Providers */}
        <TabsContent value="pendingProviders">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Provider List */}
            <div className="lg:col-span-2">
              <Card className="border-[#E0E0E0]">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
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
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPendingPage(1);
                          }}
                        />
                      </div>
                      <Select onValueChange={setFilterProvider}>
                        <SelectTrigger className="w-48 border-[#E0E0E0]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="boarding">Pet Boarding</SelectItem>
                          <SelectItem value="walker">Pet Walker</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isProviderLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
                    </div>
                  ) : isProviderError ? (
                    <div className="text-center py-4 text-red-500">
                      Error loading providers
                    </div>
                  ) : !providerData.results ||
                    providerData.results.length === 0 ? (
                    <div className="text-center py-4">
                      No pending providers found
                    </div>
                  ) : (
                    providerData.results.map((provider) => (
                      <div
                        key={provider.application_id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedProvider === provider.application_id
                            ? "border-[#4285F4] bg-[#E3F2FD]"
                            : "border-[#E0E0E0] hover:border-[#BDBDBD]"
                        }`}
                        onClick={() =>
                          setSelectedProvider(provider.application_id)
                        }>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <h3 className="font-medium text-[#212121]">
                                {provider.facility_name}
                              </h3>
                              <div>
                                <p className="text-sm text-[#757575]">
                                  Application ID: {provider.application_id}
                                </p>
                                <p className="text-sm text-[#757575]">
                                  {provider.provider_type_display}
                                </p>
                              </div>

                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1 text-sm text-[#757575]">
                                  <Mail className="h-4 w-4" />
                                  {provider.email}
                                </div>
                                {/* <div className="flex items-center gap-1 text-sm text-[#757575]">
                                  <Phone className="h-3 w-3" />
                                  {provider.phone} 09123123123
                                </div> */}

                                <div className="flex items-center gap-1 text-sm text-[#757575]">
                                  <MapPin className="h-4 w-4 text-[#757575]" />
                                  <span className="text-sm text-[#757575]">
                                    {[
                                      provider.street,
                                      provider.barangay,
                                      provider.city,
                                      provider.province,
                                    ]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(provider.status)}>
                            {provider.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-[#757575]" />
                            <span className="text-sm text-[#757575]">
                              Submitted: {formatDateTime(provider.applied_at)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#E0E0E0] text-[#424242] hover:bg-[#F5F5F5]"
                              onClick={() => handeView(provider)}>
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                            <Button
                              size="sm"
                              className="bg-[#4CAF50] hover:bg-[#388E3C] text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                approveProvider(provider.application_id);
                              }}>
                              <Check className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#F44336] text-[#F44336] hover:bg-[#FFEBEE] bg-transparent"
                              onClick={(e) => {
                                e.stopPropagation();
                                openRejectDialog(provider.application_id);
                              }}>
                              <X className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Image Modal */}
            {openDialog && <CustomModal />}

            {/* reject Modal */}
            <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Application</DialogTitle>
                  <DialogDescription>
                    Please provide a reason for rejecting this application. This
                    will be sent to the applicant.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter rejection reason..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={4}
                  />
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setRejectDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={rejectProvider}
                    disabled={!rejectReason.trim()}>
                    Confirm Reject
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Map for Selected Provider */}
            <div className="lg:col-span-1">
              {selectedProvider &&
                (() => {
                  const provider = providerData?.results?.find(
                    (p) => p.application_id === selectedProvider
                  );
                  if (!provider?.latitude || !provider?.longitude)
                    return (
                      <div className="h-64 flex items-center justify-center text-[#757575]">
                        No location available
                      </div>
                    );

                  return (
                    <Card className="border-[#E0E0E0]">
                      <CardHeader>
                        <CardTitle className="text-[#212121]">
                          {provider.facility_name} Location
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 w-full">
                          <MapContainer
                            center={[provider.latitude, provider.longitude]}
                            zoom={15}
                            scrollWheelZoom={false}
                            className="h-full w-full rounded-lg relative z-0">
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution="&copy; OpenStreetMap contributors"
                            />
                            <Marker
                              position={[
                                provider.latitude,
                                provider.longitude,
                              ]}>
                              <Popup>
                                {[
                                  provider.street,
                                  provider.barangay,
                                  provider.city,
                                  provider.province,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                                <br />
                                Lat: {provider.latitude}, Lng:{" "}
                                {provider.longitude}
                              </Popup>
                            </Marker>
                            <MapPanner
                              center={[provider.latitude, provider.longitude]}
                            />
                          </MapContainer>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()}
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
