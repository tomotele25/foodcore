"use client";

import { Poppins } from "next/font/google";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Vendor from "./Vendor";
import Hero from "@/components/Hero";
import Carousel from "@/components/Carousel";
import ScrollToTopBtn from "@/components/ScrollToTopBtn";
import PromoBanner from "@/components/PromoBanner";
import Faq from "@/components/Faq";
import ContactSupport from "@/components/ContactSupport";
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function Home() {
  return (
    <div className={`${poppins.variable} font-sans`}>
      <Head>
        <title>ChowSpace | Order Meals from Trusted Vendors</title>
        <meta
          name="description"
          content="Welcome to ChowSpace – your go-to platform for discovering local vendors and ordering delicious meals fast and easy."
        />
        <link rel="canonical" href="https://chowspace.ng/" />
        <meta
          property="og:title"
          content="ChowSpace | Order Meals from Trusted Vendors"
        />
        <meta
          property="og:description"
          content="Order food from trusted local vendors near you with ChowSpace. Easy checkout, fast delivery."
        />
        <meta property="og:url" content="https://chowspace.ng/" />
        <meta
          property="og:image"
          content="https://chowspace.ng/og-preview.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="ChowSpace | Order Meals from Trusted Vendors"
        />
        <meta
          name="twitter:description"
          content="Order meals fast and fresh from vendors near you."
        />
        <meta
          name="twitter:image"
          content="https://chowspace.ng/og-preview.jpg"
        />
      </Head>

      <ScrollToTopBtn />
      <ContactSupport />
      <main>
        <Navbar />
        <Hero />
        <PromoBanner />
        <Carousel />
        <section id="vendors">
          <Vendor />
        </section>
        <section id="Faq">
          <Faq />
        </section>
        <Footer />
      </main>
    </div>
  );
}
