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
  Camera,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/vendor/dashboard" },
  { name: "Profile", icon: Users, path: "/vendor/profile" },
  { name: "Settings", icon: Settings, path: "/vendor/settings" },
];

const BANK_OPTIONS = [
  { name: "Access Bank", code: "044" },
  { name: "EcoBank", code: "050" },
  { name: "Fidelity Bank", code: "070" },
  { name: "First Bank", code: "011" },
  { name: "Guaranty Trust Bank", code: "058" },
  { name: "Kuda Microfinance Bank", code: "50211" },
  { name: "Moniepoint MFB", code: "50515" },
  { name: "Opay Digital Services Limited (OPay)", code: "999991" },
  { name: "Paycom", code: "999991" },
  { name: "Palmpay", code: "999992" },
  { name: "Stanbic IBTC Bank", code: "221" },
  { name: "UBA", code: "033" },
  { name: "Union Bank", code: "032" },
  { name: "Zenith Bank", code: "057" },
];

const Profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    businessName: "",
    contact: "",
    location: "",
    address: "",
    accountNumber: "",
    bankName: "",
    deliveryDuration: "", // ✅ added
  });

  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState({ ...formData });
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const BACKENDURL =
    "https://chowspace-backend.vercel.app" || "http://localhost:2005";
  useEffect(() => {
    if (status === "unauthenticated") router.push("/Login");
  }, [status]);

  useEffect(() => {
    if (session?.vendor) {
      const vendor = session.vendor;
      const userData = {
        fullname: vendor.fullname || "",
        email: vendor.email || "",
        businessName: vendor.businessName || "",
        contact: vendor.phoneNumber || "",
        location: vendor.location || "",
        address: vendor.address || "",
        accountNumber: vendor.accountNumber || "",
        bankName: vendor.bankName || "",
        deliveryDuration: vendor.deliveryDuration || "", // ✅ added
      };
      setFormData(userData);
      setTempData(userData);
      setLogoPreview(vendor.logo || "");
    }
  }, [session]);

  const handleEditClick = () => setEditMode(true);

  const handleCancelClick = () => {
    setTempData(formData);
    setLogoPreview(session?.vendor?.logo);
    setNewPassword("");
    setEditMode(false);
  };

  const handleChange = (e) =>
    setTempData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    const form = new FormData();

    form.append("businessName", tempData.businessName);
    form.append("contact", tempData.contact);
    form.append("location", tempData.location);
    form.append("address", tempData.address);
    form.append("deliveryDuration", tempData.deliveryDuration); // ✅ added

    if (
      !formData.accountNumber &&
      tempData.accountNumber &&
      tempData.bankName
    ) {
      form.append("accountNumber", tempData.accountNumber);
      form.append("bankName", tempData.bankName);
    }

    if (logo) form.append("logo", logo);
    if (newPassword) form.append("password", newPassword);

    const toastId = toast.loading("Updating profile...");
    try {
      await axios.put(`${BACKENDURL}/api/vendor/profile/update`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });
      toast.success("Profile updated successfully", { id: toastId });
      setFormData(tempData);
      setNewPassword("");
      setEditMode(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update profile",
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/Login");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed z-30 inset-y-0 left-0 w-64 bg-white shadow-md transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col justify-between ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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
        <div className="px-4 mb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:bg-red-100 px-3 py-2 rounded-md w-full"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 h-screen overflow-hidden">
        <header className="sticky top-0 z-10 h-16 bg-white shadow-md px-4 py-3 flex items-center justify-between">
          <button onClick={toggleSidebar} className="md:hidden text-gray-700">
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            Vendor Profile
          </h2>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">
            {/* Logo Upload */}
            <div className="flex flex-col items-center mb-6 relative">
              <div
                onClick={() =>
                  editMode && document.getElementById("logoInput").click()
                }
                className="w-20 h-20 rounded-full overflow-hidden relative group cursor-pointer"
              >
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Logo"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold bg-[#AE2108]">
                    {formData.fullname ? formData.fullname[0] : "V"}
                  </div>
                )}
                {editMode && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-50 transition">
                    <Camera className="text-white w-6 h-6" />
                  </div>
                )}
              </div>
              {editMode && (
                <input
                  type="file"
                  id="logoInput"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              )}
            </div>

            {/* Vendor Info */}
            {!editMode ? (
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Business Name:</strong> {formData.businessName}
                </p>
                <p>
                  <strong>Phone Number:</strong> {formData.contact}
                </p>
                <p>
                  <strong>Location:</strong> {formData.location}
                </p>
                <p>
                  <strong>Address:</strong> {formData.address}
                </p>
                <p>
                  <strong>Account Number:</strong>{" "}
                  {formData.accountNumber || "Not set"}
                </p>
                <p>
                  <strong>Bank Name:</strong> {formData.bankName || "Not set"}
                </p>
                <p>
                  <strong>Delivery Duration:</strong>{" "}
                  {formData.deliveryDuration || "Not set"} mins
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
                  name="contact"
                  value={tempData.contact}
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
                <input
                  name="deliveryDuration"
                  type="number"
                  value={tempData.deliveryDuration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Estimated Delivery Time (minutes)"
                  min={1}
                />
                {!formData.accountNumber && (
                  <>
                    <input
                      name="accountNumber"
                      value={tempData.accountNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded"
                      placeholder="Account Number"
                    />
                    <select
                      name="bankName"
                      value={tempData.bankName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded bg-white"
                    >
                      <option value="">Select Bank</option>
                      {BANK_OPTIONS.map((bank) => (
                        <option key={bank.code} value={bank.name}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                <input
                  type="password"
                  placeholder="New Password (optional)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className={`flex-1 py-2 rounded-md text-white ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#AE2108]"
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save"}
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
