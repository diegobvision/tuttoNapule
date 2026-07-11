import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/config";

export const runtime = "edge";
export const alt = `${SITE_NAME} — Authentic Neapolitan & Italian food in the UK`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded fallback OG card for any route without its own image.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f6f0e3 0%, #eee5cf 100%)",
          color: "#2b1d12",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#c9822e",
            fontFamily: "sans-serif",
            marginBottom: 12,
          }}
        >
          Cucina · Casa · Ricette
        </div>
        <div style={{ display: "flex", fontSize: 118, fontWeight: 700, lineHeight: 1 }}>
          Tutto Napule
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            marginTop: 24,
            color: "#6b5847",
            fontStyle: "italic",
          }}
        >
          A taste of Naples, delivered across the UK
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 44,
            display: "flex",
            gap: 12,
            color: "#c9822e",
            fontSize: 40,
          }}
        >
          ✦ ✦ ✦
        </div>
      </div>
    ),
    { ...size }
  );
}
