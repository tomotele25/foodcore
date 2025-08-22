"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";

const formatCurrency = (amount) =>
  typeof amount === "number" ? amount.toLocaleString() : "0";

const formatPhoneNumber = (number) => {
  let digits = number.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "234" + digits.slice(1);
  return digits;
};

const Checkout = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data: session } = useSession();
  const BACKENDURL =
    "https://chowspace-backend.vercel.app" || "http://localhost:2005";

  const { cart, addToCart, removeFromCart } = useCart();

  const [vendor, setVendor] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: "",
    phone: "",
    address: "",
    location: "",
    email: "",
  });

  const [deliveryFee, setDeliveryFee] = useState(0);
  const [cartPackFees, setCartPackFees] = useState([]);

  const cartItems = cart.flat();
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  let charges = vendor?.paymentPreference === "paystack" ? 200 : 50;
  const packFee = cartPackFees.reduce((sum, fee) => sum + (fee || 0), 0);
  const finalTotal = cartTotal + deliveryFee + packFee + charges;

  useEffect(() => {
    if (session?.user) {
      setDeliveryDetails((prev) => ({
        ...prev,
        name: session.user.fullname || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

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

  const handlePackChange = (packIndex, selectedType) => {
    const packOption = vendor.packOptions?.find((p) => p.type === selectedType);
    setCartPackFees((prev) => {
      const newFees = [...prev];
      newFees[packIndex] = packOption?.fee || 0;
      return newFees;
    });
  };

  const generateWhatsAppMessage = () => {
    const orderId = `CS-${Date.now().toString().slice(-6)}-${Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase()}`;

    let message = `🛒 *CHOWSPACE ORDER CONFIRMATION*\n\n`;
    message += `🆔 Order ID: ${orderId}\n`;
    message += `📦 Items:\n`;

    cart.forEach((pack, packIndex) => {
      message += `\n📦 Pack ${packIndex + 1}:\n`;
      pack.forEach((item) => {
        message += `• ${item.productName} x${item.quantity}\n`;
      });
    });

    message += `\n💰 Subtotal: ₦${formatCurrency(cartTotal)}\n`;
    message += `🚚 Delivery Fee: ₦${formatCurrency(deliveryFee)}\n`;
    message += `💵 Total: ₦${formatCurrency(finalTotal)}\n`;

    message += `\n👤 Customer Details:\n`;
    message += `• Name: ${deliveryDetails.name}\n`;
    message += `• Location: ${deliveryDetails.location}\n`;
    message += `• Address: ${deliveryDetails.address}\n`;
    message += `• Phone: ${deliveryDetails.phone}\n`;

    message += `\n📌 Thank you for ordering from CHOWSPACE!`;

    return encodeURIComponent(message);
  };

  const handlePay = async () => {
    if (loading) return;
    setLoading(true);

    const { name, phone, address, location, email } = deliveryDetails;
    if (!name || !phone || !address || !location) {
      toast.error("Fill in all delivery details");
      setLoading(false);
      return;
    }

    if (!vendor?._id) {
      toast.error("Vendor not loaded.");
      setLoading(false);
      return;
    }

    const txRef = `chowspace-${Date.now()}`;
    const guestEmail =
      session?.user?.email || email || `guest${Date.now()}@chowspace.com`;

    const orderPayload = {
      vendorId: vendor._id,
      items: cartItems.map((item) => ({
        menuItemId: item._id,
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
        logo: item.image,
      })),
      deliveryMethod: "delivery",
      note: "",
      packFees: cartPackFees,
      totalAmount: finalTotal,
      paymentRef: txRef,
      paymentMethod:
        vendor.paymentPreference === "direct" ? "direct" : "online",
      paymentStatus: vendor.paymentPreference === "direct" ? "pending" : "paid",
    };

    if (session?.user?.id) orderPayload.customerId = session.user.id;
    else orderPayload.guestInfo = { name, email: guestEmail, phone, address };

    try {
      // If direct payment, open WhatsApp **first**
      if (vendor.paymentPreference === "direct") {
        const waLink = `https://wa.me/${formatPhoneNumber(
          vendor.contact
        )}?text=${generateWhatsAppMessage()}`;
        window.location.href = waLink;
      }

      // Create order in DB
      await axios.post(`${BACKENDURL}/api/orders`, orderPayload);

      // Online payment
      if (vendor.paymentPreference !== "direct") {
        const res = await axios.post(`${BACKENDURL}/api/init-payment`, {
          amount: finalTotal,
          email: guestEmail,
          vendorId: vendor._id,
          tx_ref: txRef,
          orderPayload,
        });

        if (res.data.success && res.data.paymentLink) {
          localStorage.setItem("latestOrder", JSON.stringify(orderPayload));
          window.location.href = res.data.paymentLink;
        } else {
          toast.error("Payment initialization failed");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not process payment/order");
    } finally {
      setLoading(false);
    }
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
                        loading="lazy"
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
                    >
                      –
                    </button>
                    <span className="font-semibold text-lg">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(item, packIndex)}
                      className="px-4 py-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Packaging
              </label>
              <select
                value={
                  vendor.packOptions?.find(
                    (p) => p.fee === cartPackFees[packIndex]
                  )?.type || ""
                }
                onChange={(e) => handlePackChange(packIndex, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#AE2108] focus:border-[#AE2108] transition"
              >
                <option value="">Select Packaging</option>
                {vendor.packOptions?.map((opt) => (
                  <option key={opt.name} value={opt.name}>
                    {opt.name} - ₦{formatCurrency(opt.fee)}
                  </option>
                ))}
              </select>
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
          {["name", "phone", "address", "email"]
            .filter((field) => {
              if (!session) return true;
              return field === "phone" || field === "address";
            })
            .map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-700 capitalize mb-1"
                >
                  {field.replace(/^\w/, (c) => c.toUpperCase())}
                  {field === "email" && (
                    <span className="text-gray-400 text-sm"> (optional)</span>
                  )}
                </label>
                <input
                  id={field}
                  type={
                    field === "phone"
                      ? "tel"
                      : field === "email"
                      ? "email"
                      : "text"
                  }
                  name={field}
                  value={deliveryDetails[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#AE2108] focus:border-[#AE2108] transition"
                  placeholder={`Enter your ${field}`}
                  required={field !== "email"}
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
              <span>Service fee</span>
              <span>₦{formatCurrency(charges)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-4 border-t mt-3">
              <span>Total:</span>
              <span>₦{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-8 w-full font-bold py-3 rounded-full shadow-lg text-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : vendor?.paymentPreference === "direct"
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-[#AE2108] hover:bg-[#941B06] text-white"
            }`}
          >
            {loading
              ? "Processing..."
              : vendor?.paymentPreference === "direct"
              ? "Pay via WhatsApp"
              : "Pay Now"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Checkout;
