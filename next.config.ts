import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["starkzap"],
  turbopack: {
    resolveAlias: {
      // Shim optional peer dep — we don't use Cartridge Controller
      "@cartridge/controller": "./src/lib/shims/cartridge-controller.ts",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
      },
    ],
  },
};

export default nextConfig;
