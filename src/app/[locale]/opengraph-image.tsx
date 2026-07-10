import { ImageResponse } from "next/og";

export const alt = "João Pedro Gaspar — Front-end para e-commerce premium";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1b1a17",
          color: "#ede8de",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "26px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#a84343",
          }}
        >
          Front-end · E-commerce · Craft
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "92px",
            fontWeight: 700,
            lineHeight: 1.02,
            maxWidth: "920px",
            letterSpacing: "-2px",
          }}
        >
          Front-end para e-commerce premium.
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: "30px",
          }}
        >
          <span style={{ display: "flex" }}>João Pedro Gaspar</span>
          <span style={{ display: "flex", color: "#b7b1a4" }}>
            jpg-portfolio.vercel.app
          </span>
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 0,
            bottom: 0,
            height: "12px",
            width: "100%",
            background: "#7c2d2d",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
