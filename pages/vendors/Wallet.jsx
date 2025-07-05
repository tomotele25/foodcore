"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  PackageOpen,
  UtensilsCrossed,
  Wallet,
  User,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/vendor/dashboard" },
  { name: "Orders", icon: PackageOpen, path: "/vendors/Orders" },
  { name: "Products", icon: UtensilsCrossed, path: "/vendors/ManageProducts" },
  { name: "Wallet", icon: Wallet, path: "/vendor/wallet" },
  { name: "Profile", icon: User, path: "/vendors/Profile" },
  { name: "Manage Team", icon: Users, path: "/vendors/ManageTeam" },
  { name: "Settings", icon: Settings, path: "/vendor/settings" },
];

export default function VendorWalletPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <button className="flex items-center gap-3 text-red-500 hover:bg-red-100 px-3 py-2 rounded-md w-full">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto ml-0 bg-gray-100 p-6">
        <header className="flex items-center justify-between mb-6">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Wallet</h2>
        </header>

        {/* Wallet Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <p className="text-gray-500">Available Balance</p>
          <h3 className="text-4xl font-bold text-[#AE2108] mt-1">₦54,200</h3>
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
          <ul className="divide-y">
            <li className="py-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">
                  Payment from customer
                </p>
                <p className="text-sm text-gray-500">2025-07-05</p>
              </div>
              <div className="text-lg font-bold text-green-600 flex items-center gap-1">
                <ArrowDown size={18} />
                ₦20,000
              </div>
            </li>
            <li className="py-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">Withdrawal</p>
                <p className="text-sm text-gray-500">2025-07-03</p>
              </div>
              <div className="text-lg font-bold text-red-600 flex items-center gap-1">
                <ArrowUp size={18} />
                ₦5,000
              </div>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
