import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ShipmentAPI } from "../api"; // Your API call
import LoadingSpinner from "../components/LoadingSpinner"; // Your spinner component

export default function OfferPage() {
  const { shipmentId } = useParams();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const location = useLocation();
  const request = location.state?.offerList;
  console.log(request);
  let user = null;
  try {
  const stored = localStorage.getItem("user");
  user = stored ? JSON.parse(stored) : null;
  console.log(user);
} catch (error) {
  console.error("Failed to parse user from localStorage:", error);
  user = null;
}
  useEffect(() => {
      const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

  if (request) {
    setOffers(request);
    setLoading(false);
  } else {
    setError("No offers found.");
    setLoading(false);
  }
}, [request]);

  if (error)
    return (
      <div className="p-8 max-w-4xl mx-auto text-center text-red-600 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 space-y-10">
      {/* Header */}
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

      {/* Heading + Offers Container */}
      <div className="max-w-8xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-4">Get Quote</h1>

        {offers.length === 0 ? (
          <p className="text-gray-500">No offers available for this shipment.</p>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-6 py-4"
              >
                {/* Left side */}
                <div className="flex items-center space-x-6">
                  {offer.logoUrl ? (
                    <img
                      src={offer.logoUrl}
                      alt={`${offer.carrier} logo`}
                      className="w-16 h-16 rounded-full border-2 border-[#d87f00]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full border-2 border-[#d87f00] bg-gray-200 flex items-center justify-center text-lg font-bold text-[#d87f00]">
                      {offer.vendorName?.[0] || "?"}
                    </div>
                  )}

                  <div>
                    <p className="font-bold text-2xl">{offer.vendorName}</p>

                    {offer.direct && (
                      <p className="text-xs font-semibold">Direct</p>
                    )}

                    {offer.warning && (
                      <div className="mt-1 inline-block bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded shadow-md max-w-max">
                        ⚠️ {offer.warning}
                      </div>
                    )}

                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-6 border-l border-gray-300 pl-6 min-w-[280px] text-xs font-bold text-center">
                  <div className="bg-blue-400 text-white px-4 py-2 rounded">
                    <p className="leading-none">{offer.estimateDelivery}</p>
                    <p className="text-lg font-extrabold">
                      ${offer.offerCost.toLocaleString()}
                    </p>
                  </div>

                  <div className="whitespace-nowrap">
                    {offer.guaranteed
                      ? "GUARANTEED"
                      : "GUARANTEED IS NOT AVAILABLE"}
                  </div>

                  <button
                    onClick={() =>{
                      const request = offer;
                      const res =  ShipmentAPI.confrimOffers({request});
                     navigate("/payment",{ state: { offer: offer }})}}
                    className="ml-4 bg-[#0076FF] hover:bg-[#005FCC] text-white px-4 py-2 rounded font-semibold"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
