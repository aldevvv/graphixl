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
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [document.id]);

  const handleReset = () => {
    const fresh = composeInitialCardDocument(
      document.metadata,
      document.template,
      document.aspectRatio
    );
    onChangeDocument(fresh);
  };

  return (
    <motion.section
      ref={workspaceRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-[min(1120px,calc(100%-48px))] mx-auto my-8 flex flex-col items-center gap-6"
      id="workspace"
    >
      {/* 1. Large Centered Canvas Preview (Top) */}
      <div className="w-full flex justify-center">
        <CardPreview document={document} isLoading={isLoading} />
      </div>

      {/* 2. Customization Controls (Below Canvas) */}
      <div className="w-full bg-white border border-[#E5E5E5] rounded-[12px] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <AppearanceControls
          document={document}
          onChange={onChangeDocument}
          onReset={handleReset}
        />
      </div>

      {/* 3. Export Controls */}
      <div className="w-full bg-white border border-[#E5E5E5] rounded-[12px] p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <ExportControls document={document} />
      </div>
    </motion.section>
  );
}
