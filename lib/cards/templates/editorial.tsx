import React from "react";
import { CardDocument, getCardDisplayUrl } from "../types";

export interface TemplateProps {
  document: CardDocument;
  dimensions: { width: number; height: number };
  resolvedImageUrl?: string | null;
}

export function EditorialTemplate({ document, dimensions, resolvedImageUrl }: TemplateProps): React.JSX.Element {
  const { customization, aspectRatio } = document;
  const isVertical = aspectRatio === "story" || aspectRatio === "portrait";
  const isLandscape = aspectRatio === "landscape" || aspectRatio === "social";

  const padding = Math.round(dimensions.width * 0.07);
  const headlineSize = isVertical ? 58 : isLandscape ? 52 : 56;
  const bodySize = isVertical ? 28 : 24;
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
      {/* Top Bar: Site Name & Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingBottom: "24px",
          borderBottom: "1px solid rgba(23, 24, 21, 0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: customization.accentColor,
            }}
          />
          <span
            style={{
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            {customization.siteName || document.metadata.siteName || "Web"}
          </span>
        </div>

        {customization.badge && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 14px",
              borderRadius: "999px",
              backgroundColor: "rgba(23, 24, 21, 0.05)",
              fontSize: "16px",
              fontWeight: 500,
              opacity: 0.75,
            }}
          >
            {customization.badge}
          </div>
        )}
      </div>

      {/* Main Body */}
      {(() => {
        const isImageAbove = customization.imagePlacement === "above";

        const imageElement = resolvedImageUrl && customization.showImage ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: isLandscape ? "40%" : "100%",
              height: isLandscape ? "300px" : isVertical ? "400px" : "260px",
              flexShrink: 0,
              overflow: "hidden",
              borderRadius: "16px",
              border: "1px solid rgba(23, 24, 21, 0.1)",
              backgroundColor: "rgba(23, 24, 21, 0.04)",
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
              minWidth: 0,
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
                  margin: "20px 0 0 0",
                  fontSize: `${bodySize}px`,
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
              flexDirection: isLandscape && resolvedImageUrl && customization.showImage ? "row" : "column",
              alignItems: "center",
              gap: "36px",
              flex: 1,
              justifyContent: "center",
              marginTop: "24px",
              marginBottom: "24px",
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

      {/* Footer Details */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "24px",
          borderTop: "1px solid rgba(23, 24, 21, 0.12)",
          fontSize: "18px",
          opacity: 0.75,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
          {customization.author ? <span>By {customization.author}</span> : <span>Article</span>}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            maxWidth: "70%",
            overflow: "hidden",
          }}
        >
          {displayUrl ? (
            <span
              style={{
                fontSize: "17px",
                fontWeight: 500,
                opacity: 0.85,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayUrl}
            </span>
          ) : (
            <span style={{ opacity: 0.5 }}>graphixl</span>
          )}
        </div>
      </div>
    </div>
  );
}
