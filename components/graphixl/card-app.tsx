"use client";

import React, { useState } from "react";
import { CardDocument, TemplateId } from "@/lib/cards/types";
import { composeInitialCardDocument } from "@/lib/cards/compose";
import { NormalizedMetadata } from "@/lib/resolver/types";
import { Hero } from "./hero";
import { UrlForm } from "./url-form";
import { CardWorkspace } from "./card-workspace";
import { HowItWorks } from "./how-it-works";
import { TemplatesSection } from "./templates-section";
import { AboutSection } from "./about-section";
import { toast } from "sonner";

const DEMO_METADATA: NormalizedMetadata = {
  url: "https://github.com/aldevvv/graphixl",
  siteName: "GitHub",
  title: "aldevvv/graphixl",
  description:
    "An open-source tool for turning URLs into polished, customizable social media cards with live previews and high-resolution image exports.",
  imageUrl: null,
  faviconUrl: "https://github.githubassets.com/favicons/favicon.svg",
  provider: "github",
  extra: {
    owner: "aldevvv",
    repo: "graphixl",
    language: "TypeScript",
  },
};

export function CardApp(): React.JSX.Element {
  const [activeDocument, setActiveDocument] = useState<CardDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmitUrl = async (url: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to retrieve metadata from this URL");
      }

      const doc = composeInitialCardDocument(data.metadata);
      setActiveDocument(doc);
      toast.success("Metadata extracted successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resolve link metadata";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (templateId: TemplateId) => {
    if (activeDocument) {
      setActiveDocument({
        ...activeDocument,
        template: templateId,
      });
    } else {
      const doc = composeInitialCardDocument(DEMO_METADATA, templateId);
      setActiveDocument(doc);
    }

    const workspaceEl = window.document.getElementById("workspace");
    if (workspaceEl) {
      workspaceEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* State A (Hero) vs State B (Compact URL Form) */}
      {activeDocument ? (
        <div className="w-full max-w-[720px] mx-auto pt-8 pb-2 px-4 flex flex-col items-center">
          <UrlForm
            onSubmit={handleSubmitUrl}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onClearError={() => setErrorMessage(null)}
          />
        </div>
      ) : (
        <Hero
          onSubmitUrl={handleSubmitUrl}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onClearError={() => setErrorMessage(null)}
        />
      )}

      {/* Interactive Card Workspace (Revealed upon generation or template click) */}
      {activeDocument && (
        <CardWorkspace
          document={activeDocument}
          onChangeDocument={setActiveDocument}
          isLoading={isLoading}
        />
      )}

      {/* Same-Page Supporting Sections */}
      <HowItWorks />
      <TemplatesSection onSelectTemplate={handleSelectTemplate} />
      <AboutSection />
    </div>
  );
}
