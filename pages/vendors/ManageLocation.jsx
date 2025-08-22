"use client";
import React, { useEffect, useState } from "react";
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
  Pencil,
  Save,
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
  const managerId = session?.user?.id;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // ✅ Fetch vendorId + locations using managerId
  useEffect(() => {
    if (!managerId) return;

    const fetchVendorAndLocations = async () => {
      try {
        const res = await axios.get(
          `${BACKENDURL}/api/locations/manager/${managerId}`
        );
        setVendorId(res.data.vendor._id);
        setLocations(res.data.locations || []);
      } catch (err) {
        console.error("Failed to fetch vendor locations:", err);
      }
    };

    fetchVendorAndLocations();
  }, [managerId]);

  // Create new location
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !vendorId) {
      setMessage({ type: "error", text: "Missing vendor or token." });
      return;
    }

    try {
      const res = await axios.post(
        `${BACKENDURL}/api/createVendorLocation`,
        { vendorId, location, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: "success", text: "Location added successfully!" });
      setLocation("");
      setPrice("");
      setLocations((prev) => [...prev, res.data.location]);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to create location.",
      });
    }
  };

  // Start editing
  const startEditing = (loc) => {
    setEditingId(loc._id);
    setEditValues({ location: loc.location, price: loc.price });
  };

  // Save edit
  const saveEdit = async (id) => {
    try {
      // send as an array since backend expects { locations: [...] }
      const res = await axios.put(
        `${BACKENDURL}/api/locations/${managerId}`,
        { locations: [editValues] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      const updatedLoc = res.data.locations.find(
        (l) => l.location === editValues.location
      );

      setLocations((prev) =>
        prev.map((loc) => (loc._id === id ? updatedLoc : loc))
      );
      setEditingId(null);
      setMessage({ type: "success", text: "Location updated successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update location.",
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
              className="flex items-center gap-2 text-[#AE2108] hover:text-[#AE2108] font-semibold"
            >
              <LocationEditIcon size={18} />
              Locations
            </Link>
            <Link
              href="/manager/ManagerOrder"
              className="flex items-center gap-2 text-gray-700 hover:text-[#AE2108] font-semibold"
            >
              <UtensilsCrossed size={18} />
              Orders
            </Link>
            <Link
              href="/vendors/ManageProducts"
              className="flex items-center gap-2 text-gray-700 hover:text-[#AE2108] font-semibold"
            >
              <PackageOpen size={18} />
              Products
            </Link>
            <Link
              href="/manager/Profile"
              className="flex items-center gap-2 text-gray-700 hover:text-[#AE2108] font-semibold"
            >
              <Settings size={18} />
              Profile
            </Link>
          </nav>
        </div>

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
      <div className="flex-1 p-6 ml-0 overflow-y-auto bg-gray-50">
        <div className="max-w-3xl mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
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

          {/* Existing Locations */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Existing Locations
            </h2>
            {!vendorId ? (
              <p className="text-gray-500">Loading vendor...</p>
            ) : locations.length === 0 ? (
              <p className="text-gray-500">No locations yet.</p>
            ) : (
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-4 py-2 border">Location</th>
                    <th className="px-4 py-2 border">Price (₦)</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((loc) => (
                    <tr key={loc._id} className="border-t">
                      <td className="px-4 py-2 border">
                        {editingId === loc._id ? (
                          <input
                            type="text"
                            value={editValues.location}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                location: e.target.value,
                              }))
                            }
                            className="border px-2 py-1 rounded w-full"
                          />
                        ) : (
                          loc.location
                        )}
                      </td>
                      <td className="px-4 py-2 border">
                        {editingId === loc._id ? (
                          <input
                            type="number"
                            value={editValues.price}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                price: e.target.value,
                              }))
                            }
                            className="border px-2 py-1 rounded w-full"
                          />
                        ) : (
                          `₦${Number(loc.price).toLocaleString()}`
                        )}
                      </td>
                      <td className="px-4 py-2 border">
                        {editingId === loc._id ? (
                          <button
                            onClick={() => saveEdit(loc._id)}
                            className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            <Save size={14} /> Save
                          </button>
                        ) : (
                          <button
                            onClick={() => startEditing(loc)}
                            className="flex items-center gap-1 bg-[#AE2108] text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
