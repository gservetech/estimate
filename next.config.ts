import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "clerk.gservetech.com",
      "m.media-amazon.com",
      "i5.walmartimages.com",
      "ae-pic-a1.aliexpress-media.com",
      "multimedia.bbycastatic.ca",
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
      // Add more API proxies if needed
    ];
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://yourfrontend.com", // Replace with your frontend domain
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
