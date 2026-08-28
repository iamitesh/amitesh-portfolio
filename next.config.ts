import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages serves static files, so Next.js must emit a fully static site.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
