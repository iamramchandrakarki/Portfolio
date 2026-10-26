/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  distDir: process.env.NODE_ENV === "production" ? ".next-production" : ".next",
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
