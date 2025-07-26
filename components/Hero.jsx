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
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setFade(true);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative px-4 sm:px-8 lg:px-20 pt-32 sm:pt-24 h-screen w-full bg-gradient-to-br from-orange-50 via-white to-yellow-50 overflow-hidden flex items-center justify-center">
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-gradient-to-r from-yellow-300 via-pink-200 to-red-300 rounded-full blur-3xl opacity-30 animate-pulse z-0" />

      <div className="relative z-10 max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
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
              className="inline-flex items-center gap-2 bg-[#AE2108] hover:bg-[#941B06] text-white px-6 py-3 rounded-full font-medium text-sm shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Explore Vendors <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1 flex justify-center items-center">
          <div className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] relative rounded-full overflow-hidden shadow-2xl border-4 border-white group">
            <Image
              loading="lazy"
              src="/Hero.png"
              alt="ChowSpace Hero"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      <style>{`
        .fade-in {
          opacity: 1;
          transition: opacity 0.6s ease-in;
        }
        .fade-out {
          opacity: 0;
          transition: opacity 0.4s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Hero;
