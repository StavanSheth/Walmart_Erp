import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://mavon.online https://*.mavon.online http://localhost:* http://127.0.0.1:*"
          },
          {
            key: "X-Frame-Options",
            value: "ALLOWALL"
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*"
          }
        ]
      }
    ];
  },
  async rewrites() {
    const backendUrl =
      process.env.BACKEND_API_URL ||
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://127.0.0.1:4000";

    return [
      {
        source: "/favicon.ico",
        destination: "/brand/walmart-spark.svg"
      },
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
