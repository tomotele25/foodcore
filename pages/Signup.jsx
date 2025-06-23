"use client";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Signup = () => {
  const [activeTab, setActiveTab] = useState("vendor");
  const [loading, setLoading] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    location: "",
    address: "",
    image: null,
    category: "",
  });

  const isVendor = activeTab === "vendor";

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "confirmPassword" && !confirmTouched) {
      setConfirmTouched(true);
    }
  };

  const confirmMatch = formData.confirmPassword === formData.password;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreed) {
      toast.error("Please agree to the terms and conditions.");
      return;
    }

    if (!confirmMatch) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullname: formData.fullname,
        businessName: formData.businessName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
        address: formData.address,
        category: formData.category,
        image: "", // Optional for now, send empty or null
      };

      const response = await axios.post(
        "http://localhost:2005/api/auth/vendor/register",
        payload
      );

      toast.success("Vendor registered successfully!");

      setFormData({
        fullname: "",
        businessName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        location: "",
        address: "",
        image: null,
        category: "",
      });
      setAgreed(false);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Toaster position="top-right" />

      {/* Left */}
      <div className="md:w-1/2 h-64 md:h-screen relative">
        <Image
          src="/logo.jpg"
          alt="Signup Visual"
          fill
          className="object-cover"
        />
      </div>

      {/* Right */}
      <div className="md:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
            Create Your Account
          </h2>

          {/* Tabs */}
          <div className="flex mb-6 border-b">
            <button
              type="button"
              onClick={() => setActiveTab("customer")}
              className={`w-1/2 py-2 text-sm font-semibold ${
                activeTab === "customer"
                  ? "text-[#AE2108] border-b-2 border-[#AE2108]"
                  : "text-gray-500"
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("vendor")}
              className={`w-1/2 py-2 text-sm font-semibold ${
                activeTab === "vendor"
                  ? "text-[#AE2108] border-b-2 border-[#AE2108]"
                  : "text-gray-500"
              }`}
            >
              Vendor
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="fullname"
              type="text"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            {isVendor && (
              <>
                <input
                  name="businessName"
                  type="text"
                  placeholder="Business Name"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />

                <input
                  name="phoneNumber"
                  type="text"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />

                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Location</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Ibadan">Ibadan</option>
                </select>

                <input
                  name="address"
                  type="text"
                  placeholder="Address (Optional)"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />

                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg"
                />

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Food Category</option>
                  <option value="African Dishes">African Dishes</option>
                  <option value="Fast Food">Fast Food</option>
                </select>
              </>
            )}

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={() => setConfirmTouched(true)}
              required
              className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                confirmTouched
                  ? formData.confirmPassword === formData.password
                    ? "border-green-500 focus:ring-green-500"
                    : "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#AE2108]"
              }`}
            />

            <label className="flex items-center text-sm gap-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              I agree to the{" "}
              <span className="text-[#AE2108]">terms and conditions</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#AE2108] hover:bg-[#941B06]"
              }`}
            >
              {loading ? "Processing..." : "Register as Vendor"}
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Already have an account?{" "}
            <a href="/Login" className="text-[#AE2108] hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
