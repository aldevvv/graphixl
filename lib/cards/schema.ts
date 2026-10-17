import { z } from "zod";

export const AspectRatioPresetSchema = z.enum([
  "square",
  "portrait",
  "story",
  "landscape",
  "social",
]);

export const TemplateIdSchema = z.enum([
  "editorial",
  "minimal",
  "product",
  "repository",
]);

export const TypographyFamilySchema = z.enum(["satoshi", "serif", "mono"]);
export const UrlDisplayModeSchema = z.enum(["domain", "full", "none"]);
export const ImagePlacementSchema = z.enum(["above", "below"]);

export const CardCustomizationSchema = z.object({
  title: z.string().max(300),
  description: z.string().max(800),
  siteName: z.string().max(100),
  author: z.string().max(100),
  badge: z.string().max(60),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{3,8}$/),
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{3,8}$/),
  textColor: z.string().regex(/^#[0-9a-fA-F]{3,8}$/),
  showImage: z.boolean(),
  imageUrl: z.string().nullable().default(null),
  imagePlacement: ImagePlacementSchema.default("below"),
  fontFamily: TypographyFamilySchema,
  urlDisplayMode: UrlDisplayModeSchema.default("domain"),
  customUrl: z.string().max(2048).optional(),
});

export const NormalizedMetadataSchema = z.object({
  url: z.string().url().max(2048),
  siteName: z.string().max(150),
  title: z.string().max(400),
  description: z.string().max(1000),
  imageUrl: z.string().nullable(),
  faviconUrl: z.string().nullable(),
  provider: z.enum(["generic", "github"]),
  extra: z.record(z.string(), z.unknown()).optional(),
});

export const CardDocumentSchema = z.object({
  id: z.string().min(1).max(64),
  version: z.number().int().positive(),
  url: z.string().url().max(2048),
  template: TemplateIdSchema,
  aspectRatio: AspectRatioPresetSchema,
  metadata: NormalizedMetadataSchema,
  customization: CardCustomizationSchema,
});

export const RenderRequestSchema = z.object({
  document: CardDocumentSchema,
  scale: z.number().min(1).max(3).default(1),
  format: z.enum(["png", "svg"]).default("png"),
});

export type RenderRequest = z.infer<typeof RenderRequestSchema>;
