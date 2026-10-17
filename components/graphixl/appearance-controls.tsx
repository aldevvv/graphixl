"use client";

import React, { useState } from "react";
import {
  CardDocument,
  TemplateId,
  AspectRatioPreset,
  TypographyFamily,
  UrlDisplayMode,
  ImagePlacement,
  ASPECT_RATIO_CONFIGS,
  getCardDisplayUrl,
} from "@/lib/cards/types";
import { TEMPLATE_METADATA } from "@/lib/cards/templates";
import {
  ChevronDown,
  Check,
  Image as ImageIcon,
  X,
  SlidersHorizontal,
  BookOpen,
  Layout,
  Sparkles,
  Code2,
  RectangleHorizontal,
  Square,
  RectangleVertical,
  Smartphone,
  Monitor,
  Type,
  Feather,
  Terminal,
  ArrowUpToLine,
  ArrowDownToLine,
  Globe,
  Link2,
  EyeOff,
  Sun,
  Moon,
} from "lucide-react";

interface AppearanceControlsProps {
  document: CardDocument;
  onChange: (updated: CardDocument) => void;
  onReset: () => void;
}

const TEMPLATE_OPTIONS: TemplateId[] = ["editorial", "minimal", "product", "repository"];

const TEMPLATE_ICONS: Record<TemplateId, React.ComponentType<{ className?: string }>> = {
  editorial: BookOpen,
  minimal: Layout,
  product: Sparkles,
  repository: Code2,
};

const ASPECT_RATIO_OPTIONS: AspectRatioPreset[] = [
  "social",
  "square",
  "portrait",
  "story",
  "landscape",
];

const ASPECT_RATIO_ICONS: Record<AspectRatioPreset, React.ComponentType<{ className?: string }>> = {
  social: RectangleHorizontal,
  square: Square,
  portrait: RectangleVertical,
  story: Smartphone,
  landscape: Monitor,
};

const FONT_ICONS: Record<TypographyFamily, React.ComponentType<{ className?: string }>> = {
  satoshi: Type,
  serif: Feather,
  mono: Terminal,
};

export interface ColorPresetItem {
  name: string;
  theme: "light" | "dark";
  bg: string;
  text: string;
  accent: string;
}

const COLOR_PRESETS: ColorPresetItem[] = [
  // Light Themes
  { name: "Pure Light", theme: "light", bg: "#FFFFFF", text: "#0A0A0A", accent: "#2563EB" },
  { name: "Warm Editorial", theme: "light", bg: "#FBF8F3", text: "#1C1917", accent: "#B45309" },
  { name: "Clean Slate", theme: "light", bg: "#F8FAFC", text: "#0F172A", accent: "#0EA5E9" },
  { name: "Soft Zinc", theme: "light", bg: "#F4F4F5", text: "#18181B", accent: "#52525B" },

  // Dark Themes
  { name: "Midnight", theme: "dark", bg: "#09090B", text: "#FAFAFA", accent: "#38BDF8" },
  { name: "Onyx Black", theme: "dark", bg: "#121212", text: "#EDEDED", accent: "#A1A1AA" },
  { name: "Deep Navy", theme: "dark", bg: "#0B1120", text: "#F8FAFC", accent: "#60A5FA" },
  { name: "Obsidian", theme: "dark", bg: "#0B1411", text: "#ECFDF5", accent: "#34D399" },
];

const NEUTRAL_INPUT_CLASSES =
  "w-full h-9 rounded-[6px] border border-[#E5E5E5] bg-white px-3 text-xs text-[#0A0A0A] placeholder:text-[#A3A3A3] outline-none transition-shadow duration-150 hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-0 focus:border-[#E5E5E5] focus:shadow-[0_2px_5px_rgba(0,0,0,0.05)]";

const NEUTRAL_TEXTAREA_CLASSES =
  "w-full min-h-[56px] rounded-[6px] border border-[#E5E5E5] bg-white p-2.5 text-xs text-[#0A0A0A] placeholder:text-[#A3A3A3] outline-none transition-shadow duration-150 hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-0 focus:border-[#E5E5E5] focus:shadow-[0_2px_5px_rgba(0,0,0,0.05)] resize-y";

export function AppearanceControls({
  document,
  onChange,
  onReset,
}: AppearanceControlsProps): React.JSX.Element {
  const { customization } = document;
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [paletteThemeFilter, setPaletteThemeFilter] = useState<"all" | "light" | "dark">("all");

  const updateCustomization = (partial: Partial<typeof customization>) => {
    onChange({
      ...document,
      customization: {
        ...customization,
        ...partial,
      },
    });
  };

  const handleTemplateChange = (template: TemplateId) => {
    onChange({
      ...document,
      template,
    });
  };

  const handleAspectRatioChange = (aspectRatio: AspectRatioPreset) => {
    onChange({
      ...document,
      aspectRatio,
    });
  };

  const handleUrlModeChange = (mode: UrlDisplayMode) => {
    updateCustomization({
      urlDisplayMode: mode,
      customUrl: "",
    });
  };

  const handleThumbnailUrlChange = (newUrl: string) => {
    const trimmed = newUrl.trim();
    updateCustomization({
      imageUrl: trimmed.length > 0 ? trimmed : null,
      showImage: trimmed.length > 0,
    });
  };

  const handleImagePlacementChange = (placement: ImagePlacement) => {
    updateCustomization({
      imagePlacement: placement,
    });
  };

  const currentDisplayUrl =
    customization.customUrl && customization.customUrl.trim().length > 0
      ? customization.customUrl
      : getCardDisplayUrl(document);

  const currentPlacement: ImagePlacement = customization.imagePlacement || "below";

  const filteredPresets =
    paletteThemeFilter === "all"
      ? COLOR_PRESETS
      : COLOR_PRESETS.filter((p) => p.theme === paletteThemeFilter);

  const isEditorial = document.template === "editorial";
  const isProduct = document.template === "product";
  const isRepository = document.template === "repository";
  const isMinimal = document.template === "minimal";

  return (
    <div className="w-full flex flex-col gap-5 text-[#0A0A0A]">
      {/* 1. Essential Section: Template & Dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4 border-b border-[#E5E5E5]">
        {/* Template Selector */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
            Template
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {TEMPLATE_OPTIONS.map((id) => {
              const isSelected = document.template === id;
              const meta = TEMPLATE_METADATA[id];
              const TemplateIcon = TEMPLATE_ICONS[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleTemplateChange(id)}
                  className={`h-9 px-2 rounded-[6px] border text-xs font-medium transition-all flex items-center justify-center gap-1.5 truncate ${
                    isSelected
                      ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                      : "border-[#E5E5E5] bg-white text-[#525252] hover:bg-[#F5F5F5] hover:text-[#0A0A0A]"
                  }`}
                  title={meta?.description}
                >
                  <TemplateIcon className="size-3.5 shrink-0" />
                  <span className="truncate">{meta?.name.replace(" Spotlight", "") || id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dimensions Selector */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
              Dimensions
            </span>
            <span className="text-[11px] text-[#737373]">
              {ASPECT_RATIO_CONFIGS[document.aspectRatio].width} × {ASPECT_RATIO_CONFIGS[document.aspectRatio].height} px
            </span>
          </div>

          {/* Desktop: Segmented buttons with icons */}
          <div className="hidden sm:grid grid-cols-5 gap-1.5">
            {ASPECT_RATIO_OPTIONS.map((preset) => {
              const isSelected = document.aspectRatio === preset;
              const config = ASPECT_RATIO_CONFIGS[preset];
              const DimensionIcon = ASPECT_RATIO_ICONS[preset];
              const shortName = config.label
                .replace(" Share", "")
                .replace(" Post", "")
                .replace(" Feed", "")
                .replace(" & Reel", "");
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleAspectRatioChange(preset)}
                  className={`h-11 px-1 rounded-[6px] border text-xs font-medium transition-all flex flex-col items-center justify-center text-center leading-tight gap-0.5 ${
                    isSelected
                      ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                      : "border-[#E5E5E5] bg-white text-[#525252] hover:bg-[#F5F5F5] hover:text-[#0A0A0A]"
                  }`}
                  title={`${config.label} (${config.ratio})`}
                >
                  <div className="flex items-center gap-1">
                    <DimensionIcon className="size-3 shrink-0" />
                    <span className="truncate text-[11px] font-medium">{shortName}</span>
                  </div>
                  <span className={`text-[10px] ${isSelected ? "text-white/75" : "text-[#737373]"}`}>
                    {config.ratio}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile: Dropdown selector */}
          <div className="relative sm:hidden">
            <select
              value={document.aspectRatio}
              onChange={(e) => handleAspectRatioChange(e.target.value as AspectRatioPreset)}
              className="w-full h-9 appearance-none rounded-[6px] border border-[#E5E5E5] bg-white px-3 pr-8 text-xs font-medium text-[#0A0A0A] outline-none transition-shadow hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-0 focus:border-[#E5E5E5] cursor-pointer"
            >
              {ASPECT_RATIO_OPTIONS.map((preset) => {
                const config = ASPECT_RATIO_CONFIGS[preset];
                return (
                  <option key={preset} value={preset}>
                    {config.label} · {config.ratio} ({config.width} × {config.height} px)
                  </option>
                );
              })}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#737373]" />
          </div>
        </div>
      </div>

      {/* 2. Essential Section: Dynamic Card Content based on Active Template */}
      <div className="flex flex-col gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
          Card Content
        </span>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Editorial Template Fields */}
          {isEditorial && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-medium text-[#525252]">Article Headline</label>
                  <input
                    type="text"
                    value={customization.title}
                    onChange={(e) => updateCustomization({ title: e.target.value })}
                    className={NEUTRAL_INPUT_CLASSES}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[#525252]">Top Badge / Category</label>
                  <input
                    type="text"
                    value={customization.badge}
                    placeholder="e.g. Design, Essay"
                    onChange={(e) => updateCustomization({ badge: e.target.value })}
                    className={NEUTRAL_INPUT_CLASSES}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#525252]">Summary or Description</label>
                <textarea
                  rows={2}
                  value={customization.description}
                  onChange={(e) => updateCustomization({ description: e.target.value })}
                  className={NEUTRAL_TEXTAREA_CLASSES}
                />
              </div>
            </>
          )}

          {/* Product Template Fields */}
          {isProduct && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-medium text-[#525252]">Product Name</label>
                  <input
                    type="text"
                    value={customization.title}
                    onChange={(e) => updateCustomization({ title: e.target.value })}
                    className={NEUTRAL_INPUT_CLASSES}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[#525252]">Price or Promo Badge</label>
                  <input
                    type="text"
                    value={customization.badge}
                    placeholder="e.g. $49, New, v2.0"
                    onChange={(e) => updateCustomization({ badge: e.target.value })}
                    className={NEUTRAL_INPUT_CLASSES}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[#525252]">Brand / Store Pill</label>
                  <input
                    type="text"
                    value={customization.siteName}
                    placeholder={document.metadata.siteName || "Brand"}
                    onChange={(e) => updateCustomization({ siteName: e.target.value })}
                    className={NEUTRAL_INPUT_CLASSES}
                  />
                </div>
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-medium text-[#525252]">Pitch or Tagline</label>
                  <textarea
                    rows={2}
                    value={customization.description}
                    onChange={(e) => updateCustomization({ description: e.target.value })}
                    className={NEUTRAL_TEXTAREA_CLASSES}
                  />
                </div>
              </div>
            </>
          )}

          {/* Repository Template Fields */}
          {isRepository && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[#525252]">Repository Name</label>
                  <input
                    type="text"
                    value={customization.title}
                    placeholder="e.g. next.js, graphixl"
                    onChange={(e) => updateCustomization({ title: e.target.value })}
                    className={NEUTRAL_INPUT_CLASSES}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[#525252]">Owner or Organization</label>
                  <input
                    type="text"
                    value={customization.author}
                    placeholder="e.g. vercel, facebook"
                    onChange={(e) => updateCustomization({ author: e.target.value })}
                    className={NEUTRAL_INPUT_CLASSES}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#525252]">Repository Description</label>
                <textarea
                  rows={2}
                  value={customization.description}
                  onChange={(e) => updateCustomization({ description: e.target.value })}
                  className={NEUTRAL_TEXTAREA_CLASSES}
                />
              </div>
            </>
          )}

          {/* Minimal Template Fields */}
          {isMinimal && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#525252]">Headline</label>
                <input
                  type="text"
                  value={customization.title}
                  onChange={(e) => updateCustomization({ title: e.target.value })}
                  className={NEUTRAL_INPUT_CLASSES}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#525252]">Description</label>
                <textarea
                  rows={2}
                  value={customization.description}
                  onChange={(e) => updateCustomization({ description: e.target.value })}
                  className={NEUTRAL_TEXTAREA_CLASSES}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3. Essential Section: Card Thumbnail (Hidden for Repository template since it does not render images) */}
      {!isRepository && (
        <div className="flex flex-col gap-2.5 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
              Thumbnail
            </span>

            <div className="flex items-center gap-3">
              {/* Position Selector (Above / Below Title) with icons */}
              <div className="inline-flex items-center rounded-[6px] border border-[#E5E5E5] bg-[#F7F7F7] p-0.5 gap-0.5">
                <button
                  type="button"
                  onClick={() => handleImagePlacementChange("above")}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-[4px] transition-colors flex items-center gap-1.5 ${
                    currentPlacement === "above"
                      ? "bg-[#0A0A0A] text-white"
                      : "text-[#525252] hover:text-[#0A0A0A]"
                  }`}
                >
                  <ArrowUpToLine className="size-3 shrink-0" />
                  <span>Above Title</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleImagePlacementChange("below")}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-[4px] transition-colors flex items-center gap-1.5 ${
                    currentPlacement === "below"
                      ? "bg-[#0A0A0A] text-white"
                      : "text-[#525252] hover:text-[#0A0A0A]"
                  }`}
                >
                  <ArrowDownToLine className="size-3 shrink-0" />
                  <span>Below Title</span>
                </button>
              </div>

              {/* Show / Hide Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-[#0A0A0A]">
                <input
                  type="checkbox"
                  checked={customization.showImage}
                  onChange={(e) => updateCustomization({ showImage: e.target.checked })}
                  className="size-3.5 rounded accent-[#0A0A0A] cursor-pointer"
                />
                <span>Show image</span>
              </label>
            </div>
          </div>

          {/* Thumbnail URL and Preview */}
          <div className="flex items-center gap-2">
            {customization.imageUrl ? (
              <div className="size-9 rounded-[6px] border border-[#E5E5E5] overflow-hidden shrink-0 bg-[#F7F7F7] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={customization.imageUrl}
                  alt=""
                  className="size-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="size-9 rounded-[6px] border border-[#E5E5E5] bg-white flex items-center justify-center text-[#A3A3A3] shrink-0">
                <ImageIcon className="size-4" />
              </div>
            )}

            <input
              type="text"
              value={customization.imageUrl || ""}
              onChange={(e) => handleThumbnailUrlChange(e.target.value)}
              placeholder="Paste image or thumbnail URL"
              className={NEUTRAL_INPUT_CLASSES}
            />

            {customization.imageUrl && (
              <button
                type="button"
                onClick={() => updateCustomization({ imageUrl: null, showImage: false })}
                className="h-9 px-2.5 rounded-[6px] border border-[#E5E5E5] bg-white text-xs font-medium text-[#737373] hover:bg-[#F5F5F5] hover:text-[#0A0A0A] transition-all flex items-center gap-1 shrink-0"
                title="Remove thumbnail"
              >
                <X className="size-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}

            {document.metadata.imageUrl && document.metadata.imageUrl !== customization.imageUrl && (
              <button
                type="button"
                onClick={() =>
                  updateCustomization({
                    imageUrl: document.metadata.imageUrl,
                    showImage: true,
                  })
                }
                className="h-9 px-2.5 rounded-[6px] border border-[#E5E5E5] bg-white text-xs font-medium text-[#737373] hover:bg-[#F5F5F5] hover:text-[#0A0A0A] transition-all shrink-0"
                title="Restore extracted image"
              >
                Original
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. Essential Section: Card URL Display with icons */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[#525252]">Card URL</label>
          <div className="inline-flex items-center rounded-[6px] border border-[#E5E5E5] bg-[#F7F7F7] p-0.5 gap-0.5">
            <button
              type="button"
              onClick={() => handleUrlModeChange("domain")}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-[4px] transition-colors flex items-center gap-1.5 ${
                customization.urlDisplayMode === "domain"
                  ? "bg-white text-[#0A0A0A] shadow-xs"
                  : "text-[#737373] hover:text-[#0A0A0A]"
              }`}
            >
              <Globe className="size-3 shrink-0" />
              <span>Domain</span>
            </button>
            <button
              type="button"
              onClick={() => handleUrlModeChange("full")}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-[4px] transition-colors flex items-center gap-1.5 ${
                customization.urlDisplayMode === "full"
                  ? "bg-white text-[#0A0A0A] shadow-xs"
                  : "text-[#737373] hover:text-[#0A0A0A]"
              }`}
            >
              <Link2 className="size-3 shrink-0" />
              <span>Full URL</span>
            </button>
            <button
              type="button"
              onClick={() => handleUrlModeChange("none")}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-[4px] transition-colors flex items-center gap-1.5 ${
                customization.urlDisplayMode === "none"
                  ? "bg-white text-[#0A0A0A] shadow-xs"
                  : "text-[#737373] hover:text-[#0A0A0A]"
              }`}
            >
              <EyeOff className="size-3 shrink-0" />
              <span>Hidden</span>
            </button>
          </div>
        </div>

        {customization.urlDisplayMode !== "none" && (
          <input
            type="text"
            value={currentDisplayUrl}
            onChange={(e) => updateCustomization({ customUrl: e.target.value })}
            placeholder="URL text shown on the card"
            className={NEUTRAL_INPUT_CLASSES}
          />
        )}
      </div>

      {/* 5. Advanced Settings (Collapsible Dropdown for Detail Controls) */}
      <div className="pt-2 border-t border-[#E5E5E5]">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between py-2 text-xs font-medium text-[#525252] hover:text-[#0A0A0A] transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-3.5 text-[#737373]" />
            <span className="font-semibold text-[#0A0A0A]">Advanced Settings</span>
            <span className="text-[11px] text-[#737373]">
              (Site name, author, color palette, typography)
            </span>
          </div>
          <ChevronDown
            className={`size-4 text-[#737373] transition-transform duration-200 ${
              showAdvanced ? "rotate-180" : ""
            }`}
          />
        </button>

        {showAdvanced && (
          <div className="pt-3 pb-1 flex flex-col gap-4 animate-in fade-in-50 duration-150">
            {/* Dynamic Site Name and Author based on template */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {!isProduct && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[#525252]">
                    {isEditorial ? "Publication or Site Name" : isRepository ? "Platform Name" : "Site Name"}
                  </label>
                  <input
                    type="text"
                    value={customization.siteName}
                    placeholder={document.metadata.siteName || (isRepository ? "github.com" : "Site Name")}
                    onChange={(e) => updateCustomization({ siteName: e.target.value })}
                    className={NEUTRAL_INPUT_CLASSES}
                  />
                </div>
              )}

              {!isRepository && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[#525252]">
                    {isEditorial ? "Author or Byline" : isProduct ? "Maker or Handle" : "Author or Handle"}
                  </label>
                  <input
                    type="text"
                    value={customization.author}
                    placeholder="Author name or @handle"
                    onChange={(e) => updateCustomization({ author: e.target.value })}
                    className={NEUTRAL_INPUT_CLASSES}
                  />
                </div>
              )}
            </div>

            {/* Palette & Typography */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E5E5E5]/70 items-start">
              {/* Palette with Light/Dark filter and indicators */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                    Color Palette
                  </span>
                  <div className="inline-flex items-center rounded-[5px] border border-[#E5E5E5] bg-[#F7F7F7] p-0.5 gap-0.5">
                    <button
                      type="button"
                      onClick={() => setPaletteThemeFilter("all")}
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-[3px] transition-colors ${
                        paletteThemeFilter === "all"
                          ? "bg-white text-[#0A0A0A] shadow-xs"
                          : "text-[#737373] hover:text-[#0A0A0A]"
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaletteThemeFilter("light")}
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-[3px] transition-colors flex items-center gap-1 ${
                        paletteThemeFilter === "light"
                          ? "bg-white text-[#0A0A0A] shadow-xs"
                          : "text-[#737373] hover:text-[#0A0A0A]"
                      }`}
                    >
                      <Sun className="size-2.5" />
                      <span>Light</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaletteThemeFilter("dark")}
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-[3px] transition-colors flex items-center gap-1 ${
                        paletteThemeFilter === "dark"
                          ? "bg-white text-[#0A0A0A] shadow-xs"
                          : "text-[#737373] hover:text-[#0A0A0A]"
                      }`}
                    >
                      <Moon className="size-2.5" />
                      <span>Dark</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {filteredPresets.map((preset) => {
                    const isSelected =
                      customization.backgroundColor.toLowerCase() === preset.bg.toLowerCase() &&
                      customization.textColor.toLowerCase() === preset.text.toLowerCase();
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() =>
                          updateCustomization({
                            backgroundColor: preset.bg,
                            textColor: preset.text,
                            accentColor: preset.accent,
                          })
                        }
                        className={`flex items-center justify-between h-8 px-2.5 rounded-[5px] text-[11px] font-medium transition-colors border ${
                          isSelected
                            ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                            : "bg-white text-[#525252] border-[#E5E5E5] hover:border-[#D4D4D4] hover:text-[#0A0A0A]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className="size-3 rounded-full border border-black/20 shrink-0"
                            style={{ backgroundColor: preset.bg }}
                          />
                          <span
                            className="size-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: preset.accent }}
                          />
                          <span className="truncate">{preset.name}</span>
                        </div>
                        {isSelected && <Check className="size-3 text-white shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Typography Font with icons */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                  Typography Font
                </span>
                <div className="flex gap-1.5">
                  {(["satoshi", "serif", "mono"] as TypographyFamily[]).map((font) => {
                    const label = font === "satoshi" ? "Sans" : font === "serif" ? "Serif" : "Mono";
                    const isSelected = customization.fontFamily === font;
                    const FontIcon = FONT_ICONS[font];
                    return (
                      <button
                        key={font}
                        type="button"
                        onClick={() => updateCustomization({ fontFamily: font })}
                        className={`flex-1 h-8 rounded-[5px] border text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                            : "border-[#E5E5E5] bg-white text-[#525252] hover:bg-[#F5F5F5] hover:text-[#0A0A0A]"
                        }`}
                      >
                        <FontIcon className="size-3.5 shrink-0" />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reset Defaults Action */}
            <div className="pt-2 flex justify-end border-t border-[#E5E5E5]/70">
              <button
                type="button"
                onClick={onReset}
                className="text-xs text-[#737373] hover:text-[#0A0A0A] hover:underline transition-colors"
              >
                Reset all customizations to defaults
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
