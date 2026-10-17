import React from "react";
import { TemplateProps } from "./editorial";
import { getCardDisplayUrl } from "../types";

export function MinimalTemplate({
  document,
  dimensions,
  resolvedImageUrl,
}: TemplateProps): React.JSX.Element {
  const { customization, aspectRatio } = document;
  const isVertical = aspectRatio === "story" || aspectRatio === "portrait";
  const isLandscape = aspectRatio === "landscape" || aspectRatio === "social";
  const padding = Math.round(dimensions.width * 0.08);
  const headlineSize = isVertical ? 64 : 56;
  const displayUrl = getCardDisplayUrl(document);

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
          {customization.siteName || document.metadata.siteName || "Link"}
        </span>
      </div>

      {/* Center: Typography focus with optional thumbnail */}
      <div
        style={{
          display: "flex",
          flexDirection: isLandscape && resolvedImageUrl && customization.showImage ? "row" : "column",
          alignItems: isLandscape ? "center" : "flex-start",
          justifyContent: "space-between",
          gap: "32px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            flex: 1,
            minWidth: 0,
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

        {resolvedImageUrl && customization.showImage && (
          <div
            style={{
              display: "flex",
              width: isLandscape ? "38%" : "100%",
              height: isLandscape ? "280px" : isVertical ? "380px" : "240px",
              flexShrink: 0,
              borderRadius: "14px",
              overflow: "hidden",
              border: "1px solid rgba(23, 24, 21, 0.08)",
              backgroundColor: "rgba(23, 24, 21, 0.03)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolvedImageUrl}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
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
            display: "flex",
            alignItems: "center",
            gap: "16px",
            maxWidth: "70%",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "4px",
              borderRadius: "2px",
              backgroundColor: customization.accentColor,
              flexShrink: 0,
            }}
          />
          {displayUrl && (
            <span
              style={{
                fontSize: "18px",
                fontWeight: 500,
                opacity: 0.75,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayUrl}
            </span>
          )}
        </div>

        {customization.author && (
          <span
            style={{
              fontSize: "18px",
              opacity: 0.6,
              flexShrink: 0,
            }}
          >
            {customization.author}
          </span>
        )}
      </div>
    </div>
  );
}
