"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

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
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="max-w-6xl mx-auto h-full px-4 md:px-6 flex flex-col-reverse md:flex-row items-center justify-center gap-6 md:gap-4">
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

            {/* Blob Image */}
            <div className="flex-1 flex justify-center items-center">
              <svg
                viewBox="0 0 200 200"
                className="w-[400px] sm:w-[400px] md:w-[520px] lg:w-[500px] h-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask id={`blob-mask-${slide.id}`}>
                  <path
                    fill="white"
                    d="M45.3,-71.5C58.9,-61.6,70.6,-49.6,75.7,-35.6C80.8,-21.6,79.2,-5.6,74.2,8.5C69.1,22.7,60.7,34.9,50.1,46.2C39.5,57.5,26.8,68,11.3,72.4C-4.2,76.8,-22.6,75.2,-36.6,67.5C-50.6,59.8,-60.1,45.9,-66.4,31.3C-72.7,16.7,-75.9,1.4,-73.5,-13.3C-71.2,-28,-63.2,-42.1,-51.6,-52.5C-40,-62.9,-25,-69.5,-9.3,-71.6C6.5,-73.7,13,-71.4,45.3,-71.5Z"
                    transform="translate(100 100)"
                  />
                </mask>
                <image
                  href={slide.image}
                  width="200"
                  height="200"
                  mask={`url(#blob-mask-${slide.id})`}
                  className="object-contain"
                />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Hero;
