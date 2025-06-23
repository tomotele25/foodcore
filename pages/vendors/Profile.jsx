"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

const Profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/Login");
    }
  }, [status, router]);

  // State for form data and edit mode
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    businessName: "",
    phoneNumber: "",
    location: "",
    address: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState({ ...formData }); // for cancel revert

  useEffect(() => {
    if (session?.vendor) {
      const vendor = session.vendor;
      const userData = {
        fullname: vendor.fullname || "",
        email: vendor.email || "",
        businessName: vendor.businessName || "",
        phoneNumber: vendor.phoneNumber || "",
        location: vendor.location || "",
        address: vendor.address || "",
      };
      setFormData(userData);
      setTempData(userData);
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setTempData(formData); // revert changes
    setEditMode(false);
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    // For now, just update formData locally
    setFormData(tempData);
    setEditMode(false);

    alert("Profile saved! (Implement backend save here)");
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-md p-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/vendor/dashboard")}
        className="text-gray-600 mb-6 hover:text-[#AE2108] flex items-center gap-1 font-medium"
      >
        ← Back to Dashboard
      </button>

      {/* Profile Avatar */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-[#AE2108] flex items-center justify-center text-white text-4xl font-semibold uppercase shadow-md">
          {formData.fullname ? formData.fullname[0] : "V"}
        </div>
      </div>

      {/* User Name & Email */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {formData.fullname || "Vendor Name"}
        </h2>
        <p className="text-gray-500">{formData.email || "email@example.com"}</p>
      </div>

      {/* Profile Details or Edit Form */}
      {!editMode ? (
        <div className="space-y-4 text-gray-700">
          <div>
            <strong>Business Name:</strong> {formData.businessName || "-"}
          </div>
          <div>
            <strong>Phone Number:</strong> {formData.phoneNumber || "-"}
          </div>
          <div>
            <strong>Location:</strong> {formData.location || "-"}
          </div>
          <div>
            <strong>Address:</strong> {formData.address || "-"}
          </div>

          <button
            onClick={handleEditClick}
            className="mt-6 w-full py-3 bg-[#AE2108] text-white font-semibold rounded-md hover:bg-[#941B06] transition"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSaveClick} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              name="businessName"
              value={tempData.businessName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#AE2108] focus:border-[#AE2108]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={tempData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#AE2108] focus:border-[#AE2108]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={tempData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#AE2108] focus:border-[#AE2108]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={tempData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#AE2108] focus:border-[#AE2108]"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 py-3 bg-[#AE2108] text-white font-semibold rounded-md hover:bg-[#941B06] transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancelClick}
              className="flex-1 py-3 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Logout */}
      <button
        onClick={() => signOut({ callbackUrl: "/Login" })}
        className="mt-8 w-full py-3 text-[#AE2108] border border-[#AE2108] font-semibold rounded-md hover:bg-[#AE2108] hover:text-white transition"
      >
        Log Out
      </button>
    </div>
  );
};

export default Profile;
