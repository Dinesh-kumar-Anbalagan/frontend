import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CustomerDetailsPage from "./pages/CustomerDetailsPage";
import TrackDetailPage from "./pages/TrackDetailPage";
import ShipmentPage from "./pages/ShipmentPage";
import OfferPage from "./pages/OfferPage";
import PaymentPage from "./pages/PaymentPage";
import TrackPage from "./pages/TrackPage";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/customers"
        element={
          <PrivateRoute>
            <CustomerDetailsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/shipment"
        element={
          <PrivateRoute>
            <ShipmentPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/offers"
        element={
          <PrivateRoute>
            <OfferPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <PrivateRoute>
            <PaymentPage />
          </PrivateRoute>
        }
      />
      <Route
       path="/payment/:offerId" 
       element={
       <PrivateRoute>
        <PaymentPage />
        </PrivateRoute>} 
      />
      <Route
        path="/track"
        element={
          <PrivateRoute>
            <TrackPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/trackDetail"
        element={
          <PrivateRoute>
            <TrackDetailPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
