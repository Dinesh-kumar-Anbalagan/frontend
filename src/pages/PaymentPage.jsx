import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { ShipmentAPI } from '../api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51S2BvcJylH4Efa57VjNh6tCkq0liOBxBw6BM9VdKvgI9im9GV7LeoSmvZ2BkO6EfpTEyInv7GquQyRGjYZX5kUOw00NOI2ogUR');

// Replace with your Stripe public key

function StripePaymentForm({ amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleStripeSubmit = async (e) => {
    e.preventDefault();
    setMessage('Processing...');

    try {
      const res = await ShipmentAPI.pay( {request:{
        amount: amount,
        currency: 'GBP',
      }});

      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
       alert(result.error.message);
       alert('Payment failed.');
      } else if (result.paymentIntent.status === 'succeeded') {
        alert('Payment successful!');
        let offer = null;
        let user = null;
        let request = null;
        let reportrequest = null;
        try {
           const stored = localStorage.getItem("offer");
           offer = stored ? JSON.parse(stored) : null;
           offer.status = "Created";
           request = offer;
           reportrequest = {"shipmentId":request.shipmentId};
           const userstored = localStorage.getItem("user");
           user = userstored ? JSON.parse(userstored) : null;
          } catch (error) {
            console.error("Failed to parse user from localStorage:", error);
            user = null;
          }
        const res = await ShipmentAPI.offerUpdate({request});
        const res1 = await ShipmentAPI.reportLabel({request:{"shipmentId":request.shipmentId}});
        const  fileName  = res1.data.fileName;
        const base64String = res1.data.base64;

        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${base64String}`;
        link.download = filename;
        link.click();

        navigate("/track", { state: { userData: user}});
      }
    } catch (error) {
      alert("Something went wrong, Please Try Again!!");
      
    }
  };

  return (
    <form onSubmit={handleStripeSubmit}>
      <CardElement className="p-3 border border-gray-300 rounded mb-4 bg-white" />
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
        Pay ${amount}
      </button>
      {message && <p className="mt-2 text-red-600">{message}</p>}
    </form>
  );
}

export default function PaymentMethodsFullScreen() {
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
  const location = useLocation();
  const offer = location.state?.offer || {};
  const request = offer;
  localStorage.setItem("offer", JSON.stringify(offer));

  console.log(offer);

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
          HERTsShip <span className="text-sm font-normal">BY University Of Hertfordshire</span>
        </div>
        <div className="text-sm flex items-center space-x-3">
          <span className="text-lg">👤</span>
          <span className="font-medium">IT Admin</span>
          <button
            className="text-lg hover:opacity-80 transition"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            🚪
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-md p-6 shadow-sm max-w-xl mx-auto px-6 py-8 space-y-10">
        <h2 className="text-3xl font-semibold text-blue-600 mb-3">💳 Payment</h2>

        <div className="mb-6">
          <label className="block mb-2 font-semibold">Payment Method</label>
           <p className="p-3 border border-gray-300 rounded bg-white">Card</p>
        </div>
        
            <div className="mb-5">
              <label className="block font-semibold mb-2">Price</label>
              <p className="p-3 border border-gray-300 rounded bg-white">${offer.offerCost?.toLocaleString()}</p>
            </div>
            <Elements stripe={stripePromise}>
              <StripePaymentForm amount={offer.offerCost || 50} />
            </Elements>
      </div>
    </div>
  );
}
