"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
const blogPosts = [
  {
    id: 1,
    title: "The Future of Food Delivery in Africa",
    description:
      "Explore how technology is revolutionizing local food vendors and delivery in Nigeria.",
    image: "/blog1.jpg",
    date: "July 19, 2025",
  },
  {
    id: 2,
    title: "Behind the Scenes of ChowSpace",
    description:
      "Take a look at how we built a platform that connects local kitchens with hungry customers.",
    image: "/blog2.jpg",
    date: "July 12, 2025",
  },
  {
    id: 3,
    title: "Tips for Vendors: Getting More Orders",
    description:
      "Maximize your sales and visibility on the platform with these practical steps.",
    image: "/blog3.jpg",
    date: "July 5, 2025",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Blog() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Head>
        <title>ChowSpace | Blog</title>
        <meta name="description" content="ChowSpace Blog" />
        <link rel="canonical" href="https://chowspace.ng/Blog" />
        <meta
          property="og:title"
          content="ChowSpace | Order Meals from Trusted Vendors"
        />
        <meta
          property="og:description"
          content="Order food from trusted local vendors near you with ChowSpace. Easy checkout, fast delivery."
        />
        <meta property="og:url" content="https://chowspace.ng/Blog" />
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

      <div className="min-h-screen px-4 sm:px-8 py-14 bg-gradient-to-br from-[#fff8f5] to-[#ffe8e1]">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-4xl sm:text-5xl font-bold text-center mb-6 text-[#AE2108]"
        >
          ChowSpace Blog
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center text-gray-700 max-w-xl mx-auto mb-12"
        >
          Stories, insights, and tips from the world of food, tech, and
          community.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              className="bg-white/70 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 border border-orange-100"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.2 }}
              variants={fadeInUp}
            >
              <Image
                loading="lazy"
                src={post.image}
                alt={post.title}
                width={800}
                height={500}
                className="w-full h-48 object-cover rounded-t-3xl"
              />
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-1">{post.date}</p>
                <h2 className="text-xl font-semibold text-[#AE2108]">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-700 mt-2">{post.description}</p>
                <button className="mt-4 text-[#AE2108] hover:underline font-medium text-sm">
                  Read More →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
