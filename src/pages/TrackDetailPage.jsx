import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShipmentAPI } from "../api";

function ShipmentDetail({ shipment }) {

  let user = null;
  try {
  const stored = localStorage.getItem("user");
  user = stored ? JSON.parse(stored) : null;
  console.log(user);
} catch (error) {
  console.error("Failed to parse user from localStorage:", error);
  user = null;
}

  const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  
  const navigate = useNavigate();

  console.log(shipment);

  if (!shipment || !shipment.progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Loading shipment details...</p>
      </div>
    );
  }

  const handlePayNow = () => {
    navigate('/payment', {
    state: {
      offer: {
        offerId: shipment.offerId,
        offerCost: shipment.cost,
        shipmentId:shipment.shipmentId
      }
    }
  });
  };

  const handlePrint = async () => {
    const res1 = await ShipmentAPI.printReport({request:{"shipmentId":shipment.shipmentId}});
            const  filename  = res1.data.filename;
            const base64String = res1.data.base64;
            const link = document.createElement("a");
            link.href = `data:application/pdf;base64,${base64String}`;
            link.download = filename;
            link.click();
  };

 shipment.progress = ["Yet to Pay", "Created", "In_Transit", " Out For Delivery", "Delivered"]
 const currentIndex = shipment.progress.indexOf(shipment.status);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header */}
      <div className="bg-[#00A0DF] text-white px-6 py-4 flex justify-between items-center">
        <div
          className="text-xl font-bold cursor-pointer"
          onClick={() => {
            navigate("/customers", {
              state: { userData: user },
            });
          }}
        >
          HERTsShip{" "}
          <span className="text-sm font-normal">BY University Of Hertfordshire</span>
        </div>
        <div className="text-sm flex items-center space-x-3">
          <span className="text-lg">👤</span>
          <span className="font-medium">IT Admin</span>
          <button
            className="text-lg hover:opacity-80 transition"
            title="Logout"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            🚪
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Track</h1>
        <p className="text-sm text-gray-500 mb-6">Updated</p>

        {/* Shipment Header */}
        <div className="bg-white border shadow-sm rounded-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            {shipment.shipperName} {shipment.trackingId}
          </h2>
          <p className="text-sm text-gray-500">
            PACKAGE {shipment.packageCount} OF {shipment.totalPackages}
          </p>
          <p className="text-sm text-gray-600">
            Tracking Number: <span className="font-medium">{shipment.trackingNumber}</span>
          </p>
          <a
            href={shipment.carrierTrackingUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 text-sm underline"
          >
            Track via {shipment.carrierName}.com
          </a>
          <p className="text-sm text-gray-600">PICKUP #: {shipment.pickupNo}</p>
        </div>

<div className="bg-white border shadow-sm rounded-md p-6 mb-6">
  <div className="relative flex justify-between items-center">
    {shipment.progress.map((step, index) => (
      <div key={index} className="flex flex-col items-center text-center w-24 relative">
        {/* Connector Line (except after last step) */}
        {index < shipment.progress.length - 1 && (
          <div
            className={`absolute top-4 left-full h-1 w-full ${
              index < currentIndex ? "bg-green-600" : "bg-gray-300"
            }`}
          ></div>
        )}

        {/* Step Circle */}
        <div
          className={`z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            index <= currentIndex
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          {index <= currentIndex ? "✓" : ""}
        </div>

        {/* Step Label */}
        <p
          className={`text-xs mt-2 ${
            index === currentIndex
              ? "text-green-600 font-semibold"
              : "text-gray-700"
          }`}
        >
          {step}
        </p>
      </div>
    ))}
  </div>
</div>

        {/* Address Details */}
        <div className="bg-white border shadow-sm rounded-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Address Details</h2>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="font-medium">Shipping From</p>
              <p>{shipment.from.address}</p>
              <p>
                {shipment.from.county}, {shipment.from.locality} {shipment.from.postalcode}
              </p>
              <p>{shipment.from.country}</p>
            </div>
            <div>
              <p className="font-medium">Shipping To</p>
              <p>{shipment.to.address}</p>
              <p>
                {shipment.to.county}, {shipment.to.locality} {shipment.to.postalcode}
              </p>
              <p>{shipment.to.country}</p>
            </div>
          </div>
        </div>

        {/* Carrier Details */}
        <div className="bg-white border shadow-sm rounded-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Carrier Details</h2>
          <div className="flex items-center gap-4">
            <img
              src={shipment.carrierLogo}
              alt="Carrier Logo"
              className="w-12 h-12 object-contain"
            />
            <div className="text-sm">
              <p className="font-medium">
                {shipment.carrierName}
              </p>
              <p>{shipment.serviceDays} Business Days</p>
              <p className="mt-2">Estimated Delivery: {shipment.estimatedDelivery}</p>
              <p>Zone: {shipment.to.address}</p>
              <p>Carrier Contact Number: {shipment.carrierContact}</p>
            </div>
          </div>
        </div>

        {/* Shipment Info */}
        <div className="bg-white border shadow-sm rounded-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Shipment Information</h2>
          <p className="text-sm">Package Count: {shipment.packageCount}</p>
          <p className="text-sm">Weight: {shipment.weight} lbs</p>
          <p className="text-sm">Price: {shipment.cost} lbs</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          {shipment.status === "Yet to Pay" && (
            <button
              onClick={handlePayNow}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
            >
              Pay Now
            </button>
          )}
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TrackDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const request = location.state?.row;

  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!request) {
      setError("Missing shipment data");
      setLoading(false);
      return;
    }

    const fetchShipment = async () => {
      try {
        const response = await ShipmentAPI.trackShipment({request});
        if (response?.data) {
          setShipment(response.data);
        } else {
          setError("Shipment not found.");
        }
      } catch (err) {
        alert("Something went wrong, Please Try Again!!");
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
  }, [request]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return <ShipmentDetail shipment={shipment} />;
}
