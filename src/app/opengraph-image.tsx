import { ImageResponse } from "next/og";

export const alt = "Unhired — Let your next hire be AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Brand gradient OG card with the wordmark. Uses a text wordmark so it renders even before
 * /public/unhired-logo.png exists; swap in the PNG via <img src={...}> if you prefer.
 */
export default function OgImage() {
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
          background: "linear-gradient(120deg, #F65663 0%, #9452F2 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "white",
            borderRadius: 999,
            padding: "14px 30px",
            alignSelf: "flex-start",
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: -2,
          }}
        >
          <span style={{ color: "#F65663" }}>un</span>
          <span style={{ color: "#0E0B1F" }}>hired</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: -4, lineHeight: 1.02 }}>
            Let your next hire be AI.
          </div>
          <div style={{ fontSize: 32, marginTop: 24, opacity: 0.92 }}>
            Before you post the job, see if AI can do it.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 24, opacity: 0.9 }}>
          <div style={{ width: 14, height: 14, borderRadius: 99, background: "#22C55E", marginRight: 12 }} />
          Free AI Hire Assessment
        </div>
      </div>
    ),
    size,
  );
}
