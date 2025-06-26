"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/vendor/dashboard" },
  { name: "Profile", icon: Users, path: "/vendor/profile" },
  { name: "Settings", icon: Settings, path: "/vendor/settings" },
];

const Profile = () => {
  const { data: session, status } = useSession();

  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    businessName: "",
    phoneNumber: "",
    location: "",
    address: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState({ ...formData });

  const [currentPassword, setCurrentPassword] = useState("vendor123"); // Just placeholder for now
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/Login");
    }
  }, [status]);

  useEffect(() => {
    if (session?.vendor) {
      const vendor = session.vendor;
      const userData = {
        fullname: vendor.fullname || "",
        email: vendor.email || "",
        businessName: vendor.businessName || "",
        phoneNumber: vendor.phoneNumber || "",
        location: vendor.location || "",
        address: vendor.address || "",
      };
      setFormData(userData);
      setTempData(userData);
    }
  }, [session]);

  const handleEditClick = () => setEditMode(true);
  const handleCancelClick = () => {
    setTempData(formData);
    setEditMode(false);
  };

  const handleChange = (e) =>
    setTempData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSaveClick = (e) => {
    e.preventDefault();
    setFormData(tempData);
    setEditMode(false);
    alert("Profile saved! (Implement backend call)");
  };

  const handlePasswordUpdate = () => {
    alert(`Password updated to: ${newPassword}`);
    setNewPassword("");
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {/* Sidebar */}
      <div
        className={`fixed z-30 inset-y-0 left-0 w-64 bg-white shadow-md transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col justify-between ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Section: Logo and Navigation */}
        <div>
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <h1 className="text-xl font-bold text-[#AE2108]">Vendor Panel</h1>
            <button onClick={toggleSidebar} className="md:hidden text-gray-600">
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

        {/* Bottom Section: Logout */}
        <div className="px-4 mb-4">
          <button
            onClick={() => signOut({ callbackUrl: "/Login" })}
            className="flex items-center gap-3 text-red-500 hover:bg-red-100 px-3 py-2 rounded-md w-full"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 h-16 bg-white shadow-md px-4 py-3 flex items-center justify-between">
          <button onClick={toggleSidebar} className="md:hidden text-gray-700">
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            Vendor Profile
          </h2>
        </header>

        {/* Scrollable Main Section */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#AE2108] flex items-center justify-center text-white text-3xl font-bold">
                {formData.fullname ? formData.fullname[0] : "V"}
              </div>
            </div>

            {/* User Info */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {session?.user.fullname}
              </h2>
              <p className="text-gray-500"> {session?.user.email}</p>
            </div>

            {/* Form or Profile */}
            {!editMode ? (
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Business Name:</strong>
                  {session?.user?.businessName}
                </p>
                <p>
                  <strong>Phone Number:</strong> {session?.user?.contact}
                </p>
                <p>
                  <strong>Location:</strong> {session?.user?.location}
                </p>
                <p>
                  <strong>Address:</strong> {session?.user?.address}
                </p>

                <button
                  onClick={handleEditClick}
                  className="w-full py-3 bg-[#AE2108] text-white font-semibold rounded-md hover:bg-[#941B06] transition"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveClick} className="space-y-4">
                <input
                  name="businessName"
                  value={tempData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Business Name"
                />
                <input
                  name="phoneNumber"
                  value={tempData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Phone Number"
                />
                <input
                  name="location"
                  value={tempData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Location"
                />
                <textarea
                  name="address"
                  value={tempData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Address"
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#AE2108] text-white py-2 rounded-md"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="flex-1 border border-gray-400 text-gray-700 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Password Section */}
            <div className="mt-10 space-y-2">
              <p className="text-gray-700">
                <strong>Current Password:</strong> {currentPassword}
              </p>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
              <button
                onClick={handlePasswordUpdate}
                className="mt-2 bg-[#AE2108] text-white px-4 py-2 rounded-md hover:bg-[#941B06] transition"
              >
                Update Password
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
