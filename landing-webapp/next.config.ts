import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  turbopack: {
    root: "./landing-webapp"
  }
};

export default nextConfig;
