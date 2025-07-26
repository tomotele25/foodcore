"use client";

import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

const Login = () => {
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
      redirect: false,
    });

    if (response?.ok) {
      toast.success("Login successful");

      const updatedSession = await getSession();
      const role = updatedSession?.user?.role;

      if (role === "admin") {
        router.push("/admin/AdminDashboard");
      } else if (role === "vendor") {
        router.push("/vendors/Dashboard");
      } else if (role === "manager") {
        router.push("/vendors/ManagerDashboard");
      } else {
        router.push("/");
      }
    } else {
      toast.error("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Login | ChowSpace</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex flex-col md:flex-row">
        <Toaster position="top-right" />

        {/* Left Image */}
        <div className="md:w-1/2 h-64 md:h-screen relative">
          <Image
            loading="lazy"
            src="/logo.jpg"
            alt="Login Visual"
            fill
            className="sm:object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="md:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Login as Customer
            </h2>

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
              <a
                aria-label="View cart"
                href="/Signup"
                className="text-[#AE2108] hover:underline"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
