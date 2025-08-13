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
  Wallet,
  Rocket,
  Star,
  Bell,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Notification from "@/components/Notification";
const menuItems = [
  { name: "Orders", icon: PackageOpen, path: "/vendors/Orders" },
  { name: "Reviews", icon: Star, path: "/vendors/Reviews" },
  { name: "Products", icon: UtensilsCrossed, path: "/vendors/ManageProducts" },
  { name: "Wallet", icon: Wallet, path: "/vendors/Wallet" },
  { name: "Profile", icon: User, path: "/vendors/Profile" },
  { name: "Subscribe", icon: Rocket, path: "/vendors/Subscribe" },
  { name: "Announcement", icon: Bell, path: "/vendors/Announcement" },
  { name: "Manage Team", icon: Users, path: "/vendors/ManageTeam" },
  { name: "Settings", icon: Settings, path: "/Settings" },
];

const BACKENDURL = "http://localhost:2005";

export default function VendorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storeStatus, setStoreStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [vendorStatus, setVendorStatus] = useState("");
  useEffect(() => {
    if (status === "unauthenticated") router.push("/Login");
  }, [status]);

  const fetchStoreStatus = async () => {
    try {
      const res = await axios.get(
        `${BACKENDURL}/api/getVendorStatusById/${session?.user?.vendorId}`
      );
      setStoreStatus(res.data.status);
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };
  const toggleStoreStatus = async () => {
    const newStatus = storeStatus === "closed" ? "opened" : "closed";
    try {
      const res = await axios.put(
        `${BACKENDURL}/api/vendor/toggleStatus`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      setStoreStatus(res.data.vendor?.status);
      toast.success(`Store is now ${res.data.vendor?.status}`);
    } catch {
      toast.error("Could not toggle store status");
    }
  };
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${BACKENDURL}/api/getAllOrders?vendorId=${session?.user?.vendorId}`
      );
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchStoreStatus();
      fetchOrders();
    }
  }, [session, status]);

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      await signOut({ redirect: false });
      toast.dismiss(toastId);
      toast.success("Logged out");
      router.push("/");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Logout failed");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="h-screen flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed z-30 inset-y-0 left-0 w-64 bg-white shadow-md flex flex-col justify-between transform transition-transform duration-200 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0`}
        >
          <div className="flex flex-col flex-grow">
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <h1 className="text-xl font-bold text-[#AE2108]">Chowspace</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="mt-4 space-y-1 px-4 flex-1 overflow-auto">
              {menuItems.map(({ name, icon: Icon, path }) => (
                <Link
                  key={name}
                  href={path}
                  className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                >
                  <Icon size={18} />
                  {name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="px-4 py-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-red-500 hover:bg-red-100 px-3 py-2 rounded-md w-full"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto  p-4 bg-gray-100">
          <header className="flex items-center  justify-between mb-6">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
            <span>
              <Notification />
            </span>
          </header>

          {/* Store Status */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <p className="text-sm text-gray-600">
                Store status:{" "}
                <span
                  className={`font-semibold capitalize ${
                    storeStatus === "opened" ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {storeStatus}
                </span>
              </p>
              <button
                onClick={toggleStoreStatus}
                className={`px-4 py-2 text-sm text-white rounded-lg shadow transition ${
                  storeStatus === "opened"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {storeStatus === "opened" ? "Close Store" : "Open Store"}
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600">Orders</h3>
              <p className="text-2xl font-bold text-[#AE2108] mt-2">
                {loadingOrders ? "..." : orders.length}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600">Revenue</h3>
              <p className="text-2xl font-bold text-[#AE2108] mt-2">
                ₦
                {loadingOrders
                  ? "..."
                  : orders
                      .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
                      .toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600">Rating</h3>
              <p className="text-2xl font-bold text-[#AE2108] mt-2">4.8</p>
            </div>
          </div>

          {/* Orders Table */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Recent Orders
            </h3>
            <div className="overflow-x-auto rounded-xl shadow bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingOrders ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6">
                        Loading...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-6 text-gray-500"
                      >
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    orders.slice(0, 5).map((order) => (
                      <tr key={order._id} className="border-t">
                        <td className="px-4 py-3">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-4 py-3">
                          {order.guestInfo?.name}
                          <br />
                          {order.customerId?.fullname}
                        </td>
                        <td className="px-4 py-3">₦{order.totalAmount}</td>
                        <td
                          className={`px-4 py-3 font-medium ${
                            order.status === "completed"
                              ? "text-green-600"
                              : order.status === "cancelled"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {order.status || "Pending"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
