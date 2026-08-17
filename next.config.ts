import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Media uploaded through the Django admin is served by the backend.
    // Add the production backend hostname here before deploying.
    remotePatterns: [
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/media/**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/media/**" },
    ],
  },
  async redirects() {
    return [{ source: "/membership", destination: "/join", permanent: true }];
  },
};

export default nextConfig;
