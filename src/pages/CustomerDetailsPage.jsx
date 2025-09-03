import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { getCustomerById } from "../api"; 
import { CustomerAPI } from '../api';

import { Pencil } from "lucide-react";

export default function CustomerDetailPage() {
  const location = useLocation();
  const userData = location.state?.userData;
  console.log(userData);

  const id  = userData.customerID;
  console.log(id);
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // track which field is being edited
  const [editField, setEditField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");

  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCustomer = async () => {
      try {
        const data = await getCustomerById(userData.customerID);
        console.log(userData);
        setCustomer(userData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id, navigate]);

  const handleShipment = () => {
    navigate("/shipment",{ state: { id : id }});
  };

  const handleTrack = () => {
    navigate("/track", { state: { userData: userData}});
  };

  // handle save on Enter
  const handleKeyDown = async (e, field) => {
    if (e.key === "Enter") {
      try {
       if (["address", "postalCode", "county", "country"].includes(field)) {
          const updatedAddress = {
          ...(customer.address || {}),  // fallback to {} if address is null
          [field]: fieldValue           // update only the changed field
        };
        customer.address = updatedAddress;
} else {
  customer[field] = fieldValue;
}
console.log(customer)
        const updated = await CustomerAPI.updateCustomerField(
          customer
        );
        console.log(updated);
        setCustomer(updated); // update UI
      } catch (error) {
        console.error("Update failed:", error);
      } finally {
        setEditField(null); // exit edit mode
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!customer) return <p>Customer not found</p>;

  const {
  customerID,
  accountNumber,
  firstName,
  lastName,
  phoneNumber,
  email,
  address: addressObj = {}
} = customer || {};

const {
  address = "",
  postalCode = "",
  county = "",
  country = ""
} = addressObj || {};

  const renderEditableField = (label, field, value) => (
    <div>
      <p className="font-semibold">{label}</p>
      {editField === field ? (
        <input
          type="text"
          className="border rounded px-2 py-1 w-full bg-white"
          value={fieldValue}
          autoFocus
          onChange={(e) => setFieldValue(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, field)}
          onBlur={() => setEditField(null)} // cancel edit on blur
        />
      ) : (
        <div className="flex items-center space-x-2">
          <p>{value}</p>
          <button
            onClick={() => {
              setEditField(field);
              setFieldValue(value);
            }}
            className="text-gray-500 hover:text-black"
          >
            <Pencil size={16} />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <div className="bg-[#00A0DF] text-white px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">
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

      {/* Title */}
      <div className="bg-white border-b px-6 pt-6">
        <h1 className="text-3xl font-bold mb-4">Customer Card</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Account Info */}
        <section className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Account Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-800">
            <div>
              <p className="font-semibold">Customer ID</p>
              <p>{customerID}</p>
            </div>
            <div>
              <p className="font-semibold">Account Number</p>
              <p>{accountNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Status</p>
              <p>Active</p>
            </div>
          </div>
        </section>

        {/* Contact Info with Editable Fields */}
        <section className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-800">
            {renderEditableField("First Name", "firstName", firstName)}
            {renderEditableField("Last Name", "lastName", lastName)}
            {renderEditableField("Phone Number", "phoneNumber", phoneNumber)}
            {renderEditableField("Email", "email", email)}
          </div>
          <br></br>

          <h2 className="text-xl font-bold mb-4">Address Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-800">
            {renderEditableField("Address Line", "address", address||"-")}
            {renderEditableField("Postal Code", "postalCode", postalCode || "-")}
            {renderEditableField("County", "county", county || "-")}
            {renderEditableField("Country", "country", country|| "-")}
          </div>
        </section>

        {/* Button Rack */}
        <div className="flex justify-end gap-4 pt-8 border-t">
          <button
            onClick={handleShipment}
            className="bg-[#00A0DF] text-white px-6 py-2 rounded-md font-semibold shadow hover:bg-[#008AC0] transition"
          >
            Create Shipment
          </button>
          <button
            onClick={handleTrack}
            className="bg-[#28C76F] text-white px-6 py-2 rounded-md font-semibold shadow hover:bg-[#20a65a] transition"
          >
            Track
          </button>
        </div>
      </div>
    </div>
  );
}
