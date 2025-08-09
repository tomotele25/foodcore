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
      "Browse curated vendors and enjoy a variety of cuisines  delivered hot and fast, just the way you like it.",
    image: "/Hero.png",
  },
  {
    title: "Order With Ease",
    subtitle: "Fast. Trusted. Affordable.",
    description:
      "From breakfast to dinner, ChowSpace makes ordering food seamless and stress free.",
    image: "/Hero.png",
  },
  {
    title: "Satisfy Your Cravings",
    subtitle: "All your favorite meals, one tap away",
    description:
      "Anytime, anywhere find dishes from local food heroes near you. Eat better, live better.",
    image: "/Hero.png",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setAnimate(true);
      }, 400);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background image */}
      <Image
        priority
        src={slides[current].image}
        alt={slides[current].title}
        fill
        className={`object-cover transition-opacity duration-700 ${
          animate ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Text content */}
      <div
        className={`relative z-10 max-w-3xl px-6 pt-20 sm:px-12 text-center transform transition-all duration-700 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3 leading-snug">
          {slides[current].title}
        </h1>
        <h2 className="text-lg sm:text-2xl font-semibold text-[#FFDDC1] mb-4">
          {slides[current].subtitle}
        </h2>
        <p className="text-base sm:text-lg text-white/90 max-w-md mx-auto mb-6 leading-relaxed">
          {slides[current].description}
        </p>
        <Link
          href="#vendors"
          aria-label="Explore Vendors"
          className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-[#AE2108] px-6 py-3 rounded-full font-medium text-sm shadow-md hover:scale-105 transition-transform duration-300"
        >
          Explore Vendors <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
