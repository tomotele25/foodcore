/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "via.placeholder.com",
      "localhost",
      "chowspace-backend.vercel.app",
    ],
  },
};

export default nextConfig;
