"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Menu,
  X,
  LayoutDashboard,
  LocationEditIcon,
  UtensilsCrossed,
  PackageOpen,
  Settings,
  LogOut,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Packaging() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [packName, setPackName] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState(null);

  const BACKENDURL =
    "http://localhost:2005" || "https://chowspace-backend.vercel.app";

  const { data: session } = useSession();
  const managerId = session?.user?._id || session?.user?.id;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!managerId) {
      setMessage({ type: "error", text: "Manager ID not found in session." });
      return;
    }

    try {
      const res = await axios.post(
        `${BACKENDURL}/api/managers/${managerId}/packs`,
        { name: packName, fee: Number(price) }
      );

      setMessage({
        type: "success",
        text: "Pack added successfully!",
      });
      setPackName("");
      setPrice("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to add pack.",
      });
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/Login" });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-lg flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div>
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-[#AE2108]">Manager Panel</h2>
            <button onClick={toggleSidebar} className="md:hidden">
              <X />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
            <Link
              href="/vendors/ManagerDashboard"
              className="flex items-center gap-2 text-gray-700 font-semibold"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link
              href="/vendors/ManageLocation"
              className="flex items-center gap-2 text-gray-700 hover:text-[#AE2108]"
            >
              <LocationEditIcon size={18} />
              Locations
            </Link>
            <Link
              href="/manager/ManagerOrder"
              className="flex items-center gap-2 text-gray-700 hover:text-[#AE2108]"
            >
              <UtensilsCrossed size={18} />
              Orders
            </Link>
            <Link
              href="/vendors/Packaging"
              className="flex items-center gap-2 text-[#AE2108] hover:text-[#AE2108]"
            >
              <PackageOpen size={18} />
              Packaging
            </Link>
            <Link
              href="/manager/Profile"
              className="flex items-center gap-2 text-gray-700 hover:text-[#AE2108]"
            >
              <Settings size={18} />
              Profile
            </Link>
          </nav>
        </div>

        {/* Logout Button Fixed Bottom */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64 bg-gray-50">
        {/* Top Navbar (with toggle button on mobile) */}
        <header className="flex items-center justify-between bg-white shadow px-4 py-3 md:py-4">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-700 rounded-lg md:hidden"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <h1 className="text-lg font-semibold">Packaging</h1>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-xl mx-auto mt-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Add Packaging Option
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
                    Pack Name
                  </label>
                  <input
                    type="text"
                    value={packName}
                    onChange={(e) => setPackName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#AE2108] focus:outline-none focus:border-[#AE2108]"
                    placeholder="e.g. Plastic Small"
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
                    placeholder="e.g. 500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#AE2108] text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                >
                  Save Pack
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
