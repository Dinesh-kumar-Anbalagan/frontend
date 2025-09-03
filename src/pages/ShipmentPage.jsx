import { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { ShipmentAPI } from "../api";

export default function ShipmentPage() {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 

  const navigate = useNavigate();
  const location = useLocation();
  const customerId = location.state?.id;

  const [errors, setErrors] = useState({
  senderCompany: false,
  receiverCompany: false,
  senderCompanyName: false,
  receiverCompanyName: false,
  senderCompanyPostal: false,
  receiverCompanyPostal:false,
  senderCompanyCountry: false,
  receiverCompanyCountry: false,
  senderCompanyState: false,
  receiverCompanyState: false,
  senderCompanyCity: false,
  receiverCompanyCity: false,
  packageLength: false,
  packageWidth: false
});

  const [form, setForm] = useState({
    handlingUnit: {
      type: "Pallet",
      units: 1,
      stackable: "No",
      length: "",
      width: "",
      height: "",
      weight:"",
    },
    sender: {
      address: "",
      country: "",
      postalCode: "",
      county: "",
      locality: "",
    },
    receiver: {
      address: "",
      country: "",
      postalCode: "",
      county: "",
      locality: "",
    },
    shipmentDate: new Date().toISOString().split("T")[0],
    customerId : customerId
  });

  const handleGetQuote = async () => {
     setLoading(true);

    const isSenderCompanyNameValid = form.sender.address.trim() !== "";
    const isReceiverCompanyNameValid = form.receiver.address.trim() !== "";
    const isSenderCompanyPostalValid = form.sender.postalCode.trim() !== "";
    const isReceiverCompanyPostalValid = form.receiver.postalCode.trim() !== "";
    const isSenderCompanyCountryValid = form.sender.country.trim() !== "";
    const isReceiverCompanyCountryValid = form.receiver.country.trim() !== "";
    const isSenderCompanyStateValid = form.sender.county.trim() !== "";
    const isReceiverCompanyStateValid = form.receiver.county.trim() !== "";
    const isSenderCompanyCityValid = form.sender.locality.trim() !== "";
    const isReceiverCompanyCityValid = form.receiver.locality.trim() !== "";
    const isLength = form.handlingUnit.length.trim() !== "";
    const iswidth = form.handlingUnit.width.trim() !== "";
    const isweight = form.handlingUnit.weight.trim() !== "";

  setErrors({
    senderCompanyName: !isSenderCompanyNameValid,
    receiverCompanyName: !isReceiverCompanyNameValid,
    senderCompanyPostal: !isSenderCompanyPostalValid,
    receiverCompanyPostal: !isReceiverCompanyPostalValid,
    senderCompanyCountry: !isSenderCompanyCountryValid,
    receiverCompanyCountry: !isReceiverCompanyCountryValid,
    senderCompanyState: !isSenderCompanyStateValid,
    receiverCompanyState: !isReceiverCompanyStateValid,
    senderCompanyCity: !isSenderCompanyCityValid,
    receiverCompanyCity: !isReceiverCompanyCityValid,
    packageLength: !isLength,
    packageWidth: !iswidth,
    packageWeight: !isweight
  });

  if (!isSenderCompanyNameValid || !isReceiverCompanyNameValid ||
     !isSenderCompanyPostalValid || !isReceiverCompanyPostalValid ||
     !isSenderCompanyCountryValid || !isReceiverCompanyCountryValid ||
     !isSenderCompanyStateValid || !isReceiverCompanyStateValid ||
     !isSenderCompanyCityValid || !isReceiverCompanyCityValid ||
     !isLength || !iswidth || !isweight)  {
    return; 
  }
try {
        const request = form
        const res = await ShipmentAPI.getOffers({request});
        console.log(res.data?.offerList);
        const offerList = res.data?.offerList;
        navigate("/offers", { state: { offerList: offerList} });
      } catch (err) {
        alert("Something went wrong, Please Try Again!!");
      } finally {
        setLoading(false);
      }

    
  };

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

      {/* What are you shipping */}
      <div className="bg-white border rounded-md p-6 shadow-sm max-w-6xl mx-auto px-6 py-6 space-y-10">
        <h2 className="font-semibold text-lg mb-4">What are you shipping?</h2>

        {/* Handling Unit */}
        <div className="grid grid-cols-6 gap-4 mb-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium">
              Handling Unit Name
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Optional"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium">Type</label>
            <select className="select select-bordered w-full bg-white">
              <option>Pallet</option>
              <option>Box</option>
              <option>Crate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium"># of Units</label>
            <input
              type="number"
              defaultValue={1}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Stackable</label>
            <select className="select select-bordered w-full bg-white">
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium"> Size</label>
            <select className="select select-bordered w-full bg-white">
              <option>Optional</option>
              <option>48x40</option>
              <option>42x42</option>
            </select>
          </div>
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium">Length (in.)</label>
            <input
              type="number"
              className={`input input-bordered w-full ${
                !form.handlingUnit.length ? "border-red-500" : ""
              }`}
              placeholder="Required"
              value={form.handlingUnit.length}
              onChange={(e) =>{
                setForm({
                  ...form,
                  handlingUnit: {
                    ...form.handlingUnit,
                    length: e.target.value,
                  },
                });
                setErrors((prev) => ({ ...prev, packageLength: false }));
              }
            }
            />
            {errors.packageLength && (
              <p className="text-xs text-red-600 mt-1">Length is required.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Width (in.)</label>
            <input
              type="number"
              className={`input input-bordered w-full ${
                !form.handlingUnit.width ? "border-red-500" : ""
              }`}
              placeholder="Required"
              value={form.handlingUnit.width}
              onChange={(e) =>{
                setForm({
                  ...form,
                  handlingUnit: {
                    ...form.handlingUnit,
                    width: e.target.value,
                  },
                });
                setErrors((prev) => ({ ...prev, packageWidth: false }));
              }
            }
            />
            {errors.packageWidth && (
              <p className="text-xs text-red-600 mt-1">width is required.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Height (in.)</label>
            <input
              type="number"
              className="input input-bordered w-full"
              placeholder="Optional"
              value={form.handlingUnit.height}
              onChange={(e) =>
                setForm({
                  ...form,
                  handlingUnit: {
                    ...form.handlingUnit,
                    height: e.target.value,
                  },
                })
              }
              required
            />
          </div>
         <div>
            <label className="block text-sm font-medium">Weight (in.)</label>
            <input
              type="number"
              className={`input input-bordered w-full ${
                !form.handlingUnit.weight ? "border-red-500" : ""
              }`}
              placeholder="Required"
              value={form.handlingUnit.weight}
              onChange={(e) =>{
                setForm({
                  ...form,
                  handlingUnit: {
                    ...form.handlingUnit,
                    weight: e.target.value,
                  },
                });
                setErrors((prev) => ({ ...prev, packageWeight: false }));
              }
            }
            />
            {errors.packageWeight && (
              <p className="text-xs text-red-600 mt-1">Weight is required.</p>
            )}
          </div>
        </div>
      </div>

      {/* Where is your shipment going */}
      <div className="bg-white border rounded-md p-5 shadow-sm max-w-6xl mx-auto px-6 py-6 space-y-10">
        <h2 className="font-semibold text-lg mb-4">
          Where is your shipment going?
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Sender */}
          <div>
            <h3 className="font-medium mb-2">Sender</h3>
            <div>
            <input
              type="text"
              className="input input-bordered w-full mb-2"
              placeholder="Company or Name"
              onChange={(e) => {
              setForm({
                ...form,
                sender: {
                  ...form.sender,
                  address: e.target.value,
                },
              });
              setErrors((prev) => ({ ...prev, senderCompanyName: false }));
              }}
            />
            {errors.senderCompanyName && (
              <p className="text-xs text-red-600 mt-1">Company is required.</p>
            )}
            </div>
            <div >
              <input
                type="text"
                defaultValue="United Kingdom"
                className="input input-bordered w-full mb-2"
                placeholder="Country"
                value={form.sender.country}
              onChange={(e) => {
              setForm({
                ...form,
                sender: {
                  ...form.sender,
                  country: e.target.value,
                },
              });
              setErrors((prev) => ({ ...prev, senderCompanyCountry: false }));
              }}
            />
            {errors.senderCompanyCountry && (
              <p className="text-xs text-red-600 mt-1">Country is required.</p>
            )}
            </div>
            <div>
              <input
                type="text"
                className="input input-bordered w-full mb-2"
                placeholder="Postal Code"
                value={form.sender.postalCode}
             onChange={(e) => {
              setForm({
                ...form,
                sender: {
                  ...form.sender,
                  postalCode: e.target.value,
                },
              });
              setErrors((prev) => ({ ...prev, senderCompanyPostal: false }));
              }}
            />
            {errors.senderCompanyPostal && (
              <p className="text-xs text-red-600 mt-1">Postal code is required.</p>
            )}
            </div>
            <div>
             <input
                type="text"
                className="input input-bordered w-full mb-2"
                placeholder="State"
                value={form.sender.county}
             onChange={(e) => {
              setForm({
                ...form,
                sender: {
                  ...form.sender,
                  county: e.target.value,
                },
              });
              setErrors((prev) => ({ ...prev, senderCompanyState: false }));
              }}
            />
            {errors.senderCompanyState && (
              <p className="text-xs text-red-600 mt-1">State is required.</p>
            )}
            </div>
            <div>
            <input
              type="text"
               className="input input-bordered w-full mb-2"
              placeholder="City"
              value={form.sender.locality}
              onChange={(e) => {
              setForm({
                ...form,
                sender: {
                  ...form.sender,
                  locality: e.target.value,
                },
              });
              setErrors((prev) => ({ ...prev, senderCompanyCity: false }));
              }}
            />
            {errors.senderCompanyCity && (
              <p className="text-xs text-red-600 mt-1">City is required.</p>
            )}
            </div>
          </div>

          {/* Receiver */}
          <div>
            <h3 className="font-medium mb-2">Receiver</h3>
            <div>
            <input
              type="text"
              className="input input-bordered w-full mb-2"
              placeholder="Company or Name"
              value={form.receiver.address}
              onChange={(e) => {
              setForm({
                ...form,
                receiver: {
                  ...form.receiver,
                  address: e.target.value,
                },
              });
              setErrors((prev) => ({ ...prev, receiverCompanyName: false }));
              }}
            />
            {errors.receiverCompanyName && (
              <p className="text-xs text-red-600 mt-1"> company is required.</p>
            )}
            </div>
            <div >
              <input
                type="text"
                defaultValue="United Kingdom"
                className="input input-bordered w-full mb-2"
                placeholder="Country"
                value={form.receiver.country}
                onChange={(e) => {
              setForm({
                ...form,
                receiver: {
                  ...form.receiver,
                  country: e.target.value,
                },
              });
              setErrors((prev) => ({ ...prev, receiverCompanyCountry: false }));
              }}
            />
            {errors.receiverCompanyCountry && (
              <p className="text-xs text-red-600 mt-1"> Country is required.</p>
            )}
            </div>
            <div>
              <input
                type="text"
                className="input input-bordered w-full mb-2"
                placeholder="Postal Code"
                value={form.receiver.postalCode}
              onChange={(e) => {
              setForm({
                ...form,
                receiver: {
                  ...form.receiver,
                  postalCode: e.target.value,
                },
              });
              setErrors((prev) => ({ ...prev, receiverCompanyPostal: false }));
              }}
            />
            {errors.receiverCompanyPostal && (
              <p className="text-xs text-red-600 mt-1">Postal code is required.</p>
            )}
            </div>
            <div>
              <input
                type="text"
                className="input input-bordered w-full mb-2"
                placeholder="State"
                value={form.receiver.county}
              onChange={(e) => {
              setForm({
                ...form,
                receiver: {
                  ...form.receiver,
                  county: e.target.value,
                },
              });
              setErrors((prev) => ({ ...prev, receiverCompanyState: false }));
              }}
            />
            {errors.receiverCompanyState && (
              <p className="text-xs text-red-600 mt-1">State  is required.</p>
            )}
            </div>
            <div>
            <input
              type="text"
              className="input input-bordered w-full mb-2"
              placeholder="City"
              required
              value={form.receiver.locality}
             onChange={(e) => {
              setForm({
                ...form,
                receiver: {
                  ...form.receiver,
                  locality: e.target.value,
                },
              });
              setErrors((prev) => ({ ...prev, receiverCompanyState: false }));
              }}
            />
            {errors.receiverCompanyState && (
              <p className="text-xs text-red-600 mt-1">City is required.</p>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Get Quote Button */}
      <div className="max-w-6xl mx-auto flex justify-end -mt-4 ">
          <button
           onClick={handleGetQuote}
           className="bg-[#00A0DF] text-white px-6 py-2 rounded-md font-semibold shadow hover:bg-[#008AC0] transition">
            Get Quote
      </button>
      </div>

      <div className="max-w-6xl mx-auto flex justify-end -mt-4" ></div>
    </div>
  );
}
