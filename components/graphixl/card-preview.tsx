"use client";

import React, { useRef, useState, useEffect } from "react";
import { CardDocument, ASPECT_RATIO_CONFIGS } from "@/lib/cards/types";
import { renderCardComponent } from "@/lib/cards/templates";

interface CardPreviewProps {
  document: CardDocument;
  isLoading?: boolean;
}

export function CardPreview({ document, isLoading }: CardPreviewProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.8);

  const config = ASPECT_RATIO_CONFIGS[document.aspectRatio] || ASPECT_RATIO_CONFIGS.social;

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const availableWidth = containerRef.current.clientWidth - 32; // account for padding
      if (availableWidth <= 0 || config.width <= 0) return;

      // Available height based on viewport (max ~72vh or 740px)
      const viewportMaxHeight =
        typeof window !== "undefined" ? Math.min(window.innerHeight * 0.72, 740) : 600;

      const scaleByWidth = availableWidth / config.width;
      const scaleByHeight = viewportMaxHeight / config.height;

      // Vertical formats (story/portrait) respect height constraint
      if (config.height > config.width) {
        setScale(Math.min(scaleByWidth, scaleByHeight));
      } else {
        setScale(Math.min(scaleByWidth, 1));
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener("resize", updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [config.width, config.height]);

  const targetWidth = Math.round(config.width * scale);
  const targetHeight = Math.round(config.height * scale);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Canvas Metadata */}
      <div className="mb-2.5 flex items-center justify-between w-full max-w-[1040px] px-1 text-[13px] text-[#737373]">
        <span className="font-medium text-[#0A0A0A]">
          {config.label}
        </span>
        <span>
          {config.width} × {config.height} px
        </span>
      </div>

      {/* Main Canvas Stage (Centered, Clean Single Boundary) */}
      <div
        ref={containerRef}
        className="w-full max-w-[1040px] flex items-center justify-center p-3 sm:p-5 rounded-[12px] bg-[#FAFAFA] border border-[#E5E5E5]"
      >
        <div
          className="relative overflow-hidden rounded-[8px] border border-[#E5E5E5] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-200"
          style={{
            width: `${targetWidth}px`,
            height: `${targetHeight}px`,
          }}
        >
          {/* Scaled Full-Resolution Canvas */}
          <div
            style={{
              width: `${config.width}px`,
              height: `${config.height}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              position: "absolute",
              top: 0,
              left: 0,
              userSelect: "none",
            }}
          >
            {renderCardComponent(document, config, document.customization.imageUrl)}
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-xs">
              <div className="size-6 animate-spin rounded-full border-2 border-[#0A0A0A] border-t-transparent" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
