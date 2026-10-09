import type { MetadataRoute } from "next";
import { siteConfig } from "@/config";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const posts = getAllPosts();
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/assessment`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: posts[0]?.updated, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updated,
      changeFrequency: "monthly" as const,
      priority: p.pillar ? 0.9 : 0.7,
    })),
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
