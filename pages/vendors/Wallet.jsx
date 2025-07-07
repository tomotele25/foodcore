"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Menu,
  X,
  LayoutDashboard,
  PackageOpen,
  UtensilsCrossed,
  Wallet,
  User,
  Users,
  Settings,
  LogOut,
  ArrowDown,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/vendor/dashboard" },
  { name: "Orders", icon: PackageOpen, path: "/vendors/Orders" },
  { name: "Products", icon: UtensilsCrossed, path: "/vendors/ManageProducts" },
  { name: "Wallet", icon: Wallet, path: "/vendors/Wallet" },
  { name: "Profile", icon: User, path: "/vendors/Profile" },
  { name: "Manage Team", icon: Users, path: "/vendors/ManageTeam" },
  { name: "Settings", icon: Settings, path: "/vendor/settings" },
];

const BACKENDURL =
  "https://chowspace-backend.vercel.app" || "http://localhost:2006";

export default function VendorWalletPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/Login");
    }
  }, [status]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${BACKENDURL}/api/getAllOrders?vendorId=${session?.user?.vendorId}`
        );
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchOrders();
    }
  }, [session, status]);

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const recentTransactions = paidOrders.slice(0, 5).map((order) => ({
    id: order._id,
    amount: order.totalAmount,
    customer: order.guestInfo?.name || "Unknown customer",
    description: `Payment from ${order.guestInfo?.name || "someone"} for ${
      order.items?.length || 0
    } item${order.items?.length > 1 ? "s" : ""}`,
    date: new Date(order.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 w-64 bg-white shadow-md flex flex-col justify-between transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex flex-col flex-grow">
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <h1 className="text-xl font-bold text-[#AE2108]">Vendor Panel</h1>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden">
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
            onClick={() => signOut({ callbackUrl: "/Login" })}
            className="flex items-center gap-3 text-red-500 hover:bg-red-100 px-3 py-2 rounded-md w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
        <header className="flex items-center justify-between mb-6">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Wallet</h2>
        </header>

        {/* Wallet Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <p className="text-gray-500">Available Balance</p>
          <h3 className="text-4xl font-bold text-[#AE2108] mt-1">
            ₦{totalRevenue.toLocaleString()}
          </h3>
          <div className="mt-4 flex gap-4">
            <button className="px-4 py-2 bg-[#AE2108] text-white rounded-md hover:bg-[#951a06] transition">
              Withdraw
            </button>
            <button className="px-4 py-2 bg-white border border-[#AE2108] text-[#AE2108] rounded-md hover:bg-[#AE2108] hover:text-white transition">
              Fund Wallet
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">
            Recent Transactions
          </h4>
          {loading ? (
            <p className="text-gray-500">Loading transactions...</p>
          ) : recentTransactions.length === 0 ? (
            <p className="text-gray-500">No transactions yet.</p>
          ) : (
            <ul className="divide-y">
              {recentTransactions.map((txn) => (
                <li
                  key={txn.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {txn.description}
                    </p>
                    <p className="text-sm text-gray-500">{txn.date}</p>
                  </div>
                  <div className="text-lg font-bold text-green-600 flex items-center gap-1">
                    <ArrowDown size={18} />₦{txn.amount.toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
