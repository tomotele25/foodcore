// Vendor.jsx

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

const Vendor = () => {
  const [vendors, setVendors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 8;

  const BACKENDURL =
    "https://chowspace-backend.vercel.app" || "http://localhost:2006";
  useEffect(() => {
    let isMounted = true;

    const fetchVendors = async () => {
      try {
        const res = await axios.get(`${BACKENDURL}/api/vendor/getVendors`);
        if (isMounted) {
          setVendors(res.data.vendors || []);
        }
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLocations = async () => {
      try {
        const res = await axios.get(`${BACKENDURL}/api/getLocations`);
        if (isMounted) {
          const locs = res.data.locations;
          setLocations(locs);
        }
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    };

    fetchVendors();
    fetchLocations();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      selectedLocation === "All" || vendor.location === selectedLocation;

    return matchesSearch && matchesLocation;
  });

  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * vendorsPerPage,
    currentPage * vendorsPerPage
  );

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <section
      id="vendors"
      className="relative bg-gradient-to-b from-white via-gray-50 to-white px-6 py-16 min-h-screen overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute top-0 left-[-100px] w-[300px] h-[300px] bg-yellow-100 opacity-20 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-[-120px] w-[250px] h-[250px] bg-red-100 opacity-20 rounded-full blur-2xl z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Top Vendors Near You
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Browse restaurants, food vendors, and more
        </p>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <input
            type="text"
            placeholder="Search by name or category..."
            className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#AE2108]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full md:w-1/4 text-black px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#AE2108]"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="All" className="text-black">
              All Locations
            </option>
            {locations.map((loc, idx) => (
              <option className="text-black" key={idx} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Vendor Cards */}
        {loading ? (
          <p className="text-center text-gray-500 mt-10 animate-pulse">
            Loading vendors...
          </p>
        ) : paginatedVendors.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 transition-opacity duration-300 ease-in-out"
            key={currentPage}
          >
            {paginatedVendors.map((vendor) => (
              <div
                key={vendor._id}
                className="relative bg-white rounded-xl shadow hover:shadow-lg transform hover:scale-[1.03] transition duration-300 overflow-hidden group"
              >
                <div className="w-full h-48 relative">
                  <Image
                    src={vendor.logo || "/logo.jpg"}
                    alt={vendor.businessName}
                    fill
                    className="object-cover"
                  />
                  {vendor.status === "closed" && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
                      <span className="text-white text-lg font-semibold">
                        Closed
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 text-left">
                  <h3 className="font-semibold text-lg text-gray-800 truncate group-hover:text-[#AE2108] transition-colors">
                    {vendor.businessName}
                  </h3>
                  <p className="text-sm text-gray-500">{vendor.category}</p>
                  <p className="text-sm text-gray-500">{vendor.location}</p>
                  <div className="text-sm text-yellow-500 mt-1">
                    {"⭐".repeat(4)}
                    <span className="text-gray-300">⭐</span>
                  </div>

                  <p
                    className={`mt-2 text-xs font-medium inline-block px-2 py-1 rounded-full ${
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
                      className="inline-block mt-3 text-sm text-white bg-[#AE2108] px-4 py-2 rounded-lg hover:bg-[#941B06] transition"
                    >
                      View Menu
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="inline-block mt-3 text-sm text-white bg-gray-400 px-4 py-2 rounded-lg cursor-not-allowed"
                    >
                      View Menu
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No vendors found.</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50"
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
