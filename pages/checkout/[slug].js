"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import PaystackPop from "@paystack/inline-js";

const formatCurrency = (amount) =>
  typeof amount === "number" ? amount.toLocaleString() : "0";

const Checkout = () => {
  const router = useRouter();
  const { slug } = router.query;

  const BACKENDURL = "http://localhost:2005";

  const { cart, addToCart, removeFromCart } = useCart();

  const [vendor, setVendor] = useState(null);
  const [locations, setLocations] = useState([]);
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: "",
    phone: "",
    address: "",
    location: "",
  });

  const [deliveryFee, setDeliveryFee] = useState(0);
  const packFee = 0;

  const cartItems = cart.flat();
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );
  const charges = Math.round(cartTotal * 0.05);
  const finalTotal = cartTotal + charges + deliveryFee + packFee;

  useEffect(() => {
    if (!slug) return;

    const fetchVendorAndLocations = async () => {
      try {
        const vendorRes = await axios.get(`${BACKENDURL}/api/vendor/${slug}`);
        const vendorData = vendorRes.data.vendor;
        setVendor(vendorData);

        const locRes = await axios.get(
          `${BACKENDURL}/api/locations/${vendorData._id}`
        );
        const formatted = locRes.data.map((loc) => ({
          name: loc.location,
          fee: loc.price,
        }));
        setLocations(formatted);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Could not load vendor or locations");
      }
    };

    fetchVendorAndLocations();
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
      toast.error("Fill in all delivery details");
      return;
    }

    if (!vendor?._id) {
      toast.error("Vendor not loaded.");
      return;
    }

    const txRef = `chow-${Date.now()}`;

    const paystack = new PaystackPop();

    paystack.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: `guest${Date.now()}@chowspace.com`,
      amount: finalTotal * 100,
      currency: "NGN",
      reference: txRef,
      metadata: {
        vendorId: vendor._id,
        guestInfo: { name, phone, address, location },
        items: cartItems.map((item) => ({
          menuItemId: item._id,
          name: item.productName,
          quantity: item.quantity,
          price: item.price,
        })),
        deliveryMethod: "delivery",
        note: "",
        totalAmount: finalTotal,
      },
      onSuccess: async (response) => {
        try {
          const verify = await axios.post(`${BACKENDURL}/api/verifyPayment`, {
            reference: response.reference,
          });

          if (verify.data.success) {
            toast.success("Payment successful!");
            router.push("/Payment-Redirect");
          } else {
            toast.error("Payment was made but order failed");
          }
        } catch (err) {
          console.error("Verify error:", err);
          toast.error("Failed to verify payment");
        }
      },
      onCancel: () => {
        toast("Transaction cancelled");
      },
    });
  };

  if (!vendor)
    return (
      <p className="text-center py-20 text-gray-700 font-semibold text-lg">
        Loading vendor info...
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 text-center sm:text-left">
        Checkout from{" "}
        <span className="text-[#AE2108]">{vendor.businessName}</span>
      </h1>

      {cart.length === 0 || cart.every((pack) => pack.length === 0) ? (
        <p className="text-center text-gray-500 py-10 text-lg">
          Your cart is empty.
        </p>
      ) : (
        cart.map((pack, packIndex) => (
          <div
            key={packIndex}
            className="mb-10 bg-white rounded-lg shadow-lg p-5"
          >
            <h2 className="font-semibold text-xl mb-5 text-[#AE2108]">
              Pack {packIndex + 1}
            </h2>
            <div className="space-y-4">
              {pack.map((item, itemIndex) => (
                <div
                  key={`${item._id}-${itemIndex}`}
                  className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 bg-gray-50 p-4 rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 relative rounded-lg overflow-hidden border border-gray-300 shadow-sm">
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
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ₦{formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <button
                      onClick={() => removeFromCart(item._id, packIndex)}
                      className="px-4 py-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                      aria-label="Remove one"
                    >
                      –
                    </button>
                    <span className="font-semibold text-lg">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(item, packIndex)}
                      className="px-4 py-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                      aria-label="Add one"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <section className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Delivery Details
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePay();
          }}
          className="space-y-6"
        >
          {["name", "phone", "address"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700 capitalize mb-1"
              >
                {field.replace(/^\w/, (c) => c.toUpperCase())}
              </label>
              <input
                id={field}
                type={field === "phone" ? "tel" : "text"}
                name={field}
                value={deliveryDetails[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#AE2108] focus:border-[#AE2108] transition"
                placeholder={`Enter your ${field}`}
                required
              />
            </div>
          ))}

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <select
              id="location"
              name="location"
              value={deliveryDetails.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#AE2108] focus:border-[#AE2108] transition"
              required
            >
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name} - ₦{formatCurrency(loc.fee)}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-8 border-t pt-6 space-y-3 text-gray-700 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₦{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Packing Fee</span>
              <span>₦{formatCurrency(packFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₦{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Charges (5%)</span>
              <span>₦{formatCurrency(charges)}</span>
            </div>

            <div className="flex justify-between text-lg font-semibold pt-4 border-t mt-3">
              <span>Total:</span>
              <span>₦{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 w-full bg-[#AE2108] hover:bg-[#941B06] transition text-white font-bold py-3 rounded-full shadow-lg text-lg"
          >
            Pay Now
          </button>
        </form>
      </section>
    </div>
  );
};

export default Checkout;
