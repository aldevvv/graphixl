import React from "react";

export function HowItWorks(): React.JSX.Element {
  const steps = [
    {
      title: "Paste a link",
      description:
        "Input any public web page, article, or repository. Graphixl retrieves Open Graph tags and metadata with anti-SSRF protections.",
    },
    {
      title: "Customize the card",
      description:
        "Choose a template layout, adjust aspect ratios, and refine headlines, text overrides, and palettes to match your taste.",
    },
    {
      title: "Download the image",
      description:
        "Export a high-resolution PNG or vector SVG formatted for Instagram Stories, Twitter feeds, and presentations.",
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-20 border-t border-[#E5E5E5]">
      <div className="w-[min(1120px,calc(100%-48px))] mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-2 max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-[#0A0A0A]">
            How it works
          </h2>
          <p className="text-base text-[#525252] leading-relaxed">
            Three simple steps to transform raw web links into shareable assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div key={step.title} className="flex flex-col gap-2.5">
              <h3 className="text-lg font-semibold text-[#0A0A0A]">
                {step.title}
              </h3>
              <p className="text-sm text-[#525252] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
