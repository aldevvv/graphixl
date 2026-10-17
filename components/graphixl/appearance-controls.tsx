"use client";

import React from "react";
import {
  CardDocument,
  TemplateId,
  AspectRatioPreset,
  TypographyFamily,
  UrlDisplayMode,
  ASPECT_RATIO_CONFIGS,
  getCardDisplayUrl,
} from "@/lib/cards/types";
import { TEMPLATE_METADATA } from "@/lib/cards/templates";
import { ChevronDown, Check, Image as ImageIcon, X } from "lucide-react";

interface AppearanceControlsProps {
  document: CardDocument;
  onChange: (updated: CardDocument) => void;
  onReset: () => void;
}

const TEMPLATE_OPTIONS: TemplateId[] = ["editorial", "minimal", "product", "repository"];

const ASPECT_RATIO_OPTIONS: AspectRatioPreset[] = [
  "social",
  "square",
  "portrait",
  "story",
  "landscape",
];

const COLOR_PRESETS = [
  { name: "Pure Light", bg: "#FFFFFF", text: "#0A0A0A", accent: "#0A0A0A" },
  { name: "Warm Sand", bg: "#F7F7F2", text: "#1A1A18", accent: "#1A1A18" },
  { name: "Soft Zinc", bg: "#F0F0F0", text: "#0A0A0A", accent: "#525252" },
  { name: "Midnight", bg: "#0A0A0A", text: "#FFFFFF", accent: "#FFFFFF" },
];

export function AppearanceControls({
  document,
  onChange,
  onReset,
}: AppearanceControlsProps): React.JSX.Element {
  const { customization } = document;

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

  const currentDisplayUrl =
    customization.customUrl && customization.customUrl.trim().length > 0
      ? customization.customUrl
      : getCardDisplayUrl(document);

  return (
    <div className="w-full flex flex-col gap-4 text-[#0A0A0A]">
      {/* 1. Top Row: Template & Dimensions Dropdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-[#E5E5E5]">
        {/* Template Selector */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
            Template
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {TEMPLATE_OPTIONS.map((id) => {
              const isSelected = document.template === id;
              const meta = TEMPLATE_METADATA[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleTemplateChange(id)}
                  className={`h-9 px-2 rounded-[6px] border text-xs font-medium transition-colors truncate text-center ${
                    isSelected
                      ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                      : "border-[#E5E5E5] bg-white text-[#525252] hover:border-[#0A0A0A]/40 hover:text-[#0A0A0A]"
                  }`}
                  title={meta?.description}
                >
                  {meta?.name.replace(" Spotlight", "") || id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dimensions Dropdown */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
              Dimensions
            </span>
            <span className="text-[11px] text-[#737373]">
              {ASPECT_RATIO_CONFIGS[document.aspectRatio].width} × {ASPECT_RATIO_CONFIGS[document.aspectRatio].height} px
            </span>
          </div>
          <div className="relative">
            <select
              value={document.aspectRatio}
              onChange={(e) => handleAspectRatioChange(e.target.value as AspectRatioPreset)}
              className="w-full h-9 appearance-none rounded-[6px] border border-[#E5E5E5] bg-white px-3 pr-8 text-xs font-medium text-[#0A0A0A] outline-none transition-colors hover:border-[#0A0A0A]/40 focus:border-[#0A0A0A] cursor-pointer"
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

      {/* 2. Content & URL Display Section */}
      <div className="flex flex-col gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
          Card Content
        </span>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Headline */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#525252]">Headline</label>
            <input
              type="text"
              value={customization.title}
              onChange={(e) => updateCustomization({ title: e.target.value })}
              className="w-full h-9 rounded-[6px] border border-[#E5E5E5] bg-white px-3 text-xs text-[#0A0A0A] outline-none transition-colors focus:border-[#0A0A0A]"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#525252]">Description</label>
            <textarea
              rows={2}
              value={customization.description}
              onChange={(e) => updateCustomization({ description: e.target.value })}
              className="w-full min-h-[54px] rounded-[6px] border border-[#E5E5E5] bg-white p-2 text-xs text-[#0A0A0A] outline-none transition-colors focus:border-[#0A0A0A] resize-y"
            />
          </div>

          {/* Site Name and Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#525252]">Site Name</label>
              <input
                type="text"
                value={customization.siteName}
                placeholder={document.metadata.siteName || "Site or Publication"}
                onChange={(e) => updateCustomization({ siteName: e.target.value })}
                className="w-full h-9 rounded-[6px] border border-[#E5E5E5] bg-white px-3 text-xs text-[#0A0A0A] outline-none transition-colors focus:border-[#0A0A0A]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#525252]">Author or Handle</label>
              <input
                type="text"
                value={customization.author}
                placeholder="Author name or @handle"
                onChange={(e) => updateCustomization({ author: e.target.value })}
                className="w-full h-9 rounded-[6px] border border-[#E5E5E5] bg-white px-3 text-xs text-[#0A0A0A] outline-none transition-colors focus:border-[#0A0A0A]"
              />
            </div>
          </div>

          {/* URL Display Control */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#525252]">Card URL</label>
              <div className="inline-flex items-center rounded-[6px] border border-[#E5E5E5] bg-[#F7F7F7] p-0.5 gap-0.5">
                <button
                  type="button"
                  onClick={() => handleUrlModeChange("domain")}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-[4px] transition-colors ${
                    customization.urlDisplayMode === "domain"
                      ? "bg-white text-[#0A0A0A] shadow-xs"
                      : "text-[#737373] hover:text-[#0A0A0A]"
                  }`}
                >
                  Domain
                </button>
                <button
                  type="button"
                  onClick={() => handleUrlModeChange("full")}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-[4px] transition-colors ${
                    customization.urlDisplayMode === "full"
                      ? "bg-white text-[#0A0A0A] shadow-xs"
                      : "text-[#737373] hover:text-[#0A0A0A]"
                  }`}
                >
                  Full URL
                </button>
                <button
                  type="button"
                  onClick={() => handleUrlModeChange("none")}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-[4px] transition-colors ${
                    customization.urlDisplayMode === "none"
                      ? "bg-white text-[#0A0A0A] shadow-xs"
                      : "text-[#737373] hover:text-[#0A0A0A]"
                  }`}
                >
                  Hidden
                </button>
              </div>
            </div>

            {customization.urlDisplayMode !== "none" && (
              <input
                type="text"
                value={currentDisplayUrl}
                onChange={(e) => updateCustomization({ customUrl: e.target.value })}
                placeholder="URL text shown on the card"
                className="w-full h-9 rounded-[6px] border border-[#E5E5E5] bg-white px-3 text-xs text-[#0A0A0A] outline-none transition-colors focus:border-[#0A0A0A]"
              />
            )}
          </div>
        </div>
      </div>

      {/* 3. Thumbnail / Preview Image Control */}
      <div className="flex flex-col gap-2 pt-3 border-t border-[#E5E5E5]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
            Card Thumbnail
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-[#0A0A0A]">
            <input
              type="checkbox"
              checked={customization.showImage}
              onChange={(e) => updateCustomization({ showImage: e.target.checked })}
              className="size-3.5 rounded accent-[#0A0A0A] cursor-pointer"
            />
            <span>Show preview image</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          {/* Thumbnail preview square */}
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
            <div className="size-9 rounded-[6px] border border-[#E5E5E5] bg-[#FAFAFA] flex items-center justify-center text-[#A3A3A3] shrink-0">
              <ImageIcon className="size-4" />
            </div>
          )}

          {/* Image URL input */}
          <input
            type="text"
            value={customization.imageUrl || ""}
            onChange={(e) => handleThumbnailUrlChange(e.target.value)}
            placeholder="Paste image or thumbnail URL"
            className="flex-1 h-9 rounded-[6px] border border-[#E5E5E5] bg-white px-3 text-xs text-[#0A0A0A] outline-none transition-colors focus:border-[#0A0A0A]"
          />

          {/* Clear thumbnail button */}
          {customization.imageUrl && (
            <button
              type="button"
              onClick={() => updateCustomization({ imageUrl: null, showImage: false })}
              className="h-9 px-2.5 rounded-[6px] border border-[#E5E5E5] text-xs font-medium text-[#737373] hover:text-[#0A0A0A] hover:border-[#0A0A0A]/40 transition-colors flex items-center gap-1 shrink-0"
              title="Remove thumbnail"
            >
              <X className="size-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

          {/* Restore original metadata image */}
          {document.metadata.imageUrl && document.metadata.imageUrl !== customization.imageUrl && (
            <button
              type="button"
              onClick={() =>
                updateCustomization({
                  imageUrl: document.metadata.imageUrl,
                  showImage: true,
                })
              }
              className="h-9 px-2.5 rounded-[6px] border border-[#E5E5E5] text-xs font-medium text-[#737373] hover:text-[#0A0A0A] hover:border-[#0A0A0A]/40 transition-colors shrink-0"
              title="Restore extracted image"
            >
              Original
            </button>
          )}
        </div>
      </div>

      {/* 4. Appearance: Palette & Typography */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E5E5E5] items-start">
        {/* Palette with clean solid active state without borderlines */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
            Palette
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {COLOR_PRESETS.map((preset) => {
              const isSelected =
                customization.backgroundColor === preset.bg &&
                customization.textColor === preset.text;
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
                  className={`flex items-center justify-between h-8 px-2.5 rounded-[5px] text-[11px] font-medium transition-colors ${
                    isSelected
                      ? "bg-[#0A0A0A] text-white border-transparent"
                      : "bg-[#FAFAFA] text-[#525252] border border-[#E5E5E5] hover:border-[#0A0A0A]/40 hover:text-[#0A0A0A]"
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="size-2.5 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: preset.bg }}
                    />
                    <span className="truncate">{preset.name}</span>
                  </div>
                  {isSelected && <Check className="size-3 text-white shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Typography & Reset */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
              Font
            </span>
            <button
              type="button"
              onClick={onReset}
              className="text-[11px] text-[#737373] hover:text-[#0A0A0A] hover:underline transition-colors"
            >
              Reset defaults
            </button>
          </div>
          <div className="flex gap-1.5">
            {(["satoshi", "serif", "mono"] as TypographyFamily[]).map((font) => {
              const label = font === "satoshi" ? "Sans" : font === "serif" ? "Serif" : "Mono";
              const isSelected = customization.fontFamily === font;
              return (
                <button
                  key={font}
                  type="button"
                  onClick={() => updateCustomization({ fontFamily: font })}
                  className={`flex-1 h-8 rounded-[5px] border text-xs font-medium transition-colors ${
                    isSelected
                      ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                      : "border-[#E5E5E5] bg-white text-[#525252] hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
