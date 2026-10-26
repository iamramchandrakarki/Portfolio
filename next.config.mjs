/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  output: "export",
  distDir: process.env.NODE_ENV === "production" ? "dist" : ".next-dev",
  images: { unoptimized: true },
};

export default nextConfig;
