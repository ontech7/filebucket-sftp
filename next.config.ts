import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["crypto", "ssh2", "ws"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/files/:folder/:name*",
        destination: "/api/file/:folder/:name*",
      },
    ];
  },
};

export default nextConfig;
