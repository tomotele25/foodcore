import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#f9f9f9] border-t mt-20 text-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo & Tagline */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Image
              src="/logo.jpg"
              alt="ChowSpace Logo"
              width={35}
              height={35}
            />
            <span className="text-xl font-semibold text-[#AE2108]">
              ChowSpace
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Delicious meals from trusted vendors, right at your doorstep.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#vendors" className="hover:text-[#AE2108]">
                Vendors
              </Link>
            </li>
            <li>
              <Link href="#how-it-works" className="hover:text-[#AE2108]">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="#contact" className="hover:text-[#AE2108]">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#AE2108]">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-[#AE2108]">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-[#AE2108]">
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Contact Info (optional) */}
        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <p className="text-sm text-gray-600">hello@chowspace.com</p>
          <p className="text-sm text-gray-600 mt-1">+234 800 000 0000</p>
        </div>
      </div>

      <div className="border-t text-center text-sm text-gray-500 py-4 px-4">
        &copy; {new Date().getFullYear()} ChowSpace. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
