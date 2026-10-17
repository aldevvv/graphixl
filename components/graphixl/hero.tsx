"use client";

import React from "react";
import { motion } from "framer-motion";
import { UrlForm } from "./url-form";

interface HeroProps {
  onSubmitUrl: (url: string) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
  onClearError: () => void;
}

export function Hero({
  onSubmitUrl,
  isLoading,
  errorMessage,
  onClearError,
}: HeroProps): React.JSX.Element {
  return (
    <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl flex flex-col items-center px-4"
      >
        {/* Primary headline */}
        <h1 className="text-4xl sm:text-5xl md:text-[56px] font-bold tracking-tight text-[#0A0A0A] leading-[1.08] max-w-2xl">
          Turn any link into a visual worth sharing.
        </h1>

        {/* Supporting description */}
        <p className="mt-4 text-base text-[#525252] max-w-xl font-normal leading-relaxed">
          Paste a URL, customize the design, and download a card ready to share.
        </p>

        {/* Main URL Input */}
        <div className="mt-8 w-full">
          <UrlForm
            onSubmit={onSubmitUrl}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onClearError={onClearError}
          />
        </div>
      </motion.div>
    </section>
  );
}
