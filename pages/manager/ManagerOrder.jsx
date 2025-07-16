"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import toast from "react-hot-toast";

export default function ManagerOrder() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  const router = useRouter();
  const BACKENDURL = "https://chowspace-backend.vercel.app";

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = session?.user?.accessToken;
        if (!token) return;

        const [ordersRes, disputesRes] = await Promise.all([
          axios.get(`${BACKENDURL}/api/manager/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BACKENDURL}/api/get-disputes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const filtered = (ordersRes.data.orders || []).filter(
          (order) =>
            new Date(order.createdAt).toISOString().slice(0, 10) === dateFilter
        );

        setOrders(filtered);
        setDisputes(disputesRes.data.disputes || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchData();
    }
  }, [status, session, dateFilter]);

  const handleResolveDispute = async (disputeId) => {
    try {
      const token = session?.user?.accessToken;
      await axios.put(
        `${BACKENDURL}/api/resolve-dispute/${disputeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Dispute marked as resolved");
      setDisputes((prev) => prev.filter((d) => d._id !== disputeId));
      setSelectedDispute(null);
    } catch (err) {
      toast.error("Failed to resolve dispute");
    }
  };

  const getPaymentStatusClasses = (paymentStatus) => {
    switch ((paymentStatus || "").toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
      case "unpaid":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  const getOrderDispute = (orderId) =>
    disputes.find((d) => d.order?._id === orderId);

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-white shadow transform transition-transform duration-300 ease-in-out flex flex-col justify-between
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div>
          <div className="hidden md:flex items-center justify-center py-4 border-b">
            <h1 className="text-xl font-bold text-[#AE2108]">Manager Panel</h1>
          </div>
          <nav className="mt-4 space-y-2 px-4">
            <Link
              href="/vendors/ManagerDashboard"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link
              href="/manager/ManagerOrder"
              className="flex items-center gap-3 px-3 py-2 text-[#AE2108] bg-gray-100 rounded font-semibold"
            >
              <UtensilsCrossed size={18} />
              Orders
            </Link>
            <Link
              href="/vendors/ManageProducts"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              <PackageOpen size={18} />
              Products
            </Link>
            <Link
              href="/manager/profile"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              <Settings size={18} />
              Profile
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={() => signOut({ callbackUrl: "/Login" })}
            className="flex items-center gap-2 text-red-600 hover:bg-red-100 px-3 py-2 rounded w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-[#AE2108] mb-4">
          Manage Orders
        </h1>
        {loading ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-sm bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Delivery</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Dispute</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const dispute = getOrderDispute(order._id);
                  return (
                    <tr key={order._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3">{order.guestInfo?.name}</td>
                      <td className="px-4 py-3">
                        {order.items
                          .map((i) => `${i.name} x${i.quantity}`)
                          .join(", ")}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <div>
                          <strong>Phone:</strong> {order.guestInfo?.phone}
                        </div>
                        <div>
                          <strong>Addr:</strong> {order.guestInfo?.address}
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusClasses(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus || "pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{order.status}</td>
                      <td className="px-4 py-3">
                        {dispute ? (
                          <button
                            onClick={() => setSelectedDispute(dispute)}
                            className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded"
                          >
                            View Dispute
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">None</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setSelectedDispute(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-bold text-[#AE2108] mb-3">
              Dispute Details
            </h2>
            <p className="mb-1">
              <strong>Order ID:</strong> #{selectedDispute.order?._id.slice(-6)}
            </p>
            <p className="mb-1">
              <strong>Reason:</strong> {selectedDispute.reason}
            </p>
            <p className="mb-4">
              <strong>Message:</strong>{" "}
              {selectedDispute.message || "No additional message"}
            </p>
            <button
              onClick={() => handleResolveDispute(selectedDispute._id)}
              className="mt-4 bg-[#AE2108] hover:bg-red-700 text-white px-4 py-2 rounded w-full"
            >
              Mark as Resolved
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
