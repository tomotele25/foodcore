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
  ArrowBigLeft,
  ArrowRightIcon,
  CircleQuestionMarkIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Notification from "@/components/Notification";
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
  "https://chowspace-backend.vercel.app" || "http://localhost:2006";

export default function VendorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storeStatus, setStoreStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

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

  useEffect(() => {
    if (status === "authenticated") {
      fetchStoreStatus();
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
            <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
          </header>

          <div className="grid gap-10  sm:flex justify-between px-10 ">
            <div className="flex items-center py-2 sm:py-5 gap-3 sm:gap-18 bg-white px-4 sm:px-16 shadow-2xs rounded-2xl">
              <span className="flex text-sm items-center ">
                <span>
                  <img src="/logo.jpg" height={100} width={100} alt="" />
                </span>
                <span className="grid">
                  <p className="text-nowrap">Tomotele Christopher</p>
                  <Link href="/vendors/Profile">
                    <p className="flex items-center gap-1">view profile</p>
                  </Link>
                </span>
              </span>
              <span>
                <ArrowRightIcon size={10} />
              </span>
            </div>
            <div className="flex flex-col gap-5 relative">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Set when store closes{" "}
                <CircleQuestionMarkIcon
                  onMouseEnter={() => {
                    setMouseIsOver(true);
                  }}
                  onMouseLeave={() => {
                    setMouseIsOver(false);
                  }}
                  className=" cursor-pointer "
                />
              </h1>
              {mouseIsOver && (
                <div className="absolute sm:right-72 bg-slate-100 shadow-2xl justify-items-start   top-10">
                  <p className="text-xs  w-32 p-2 text-left capitalize">
                    set when the store automatically closes
                  </p>
                </div>
              )}
              <div>
                <span className="grid">
                  <span className="gap-2 flex">
                    <input
                      type="time"
                      className="border-1 border-[#AE2108] w-1/2"
                    />
                    <button className="flex-1 px-5  bg-[#AE2108]">set</button>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
