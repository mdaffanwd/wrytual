import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  swcMinifyOptions: {
    compress: {
      drop_console: true,
    },
  }
};

export default nextConfig;
