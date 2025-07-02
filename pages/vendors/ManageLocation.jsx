"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  X,
  LayoutDashboard,
  LocationEditIcon,
  UtensilsCrossed,
  PackageOpen,
  Settings,
  LogOut,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function ManageLocation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState(null);
  const BACKENDURL =
    "https://chowspace-backend.vercel.app" || "http://localhost:2006";
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage({ type: "error", text: "Access token not found in session." });
      return;
    }

    try {
      const res = await axios.post(
        `${BACKENDURL}/api/createVendorLocation`,
        { location, price },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({
        type: "success",
        text: "Location added/updated successfully!",
      });
      setLocation("");
      setPrice("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to create location.",
      });
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/Login" });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md p-4 transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:inset-0`}
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#AE2108]">Manager Panel</h2>
            <button
              onClick={toggleSidebar}
              className="text-gray-500 md:hidden focus:outline-none"
            >
              <X />
            </button>
          </div>

          <nav className="space-y-4">
            <Link
              href="/vendors/ManagerDashboard"
              className="flex items-center gap-2 text-gray-700 hover:text-[#AE2108]"
            >
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link
              href="/vendors/ManageLocation"
              className="flex items-center gap-2 text-[#AE2108] font-semibold"
            >
              <LocationEditIcon size={18} /> Locations
            </Link>
            <Link
              href="/manager/ManagerOrder"
              className="flex items-center gap-2 text-gray-700 hover:text-[#AE2108]"
            >
              <UtensilsCrossed size={18} /> Orders
            </Link>
            <Link
              href="/vendors/ManageProducts"
              className="flex items-center gap-2 text-gray-700 hover:text-[#AE2108]"
            >
              <PackageOpen size={18} /> Products
            </Link>
            <Link
              href="/manager/profile"
              className="flex items-center gap-2 text-gray-700 hover:text-[#AE2108]"
            >
              <Settings size={18} /> Profile
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 ml-0 overflow-y-auto bg-gray-50">
        <div className="max-w-xl mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Add Delivery Location
            </h1>

            {message && (
              <div
                className={`mb-4 p-3 rounded ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#AE2108] focus:outline-none focus:border-[#AE2108]"
                  placeholder="e.g. Lagos"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Price (₦)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#AE2108] focus:outline-none focus:border-[#AE2108]"
                  placeholder="e.g. 2000"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#AE2108] text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
              >
                Save Location
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
