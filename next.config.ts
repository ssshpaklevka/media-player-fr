import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/media-player",
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.selstorage.ru", // wildcard для всех поддоменов
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
