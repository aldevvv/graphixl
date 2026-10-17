import React from "react";
import { CardDocument, TemplateId } from "../types";
import { EditorialTemplate, TemplateProps } from "./editorial";
import { MinimalTemplate } from "./minimal";
import { ProductTemplate } from "./product";
import { RepositoryTemplate } from "./repository";

export const TEMPLATE_COMPONENTS: Record<TemplateId, React.ComponentType<TemplateProps>> = {
  editorial: EditorialTemplate,
  minimal: MinimalTemplate,
  product: ProductTemplate,
  repository: RepositoryTemplate,
};

export const TEMPLATE_METADATA: Record<TemplateId, { name: string; description: string }> = {
  editorial: {
    name: "Editorial",
    description: "Designed for articles, essays, and long-form writing.",
  },
  minimal: {
    name: "Minimal",
    description: "Generous whitespace, quiet typography, and minimal decoration.",
  },
  product: {
    name: "Product Spotlight",
    description: "Prominent preview images, product headlines, and clear details.",
  },
  repository: {
    name: "Repository Spotlight",
    description: "Engineered for GitHub projects, owner hierarchy, and repository stats.",
  },
};

export function renderCardComponent(
  document: CardDocument,
  dimensions: { width: number; height: number },
  resolvedImageUrl?: string | null
): React.ReactElement {
  const Component = TEMPLATE_COMPONENTS[document.template] || EditorialTemplate;
  return React.createElement(Component, {
    document,
    dimensions,
    resolvedImageUrl,
  });
}
