import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { AuthAPI } from '../api';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const userData = await AuthAPI.login({email,password});
      console.log(userData.data)
      if (userData.data.accountNumber!=null) {
         localStorage.setItem("token", "fake-jwt-token");
         localStorage.setItem("user", JSON.stringify(userData.data));
         navigate("/customers", { state: { userData: userData.data }});
      } else {
       alert("InValid Cred, Please Try Again!!");
      }
    } catch (err) {
      alert("Something went wrong, Please Try Again!!");
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigate("/register");
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 mx-4 backdrop-blur-sm bg-opacity-80">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="src/assets/logo.png"
            alt="HertsShip Logo"
            className="h-10"
          />
        </div>

        <h2 className="text-xl font-semibold text-center mb-4">
          Welcome
        </h2>
        <p className="text-center text-gray-700 mb-6">
          Log in to HERTsShip
        </p>

        <input
          type="text"
          placeholder=" email address"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-black"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-black"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-200"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        {loading && (
          <div className="mt-4">
            <LoadingSpinner />
          </div>
        )}

        <p
          onClick={goToRegister}
          className="mt-6 text-center text-blue-600 cursor-pointer hover:underline"
        >
          New user? Register
        </p>
      </div>
    </div>
  );
}
