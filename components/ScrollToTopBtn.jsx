"use client";
import React, { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTopBtn = () => {
  const [visible, setVisible] = useState(false);

  // Show when scrollY > 200
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#AE2108] text-white shadow-lg hover:bg-[#941B06] transition"
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
};

export default ScrollToTopBtn;
