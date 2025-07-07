import React, { useEffect, useState } from "react";
import { service_list } from "../api/service";
export const ModalService = ({ onClose, onAddService }) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [useCustomService, setUseCustomService] = useState(false);
  const [customService, setCustomService] = useState("");
  const [rate, setRate] = useState("");
  const [rateType, setRateType] = useState("hourly");

  useEffect(() => {
    // fetching data from backend
    const fetchService = async () => {
      try {
        const data = await service_list();
        setServices(data);
      } catch (error) {
        console.log("Error fetching services:", error);
      }
    };
    fetchService();
  }, []);

  const handleAdd = () => {
    const serviceName = useCustomService ? customService : selectedService;
    if (!serviceName || !rate) {
      console.log("please provide a service and rate");
      return;
    }

    const newService = {
      service: serviceName,
      rate: rate,
      rate_type: rateType,
    };

    onAddService(newService);
    onClose();
    // Reset fields
    setSelectedService("");
    setCustomService("");
    setRate("");
    setRateType("hourly");
    setUseCustomService(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[25rem]">
        <h2 className="text-xl font-bold mb-4">Add Service Offer</h2>
        <div>
          <label className="block mb-1">Select Service:</label>
          <select
            className="border p-2 rounded w-full"
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value);
              setUseCustomService(false);
            }}>
            <option value="">-- Select Service --</option>
            {services.map((s) => (
              <option key={s.id} value={s.service_name}>
                {s.service_name}
              </option>
            ))}
          </select>

          <div className="mt-3">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="mr-2"
                checked={useCustomService}
                onChange={() => {
                  setUseCustomService(true);
                  setSelectedService("");
                }}
              />
              Other (Specify your service)
            </label>
          </div>

          {useCustomService && (
            <div className="mt-2">
              <label className="block mb-1">Custom Service Name:</label>
              <input
                type="text"
                className="border p-2 rounded w-full"
                value={customService}
                onChange={(e) => {
                  setCustomService(e.target.value);
                  setSelectedService("");
                }}
              />
            </div>
          )}

          {(selectedService || (useCustomService && customService)) && (
            <>
              <div className="mt-2">
                <label className="block mb-1">Rate (PHP):</label>
                <input
                  type="number"
                  className="border p-2 rounded w-full"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
              </div>

              <div className="mt-2">
                <label className="block mb-1">Rate Type:</label>
                <select
                  className="border p-2 rounded w-full"
                  value={rateType}
                  onChange={(e) => setRateType(e.target.value)}>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
