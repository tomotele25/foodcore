import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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
      }, 500); // fade out before switching
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full bg-white pt-40 sm:pt-20 overflow-hidden flex items-center justify-center">
      {/* Background Gradient Blob */}
      <div
        className="absolute bottom-[-120px] right-[-120px] w-[500px] h-[500px] bg-gradient-to-br from-pink-200 via-red-200 to-yellow-300 opacity-30 rounded-full blur-3xl z-0"
        style={{ animation: "float 10s ease-in-out infinite" }}
      />

      {/* Keyframe animations in-page */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .fade-in {
          opacity: 1;
          transition: opacity 0.8s ease-in;
        }

        .fade-out {
          opacity: 0;
          transition: opacity 0.5s ease-out;
        }
      `}</style>

      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl w-full px-6 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
        {/* Text */}
        <div className="flex-1 transition-all duration-700">
          <div className={fade ? "fade-in" : "fade-out"}>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {slides[current].title}
            </h1>
            <h2 className="text-lg sm:text-xl text-[#AE2108] font-semibold mb-2">
              {slides[current].subtitle}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-md mx-auto md:mx-0">
              {slides[current].description}
            </p>
            <Link
              href="#vendors"
              className="inline-block bg-[#AE2108] hover:bg-[#941B06] text-white px-6 py-3 rounded-full font-medium text-sm shadow-md"
            >
              Explore Vendors
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1 flex justify-center items-center">
          <div className="w-[300px] h-[300px] rounded-full overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src="/chowspace_hero.png"
              alt="ChowSpace Hero"
              width={400}
              height={400}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
