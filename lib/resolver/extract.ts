import * as cheerio from "cheerio";
import { NormalizedMetadata } from "./types";
import { isGitHubUrl, extractGitHubMetadata } from "./adapters/github";

function resolveUrlSafely(relativeOrAbsolute: string | undefined | null, baseUrl: string): string | null {
  if (!relativeOrAbsolute || typeof relativeOrAbsolute !== "string") {
    return null;
  }
  const trimmed = relativeOrAbsolute.trim();
  if (!trimmed || trimmed.startsWith("data:") || trimmed.startsWith("javascript:")) {
    return null;
  }
  try {
    return new URL(trimmed, baseUrl).href;
  } catch {
    return null;
  }
}

function cleanText(text: string | undefined | null): string {
  if (!text) return "";
  return text
    .replace(/\s+/g, " ")
    .replace(/[\r\n\t]+/g, " ")
    .trim();
}

/**
 * Extracts and normalizes metadata from HTML and document URL.
 */
export function extractMetadataFromHtml(html: string, pageUrl: string): NormalizedMetadata {
  const $ = cheerio.load(html);
  const parsedUrl = new URL(pageUrl);

  // Title extraction with priority: og:title -> twitter:title -> <title> -> fallback hostname
  const ogTitle = cleanText($('meta[property="og:title"]').attr("content"));
  const twitterTitle = cleanText($('meta[name="twitter:title"]').attr("content"));
  const htmlTitle = cleanText($("title").first().text());
  const h1Title = cleanText($("h1").first().text());
  const title = ogTitle || twitterTitle || htmlTitle || h1Title || parsedUrl.hostname;

  // Description extraction with priority: og:description -> twitter:description -> meta[name="description"]
  const ogDesc = cleanText($('meta[property="og:description"]').attr("content"));
  const twitterDesc = cleanText($('meta[name="twitter:description"]').attr("content"));
  const metaDesc = cleanText($('meta[name="description"]').attr("content"));
  const description = ogDesc || twitterDesc || metaDesc || "";

  // Site name extraction: og:site_name -> application-name -> title separator -> clean domain
  const ogSiteName = cleanText(
    $('meta[property="og:site_name"]').attr("content") ||
    $('meta[name="og:site_name"]').attr("content") ||
    $('meta[name="application-name"]').attr("content") ||
    $('meta[property="al:android:app_name"]').attr("content") ||
    $('meta[property="al:ios:app_name"]').attr("content")
  );

  let extractedSiteName = ogSiteName;
  if (!extractedSiteName && htmlTitle) {
    const parts = htmlTitle.split(/\s+[|\-·]\s+/);
    if (parts.length > 1 && parts[parts.length - 1].trim().length > 1) {
      extractedSiteName = parts[parts.length - 1].trim();
    }
  }

  const siteName = extractedSiteName || parsedUrl.hostname.replace(/^www\./, "");

  // Image extraction
  const ogImage = $('meta[property="og:image"]').attr("content") ||
    $('meta[property="og:image:url"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content") ||
    $('meta[name="twitter:image:src"]').attr("content") ||
    $('link[rel="image_src"]').attr("href");
  const imageUrl = resolveUrlSafely(ogImage, pageUrl);

  // Favicon extraction
  const faviconHref =
    $('link[rel="icon"]').attr("href") ||
    $('link[rel="shortcut icon"]').attr("href") ||
    $('link[rel="apple-touch-icon"]').attr("href") ||
    "/favicon.ico";
  const faviconUrl = resolveUrlSafely(faviconHref, pageUrl);

  // Optional author and published date
  const author = cleanText(
    $('meta[name="author"]').attr("content") ||
    $('meta[property="article:author"]').attr("content")
  );
  const publishedDate = cleanText(
    $('meta[property="article:published_time"]').attr("content") ||
    $('meta[name="date"]').attr("content")
  );

  const baseMeta: NormalizedMetadata = {
    url: pageUrl,
    siteName,
    title,
    description,
    imageUrl,
    faviconUrl,
    provider: "generic",
    extra: {
      author: author || undefined,
      publishedDate: publishedDate || undefined,
    },
  };

  if (isGitHubUrl(pageUrl)) {
    return extractGitHubMetadata(html, pageUrl, baseMeta);
  }

  return baseMeta;
}
