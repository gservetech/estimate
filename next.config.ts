import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "clerk.gservetech.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/products/:path*", // Calls to /api/products will be proxied
        destination: "http://165.227.42.159:8080/api/products/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/api/:path*", // Apply CORS headers to API requests
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Allows requests from any origin
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
