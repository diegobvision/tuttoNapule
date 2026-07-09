import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
  sassOptions: {
    // src/styles is on the load path, so any module can `@use "variables" as *;`
    // and `@use "mixins" as *;` without a long relative path.
    includePaths: ["./src/styles"],
  },
};

export default nextConfig;
