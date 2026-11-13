// TrackPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import { ShipmentAPI } from "../api";

const statusStyles = {
  Exception: "bg-orange-100 text-orange-600",
  Created: "bg-gray-100 text-gray-700",
  Delivered: "bg-green-100 text-green-700",
  "Pending Pickup": "bg-blue-100 text-blue-700",
  "Out for Delivery": "bg-blue-200 text-blue-800",
  Voided: "bg-red-100 text-red-600",
};

const TrackPage = () => {
  let user = null;

try {
  const stored = localStorage.getItem("user");
  user = stored ? JSON.parse(stored) : null;
  console.log(user);
} catch (error) {
  console.error("Failed to parse user from localStorage:", error);
  user = null;
}
  
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const customer = location.state?.userData;
 // Alice

  useEffect(() => {

    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchShipments = async () => {
      try {
        console.log(customer);
        const request = customer;
        const response = await ShipmentAPI.track({request})
        console.log(response.data?.shipmentESList);
         if (request) {
           setShipments(response.data?.shipmentESList||"");
          setLoading(false);
        } else {
          setError("No offers found.");
          setLoading(false);
        }
      } catch (err) {
       alert("Something went wrong, Please Try Again!!");
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
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
          <span className="text-sm font-normal">
            BY University Of Hertfordshire
          </span>
        </div>
        <div className="text-sm flex items-center space-x-3">
          <span className="text-lg">👤</span>
          <span className="font-medium">{user.firstName}</span>
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

      {/* Page Content */}
      <div className="max-w-8xl mx-auto px-6 space-y-4">
        <h1 className="text-4xl font-bold mb-4">Get Quote</h1>

        {/* Loading / Error */}
        {loading && <p className="text-gray-700">Loading data...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Table Card */}
        <div className="bg-white rounded-md shadow-sm p-4 overflow-auto space-y-4">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 text-gray-700 uppercase">
              <tr>
                <th className="p-2">Sender Company</th>
                <th className="p-2">Receiver Company</th>
                <th className="p-2">Carrier</th>
                <th className="p-2">Ship Date</th>
                <th className="p-2">Tracking</th>
                <th className="p-2">Estimated Delivery</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Sender Postal Code</th>
                <th className="p-2">Receiver Postal Code</th>
                <th className="p-2">Pickup Number</th>
                <th className="p-2">Status</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((row, index) => (
                <tr key={index} className={index % 2 === 1 ? "bg-blue-50" : ""}>
                  <td className="p-2">{row.senderCompany}</td>
                  <td className="p-2">{row.receiverCompany}</td>
                  <td className="p-2">{row.carrier}</td>
                  <td className="p-2">{row.shipDate}</td>
                  <td className="p-2">{row.tracking}</td>
                  <td className="p-2">{row.estimatedDelivery}</td>
                  <td className="p-2">{row.customerId}</td>
                  <td className="p-2">{row.senderPostalCode}</td>
                  <td className="p-2">{row.receiverPostalCode}</td>
                  <td className="p-2">{row.pickupNumber || "-"}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        statusStyles[row.status] || "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                 <td className="p-2">
                    <button
                      onClick={() => {
                        console.log(row);
                        navigate("/trackDetail", {
                          state: { row: row },
                        });
                      }}
                      className="text-blue-600 font-semibold cursor-pointer focus:outline-none hover:underline"
                    >
                      More
                    </button>
                  </td>
                </tr>
              ))}
              {shipments.length === 0 && !loading && (
                <tr>
                  <td colSpan="12" className="text-center p-4 text-gray-500">
                    No shipments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrackPage;
