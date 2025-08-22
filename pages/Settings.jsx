"use client";

import { useState } from "react";
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
  CircleQuestionMarkIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/vendors/Dashboard" },
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

const BACKENDURL =
  "https://chowspace-backend.vercel.app" || "http://localhost:2005";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function StoreHours() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storeHours, setStoreHours] = useState(
    weekdays.map((day) => ({ day, open: "09:00", close: "17:00" }))
  );
  const [mouseIsOver, setMouseIsOver] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  const handleTimeChange = (index, field, value) => {
    const updated = [...storeHours];
    updated[index][field] = value;
    setStoreHours(updated);
  };

  const saveStoreHours = async () => {
    try {
      await axios.put(
        `${BACKENDURL}/api/vendor/update-hours`,
        { openingHours: storeHours },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      toast.success("Store hours updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update store hours");
    }
  };

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
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <header className="flex items-center justify-between mb-6">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
          </header>

          <div className="grid gap-10">
            <div className="flex flex-col gap-5 relative bg-white p-6 rounded-2xl shadow-md">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Set Store Hours{" "}
                <CircleQuestionMarkIcon
                  onMouseEnter={() => setMouseIsOver(true)}
                  onMouseLeave={() => setMouseIsOver(false)}
                  className="cursor-pointer"
                />
              </h1>

              {mouseIsOver && (
                <div className="absolute sm:right-72 bg-slate-100 shadow p-2 top-12 rounded">
                  <p className="text-xs w-48 p-2 text-left capitalize">
                    Set opening and closing times for each day
                  </p>
                </div>
              )}

              <div className="grid gap-4 mt-4">
                {storeHours.map((dayObj, idx) => (
                  <div key={dayObj.day} className="flex items-center gap-2">
                    <span className="w-24 font-semibold">{dayObj.day}</span>
                    <input
                      type="time"
                      value={dayObj.open}
                      onChange={(e) =>
                        handleTimeChange(idx, "open", e.target.value)
                      }
                      className="border border-[#AE2108] px-2 py-1 rounded"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={dayObj.close}
                      onChange={(e) =>
                        handleTimeChange(idx, "close", e.target.value)
                      }
                      className="border border-[#AE2108] px-2 py-1 rounded"
                    />
                  </div>
                ))}
                <button
                  onClick={saveStoreHours}
                  className="px-5 py-2 mt-4 bg-[#AE2108] text-white rounded-md"
                >
                  Save Hours
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
