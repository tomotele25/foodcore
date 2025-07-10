"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

const BACKENDURL =
  "https://chowspace-backend.vercel.app" || "http://localhost:2006";

const Carousel = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchVendors = async () => {
      try {
        const response = await axios.get(`${BACKENDURL}/api/vendor/getVendors`);
        const data = response.data.vendors || [];

        const handpicked = data.slice(0, 5);
        if (isMounted) setVendors(handpicked);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading || vendors.length === 0) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-20 bg-white relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-black text-center">
          Handpicked For You
        </h2>

        {/* Custom Arrows */}
        <div className="absolute top-[52%] left-0 z-10 -translate-y-1/2">
          <div className="swiper-button-prev-custom bg-white border border-gray-300 rounded-full shadow p-2 hover:bg-[#AE2108] hover:text-white cursor-pointer transition">
            <ChevronLeft />
          </div>
        </div>
        <div className="absolute top-[52%] right-0 z-10 -translate-y-1/2">
          <div className="swiper-button-next-custom bg-white border border-gray-300 rounded-full shadow p-2 hover:bg-[#AE2108] hover:text-white cursor-pointer transition">
            <ChevronRight />
          </div>
        </div>

        <Swiper
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          autoplay={{ delay: 3000 }}
          loop={true}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          modules={[Autoplay, Navigation]}
        >
          {vendors.map((item, index) => (
            <SwiperSlide key={index}>
              {item.status === "opened" ? (
                <Link href={`/vendors/menu/${item.slug}`} passHref>
                  <div className="cursor-pointer bg-gray-50 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                    <div className="w-full h-52 bg-gray-100 relative">
                      <img
                        src={item.logo || "/logo.jpg"}
                        alt={item.businessName}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.businessName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        {item.category || "Uncategorized"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.location || "Unknown location"}
                      </p>
                      <span className="inline-block mt-4 text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700">
                        Open Now
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="cursor-not-allowed bg-gray-50 rounded-2xl shadow-md overflow-hidden opacity-70">
                  <div className="w-full h-52 bg-gray-100 relative">
                    <img
                      src={item.logo}
                      alt={item.businessName}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.businessName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      {item.category || "Uncategorized"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.location || "Unknown location"}
                    </p>
                    <span className="inline-block mt-4 text-xs font-medium px-3 py-1 rounded-full bg-red-100 text-red-600">
                      Opens Tomorrow
                    </span>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Carousel;
