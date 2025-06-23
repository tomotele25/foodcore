import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Vendor from "./Vendor";
import Hero from "@/components/Hero";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function Home() {
  return (
    <div className={`${poppins.variable} font-sans`}>
      <main>
        <Navbar />
        <Hero />
        <Vendor />
        <Footer />
      </main>
    </div>
  );
}
