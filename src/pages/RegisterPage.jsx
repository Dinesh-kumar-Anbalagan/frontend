import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function RegisterPage() {
  const [details, setDetails] = useState({ firstName: "", lastName:"",phoneNumber:"", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await AuthAPI.register(details);
      setSuccess("Register Successfully");
      navigate("/login")
    } catch (err) {
      alert("Something went wrong, Please Try Again!!");
    } finally {
      setLoading(false);
    }
  };

  return (
     <div
      className="min-h-screen bg-center flex items-center justify-center"
      style={{
        backgroundColor: "#f0f0f0", // fallback background color
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-96">
        <div className="flex justify-center mb-4">
           <img
            src="src/assets/logo.png"
            alt="HertsShip Logo"
            className="h-10"
          />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center">Welcome</h1>
        <p className="text-center mb-6">Create your HertsShip account</p>

        <input
          type="text"
          placeholder="First Name"
          value={details.firstName}
          onChange={(e) => setDetails({ ...details, firstName: e.target.value })}
          className="w-full p-3  text-white border rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300 bg-black"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={details.lastName}
          onChange={(e) => setDetails({ ...details, lastName: e.target.value })}
          className="w-full p-3 border  text-white rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={details.phoneNumber}
          onChange={(e) => setDetails({ ...details, phoneNumber: e.target.value })}
          className="w-full p-3 border  text-white rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="email"
          placeholder="Email"
          value={details.email}
          onChange={(e) => setDetails({ ...details, email: e.target.value })}
          className="w-full p-3 border  text-white rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={details.password}
          onChange={(e) => setDetails({ ...details, password: e.target.value })}
          className="w-full p-3 border  text-white rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300"
        />

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

        {loading && (
          <div className="mt-4 flex justify-center">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
}
