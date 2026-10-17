import test from "node:test";
import assert from "node:assert/strict";
import {
  CardDocumentSchema,
  RenderRequestSchema,
  CardCustomizationSchema,
} from "../lib/cards/schema";
import { CardDocument } from "../lib/cards/types";

const VALID_DOC: CardDocument = {
  id: "card_123456",
  version: 1,
  url: "https://example.com",
  template: "editorial",
  aspectRatio: "social",
  metadata: {
    url: "https://example.com",
    siteName: "Example",
    title: "Test Title",
    description: "Test Description",
    imageUrl: null,
    faviconUrl: null,
    provider: "generic",
  },
  customization: {
    title: "Test Title",
    description: "Test Description",
    siteName: "Example",
    author: "Alice",
    badge: "Article",
    accentColor: "#D8FF4F",
    backgroundColor: "#FFFFFF",
    textColor: "#171815",
    showImage: false,
    imageUrl: null,
    fontFamily: "satoshi",
    urlDisplayMode: "domain",
  },
};

test("CardDocumentSchema: accepts a valid card document", () => {
  const parsed = CardDocumentSchema.safeParse(VALID_DOC);
  assert.equal(parsed.success, true);
});

test("CardDocumentSchema: rejects unknown templates", () => {
  const invalid = { ...VALID_DOC, template: "nonexistent-template" };
  const parsed = CardDocumentSchema.safeParse(invalid);
  assert.equal(parsed.success, false);
});

test("CardDocumentSchema: rejects invalid aspect ratios", () => {
  const invalid = { ...VALID_DOC, aspectRatio: "3:4" };
  const parsed = CardDocumentSchema.safeParse(invalid);
  assert.equal(parsed.success, false);
});

test("CardDocumentSchema: rejects invalid hex colors", () => {
  const invalid = {
    ...VALID_DOC,
    customization: { ...VALID_DOC.customization, backgroundColor: "not-a-color" },
  };
  const parsed = CardDocumentSchema.safeParse(invalid);
  assert.equal(parsed.success, false);
});

test("RenderRequestSchema: validates render request payload", () => {
  const req = {
    document: VALID_DOC,
    scale: 2,
    format: "png",
  };
  const parsed = RenderRequestSchema.safeParse(req);
  assert.equal(parsed.success, true);
});

test("getCardDisplayUrl: returns domain only when urlDisplayMode is 'domain'", async () => {
  const { getCardDisplayUrl } = await import("../lib/cards/types");
  const doc = {
    url: "https://www.mhdalif.id/blog/hermes-agent-changed-how-i-turn-ideas-into-reality",
    customization: { urlDisplayMode: "domain" as const },
  };
  assert.equal(getCardDisplayUrl(doc), "www.mhdalif.id");
});

test("getCardDisplayUrl: returns full path when urlDisplayMode is 'full'", async () => {
  const { getCardDisplayUrl } = await import("../lib/cards/types");
  const doc = {
    url: "https://www.mhdalif.id/blog/hermes-agent-changed-how-i-turn-ideas-into-reality",
    customization: { urlDisplayMode: "full" as const },
  };
  assert.equal(
    getCardDisplayUrl(doc),
    "www.mhdalif.id/blog/hermes-agent-changed-how-i-turn-ideas-into-reality"
  );
});

test("getCardDisplayUrl: returns empty string when urlDisplayMode is 'none'", async () => {
  const { getCardDisplayUrl } = await import("../lib/cards/types");
  const doc = {
    url: "https://www.mhdalif.id/blog/hermes-agent-changed-how-i-turn-ideas-into-reality",
    customization: { urlDisplayMode: "none" as const },
  };
  assert.equal(getCardDisplayUrl(doc), "");
});

test("getCardDisplayUrl: respects customUrl override", async () => {
  const { getCardDisplayUrl } = await import("../lib/cards/types");
  const doc = {
    url: "https://www.mhdalif.id/blog/hermes-agent-changed-how-i-turn-ideas-into-reality",
    customization: {
      urlDisplayMode: "full" as const,
      customUrl: "mhdalif.id/custom-slug",
    },
  };
  assert.equal(getCardDisplayUrl(doc), "mhdalif.id/custom-slug");
});

test("CardCustomizationSchema: validates imagePlacement above and below", () => {
  const parsedAbove = CardCustomizationSchema.safeParse({
    ...VALID_DOC.customization,
    imagePlacement: "above",
  });
  assert.equal(parsedAbove.success, true);
  if (parsedAbove.success) {
    assert.equal(parsedAbove.data.imagePlacement, "above");
  }

  const parsedBelow = CardCustomizationSchema.safeParse({
    ...VALID_DOC.customization,
    imagePlacement: "below",
  });
  assert.equal(parsedBelow.success, true);
  if (parsedBelow.success) {
    assert.equal(parsedBelow.data.imagePlacement, "below");
  }
});
