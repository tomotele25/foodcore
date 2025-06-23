"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full z-52">
      <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="ChowSpace Logo"
            width={60}
            height={40}
            priority
          />
          <span className="text-xl font-semibold text-[#AE2108]">
            ChowSpace
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 text-sm">
          <Link href="#vendors" className="hover:text-[#AE2108]">
            Vendors
          </Link>
          <Link href="#how-it-works" className="hover:text-[#AE2108]">
            How It Works
          </Link>
          <Link href="#contact" className="hover:text-[#AE2108]">
            Contact
          </Link>
        </div>

        {/* Auth Links - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-[#AE2108] hover:underline"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-[#AE2108] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#941B06]"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-[#AE2108]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden flex flex-col px-6 py-4 gap-4 text-gray-700 text-sm z-50">
            <Link
              href="#vendors"
              className="hover:text-[#AE2108]"
              onClick={() => setIsOpen(false)}
            >
              Vendors
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-[#AE2108]"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#contact"
              className="hover:text-[#AE2108]"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <hr className="border-gray-200" />
            <Link
              href="/login"
              className="text-sm font-medium text-[#AE2108] hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/Signup"
              className="bg-[#AE2108] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#941B06]"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
