export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );

    if (!response.ok) throw new Error("Failed to fetch location info");

    const data = await response.json();
    const address = data.address || {};

    // Province correction for Cebu area
    let province =
      address.province || address.state || address.region || "";

    if (
      (address.city && address.city.includes("Mandaue")) ||
      (address.city && address.city.includes("Cebu"))
    ) {
      province = "Cebu"; // override region with actual province
    }

    return {
      province,
      city:
        address.city ||
        address.town ||
        address.municipality ||
        address.village ||
        "",
      barangay:
        address.suburb ||
        address.barangay ||
        address.neighbourhood ||
        address.district ||
        "",
      street:
        address.road ||
        address.street ||
        address.highway ||
        address.residential ||
        "",
    };
  } catch (error) {
    console.error("Reverse geocode error:", error);
    return {
      province: "",
      city: "",
      barangay: "",
      street: "",
    };
  }
};
