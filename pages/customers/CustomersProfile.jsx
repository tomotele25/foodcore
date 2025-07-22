"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Gift,
  Settings,
  LogOut,
  MapPin,
  Heart,
  HelpCircle,
} from "lucide-react";

const CustomersProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user || session?.user?.role !== "customer") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-sm w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            You're not logged in
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Please sign in to access your customer profile.
          </p>
          <button
            onClick={() => router.push("/Login")}
            className="px-5 py-2 rounded-full bg-[#AE2108] text-white hover:bg-[#941B06] transition text-sm font-medium"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 sm:gap-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#AE2108] text-white flex items-center justify-center rounded-full text-lg font-bold uppercase">
              {session.user.fullname?.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Hello, {session.user.fullname} 👋
              </h2>
              <p className="text-sm text-gray-500">{session.user.email}</p>
            </div>
          </div>

          <button
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
            className="flex items-center px-4 py-2 bg-gray-100 text-sm text-gray-700 rounded-full hover:bg-red-50 hover:text-red-600 transition self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>

        {/* Profile Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProfileCard
            icon={<ShoppingBag className="text-[#AE2108] w-5 h-5" />}
            title="Order History"
            description="Track and manage your previous orders"
          />
          <ProfileCard
            icon={<Gift className="text-[#AE2108] w-5 h-5" />}
            title="Redeem Coupon"
            description="Apply discount codes to your orders"
          />
          <ProfileCard
            icon={<Settings className="text-[#AE2108] w-5 h-5" />}
            title="Account Settings"
            description="Update your personal information"
          />
          <ProfileCard
            icon={<MapPin className="text-[#AE2108] w-5 h-5" />}
            title="Delivery Address"
            description="Manage your shipping locations"
          />
          <ProfileCard
            icon={<Heart className="text-[#AE2108] w-5 h-5" />}
            title="Saved Items"
            description="View items you saved for later"
          />
          <ProfileCard
            icon={<HelpCircle className="text-[#AE2108] w-5 h-5" />}
            title="Help & Support"
            description="Get help or contact ChowSpace"
          />
        </div>
      </div>
    </div>
  );
};

// Reusable Card Component
const ProfileCard = ({ icon, title, description }) => (
  <div className="p-4 bg-gray-100 rounded-xl hover:bg-gray-200 cursor-pointer transition">
    <div className="flex items-start space-x-4">
      <div className="p-2 bg-white rounded-full shadow">{icon}</div>
      <div>
        <h4 className="text-sm font-medium text-gray-800">{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  </div>
);

export default CustomersProfile;
