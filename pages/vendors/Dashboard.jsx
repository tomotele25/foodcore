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
import axios from "axios";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/vendor/dashboard" },
  { name: "Orders", icon: PackageOpen, path: "/vendors/Orders" },
  { name: "Products", icon: UtensilsCrossed, path: "/vendors/ManageProducts" },
  { name: "Profile", icon: User, path: "/vendors/Profile" },
  { name: "Manage Team", icon: Users, path: "/vendors/ManageTeam" },
  { name: "Settings", icon: Settings, path: "/vendor/settings" },
];
const BACKENDURL =
  "https://chowspace-backend.vercel.app" || "http://localhost:2006";
export default function VendorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const { data: session, status } = useSession();
  const router = useRouter();

  const [storeStatus, setStoreStatus] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/Login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.vendorId) return;

      try {
        const res = await axios.get(
          `${BACKENDURL}/api/getAllOrders?vendorId=${session.user.vendorId}`
        );
        setOrders(res.data.orders || []); // ✅ Fix: extract actual array
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (status === "authenticated") {
      fetchOrders();
    }
  }, [session, status]);

  const toggleStatus = async () => {
    const vendorId = session?.user.vendorId;
    if (!vendorId) return;

    const newStatus = storeStatus === "opened" ? "closed" : "opened";
    setLoadingStatus(true);
    try {
      const res = await axios.put(`${BACKENDURL}/api/vendor/toggleStatus`, {
        vendorId,
        status: newStatus,
      });
      setStoreStatus(res.data.vendor.status);
      toast.success(`Store is now ${res.data.vendor.status}`);
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error("Failed to update store status");
    } finally {
      setLoadingStatus(false);
    }
  };

  const logout = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging out...");
    try {
      await signOut({ redirect: false });
      toast.dismiss(toastId);
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`fixed z-30 inset-y-0 left-0 w-64 bg-white shadow-md transform transition-transform duration-200 ease-in-out flex flex-col justify-between md:relative md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <h1 className="text-xl font-bold text-[#AE2108]">Vendor Panel</h1>
              <button onClick={toggleSidebar} className="md:hidden">
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
          <div className="px-4 mb-4">
            <button
              onClick={logout}
              className="flex items-center gap-3 text-red-500 hover:bg-red-100 px-3 py-2 rounded-md w-full"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-between px-4 py-3 bg-white shadow-md sticky top-0 z-10">
            <button className="md:hidden" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
          </header>

          <main className="flex-1 p-4 md:p-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                    : Array.isArray(orders)
                    ? orders
                        .reduce(
                          (acc, order) => acc + (order.totalAmount || 0),
                          0
                        )
                        .toLocaleString()
                    : "0"}
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm">
                <h3 className="text-sm font-semibold text-gray-600">Ratings</h3>
                <p className="text-2xl font-bold text-[#AE2108] mt-2">4.8</p>
              </div>
            </div>

            {/* Store Status */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Store Availability
              </h3>
              <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between">
                <p className="text-gray-700">
                  Your store is currently{" "}
                  <span className="font-bold capitalize text-[#AE2108]">
                    {storeStatus}
                  </span>
                </p>
                <button
                  onClick={toggleStatus}
                  disabled={loadingStatus}
                  className={`px-4 py-2 rounded-lg font-medium text-white transition ${
                    storeStatus === "opened"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loadingStatus
                    ? "Updating..."
                    : storeStatus === "opened"
                    ? "Set to Closed"
                    : "Set to Opened"}
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Recent Orders
              </h3>
              <div className="overflow-x-auto rounded-xl shadow">
                <table className="min-w-full bg-white text-sm">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Order ID</th>
                      <th className="px-4 py-3 font-semibold">Customer</th>
                      <th className="px-4 py-3 font-semibold">Total</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingOrders ? (
                      <tr>
                        <td colSpan="4" className="text-center px-4 py-6">
                          Loading...
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center px-4 py-6 text-gray-500"
                        >
                          No recent orders
                        </td>
                      </tr>
                    ) : (
                      orders.slice(0, 5).map((order) => {
                        const status = (
                          order.status || "Pending"
                        ).toLowerCase();
                        const colorClass =
                          status === "completed"
                            ? "text-green-600"
                            : status === "cancelled"
                            ? "text-red-600"
                            : "text-yellow-600";

                        return (
                          <tr key={order._id} className="border-t">
                            <td className="px-4 py-3">
                              #{order._id.slice(-6).toUpperCase()}
                            </td>
                            <td className="px-4 py-3">
                              {order.guestInfo?.name || "Guest"}
                            </td>
                            <td className="px-4 py-3">₦{order.totalAmount}</td>
                            <td
                              className={`px-4 py-3 font-medium ${colorClass}`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </td>
                          </tr>
                        );
                      })
                    )}
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
