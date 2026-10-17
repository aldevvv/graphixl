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
