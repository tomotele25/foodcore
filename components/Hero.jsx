"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    id: 1,
    title: "Discover Delicious Meals",
    subtitle: "From Top Vendors Around You",
    image: "/chowspace_hero.png",
  },
  {
    id: 2,
    title: "Order With Ease",
    subtitle: "Fast, Trusted, Affordable",
    image: "/chowspace_hero.png",
  },
  {
    id: 3,
    title: "Satisfy Your Cravings",
    subtitle: "All your favorite meals, one tap away",
    image: "/chowspace_hero.png",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-white mt-20 sm:mt-10">
      {/* Background blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-gradient-to-r from-pink-300 via-red-300 to-yellow-200 opacity-30 rounded-full blur-3xl animate-float-slow z-0" />
      <div className="absolute top-1/3 right-[-150px] w-[500px] h-[500px] bg-gradient-to-br from-green-200 via-blue-300 to-purple-300 opacity-20 rounded-full blur-3xl animate-float-medium z-0" />
      <div className="absolute bottom-[-100px] left-1/4 w-[300px] h-[300px] bg-gradient-to-br from-yellow-100 via-red-100 to-pink-200 opacity-25 rounded-full blur-2xl animate-float-fast z-0" />

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="max-w-6xl mx-auto h-full px-4 md:px-6 flex flex-col-reverse md:flex-row items-center justify-center gap-6 md:gap-4 relative z-10">
            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {slide.title}
              </h1>
              <p className="text-gray-600 mt-3 text-base sm:text-lg md:text-xl">
                {slide.subtitle}
              </p>
              <Link
                href="#vendors"
                className="inline-block mt-6 bg-[#AE2108] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#941B06]"
              >
                Explore Vendors
              </Link>
            </div>

            {/* Blob-masked Image using next/image */}
            <div className="flex-1 flex justify-center items-center relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px]">
              <div className="w-full h-full relative rounded-full overflow-hidden mask-blob">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        .mask-blob {
          mask-image: url("/blob-mask.svg");
          -webkit-mask-image: url("/blob-mask.svg");
          mask-size: cover;
          mask-repeat: no-repeat;
          mask-position: center;
        }
      `}</style>
    </section>
  );
};

export default Hero;
