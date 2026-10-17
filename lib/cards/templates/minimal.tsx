import React from "react";
import { TemplateProps } from "./editorial";

export function MinimalTemplate({ document, dimensions }: TemplateProps): React.JSX.Element {
  const { customization, aspectRatio } = document;
  const isVertical = aspectRatio === "story" || aspectRatio === "portrait";
  const padding = Math.round(dimensions.width * 0.08);
  const headlineSize = isVertical ? 64 : 56;

  const fontStack =
    customization.fontFamily === "serif"
      ? "Georgia, serif"
      : customization.fontFamily === "mono"
      ? "SFMono-Regular, Consolas, monospace"
      : "Satoshi, Inter, sans-serif";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        backgroundColor: customization.backgroundColor,
        color: customization.textColor,
        padding: `${padding}px`,
        boxSizing: "border-box",
        fontFamily: fontStack,
      }}
    >
      {/* Top: Minimal domain label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          style={{
            fontSize: "18px",
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            opacity: 0.6,
          }}
        >
          {customization.siteName || "Link"}
        </span>
      </div>

      {/* Center: Typography focus */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "90%",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: `${headlineSize}px`,
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            color: customization.textColor,
          }}
        >
          {customization.title}
        </h1>

        {customization.description && (
          <p
            style={{
              margin: 0,
              fontSize: "26px",
              lineHeight: 1.5,
              opacity: 0.7,
              maxWidth: "85%",
            }}
          >
            {customization.description}
          </p>
        )}
      </div>

      {/* Bottom: Accent bar & subtle details */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "24px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "4px",
            borderRadius: "2px",
            backgroundColor: customization.accentColor,
          }}
        />

        {customization.author && (
          <span
            style={{
              fontSize: "18px",
              opacity: 0.5,
            }}
          >
            {customization.author}
          </span>
        )}
      </div>
    </div>
  );
}
