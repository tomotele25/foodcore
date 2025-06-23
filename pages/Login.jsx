"use client";

import React, { useState } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const Login = () => {
  const [activeTab, setActiveTab] = useState("vendor");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      role: activeTab, // send "customer", "vendor", or "manager"
      redirect: false,
    });

    if (response?.ok) {
      toast.success("Login successful");
      // Redirect based on role
      if (activeTab === "vendor") {
        router.push("/vendors/Dashboard");
      } else if (activeTab === "manager") {
        router.push("vendors/ManagerDashboard");
      } else {
        router.push("/customer/dashboard"); // <-- your customer dashboard
      }
    } else {
      toast.error("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Toaster position="top-right" />

      {/* Left Image */}
      <div className="md:w-1/2 h-64 md:h-screen relative">
        <Image
          src="/logo.jpg"
          alt="Login Visual"
          fill
          className="object-cover"
        />
      </div>

      {/* Right Form */}
      <div className="md:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Welcome Back
          </h2>

          {/* Tabs */}
          <div className="flex mb-6 border-b">
            {["customer", "vendor", "manager"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`w-1/3 py-2 text-sm font-semibold ${
                  activeTab === tab
                    ? "text-[#AE2108] border-b-2 border-[#AE2108]"
                    : "text-gray-500"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-700">Password</label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] cursor-pointer text-sm text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Don’t have an account?{" "}
            <a href="/signup" className="text-[#AE2108] hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
