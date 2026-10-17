import React from "react";

export function GraphixlLogo({ className = "" }: { className?: string }): React.JSX.Element {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div className="relative flex items-center justify-center size-7 rounded-md bg-[#0A0A0A] text-white">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          <rect x="3" y="3" width="18" height="18" rx="2.5" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
          <circle cx="15" cy="15" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <span className="font-bold text-[17px] tracking-tight text-[#0A0A0A]">
        Graphixl
      </span>
    </div>
  );
}
