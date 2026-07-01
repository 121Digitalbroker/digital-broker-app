import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/list-property", destination: "/create", permanent: true },
      { source: "/my-listings", destination: "/my-properties", permanent: true },
    ];
  },
};

export default nextConfig;
