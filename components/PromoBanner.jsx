"use client";

import Image from "next/image";
import { Gift, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function PromoBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative isolate overflow-hidden bg-[#AE2108] text-white rounded-3xl px-4 sm:px-6 py-10 sm:py-14 shadow-2xl mt-8 mx-2 sm:mx-6 lg:mx-0"
    >
      {/* Zooming background */}
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src="/food-banner.jpg"
          alt="Food ingredients background"
          layout="fill"
          objectFit="cover"
          className="pointer-events-none"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-10">
        <div className="flex items-start sm:items-center gap-4 max-w-xl">
          <motion.div
            className="p-4 bg-white/20 rounded-full shrink-0"
            whileHover={{ rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Gift className="w-8 h-8 text-white animate-pulse" />
          </motion.div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight">
              First 50 Orders Today Are{" "}
              <span className="underline decoration-yellow-300">FREE!</span>
            </h2>
            <p className="text-sm sm:text-base text-orange-100 mt-1">
              Be among the fastest to claim this exclusive deal—only available
              daily!
            </p>
          </div>
        </div>

        <motion.a
          href="#vendors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 bg-white text-[#AE2108] px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-semibold shadow-lg hover:bg-orange-50 transition-transform duration-200"
        >
          <ShoppingBag size={20} className="text-[#AE2108]" />
          Order Now
        </motion.a>
      </div>
    </motion.section>
  );
}
