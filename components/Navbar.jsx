"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import CustomersProfile from "@/pages/customers/CustomersProfile";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            loading="lazy"
            src="/logo.jpg"
            alt="ChowSpace Logo"
            width={50}
            height={40}
            className="object-contain rounded-md"
            priority
          />
          <span className="text-lg sm:text-xl font-semibold text-[#AE2108]">
            ChowSpace
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-800">
          <Link href="#vendors" className="hover:text-[#AE2108] transition">
            Vendors
          </Link>
          <Link href="#Faq" className="hover:text-[#AE2108] transition">
            Faq
          </Link>
          <Link href="/Blog" className="hover:text-[#AE2108] transition">
            Blog
          </Link>
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex justify-center items-center gap-4">
          {session?.user?.role === "customer" ? (
            <Link
              href="customers/CustomersProfile"
              className="flex items-center justify-center text-white font-semibold bg-[#AE2108] hover:bg-[#941B06] transition w-10 h-10 rounded-full text-sm shadow"
            >
              {session?.user?.fullname?.[0]}
            </Link>
          ) : (
            <>
              <Link
                href="/Login"
                className="text-sm text-[#AE2108] font-medium hover:underline"
              >
                Sign In
              </Link>
              <Link
                href="/Signup"
                className="bg-[#AE2108] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#941B06] transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-[#AE2108]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 py-4 bg-white/90 shadow-md backdrop-blur-md flex flex-col gap-4 text-sm text-gray-800 transition-all">
          <Link
            href="#vendors"
            onClick={() => setIsOpen(false)}
            className="hover:text-[#AE2108]"
          >
            Vendors
          </Link>
          <Link
            href="#how-it-works"
            onClick={() => setIsOpen(false)}
            className="hover:text-[#AE2108]"
          >
            How It Works
          </Link>
          <Link
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="hover:text-[#AE2108]"
          >
            Contact
          </Link>
          <hr className="border-gray-200" />
          {session?.user?.role === "customer" ? (
            <Link
              href="customers/CustomersProfile"
              className="flex items-center justify-center text-white font-semibold bg-[#AE2108] hover:bg-[#941B06] transition w-10 h-10 rounded-full text-sm shadow"
            >
              {session?.user?.fullname?.[0]}
            </Link>
          ) : (
            <>
              <Link
                href="/Login"
                onClick={() => setIsOpen(false)}
                className="text-[#AE2108] hover:underline"
              >
                Sign In
              </Link>
              <Link
                href="/Signup"
                onClick={() => setIsOpen(false)}
                className="bg-[#AE2108] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#941B06] transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
