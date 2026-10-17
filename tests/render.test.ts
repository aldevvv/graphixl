import test from "node:test";
import assert from "node:assert/strict";
import { renderCardToPng, renderCardToSvg } from "../lib/cards/renderer";
import { CardDocument, AspectRatioPreset, TemplateId } from "../lib/cards/types";

const BASE_DOC: CardDocument = {
  id: "card_test_render",
  version: 1,
  url: "https://github.com/aldevvv/graphixl",
  template: "editorial",
  aspectRatio: "social",
  metadata: {
    url: "https://github.com/aldevvv/graphixl",
    siteName: "GitHub",
    title: "aldevvv/graphixl",
    description: "An open-source tool for turning URLs into polished, customizable social media cards.",
    imageUrl: null,
    faviconUrl: null,
    provider: "github",
    extra: {
      owner: "aldevvv",
      repo: "graphixl",
      stars: 42,
    },
  },
  customization: {
    title: "Graphixl Open Source Project",
    description: "Turn any link into a visual worth sharing with deterministic Satori output.",
    siteName: "GitHub",
    author: "aldevvv",
    badge: "Open Source",
    accentColor: "#D8FF4F",
    backgroundColor: "#FFFFFF",
    textColor: "#171815",
    showImage: false,
    imageUrl: null,
    fontFamily: "satoshi",
  },
};

test("renderCardToSvg: produces valid SVG XML markup", async () => {
  const svg = await renderCardToSvg(BASE_DOC);
  assert.equal(typeof svg, "string");
  assert.equal(svg.includes("<svg"), true);
  assert.equal(svg.includes("</svg>"), true);
  assert.equal(svg.length > 1000, true);
});

test("renderCardToPng: produces valid PNG binary buffer with correct magic number", async () => {
  const pngBuffer = await renderCardToPng(BASE_DOC, 1);
  assert.equal(Buffer.isBuffer(pngBuffer), true);
  assert.equal(pngBuffer.length > 1000, true);

  // PNG magic number: 0x89 0x50 0x4E 0x47 (89 50 4E 47 in hex, or .PNG in ascii)
  assert.equal(pngBuffer[0], 0x89);
  assert.equal(pngBuffer[1], 0x50);
  assert.equal(pngBuffer[2], 0x4e);
  assert.equal(pngBuffer[3], 0x47);
});

test("renderCardToPng: renders all four templates successfully", async () => {
  const templates: TemplateId[] = ["editorial", "minimal", "product", "repository"];
  for (const t of templates) {
    const doc: CardDocument = { ...BASE_DOC, template: t };
    const buffer = await renderCardToPng(doc, 1);
    assert.equal(buffer.length > 500, true, `Template ${t} failed to generate buffer`);
  }
});

test("renderCardToPng: renders all five aspect ratio presets successfully", async () => {
  const ratios: AspectRatioPreset[] = ["square", "portrait", "story", "landscape", "social"];
  for (const r of ratios) {
    const doc: CardDocument = { ...BASE_DOC, aspectRatio: r };
    const buffer = await renderCardToPng(doc, 1);
    assert.equal(buffer.length > 500, true, `Aspect ratio ${r} failed to generate buffer`);
  }
});
