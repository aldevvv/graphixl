import React from "react";
import { GraphixlLogo } from "./logo";

export function SiteFooter(): React.JSX.Element {
  return (
    <footer className="w-full border-t border-[#E5E5E5] bg-white py-10">
      <div className="w-[min(1200px,calc(100%-48px))] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-[#525252]">
        <div className="flex items-center gap-4">
          <GraphixlLogo />
          <span className="text-xs text-[#737373]">Turn any link into a visual worth sharing.</span>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <a
            href="https://github.com/aldevvv/graphixl"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0A0A0A] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://github.com/aldevvv/graphixl/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0A0A0A] transition-colors"
          >
            MIT License
          </a>
          <span>2026 Graphixl</span>
        </div>
      </div>
    </footer>
  );
}
