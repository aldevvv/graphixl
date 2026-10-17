import React from "react";
import { TemplateProps } from "./editorial";

export function RepositoryTemplate({ document, dimensions }: TemplateProps): React.JSX.Element {
  const { customization, metadata, aspectRatio } = document;
  const isVertical = aspectRatio === "story" || aspectRatio === "portrait";
  const padding = Math.round(dimensions.width * 0.075);
  const headlineSize = isVertical ? 58 : 50;

  const fontStack =
    customization.fontFamily === "mono"
      ? "SFMono-Regular, Consolas, monospace"
      : "Satoshi, Inter, sans-serif";

  const owner = (metadata.extra?.owner as string) || customization.author || "github";
  const repo = (metadata.extra?.repo as string) || customization.title;
  const language = (metadata.extra?.language as string) || "";
  const stars = metadata.extra?.stars as number | undefined;

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
      {/* Header: GitHub badge and tag */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "8px",
              backgroundColor: "rgba(23, 24, 21, 0.06)",
              fontSize: "17px",
              fontWeight: 600,
            }}
          >
            <span>github.com</span>
            <span style={{ opacity: 0.4 }}>/</span>
            <span>{owner}</span>
          </div>
        </div>

        {language && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "18px",
              fontWeight: 500,
              opacity: 0.8,
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: customization.accentColor,
              }}
            />
            <span>{language}</span>
          </div>
        )}
      </div>

      {/* Main Content: Repo name & description */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          margin: "24px 0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span
            style={{
              fontSize: "22px",
              fontWeight: 500,
              opacity: 0.5,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Open Source Repository
          </span>
          <h1
            style={{
              margin: 0,
              fontSize: `${headlineSize}px`,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: customization.textColor,
            }}
          >
            {repo}
          </h1>
        </div>

        {customization.description && (
          <p
            style={{
              margin: 0,
              fontSize: "26px",
              lineHeight: 1.5,
              opacity: 0.75,
              maxWidth: "92%",
            }}
          >
            {customization.description}
          </p>
        )}
      </div>

      {/* Footer Metrics */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "24px",
          borderTop: "1px solid rgba(23, 24, 21, 0.12)",
          fontSize: "19px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {stars !== undefined && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: 600 }}>{stars.toLocaleString()}</span>
              <span style={{ opacity: 0.6 }}>stars</span>
            </div>
          )}
          <span style={{ opacity: 0.5 }}>Public repository</span>
        </div>

        <span style={{ opacity: 0.5 }}>graphixl</span>
      </div>
    </div>
  );
}
