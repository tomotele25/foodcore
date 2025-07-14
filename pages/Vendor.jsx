"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Heart } from "lucide-react";
import { useRouter } from "next/router";

const setCookie = (name, value, days = 30) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
};

const getCookie = (name) =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];

const Vendor = () => {
  const [vendors, setVendors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 8;
  const router = useRouter();
  const BACKENDURL = "https://chowspace-backend.vercel.app";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorsRes, locationsRes] = await Promise.all([
          axios.get(`${BACKENDURL}/api/vendor/getVendors`),
          axios.get(`${BACKENDURL}/api/getLocations`),
        ]);
        setVendors(vendorsRes.data.vendors || []);
        setLocations(locationsRes.data.locations || []);
        const savedLocation = getCookie("location");
        if (savedLocation) setSelectedLocation(savedLocation);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredVendors = vendors.filter((vendor) => {
    const matchSearch =
      vendor.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchLocation =
      selectedLocation === "All" || vendor.location === selectedLocation;

    return matchSearch && matchLocation;
  });

  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);
  const paginated = filteredVendors.slice(
    (currentPage - 1) * vendorsPerPage,
    currentPage * vendorsPerPage
  );

  const goToNext = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);
  const goToPrev = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  const openModal = () => router.push("/Login");

  return (
    <section
      id="vendors"
      className="relative px-6 py-16 min-h-screen bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden"
    >
      {/* Background Glow Blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-yellow-100 opacity-20 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-[-80px] right-[-100px] w-[250px] h-[250px] bg-red-100 opacity-20 rounded-full blur-2xl z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Top Vendors Near You
        </h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          Explore local food vendors and favorite meals around you.
        </p>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
          <input
            type="text"
            placeholder="Search by name or category..."
            className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#AE2108] outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedLocation}
            onChange={(e) => {
              const newVal = e.target.value;
              setSelectedLocation(newVal);
              setCookie("location", newVal);
            }}
            className="w-full md:w-1/4 px-4 py-2 rounded-lg border border-gray-300 shadow-sm text-black focus:ring-2 focus:ring-[#AE2108] outline-none"
          >
            <option value="All">All Locations</option>
            {locations.map((loc, i) => (
              <option key={i} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Vendors */}
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">
            Loading vendors...
          </p>
        ) : paginated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {paginated.map((vendor) => (
              <div
                key={vendor._id}
                className="relative group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="absolute top-3 left-3 cursor-pointer z-10 transition-transform transform hover:scale-110">
                  <Heart size={20} color="#AE2108" />
                </div>
                <div className="relative w-full h-44 overflow-hidden rounded-t-xl">
                  <Image
                    src={vendor.logo || "/logo.jpg"}
                    alt={vendor.businessName}
                    fill
                    className="object-cover"
                  />
                  {vendor.status === "closed" && (
                    <div className="absolute inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-20">
                      <span className="text-white text-sm font-semibold">
                        Closed
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg truncate group-hover:text-[#AE2108] transition-colors">
                    {vendor.businessName}
                  </h3>
                  <p className="text-sm text-gray-500">{vendor.category}</p>
                  <p className="text-sm text-gray-500">{vendor.location}</p>
                  <div className="text-yellow-500 mt-1 text-sm">
                    ⭐⭐⭐⭐<span className="text-gray-300">⭐</span>
                  </div>
                  <p
                    className={`inline-block text-xs mt-2 px-2 py-1 rounded-full font-medium ${
                      vendor.status === "opened"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {vendor.status}
                  </p>
                  {vendor.status === "opened" ? (
                    <Link
                      href={`/vendors/menu/${vendor.slug}`}
                      className="block mt-4 text-sm text-white bg-[#AE2108] hover:bg-[#941B06] px-4 py-2 rounded-lg text-center transition"
                    >
                      View Menu
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="block mt-4 text-sm text-white bg-gray-400 px-4 py-2 rounded-lg text-center cursor-not-allowed"
                    >
                      View Menu
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No vendors match your filters.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-6">
            <button
              onClick={goToPrev}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Vendor;
