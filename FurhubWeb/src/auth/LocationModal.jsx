import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LocationModal = ({ visible, onClose, onSelectLocation }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  if (!visible) return null;

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([10.3157, 123.8854], 13); // default Cebu

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const setMarker = (lat, lng) => {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
      }
      setCurrentLocation({ lat, lng });
    };

    // Detect user location
    map.locate({ setView: true, maxZoom: 16 });

    map.on("locationfound", function (e) {
      const { lat, lng } = e.latlng;
      setMarker(lat, lng);
    });

    map.on("locationerror", function () {
      console.warn("Could not detect location. Defaulting to Cebu.");
      setMarker(10.3157, 123.8854);
    });

    // Allow user to move marker manually
    map.on("click", function (e) {
      const { lat, lng } = e.latlng;
      setMarker(lat, lng);
    });

    return () => {
      map.remove();
    };
  }, [mapRef]);

  const handleConfirm = () => {
    if (currentLocation) {
      onSelectLocation(currentLocation);
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-[80%] h-[80%] relative flex flex-col p-4">
        {/* Map container */}
        <div
          ref={mapRef}
          className="flex-1 rounded-md"
          style={{ width: "100%", height: "100%" }}
        ></div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
