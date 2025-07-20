"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "Discover Delicious Meals",
    subtitle: "From Top Vendors Around You",
    description:
      "Browse curated vendors and enjoy a variety of cuisines — delivered hot and fast, just the way you like it.",
  },
  {
    title: "Order With Ease",
    subtitle: "Fast. Trusted. Affordable.",
    description:
      "From breakfast to dinner, ChowSpace makes ordering food seamless and stress-free.",
  },
  {
    title: "Satisfy Your Cravings",
    subtitle: "All your favorite meals, one tap away",
    description:
      "Anytime, anywhere — find dishes from local food heroes near you. Eat better, live better.",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative px-6 sm:px-12 lg:px-20 pt-28 sm:pt-24 h-screen w-full bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center overflow-hidden">
      {/* Soft floating glow */}
      <div className="absolute top-[-120px] left-[-100px] w-[420px] h-[420px] bg-gradient-to-r from-yellow-300 via-pink-200 to-red-300 rounded-full blur-3xl opacity-30 animate-pulse z-0" />

      <div className="relative z-10 max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
        {/* Text Section */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                {slides[current].title}
              </h1>
              <h2 className="text-lg sm:text-xl font-semibold text-[#AE2108] mb-3">
                {slides[current].subtitle}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-md mb-6 mx-auto md:mx-0">
                {slides[current].description}
              </p>
              <Link
                href="#vendors"
                className="inline-flex items-center gap-2 bg-[#AE2108] hover:bg-[#941B06] text-white px-6 py-3 rounded-full font-medium text-sm shadow-md hover:scale-105 transition duration-300"
              >
                Explore Vendors <ArrowRight size={16} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Image Section */}
        <motion.div
          className="flex-1 flex justify-center items-center"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] relative rounded-full overflow-hidden shadow-2xl border-4 border-white group">
            <Image
              src="/Hero.png"
              alt="ChowSpace Hero"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
