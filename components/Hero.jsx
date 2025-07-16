"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    title: "Discover Delicious Meals",
    subtitle: "From Top Vendors Around You",
    description:
      "Browse hundreds of curated vendors and enjoy a variety of cuisines — delivered hot and fast, just the way you like it.",
  },
  {
    title: "Order With Ease",
    subtitle: "Fast. Trusted. Affordable.",
    description:
      "From breakfast to dinner, ChowSpace gives you a seamless way to find, order, and enjoy meals without hassle.",
  },
  {
    title: "Satisfy Your Cravings",
    subtitle: "All your favorite meals, one tap away",
    description:
      "No matter the time or place, get your favorite dishes from local food heroes near you. Eat better, live better.",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setFade(true);
      }, 500);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative px-2 sm:px-20 h-screen w-full pt-32 sm:pt-24 bg-gradient-to-br from-orange-50 via-white to-yellow-50 overflow-hidden flex items-center justify-center">
      {/* Floating gradient blob */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-gradient-to-r from-yellow-300 via-pink-200 to-red-300 rounded-full blur-3xl opacity-30 animate-pulse z-0" />

      {/* Hero content container */}
      <div className="relative z-10 max-w-7xl w-full px-6 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
        {/* Text Content */}
        <div className="flex-1">
          <div className={fade ? "fade-in" : "fade-out"}>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
              {slides[current].title}
            </h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#AE2108] mb-2">
              {slides[current].subtitle}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-md mb-6 mx-auto md:mx-0">
              {slides[current].description}
            </p>
            <Link
              href="#vendors"
              className="inline-flex items-center gap-2 bg-[#AE2108] hover:bg-[#941B06] text-white px-6 py-3 rounded-full font-medium text-sm shadow-lg hover:scale-105 transition duration-300"
            >
              Explore Vendors <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1 flex justify-center items-center">
          <div className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] relative rounded-full overflow-hidden shadow-2xl border-4 border-white group">
            <Image
              src="/chowspace_hero.png" // Use open-source image if needed
              alt="ChowSpace Hero"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .fade-in {
          opacity: 1;
          transition: opacity 0.8s ease-in;
        }
        .fade-out {
          opacity: 0;
          transition: opacity 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Hero;
