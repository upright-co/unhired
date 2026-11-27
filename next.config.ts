import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Parsers for uploaded job descriptions run only in Node route handlers.
  serverExternalPackages: ["pdf-parse", "mammoth"],
  poweredByHeader: false,
  // Pin the workspace root (a stray lockfile in a parent folder otherwise confuses tracing).
  outputFileTracingRoot: path.join(__dirname),
  // The pilot confirmation email attaches this PDF from disk.
  outputFileTracingIncludes: { "/api/pilot/apply": ["./public/pilot/**"] },
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
      {
        source: "/proposals/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/premier-garage",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/partners",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  // Client proposals are static pages in public/proposals/<client>/, served at a short URL.
  async rewrites() {
    return [
      { source: "/premier-garage", destination: "/proposals/premier-garage/index.html" },
      { source: "/partners", destination: "/proposals/partners/index.html" },
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
