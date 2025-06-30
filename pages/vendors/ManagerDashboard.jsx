"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  PackageOpen,
  Settings,
  LogOut,
  Menu,
  X,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ManagerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [vendorStatus, setVendorStatus] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const BACKENDURL =
    "https://chowspace-backend.vercel.app" || "http://localhost:2006";

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BACKENDURL}/api/manager/orders`, {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        });
        setOrders(res.data.orders);
      } catch {
        toast.error("Failed to load orders");
      }
    };

    const fetchVendorStatus = async () => {
      try {
        const res = await axios.get(`${BACKENDURL}/api/getManagerWithStatus`, {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        });
        const status = res.data?.managers?.[0]?.vendorStatus;
        if (status) setVendorStatus(status);
      } catch {
        toast.error("Failed to load store status");
      }
    };

    fetchOrders();
    fetchVendorStatus();
  }, [session, status]);

  const toggleStoreStatus = async () => {
    const newStatus = vendorStatus === "opened" ? "closed" : "opened";

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
      setVendorStatus(res.data.vendor?.status);
      toast.success(`Store is now ${res.data.vendor?.status}`);
    } catch {
      toast.error("Could not toggle store status");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/Login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
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
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link
              href="/manager/ManagerOrder"
              className="flex items-center gap-2 text-gray-700 hover:text-[#AE2108]"
            >
              <UtensilsCrossed size={18} />
              Orders
            </Link>
            <Link
              href="/vendors/ManageProducts"
              className="flex items-center gap-2 text-gray-700 hover:text-[#AE2108]"
            >
              <PackageOpen size={18} />
              Products
            </Link>
            <Link
              href="/manager/profile"
              className="flex items-center gap-2 text-gray-700 hover:text-[#AE2108]"
            >
              <Settings size={18} />
              Profile
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

      {/* Toggle button for mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-md shadow-md"
      >
        <Menu />
      </button>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-[#AE2108] mb-4">
          Manager Overview
        </h1>

        {/* Vendor status */}
        {vendorStatus && (
          <div className="flex items-center gap-4 mb-6">
            <p className="text-sm text-gray-600">
              Store status:{" "}
              <span
                className={`font-semibold capitalize ${
                  vendorStatus === "opened" ? "text-green-700" : "text-red-600"
                }`}
              >
                {vendorStatus}
              </span>
            </p>
            <button
              onClick={toggleStoreStatus}
              className={`px-4 py-2 text-sm text-white rounded-lg shadow transition ${
                vendorStatus === "opened"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {vendorStatus === "opened" ? "Close Store" : "Open Store"}
            </button>
          </div>
        )}

        {/* Overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-gray-600 text-sm mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-[#AE2108]">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-gray-600 text-sm mb-2">Recent Status</h3>
            <p className="text-md font-semibold capitalize">
              {orders[0]?.status || "No orders yet"}
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-bold mb-4 text-[#AE2108]">
            Recent Orders
          </h3>
          <ul className="divide-y divide-gray-200">
            {orders
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
              .map((order) => (
                <li key={order._id} className="py-3 text-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{order.guestInfo?.name}</p>
                      <p className="text-gray-500">
                        {order.items.length} items – ₦{order.totalAmount}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
          {orders.length === 0 && (
            <p className="text-gray-500 text-sm">No recent orders found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
