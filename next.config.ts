import type { NextConfig } from "next";

// Environment variables
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://www.gservetech.com' : 'http://localhost:3000');
const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL || "https://api.gservetech.com";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "clerk.gservetech.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "i5.walmartimages.com" },
      { protocol: "https", hostname: "i5.walmartimages.ca" },
      { protocol: "https", hostname: "ae-pic-a1.aliexpress-media.com" },
      { protocol: "https", hostname: "multimedia.bbycastatic.ca" },
      { protocol: "https", hostname: "bbycastatic.ca" },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/products/:path*",
        destination: `${API_BACKEND_URL}/api/products/:path*`,
      },
      {
        source: "/api/orders/:path*",
        destination: `${API_BACKEND_URL}/api/orders/:path*`,
      },
      {
        source: "/api/users/:path*",
        destination: `${API_BACKEND_URL}/api/users/:path*`,
      },
      {
        source: "/api/shipping/:path*",
        destination: `${API_BACKEND_URL}/api/shipping/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: FRONTEND_URL,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },

  eslint: {
    // Ensure no deprecated options here
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
