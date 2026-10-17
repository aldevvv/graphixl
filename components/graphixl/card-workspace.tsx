"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { CardDocument } from "@/lib/cards/types";
import { composeInitialCardDocument } from "@/lib/cards/compose";
import { CardPreview } from "./card-preview";
import { AppearanceControls } from "./appearance-controls";
import { ExportControls } from "./export-controls";

interface CardWorkspaceProps {
  document: CardDocument;
  onChangeDocument: (updated: CardDocument) => void;
  isLoading?: boolean;
}

export function CardWorkspace({
  document,
  onChangeDocument,
  isLoading,
}: CardWorkspaceProps): React.JSX.Element {
  const workspaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smoothly scroll workspace into view if it was newly activated
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [document.id]);

  const handleReset = () => {
    const fresh = composeInitialCardDocument(document.metadata, document.template, document.aspectRatio);
    onChangeDocument(fresh);
  };

  return (
    <motion.section
      ref={workspaceRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-[min(1080px,calc(100%-48px))] mx-auto my-10 flex flex-col items-center gap-12"
      id="workspace"
    >
      {/* 1. Large Centered Canvas Preview (Always Top) */}
      <div className="w-full flex justify-center">
        <CardPreview document={document} isLoading={isLoading} />
      </div>

      {/* 2. Customization Controls (Always Below Canvas) */}
      <div className="w-full max-w-[1040px] pt-4">
        <AppearanceControls
          document={document}
          onChange={onChangeDocument}
          onReset={handleReset}
        />
      </div>

      {/* 3. Export Controls */}
      <div className="w-full max-w-[1040px]">
        <ExportControls document={document} />
      </div>
    </motion.section>
  );
}
