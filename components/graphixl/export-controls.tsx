"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { CardDocument } from "@/lib/cards/types";
import { toast } from "sonner";

interface ExportControlsProps {
  document: CardDocument;
}

type ExportFormat = "png" | "svg";
type ExportResolution = 1 | 2;

export function ExportControls({ document }: ExportControlsProps): React.JSX.Element {
  const [format, setFormat] = useState<ExportFormat>("png");
  const [resolution, setResolution] = useState<ExportResolution>(2);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document,
          scale: format === "svg" ? 1 : resolution,
          format,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.error || "Failed to render card image");
      }

      const blob = await res.blob();
      const filename = `graphixl-${document.template}-${document.aspectRatio}.${format}`;

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success(`Downloaded ${filename}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Download failed";
      toast.error(msg);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-[#E5E5E5]">
      {/* Format & Resolution Pickers */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Format Selector */}
        <div className="inline-flex rounded-[8px] border border-[#E5E5E5] p-0.5 bg-white">
          <button
            type="button"
            onClick={() => setFormat("png")}
            className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors ${
              format === "png"
                ? "bg-[#0A0A0A] text-white"
                : "text-[#525252] hover:text-[#0A0A0A]"
            }`}
          >
            PNG
          </button>
          <button
            type="button"
            onClick={() => setFormat("svg")}
            className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors ${
              format === "svg"
                ? "bg-[#0A0A0A] text-white"
                : "text-[#525252] hover:text-[#0A0A0A]"
            }`}
          >
            SVG
          </button>
        </div>

        {/* Resolution Selector (for PNG) */}
        {format === "png" && (
          <div className="inline-flex rounded-[8px] border border-[#E5E5E5] p-0.5 bg-white">
            <button
              type="button"
              onClick={() => setResolution(2)}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors ${
                resolution === 2
                  ? "bg-[#0A0A0A] text-white"
                  : "text-[#525252] hover:text-[#0A0A0A]"
              }`}
            >
              2x (High-Res)
            </button>
            <button
              type="button"
              onClick={() => setResolution(1)}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors ${
                resolution === 1
                  ? "bg-[#0A0A0A] text-white"
                  : "text-[#525252] hover:text-[#0A0A0A]"
              }`}
            >
              1x (Standard)
            </button>
          </div>
        )}
      </div>

      {/* Primary Download Button */}
      <button
        type="button"
        disabled={isExporting}
        onClick={handleExport}
        className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#0A0A0A] px-6 h-11 text-sm font-medium text-white transition-colors hover:bg-[#262626] disabled:pointer-events-none disabled:opacity-50 shrink-0"
      >
        {isExporting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Rendering image...</span>
          </>
        ) : (
          <span>Download {format.toUpperCase()}</span>
        )}
      </button>
    </div>
  );
}
