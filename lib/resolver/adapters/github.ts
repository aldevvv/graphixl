import * as cheerio from "cheerio";
import { NormalizedMetadata } from "../types";

export function isGitHubUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    return (
      (parsed.hostname === "github.com" || parsed.hostname === "www.github.com") &&
      parsed.pathname.split("/").filter(Boolean).length >= 2
    );
  } catch {
    return false;
  }
}

export function extractGitHubMetadata(
  html: string,
  urlStr: string,
  baseMeta: Partial<NormalizedMetadata>
): NormalizedMetadata {
  const $ = cheerio.load(html);
  const parsed = new URL(urlStr);
  const segments = parsed.pathname.split("/").filter(Boolean);
  const owner = segments[0] || "";
  const repo = segments[1] || "";

  // Title extraction
  const repoHeader = `${owner}/${repo}`;
  const title =
    baseMeta.title && !baseMeta.title.includes("GitHub -")
      ? baseMeta.title
      : repoHeader;

  // Description extraction
  let description =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    $('p[class*="f4"]').first().text().trim() ||
    baseMeta.description ||
    "";

  // Clean GitHub description boilerplate
  if (description.includes("Contribute to")) {
    const match = description.match(/Contribute to [^ ]+ development by creating an account on GitHub\./);
    if (match) {
      description = description.replace(match[0], "").trim();
    }
  }

  // Language
  const language =
    $('[itemprop="programmingLanguage"]').first().text().trim() ||
    $('span[class*="color-fg-default"][class*="text-bold"]').first().text().trim() ||
    undefined;

  // Stars
  let stars: number | undefined;
  const starsText =
    $("#repo-stars-counter-star").attr("title") ||
    $("#repo-stars-counter-star").text().trim() ||
    $('a[href$="/stargazers"] span').first().text().trim();

  if (starsText) {
    const cleaned = starsText.replace(/,/g, "").replace(/k/i, "000");
    const num = parseInt(cleaned, 10);
    if (!isNaN(num)) {
      stars = num;
    }
  }

  // Favicon & Preview Image
  const faviconUrl = "https://github.githubassets.com/favicons/favicon.svg";
  const imageUrl =
    baseMeta.imageUrl ||
    $('meta[property="og:image"]').attr("content") ||
    null;

  return {
    url: urlStr,
    siteName: "GitHub",
    title,
    description: description || "GitHub repository",
    imageUrl,
    faviconUrl,
    provider: "github",
    extra: {
      owner,
      repo,
      language,
      stars,
    },
  };
}
