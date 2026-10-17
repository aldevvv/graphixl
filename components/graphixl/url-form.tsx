"use client";

import React, { useState } from "react";
import { Link2, Loader2 } from "lucide-react";

interface UrlFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
  onClearError: () => void;
}

const SAMPLE_URLS = [
  { label: "Next.js Repository", url: "https://github.com/vercel/next.js" },
  { label: "Next.js Blog", url: "https://nextjs.org/blog/next-15" },
];

export function UrlForm({
  onSubmit,
  isLoading,
  errorMessage,
  onClearError,
}: UrlFormProps): React.JSX.Element {
  const [inputUrl, setInputUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || isLoading) return;
    onClearError();
    onSubmit(inputUrl.trim());
  };

  const handleSelectSample = (sampleUrl: string) => {
    setInputUrl(sampleUrl);
    onClearError();
    onSubmit(sampleUrl);
  };

  return (
    <div className="w-full max-w-[720px] mx-auto flex flex-col items-center">
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className={`group relative flex flex-col sm:flex-row items-stretch sm:items-center rounded-[10px] border bg-white p-1.5 transition-colors sm:h-14 ${
            errorMessage
              ? "border-red-500 ring-1 ring-red-500"
              : "border-[#E5E5E5] hover:bg-[#FAFAFA] hover:shadow-xs focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0A0A0A]/5"
          }`}
        >
          <div className="hidden sm:flex items-center pl-3 pr-1 text-[#737373]">
            <Link2 className="size-4" />
          </div>

          <input
            type="url"
            value={inputUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              if (errorMessage) onClearError();
            }}
            placeholder="Paste any article, website, or repository URL"
            required
            disabled={isLoading}
            className="flex-1 min-w-0 bg-transparent px-3 py-2 text-[15px] text-[#0A0A0A] placeholder:text-[#737373] outline-none disabled:opacity-50"
            aria-label="Target website URL"
          />

          <button
            type="submit"
            disabled={isLoading || !inputUrl.trim()}
            className="mt-2 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#0A0A0A] px-5 h-10 text-sm font-medium text-white transition-colors hover:bg-[#262626] disabled:pointer-events-none disabled:opacity-40 shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Fetching metadata...</span>
              </>
            ) : (
              <span>Generate card</span>
            )}
          </button>
        </div>
      </form>

      {/* Error Feedback */}
      {errorMessage && (
        <div className="mt-3 w-full rounded-[8px] border border-red-200 bg-red-50/80 px-4 py-2.5 text-sm text-red-700 text-left">
          {errorMessage}
        </div>
      )}

      {/* Sample Shortcuts */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[13px] text-[#737373]">
        <span>Try a sample:</span>
        {SAMPLE_URLS.map((sample, idx) => (
          <React.Fragment key={sample.url}>
            {idx > 0 && <span className="text-[#E5E5E5]">·</span>}
            <button
              type="button"
              onClick={() => handleSelectSample(sample.url)}
              disabled={isLoading}
              className="text-[#525252] hover:text-[#0A0A0A] hover:underline transition-colors"
            >
              {sample.label}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
