import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Parsers for uploaded job descriptions run only in Node route handlers.
  serverExternalPackages: ["pdf-parse", "mammoth"],
  poweredByHeader: false,
  // Pin the workspace root (a stray lockfile in a parent folder otherwise confuses tracing).
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
