import { NormalizedMetadata } from "../resolver/types";
import { AspectRatioPreset, CardDocument, TemplateId } from "./types";

export function getDefaultTemplateForMetadata(metadata: NormalizedMetadata): TemplateId {
  if (metadata.provider === "github") {
    return "repository";
  }
  if (metadata.imageUrl) {
    return "product";
  }
  return "editorial";
}

export function composeInitialCardDocument(
  metadata: NormalizedMetadata,
  preferredTemplate?: TemplateId,
  preferredAspectRatio: AspectRatioPreset = "social"
): CardDocument {
  const template = preferredTemplate || getDefaultTemplateForMetadata(metadata);

  const author =
    (metadata.extra?.author as string) ||
    (metadata.extra?.owner as string) ||
    "";

  let badge = metadata.siteName || "Web";
  if (metadata.provider === "github") {
    const lang = (metadata.extra?.language as string) || "Repository";
    const stars = metadata.extra?.stars as number | undefined;
    badge = stars ? `${lang} • ${stars.toLocaleString()} stars` : lang;
  }

  return {
    id: `card_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    version: 1,
    url: metadata.url,
    template,
    aspectRatio: preferredAspectRatio,
    metadata,
    customization: {
      title: metadata.title || "Untitled Link",
      description: metadata.description || "",
      siteName: metadata.siteName || "",
      author,
      badge,
      accentColor: "#0A0A0A",
      backgroundColor: "#FFFFFF",
      textColor: "#0A0A0A",
      showImage: Boolean(metadata.imageUrl),
      imageUrl: metadata.imageUrl,
      fontFamily: "satoshi",
    },
  };
}
