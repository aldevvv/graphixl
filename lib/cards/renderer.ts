import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { CardDocument, ASPECT_RATIO_CONFIGS } from "./types";
import { renderCardComponent } from "./templates";
import { fetchImageAsDataUrlSafely } from "../resolver/fetcher";

let regularFontBuffer: Buffer | null = null;
let boldFontBuffer: Buffer | null = null;

function loadFontBuffers(): { regular: Buffer; bold: Buffer } {
  if (regularFontBuffer && boldFontBuffer) {
    return { regular: regularFontBuffer, bold: boldFontBuffer };
  }

  const candidateRegularPaths = [
    path.join(process.cwd(), "assets", "fonts", "NotoSans-Regular.ttf"),
    "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
  ];

  const candidateBoldPaths = [
    path.join(process.cwd(), "assets", "fonts", "NotoSans-Bold.ttf"),
    "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
  ];

  for (const p of candidateRegularPaths) {
    if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
      regularFontBuffer = fs.readFileSync(/*turbopackIgnore: true*/ p);
      break;
    }
  }

  for (const p of candidateBoldPaths) {
    if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
      boldFontBuffer = fs.readFileSync(/*turbopackIgnore: true*/ p);
      break;
    }
  }

  if (!regularFontBuffer) {
    // Ultimate fallback to any available ttf
    const nextGeist = path.join(
      process.cwd(),
      "node_modules",
      "next",
      "dist",
      "compiled",
      "@vercel",
      "og",
      "Geist-Regular.ttf"
    );
    if (fs.existsSync(/*turbopackIgnore: true*/ nextGeist)) {
      regularFontBuffer = fs.readFileSync(/*turbopackIgnore: true*/ nextGeist);
    }
  }

  if (!boldFontBuffer && regularFontBuffer) {
    boldFontBuffer = regularFontBuffer;
  }

  if (!regularFontBuffer || !boldFontBuffer) {
    throw new Error("Unable to locate required TTF font buffers for Satori rendering");
  }

  return { regular: regularFontBuffer, bold: boldFontBuffer };
}

/**
 * Renders a CardDocument into SVG markup using Satori.
 */
export async function renderCardToSvg(document: CardDocument): Promise<string> {
  const config = ASPECT_RATIO_CONFIGS[document.aspectRatio] || ASPECT_RATIO_CONFIGS.social;
  const { regular, bold } = loadFontBuffers();

  // Safely pre-fetch remote image so Satori never fetches external URLs
  let resolvedImageUrl: string | null = null;
  if (document.customization.showImage && document.customization.imageUrl) {
    if (document.customization.imageUrl.startsWith("data:")) {
      resolvedImageUrl = document.customization.imageUrl;
    } else {
      resolvedImageUrl = await fetchImageAsDataUrlSafely(document.customization.imageUrl);
    }
  }

  const element = renderCardComponent(document, config, resolvedImageUrl);

  const svg = await satori(element, {
    width: config.width,
    height: config.height,
    fonts: [
      {
        name: "Satoshi",
        data: regular,
        weight: 400,
        style: "normal",
      },
      {
        name: "Satoshi",
        data: bold,
        weight: 700,
        style: "normal",
      },
    ],
  });

  return svg;
}

/**
 * Renders a CardDocument into a PNG buffer using Satori and Resvg.
 */
export async function renderCardToPng(document: CardDocument, scale = 1): Promise<Buffer> {
  const svg = await renderCardToSvg(document);
  const config = ASPECT_RATIO_CONFIGS[document.aspectRatio] || ASPECT_RATIO_CONFIGS.social;

  const targetWidth = Math.round(config.width * Math.min(Math.max(scale, 1), 3));

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: targetWidth,
    },
  });

  const rendered = resvg.render();
  return rendered.asPng();
}
