import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Vendor from "./Vendor";
import Hero from "@/components/Hero";
import Carousel from "@/components/Carousel";
import ScrollToTopBtn from "@/components/ScrollToTopBtn";
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
        <Hero />
        <Carousel />
        <Vendor />
        <Footer />
      </main>
    </div>
  );
}
