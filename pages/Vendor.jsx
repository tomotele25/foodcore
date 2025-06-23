"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
const vendors = [
  {
    id: 1,
    name: "Mama Ope Kitchen",
    image: "/logo.jpg",
    category: "African Dishes",
    location: "Lagos",
    rating: 4.8,
  },
  {
    id: 2,
    name: "ChopLife Express",
    image: "/logo.jpg",
    category: "Fast Food",
    location: "Abuja",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Royal Taste",
    image: "/logo.jpg",
    category: "Local & Continental",
    location: "Lagos",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Tummy Treats",
    image: "/logo.jpg",
    category: "Desserts",
    location: "Ibadan",
    rating: 4.6,
  },
];

const Vendor = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      selectedLocation === "All" || vendor.location === selectedLocation;

    return matchesSearch && matchesLocation;
  });

  return (
    <section id="vendors" className="bg-gray-50 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Top Vendors Near You
        </h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name or category..."
            className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#AE2108]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Location Filter */}
          <select
            className="w-full md:w-1/4 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#AE2108]"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="All">All Locations</option>
            <option value="Lagos">Lagos</option>
            <option value="Abuja">Abuja</option>
            <option value="Ibadan">Ibadan</option>
          </select>
        </div>

        {/* Vendor Cards */}
        {filteredVendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredVendors.map((vendor) => (
              <Link href="/Menu">
                <div className="bg-white rounded-xl shadow hover:shadow-md transition duration-300 overflow-hidden cursor-pointer">
                  <div key={vendor.id} className="w-full h-48 relative">
                    <Image
                      src={vendor.image}
                      alt={vendor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 text-left">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {vendor.name}
                    </h3>
                    <p className="text-sm text-gray-500">{vendor.category}</p>
                    <p className="text-sm text-gray-500">{vendor.location}</p>
                    <p className="text-sm text-yellow-500 mt-1">
                      ⭐ {vendor.rating}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No vendors found.</p>
        )}
      </div>
    </section>
  );
};

export default Vendor;
