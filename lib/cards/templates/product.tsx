import React from "react";
import { TemplateProps } from "./editorial";
import { getCardDisplayUrl } from "../types";

export function ProductTemplate({ document, dimensions, resolvedImageUrl }: TemplateProps): React.JSX.Element {
  const { customization, aspectRatio } = document;
  const isVertical = aspectRatio === "story" || aspectRatio === "portrait";
  const padding = Math.round(dimensions.width * 0.065);
  const headlineSize = isVertical ? 56 : 48;
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
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              backgroundColor: customization.accentColor,
              color: "#171815",
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            {customization.siteName || document.metadata.siteName || "Product"}
          </span>
        </div>

        {customization.badge && (
          <span
            style={{
              fontSize: "16px",
              fontWeight: 500,
              opacity: 0.65,
            }}
          >
            {customization.badge}
          </span>
        )}
      </div>

      {/* Main Content & Media */}
      {(() => {
        const isImageAbove = customization.imagePlacement === "above";

        const imageElement = resolvedImageUrl && customization.showImage ? (
          <div
            style={{
              display: "flex",
              width: isVertical ? "100%" : "44%",
              height: isVertical ? "420px" : "320px",
              flexShrink: 0,
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid rgba(23, 24, 21, 0.1)",
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
        ) : null;

        const textElement = (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: `${headlineSize}px`,
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                color: customization.textColor,
              }}
            >
              {customization.title}
            </h1>

            {customization.description && (
              <p
                style={{
                  margin: "18px 0 0 0",
                  fontSize: "24px",
                  lineHeight: 1.5,
                  opacity: 0.75,
                }}
              >
                {customization.description}
              </p>
            )}
          </div>
        );

        return (
          <div
            style={{
              display: "flex",
              flexDirection: isVertical ? "column" : "row",
              alignItems: "center",
              gap: "36px",
              flex: 1,
              margin: "24px 0",
              width: "100%",
            }}
          >
            {isImageAbove ? (
              <>
                {imageElement}
                {textElement}
              </>
            ) : (
              <>
                {textElement}
                {imageElement}
              </>
            )}
          </div>
        );
      })()}

      {/* Footer Info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "20px",
          borderTop: "1px solid rgba(23, 24, 21, 0.1)",
          fontSize: "17px",
          opacity: 0.75,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            maxWidth: "75%",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontWeight: 600,
              fontSize: "17px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayUrl || "View product"}
          </span>
        </div>
        <span style={{ opacity: 0.5 }}>graphixl</span>
      </div>
    </div>
  );
}
