import { ImageResponse } from "next/og";
import { getAllPosts, getPost } from "@/lib/blog";

export const alt = "Unhired blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

/** Share card for each post: dark brand panel, gradient glow, the post title. */
export default async function PostOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  const title = post?.title ?? "The AI Employee Blog";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0E0B1F",
          color: "white",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -160,
            bottom: -220,
            width: 640,
            height: 640,
            borderRadius: 999,
            background: "linear-gradient(120deg, #F65663 0%, #9452F2 100%)",
            opacity: 0.55,
            filter: "blur(90px)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              background: "white",
              borderRadius: 999,
              padding: "12px 26px",
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: -2,
            }}
          >
            <span style={{ color: "#F65663" }}>un</span>
            <span style={{ color: "#0E0B1F" }}>hired</span>
          </div>
          <div style={{ fontSize: 22, letterSpacing: 3, opacity: 0.6 }}>THE AI EMPLOYEE BLOG</div>
        </div>
        <div style={{ display: "flex", fontSize: title.length > 48 ? 66 : 80, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05, maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 26, opacity: 0.8 }}>unhired.io/blog</div>
      </div>
    ),
    size,
  );
}
