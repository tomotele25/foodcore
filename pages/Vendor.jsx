"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Heart, Clock } from "lucide-react";
import { useRouter } from "next/router";
import VendorSkeletonCard from "@/components/VendorSkeletonCard";

const Vendor = () => {
  const [vendors, setVendors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 8;
  const router = useRouter();
  const BACKENDURL =
    "https://chowspace-backend.vercel.app" || "http://localhost:2005";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorsRes, locationsRes] = await Promise.all([
          axios.get(`${BACKENDURL}/api/vendor/getVendors`),
          axios.get(`${BACKENDURL}/api/getLocations`),
        ]);
        setVendors(vendorsRes.data.vendors || []);
        setLocations(locationsRes.data.locations || []);
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

  return (
    <section className="relative px-5 sm:px-20 py-16 min-h-screen bg-[#fffdfc] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-[#AE2108]  mb-2">
            Discover Top Vendors
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Find the best meals from vendors around you and enjoy swift
            delivery.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
          <input
            type="text"
            placeholder="Search vendors or categories..."
            className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#AE2108] outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
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

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(5)].map((_, i) => (
              <VendorSkeletonCard key={i} />
            ))}
          </div>
        ) : paginated.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginated.map((vendor) => (
              <div
                key={vendor._id}
                className="relative group bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={vendor.logo || "/logo.jpg"}
                    alt={vendor.businessName}
                    fill
                    className="object-cover"
                  />
                  {vendor.status === "closed" && (
                    <div className="absolute inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        Closed
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white p-1.5 rounded-full shadow">
                    <Heart size={18} color="#AE2108" />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                    {vendor.businessName}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-2">
                    <span>{vendor.category}</span>
                    <span>{vendor.location}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <Clock size={16} className="mr-1 text-[#AE2108]" />
                    {vendor.deliveryDuration} mins delivery
                  </div>

                  <p
                    className={`inline-block text-xs px-2 py-1 rounded-full font-medium mb-2 ${
                      vendor.status === "opened"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {vendor.status}
                  </p>

                  <Link
                    href={
                      vendor.status === "opened"
                        ? `/vendors/menu/${vendor.slug}`
                        : "#"
                    }
                    className={`block w-full text-center text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 ${
                      vendor.status === "opened"
                        ? "bg-[#AE2108] text-white hover:bg-[#941B06]"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No vendors match your filters.
          </p>
        )}

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
