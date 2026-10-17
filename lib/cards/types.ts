import { NormalizedMetadata } from "../resolver/types";

export type AspectRatioPreset = "square" | "portrait" | "story" | "landscape" | "social";

export type TemplateId = "editorial" | "minimal" | "product" | "repository";

export type TypographyFamily = "satoshi" | "serif" | "mono";

export interface AspectRatioConfig {
  width: number;
  height: number;
  label: string;
  ratio: string;
}

export const ASPECT_RATIO_CONFIGS: Record<AspectRatioPreset, AspectRatioConfig> = {
  square: { width: 1080, height: 1080, label: "Square", ratio: "1:1" },
  portrait: { width: 1080, height: 1350, label: "Portrait", ratio: "4:5" },
  story: { width: 1080, height: 1920, label: "Story", ratio: "9:16" },
  landscape: { width: 1200, height: 675, label: "Landscape", ratio: "16:9" },
  social: { width: 1200, height: 630, label: "Social Share", ratio: "1.91:1" },
};

export type UrlDisplayMode = "domain" | "full" | "none";

export interface CardCustomization {
  title: string;
  description: string;
  siteName: string;
  author: string;
  badge: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  showImage: boolean;
  imageUrl: string | null;
  fontFamily: TypographyFamily;
  urlDisplayMode?: UrlDisplayMode;
  customUrl?: string;
}

export interface CardDocument {
  id: string;
  version: number;
  url: string;
  template: TemplateId;
  aspectRatio: AspectRatioPreset;
  metadata: NormalizedMetadata;
  customization: CardCustomization;
}

export function getCardDisplayUrl(document: {
  url?: string;
  customization?: {
    urlDisplayMode?: UrlDisplayMode;
    customUrl?: string;
  };
}): string {
  const mode = document.customization?.urlDisplayMode ?? "domain";
  if (mode === "none") {
    return "";
  }
  if (document.customization?.customUrl && document.customization.customUrl.trim().length > 0) {
    return document.customization.customUrl.trim();
  }
  const rawUrl = document.url || "";
  if (!rawUrl) return "";

  try {
    const parsed = new URL(
      rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
        ? rawUrl
        : `https://${rawUrl}`
    );
    if (mode === "domain") {
      return parsed.hostname;
    }
    const pathAndSearch = (parsed.pathname === "/" ? "" : parsed.pathname) + parsed.search;
    return `${parsed.hostname}${pathAndSearch}`;
  } catch {
    return rawUrl;
  }
}
