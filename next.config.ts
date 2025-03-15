import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "clerk.gservetech.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "i5.walmartimages.com",
      },
      {
        protocol: "https",
        hostname: "i5.walmartimages.ca",
      },
      {
        protocol: "https",
        hostname: "ae-pic-a1.aliexpress-media.com",
      },
      {
        protocol: "https",
        hostname: "multimedia.bbycastatic.ca",
      },
      {
        protocol: "https",
        hostname: "bbycastatic.ca",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/products/:path*",
        destination: "https://api.gservetech.com/api/products/:path*",
      },
      {
        source: "/api/orders/:path*",
        destination: "https://api.gservetech.com/api/orders/:path*",
      },
      {
        source: "/api/users/:path*",
        destination: "https://api.gservetech.com/api/users/:path*",
      },
      {
        source: "/api/shipping/:path*",
        destination: "https://api.gservetech.com/api/shipping/:path*",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://yourfrontend.com",
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
