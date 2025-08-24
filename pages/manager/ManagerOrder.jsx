"use client";

import { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  LayoutDashboard,
  PackageOpen,
  LogOut,
  Menu,
  X,
  UtensilsCrossed,
  Settings,
  LocationEditIcon,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ManagerOrder() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [newOrderIds, setNewOrderIds] = useState([]);
  const audioRef = useRef(null);
  const [dateFilter, setDateFilter] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  const router = useRouter();
  const BACKENDURL =
    "https://chowspace-backend.vercel.app" || "http://localhost:2006";

  useEffect(() => {
    if (status !== "authenticated") return;

    const interval = setInterval(async () => {
      try {
        const token = session?.user?.accessToken;
        if (!token) return;

        const [resOrders, resDisputes] = await Promise.all([
          axios.get(`${BACKENDURL}/api/manager/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BACKENDURL}/api/get-disputes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const filtered = (resOrders.data.orders || []).filter((order) => {
          const orderDate = new Date(order.createdAt)
            .toISOString()
            .slice(0, 10);
          return orderDate === dateFilter;
        });

        const newOnes = filtered.filter(
          (order) => !orders.find((o) => o._id === order._id)
        );

        if (newOnes.length > 0) {
          setNewOrderIds((prev) => [...prev, ...newOnes.map((o) => o._id)]);

          if (audioRef.current) {
            audioRef.current.muted = false;
            audioRef.current.volume = 1;
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((err) => {
              console.warn("Notification sound failed", err);
            });
          }

          toast.success("New order received!");
        }

        setOrders(filtered);
        setDisputes(resDisputes.data.disputes || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders or disputes");
      } finally {
        setLoading(false);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [status, session, dateFilter, orders]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    signOut({ callbackUrl: "/Login" });
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Mobile Topbar */}
      <div className="md:hidden flex justify-between items-center px-4 py-3 bg-white shadow z-30 w-full fixed top-0">
        <h1 className="text-xl font-bold text-[#AE2108]">Manager Panel</h1>
        <button onClick={toggleSidebar}>
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${
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
              className="flex items-center gap-2 text-gray-700 font-semibold hover:text-[#AE2108]"
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
              className="flex items-center gap-2 text-[#AE2108] font-semibold"
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
              href="/manager/Profile"
              className="flex items-center gap-2 text-gray-700 hover:text-[#AE2108]"
            >
              <Settings size={18} />
              Profile
            </Link>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg w-full transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-0 md:ml-64 p-6 overflow-auto">
        {/* Filters */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-[#AE2108]">Manage Orders</h1>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">Date:</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setLoading(true);
                  setDateFilter(e.target.value);
                }}
                className="border border-gray-300 px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#AE2108]/50"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#AE2108] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">
              Loading orders for {dateFilter || "today"}...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 font-medium">
              No orders found for {dateFilter}.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredOrders.map((order) => {
              const disp = disputes.find((d) => d.orderId === order._id);
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition border border-gray-100 flex flex-col overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-800">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                      {newOrderIds.includes(order._id) &&
                        order.status !== "completed" && (
                          <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                            NEW
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="flex flex-col gap-2 text-sm text-gray-700">
                    <span>
                      <strong>Customer:</strong>{" "}
                      {order.guestInfo?.name || order.customerId?.fullname}
                    </span>
                    <span>
                      <strong>Total:</strong> ₦{order.totalAmount}
                    </span>
                    <span>
                      <strong>Delivery:</strong> {order.deliveryMethod || "N/A"}
                    </span>
                    <span>
                      <strong>Phone:</strong> {order.guestInfo?.phone || "N/A"}
                    </span>
                    <span>
                      <strong>Address:</strong>{" "}
                      {order.guestInfo?.address || "N/A"}
                    </span>
                  </div>

                  {/* Items */}
                  <details className="mt-3 border-t pt-2 group">
                    <summary className="cursor-pointer font-medium text-gray-700 hover:text-[#AE2108]">
                      Items ({order.items?.length})
                    </summary>
                    <div className="mt-2 max-h-40 overflow-y-auto text-sm text-gray-600 space-y-1 transition-all duration-300">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between border-b py-1"
                        >
                          <span>{item.name}</span>
                          <span>x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </details>

                  {/* Dispute */}
                  <div className="mt-3">
                    {disp?.message ? (
                      <span className="inline-block bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">
                        Dispute: {disp.message}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">No dispute</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
