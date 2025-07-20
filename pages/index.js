"use client";

import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Vendor from "./Vendor";
import Hero from "@/components/Hero";
import Carousel from "@/components/Carousel";
import ScrollToTopBtn from "@/components/ScrollToTopBtn";
import PromoBanner from "@/components/PromoBanner";
import FadeInSection from "@/components/FadeInSection";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function Home() {
  return (
    <div className={`${poppins.variable} font-sans`}>
      <ScrollToTopBtn />
      <main>
        <Navbar />

        <FadeInSection delay={0.1}>
          <Hero />
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <PromoBanner />
        </FadeInSection>

        <FadeInSection delay={0.3}>
          <Carousel />
        </FadeInSection>

        <FadeInSection delay={0.4}>
          <Vendor />
        </FadeInSection>

        <Footer />
      </main>
    </div>
  );
}
