import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const windowChrome = {
  display: "flex",
  alignItems: "center",
  width: 14,
  height: 14,
  borderRadius: 999,
} as const;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: site.backgroundColor,
          color: "#ffffff",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          padding: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: "#1a1919",
            border: "1px solid #4a4540",
            borderRadius: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "18px 24px",
              background: "#393f3f",
              borderBottom: "1px solid #4a4540",
            }}
          >
            <div style={{ ...windowChrome, background: "#ff5f57" }} />
            <div
              style={{ ...windowChrome, background: "#febc2e", marginLeft: 10 }}
            />
            <div
              style={{ ...windowChrome, background: "#28c840", marginLeft: 10 }}
            />
            <div
              style={{
                display: "flex",
                marginLeft: 16,
                fontSize: 22,
                color: "#bbc2c0",
                letterSpacing: 0.4,
              }}
            >
              {site.name}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flexGrow: 1,
              padding: "48px 64px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 28,
                color: site.themeColor,
                letterSpacing: 4,
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              Linux-inspired web desktop
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 76,
                fontWeight: 700,
                lineHeight: 1.05,
                marginBottom: 18,
              }}
            >
              {site.author}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 34,
                color: "#bbc2c0",
                marginBottom: 36,
              }}
            >
              {site.jobTitle} · Open Source Contributor
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 26,
                color: site.themeColor,
              }}
            >
              {site.url.replace("https://", "")}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
