/**
 * Theme detection and adaptive design tokens for card templates.
 * Dynamically calculates contrast for borders, dividers, badges,
 * and surfaces based on the card background color.
 */

export function isDarkColor(hexColor?: string | null): boolean {
  if (!hexColor || typeof hexColor !== "string") return false;
  let hex = hexColor.replace("#", "").trim();
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (hex.length !== 6 && hex.length !== 8) return false;
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 128;
}

export interface TemplateTheme {
  isDark: boolean;
  divider: string;
  badgeBg: string;
  badgeBorder: string;
  imageBorder: string;
  imageBg: string;
  surfaceMuted: string;
}

export function getTemplateTheme(backgroundColor: string): TemplateTheme {
  const isDark = isDarkColor(backgroundColor);
  return {
    isDark,
    divider: isDark ? "rgba(255, 255, 255, 0.14)" : "rgba(23, 24, 21, 0.12)",
    badgeBg: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(23, 24, 21, 0.05)",
    badgeBorder: isDark ? "rgba(255, 255, 255, 0.16)" : "rgba(23, 24, 21, 0.1)",
    imageBorder: isDark ? "rgba(255, 255, 255, 0.14)" : "rgba(23, 24, 21, 0.1)",
    imageBg: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(23, 24, 21, 0.04)",
    surfaceMuted: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(23, 24, 21, 0.06)",
  };
}
