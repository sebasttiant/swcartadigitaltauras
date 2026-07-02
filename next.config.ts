import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output keeps the Docker preview image small and self-contained.
  output: "standalone",
  reactStrictMode: true,
};

export default nextConfig;
