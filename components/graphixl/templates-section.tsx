import React from "react";
import { TemplateId } from "@/lib/cards/types";
import { TEMPLATE_METADATA } from "@/lib/cards/templates";

interface TemplatesSectionProps {
  onSelectTemplate?: (template: TemplateId) => void;
}

const TEMPLATE_CARDS: {
  id: TemplateId;
  previewSample: string;
}[] = [
  {
    id: "editorial",
    previewSample: "The quiet discipline of minimalist software architecture.",
  },
  {
    id: "minimal",
    previewSample: "Less visual noise, more signal.",
  },
  {
    id: "product",
    previewSample: "Next generation design tooling for engineering teams.",
  },
  {
    id: "repository",
    previewSample: "vercel/next.js · 120,000 stars · TypeScript",
  },
];

export function TemplatesSection({ onSelectTemplate }: TemplatesSectionProps): React.JSX.Element {
  return (
    <section id="templates" className="w-full py-20 border-t border-[#E5E5E5]">
      <div className="w-[min(1120px,calc(100%-48px))] mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-2 max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-[#0A0A0A]">
            Card templates
          </h2>
          <p className="text-base text-[#525252] leading-relaxed">
            Layouts designed for articles, announcements, and repositories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEMPLATE_CARDS.map((card) => {
            const meta = TEMPLATE_METADATA[card.id];
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onSelectTemplate?.(card.id)}
                className="group flex flex-col items-start text-left transition-colors cursor-pointer"
              >
                {/* Visual Preview Frame */}
                <div className="w-full aspect-[16/10] rounded-[8px] border border-[#E5E5E5] bg-[#FAFAFA] p-4 flex flex-col justify-between mb-3 group-hover:border-[#0A0A0A] transition-colors">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#0A0A0A]" />
                    <span className="h-1 w-12 rounded-full bg-[#E5E5E5]" />
                  </div>
                  <p className="text-xs font-semibold text-[#0A0A0A] line-clamp-2">
                    {card.previewSample}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#737373]">
                    <span>{meta.name}</span>
                    <span>1200 × 630</span>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-[#0A0A0A]">
                  {meta.name}
                </h3>
                <p className="text-xs text-[#525252] mt-0.5 line-clamp-2">
                  {meta.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
