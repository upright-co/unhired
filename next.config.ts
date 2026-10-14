import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Parsers for uploaded job descriptions run only in Node route handlers.
  serverExternalPackages: ["pdf-parse", "mammoth"],
  poweredByHeader: false,
  // Pin the workspace root (a stray lockfile in a parent folder otherwise confuses tracing).
  outputFileTracingRoot: path.join(__dirname),
  // Publish kits' data files are read by the browser automation that drafts posts on Medium,
  // Substack and LinkedIn, from those sites' own pages, so they need CORS. Nothing private lives there.
  async headers() {
    return [
      {
        source: "/kits/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
    ];
  },
  // One canonical host for search: www.unhired.io permanently redirects to unhired.io.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.unhired.io" }],
        destination: "https://unhired.io/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
