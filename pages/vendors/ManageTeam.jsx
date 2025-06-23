"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeftCircle } from "lucide-react";

export default function CreateManager() {
  const router = useRouter();
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Manager",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((res) => setTimeout(res, 1000));

      // Add to temporary list
      setManagers((prev) => [...prev, formData]);
      toast.success("Manager added (temporary)");

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        role: "Manager",
      });
    } catch (err) {
      toast.error("Failed to add manager");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <Toaster position="top-right" />

      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
        >
          <ArrowLeftCircle size={18} />
          <span>Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-[#AE2108] mb-4">
            Create Manager
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="08123456789"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Manager">Manager</option>
                <option value="Assistant">Assistant</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#AE2108] hover:bg-[#941B06]"
              }`}
            >
              {loading ? "Adding..." : "Add Manager"}
            </button>
          </form>
        </div>

        {/* Right: Temporary Manager List */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Team Members
          </h2>

          {managers.length === 0 ? (
            <p className="text-gray-500">No managers added yet.</p>
          ) : (
            <ul className="space-y-4">
              {managers.map((manager, index) => (
                <li
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <h3 className="font-semibold text-[#AE2108]">
                    {manager.fullName}
                  </h3>
                  <p className="text-sm text-gray-600">{manager.email}</p>
                  <p className="text-sm text-gray-600">{manager.phone}</p>
                  <p className="text-xs text-gray-500 italic">{manager.role}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
