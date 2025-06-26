"use client";

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
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";

export default function ManagerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const [orders, setOrders] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:2006/api/manager/orders",
          {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        );
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Failed to fetch manager orders:", err);
      }
    };

    if (session?.user?.accessToken) {
      fetchOrders();
    }
  }, [session]);

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
            onClick={() => signOut({ callbackUrl: "/Login" })}
            className="flex items-center gap-2 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-md shadow-md"
      >
        <Menu />
      </button>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-[#AE2108] mb-4">Manager</h1>
        <p className="text-gray-600 mb-6">
          This is your dashboard. You can manage orders, products, and your
          profile.
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded">
            <thead>
              <tr className="text-left bg-gray-100 border-b border-gray-300">
                <th className="p-3 text-sm font-semibold">Guest</th>
                <th className="p-3 text-sm font-semibold">Phone</th>
                <th className="p-3 text-sm font-semibold">Items</th>
                <th className="p-3 text-sm font-semibold">Total</th>
                <th className="p-3 text-sm font-semibold">Status</th>
                <th className="p-3 text-sm font-semibold">Toggle</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 text-sm">
                  <td className="p-3">{order.guestInfo?.name}</td>
                  <td className="p-3">{order.guestInfo?.phone}</td>
                  <td className="p-3">
                    <ul className="space-y-1">
                      {order.items?.map((item, i) => (
                        <li key={i}>
                          {item.name} x{item.quantity} - ₦{item.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3">₦{order.totalAmount}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        order.status === "pending"
                          ? "text-yellow-700 bg-yellow-100"
                          : "text-green-700 bg-green-100"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-100 text-sm">
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
