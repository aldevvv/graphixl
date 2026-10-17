"use client";

import React from "react";
import {
  CardDocument,
  TemplateId,
  AspectRatioPreset,
  TypographyFamily,
  ASPECT_RATIO_CONFIGS,
} from "@/lib/cards/types";
import { TEMPLATE_METADATA } from "@/lib/cards/templates";

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

  return (
    <div className="w-full flex flex-col gap-10 text-[#0A0A0A]">
      {/* 1. Template Selector */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-semibold text-[#0A0A0A]">
            Templates
          </label>
          <span className="text-xs text-[#737373]">
            Select layout style
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TEMPLATE_OPTIONS.map((id) => {
            const isSelected = document.template === id;
            const meta = TEMPLATE_METADATA[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleTemplateChange(id)}
                className={`flex flex-col items-start p-3.5 rounded-[8px] border text-left transition-all ${
                  isSelected
                    ? "border-[#0A0A0A] bg-[#FAFAFA] ring-1 ring-[#0A0A0A] text-[#0A0A0A]"
                    : "border-[#E5E5E5] bg-white text-[#525252] hover:border-[#0A0A0A]/40 hover:text-[#0A0A0A]"
                }`}
              >
                <div className="w-full aspect-[16/9] mb-2.5 rounded-[4px] border border-[#E5E5E5] bg-white p-2 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-[#0A0A0A]" />
                    <span className="h-1 w-8 rounded-full bg-[#E5E5E5]" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-4/5 rounded-full bg-[#0A0A0A]/80" />
                    <div className="h-1 w-3/5 rounded-full bg-[#E5E5E5]" />
                  </div>
                </div>
                <span className="text-sm font-medium text-[#0A0A0A]">
                  {meta?.name || id}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Dimensions & Aspect Ratio */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-semibold text-[#0A0A0A]">
            Dimensions
          </label>
          <span className="text-xs text-[#737373]">
            {ASPECT_RATIO_CONFIGS[document.aspectRatio].width} × {ASPECT_RATIO_CONFIGS[document.aspectRatio].height} px
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ASPECT_RATIO_OPTIONS.map((preset) => {
            const isSelected = document.aspectRatio === preset;
            const config = ASPECT_RATIO_CONFIGS[preset];
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handleAspectRatioChange(preset)}
                className={`px-4 h-10 rounded-[8px] border text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                    : "border-[#E5E5E5] bg-white text-[#525252] hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Content Fields */}
      <div className="flex flex-col gap-4">
        <label className="text-base font-semibold text-[#0A0A0A]">
          Content
        </label>
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#525252]">Headline</label>
            <input
              type="text"
              value={customization.title}
              onChange={(e) => updateCustomization({ title: e.target.value })}
              className="w-full h-11 rounded-[8px] border border-[#E5E5E5] bg-white px-3.5 text-[15px] text-[#0A0A0A] outline-none transition-colors focus:border-[#0A0A0A]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#525252]">Description</label>
            <textarea
              rows={3}
              value={customization.description}
              onChange={(e) => updateCustomization({ description: e.target.value })}
              className="w-full min-h-[100px] rounded-[8px] border border-[#E5E5E5] bg-white p-3.5 text-[15px] text-[#0A0A0A] outline-none transition-colors focus:border-[#0A0A0A] resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#525252]">Site name</label>
              <input
                type="text"
                value={customization.siteName}
                onChange={(e) => updateCustomization({ siteName: e.target.value })}
                className="w-full h-11 rounded-[8px] border border-[#E5E5E5] bg-white px-3.5 text-[15px] text-[#0A0A0A] outline-none transition-colors focus:border-[#0A0A0A]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#525252]">Author or handle</label>
              <input
                type="text"
                value={customization.author}
                onChange={(e) => updateCustomization({ author: e.target.value })}
                className="w-full h-11 rounded-[8px] border border-[#E5E5E5] bg-white px-3.5 text-[15px] text-[#0A0A0A] outline-none transition-colors focus:border-[#0A0A0A]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Appearance Controls */}
      <div className="flex flex-col gap-4">
        <label className="text-base font-semibold text-[#0A0A0A]">
          Appearance
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Color Palette */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#525252]">Color palette</label>
            <div className="grid grid-cols-2 gap-2">
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
                    className={`flex items-center gap-2 px-3 py-2 rounded-[8px] border text-xs font-medium transition-colors ${
                      isSelected
                        ? "border-[#0A0A0A] bg-[#FAFAFA] text-[#0A0A0A] ring-1 ring-[#0A0A0A]"
                        : "border-[#E5E5E5] bg-white text-[#525252] hover:border-[#0A0A0A]/40 hover:text-[#0A0A0A]"
                    }`}
                  >
                    <div
                      className="size-3.5 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: preset.bg }}
                    />
                    <span className="truncate">{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#525252]">Typography</label>
            <div className="flex gap-2">
              {(["satoshi", "serif", "mono"] as TypographyFamily[]).map((font) => {
                const label = font === "satoshi" ? "Sans" : font === "serif" ? "Serif" : "Mono";
                const isSelected = customization.fontFamily === font;
                return (
                  <button
                    key={font}
                    type="button"
                    onClick={() => updateCustomization({ fontFamily: font })}
                    className={`flex-1 h-9 rounded-[8px] border text-xs font-medium transition-colors ${
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

          {/* Options & Reset */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[#525252]">Options</label>
            <div className="flex flex-col gap-2.5">
              {document.metadata.imageUrl && (
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[#0A0A0A]">
                  <input
                    type="checkbox"
                    checked={customization.showImage}
                    onChange={(e) => updateCustomization({ showImage: e.target.checked })}
                    className="size-4 rounded accent-[#0A0A0A] cursor-pointer"
                  />
                  <span>Show preview image</span>
                </label>
              )}

              <button
                type="button"
                onClick={onReset}
                className="text-left text-xs text-[#737373] hover:text-[#0A0A0A] hover:underline transition-colors mt-1"
              >
                Reset to original metadata
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
