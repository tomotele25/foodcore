"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  PackageOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/vendor/dashboard" },
  { name: "Orders", icon: PackageOpen, path: "/vendors/Orders" },
  { name: "Products", icon: UtensilsCrossed, path: "/vendors/ManageProducts" },
  { name: "Profile", icon: User, path: "/vendors/Profile" },
  { name: "Manage Team", icon: Users, path: "/vendors/ManageTeam" },
  { name: "Settings", icon: Settings, path: "/vendor/settings" },
];

export default function VendorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/Login");
    }
  }, [status, router]);

  const logout = async (e) => {
    e.preventDefault();

    const toastId = toast.loading(
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-t-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>Logging out...</span>
      </div>,
      { position: "top-right", duration: Infinity }
    );

    try {
      await signOut({ redirect: false });
      toast.dismiss(toastId);
      toast.success("Logged out successfully", { position: "top-right" });
      router.push("/"); // redirect after logout
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to logout", { position: "top-right" });
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <div
          className={`fixed z-30 inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col justify-between ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <h1 className="text-xl font-bold text-[#AE2108]">Vendor Panel</h1>
              <button
                className="md:hidden text-gray-600"
                onClick={toggleSidebar}
                aria-label="Close sidebar"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="mt-4 space-y-1 px-4">
              {menuItems.map(({ name, icon: Icon, path }) => (
                <Link
                  key={name}
                  href={path}
                  className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                >
                  <Icon size={18} />
                  <span>{name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="px-4 mb-4">
            <button
              onClick={logout}
              className="flex items-center gap-3 text-red-500 hover:bg-red-100 px-3 py-2 rounded-md w-full"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-3 bg-white shadow-md sticky top-0 z-10">
            <button
              className="md:hidden text-gray-700"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
          </header>

          {/* Content */}
          <main className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-medium text-gray-700">Orders</h3>
                <p className="text-2xl font-bold text-[#AE2108] mt-2">120</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-medium text-gray-700">Revenue</h3>
                <p className="text-2xl font-bold text-[#AE2108] mt-2">
                  $12,500
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-medium text-gray-700">Ratings</h3>
                <p className="text-2xl font-bold text-[#AE2108] mt-2">4.8</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Recent Orders
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl overflow-hidden text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3">Order ID</th>
                      <th className="text-left px-4 py-3">Customer</th>
                      <th className="text-left px-4 py-3">Total</th>
                      <th className="text-left px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3">#ORD12345</td>
                      <td className="px-4 py-3">Jane Doe</td>
                      <td className="px-4 py-3">$45.00</td>
                      <td className="px-4 py-3 text-green-500 font-medium">
                        Delivered
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">#ORD12346</td>
                      <td className="px-4 py-3">John Smith</td>
                      <td className="px-4 py-3">$30.00</td>
                      <td className="px-4 py-3 text-yellow-500 font-medium">
                        Pending
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">#ORD12347</td>
                      <td className="px-4 py-3">Sarah Lee</td>
                      <td className="px-4 py-3">$80.00</td>
                      <td className="px-4 py-3 text-red-500 font-medium">
                        Cancelled
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
