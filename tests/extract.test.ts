import test from "node:test";
import assert from "node:assert/strict";
import { extractMetadataFromHtml } from "../lib/resolver/extract";

test("extractMetadataFromHtml: extracts full Open Graph metadata", () => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Fallback Title</title>
        <meta property="og:title" content="Open Graph Title" />
        <meta property="og:description" content="Open Graph Description Text" />
        <meta property="og:site_name" content="Example Pub" />
        <meta property="og:image" content="https://example.com/cover.png" />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body><h1>Content</h1></body>
    </html>
  `;

  const meta = extractMetadataFromHtml(html, "https://example.com/posts/test-post");
  assert.equal(meta.title, "Open Graph Title");
  assert.equal(meta.description, "Open Graph Description Text");
  assert.equal(meta.siteName, "Example Pub");
  assert.equal(meta.imageUrl, "https://example.com/cover.png");
  assert.equal(meta.faviconUrl, "https://example.com/favicon.png");
});

test("extractMetadataFromHtml: falls back to standard HTML tags", () => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Standard Page Title</title>
        <meta name="description" content="Standard page description" />
      </head>
      <body></body>
    </html>
  `;

  const meta = extractMetadataFromHtml(html, "https://example.org/about");
  assert.equal(meta.title, "Standard Page Title");
  assert.equal(meta.description, "Standard page description");
  assert.equal(meta.siteName, "example.org");
  assert.equal(meta.imageUrl, null);
  assert.equal(meta.faviconUrl, "https://example.org/favicon.ico");
});

test("extractMetadataFromHtml: resolves relative image URLs to absolute", () => {
  const html = `
    <html>
      <head>
        <meta property="og:image" content="./assets/hero.jpg" />
      </head>
    </html>
  `;

  const meta = extractMetadataFromHtml(html, "https://example.com/articles/deep-dive/");
  assert.equal(meta.imageUrl, "https://example.com/articles/deep-dive/assets/hero.jpg");
});

test("extractMetadataFromHtml: extracts GitHub repository information", () => {
  const html = `
    <html>
      <head>
        <title>GitHub - facebook/react: The library for web and native user interfaces</title>
        <meta name="description" content="The library for web and native user interfaces." />
        <span itemprop="programmingLanguage">JavaScript</span>
        <span id="repo-stars-counter-star" title="220,000">220k</span>
      </head>
    </html>
  `;

  const meta = extractMetadataFromHtml(html, "https://github.com/facebook/react");
  assert.equal(meta.provider, "github");
  assert.equal(meta.siteName, "GitHub");
  assert.equal(meta.extra?.owner, "facebook");
  assert.equal(meta.extra?.repo, "react");
  assert.equal(meta.extra?.language, "JavaScript");
  assert.equal(meta.extra?.stars, 220000);
});
