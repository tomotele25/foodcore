"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/router";

const Checkout = () => {
  const router = useRouter();
  const { slug } = router.query;
  const BACKENDURL =
    "https://chowspace-backend.vercel.app" || "http://localhost:2006";
  const { cart, addToCart, removeFromCart } = useCart();
  const cartItems = Object.values(cart);

  const [vendor, setVendor] = useState(null);
  const [locations] = useState([
    { name: "Lekki", fee: 1000 },
    { name: "Ikeja", fee: 1500 },
    { name: "Ajah", fee: 2000 },
  ]);

  const [deliveryDetails, setDeliveryDetails] = useState({
    name: "",
    phone: "",
    address: "",
    location: "",
  });

  const [deliveryFee, setDeliveryFee] = useState(0);
  const packFee = 300;

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const charges = Math.round(cartTotal * 0.05);
  const finalTotal = cartTotal + charges + deliveryFee + packFee;

  useEffect(() => {
    if (!slug) return;
    const fetchVendor = async () => {
      try {
        const res = await axios.get(`${BACKENDURL}/api/vendor/${slug}`);
        setVendor(res.data.vendor);
      } catch (err) {
        console.error("Vendor fetch failed:", err);
        alert("Failed to load vendor.");
      }
    };
    fetchVendor();
  }, [slug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({ ...prev, [name]: value }));

    if (name === "location") {
      const found = locations.find((loc) => loc.name === value);
      setDeliveryFee(found?.fee || 0);
    }
  };

  const handlePay = async () => {
    const { name, phone, address, location } = deliveryDetails;

    if (!name || !phone || !address || !location) {
      alert("Please complete all delivery details.");
      return;
    }

    if (!vendor?._id) {
      alert("Vendor not loaded.");
      return;
    }

    const orderPayload = {
      vendorId: vendor._id,
      items: cartItems.map((item) => ({
        menuItemId: item._id,
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
      guestInfo: { name, phone, address },
      deliveryMethod: "delivery",
      note: "",
      totalAmount: finalTotal,
    };

    try {
      const response = await axios.post(
        "${BACKENDURL}/api/orders",
        orderPayload
      );
      alert("Order placed successfully!");
      console.log("Order:", response.data);
    } catch (error) {
      console.error("Order error:", error);
      alert(error?.response?.data?.message || "Order failed.");
    }
  };

  if (!vendor) {
    return <p className="text-center py-20">Loading vendor info...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Checkout from {vendor.businessName}
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between bg-white shadow rounded-lg p-4 mb-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 relative rounded overflow-hidden">
                <Image
                  src={
                    item.image?.startsWith("http")
                      ? item.image
                      : `${BACKENDURL}/uploads/${item.image}`
                  }
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="font-medium text-gray-800">
                  {item.productName}
                </h2>
                <p className="text-sm text-gray-500">
                  ₦{item.price.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => removeFromCart(item._id)}
                className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                -
              </button>
              <span className="font-medium">{item.quantity}</span>
              <button
                onClick={() => addToCart(item)}
                className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>
        ))
      )}

      {/* Delivery Form */}
      <div className="bg-white p-5 rounded-lg shadow mt-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Delivery Details
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={deliveryDetails.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={deliveryDetails.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm"
              placeholder="e.g. 08123456789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Delivery Address
            </label>
            <textarea
              name="address"
              value={deliveryDetails.address}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm"
              placeholder="Enter delivery address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <select
              name="location"
              value={deliveryDetails.location}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm"
            >
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name} - ₦{loc.fee}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="mt-8 border-t pt-4 space-y-2 text-gray-700 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₦{cartTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Packing Fee</span>
          <span>₦{packFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>₦{deliveryFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Charges (5%)</span>
          <span>₦{charges.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-base font-semibold pt-2 border-t mt-3">
          <span>Total:</span>
          <span>₦{finalTotal.toLocaleString()}</span>
        </div>

        <button
          onClick={handlePay}
          className="mt-6 w-full bg-[#AE2108] text-white py-3 rounded-full text-sm font-medium hover:bg-[#941B06] transition"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Checkout;
