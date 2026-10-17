import React from "react";
import { GitHubIcon } from "./github-icon";

export function AboutSection(): React.JSX.Element {
  return (
    <section id="about" className="w-full py-20 border-t border-[#E5E5E5]">
      <div className="w-[min(1120px,calc(100%-48px))] mx-auto max-w-2xl flex flex-col gap-5">
        <h2 className="text-3xl font-bold tracking-tight text-[#0A0A0A]">
          Open source. No account required.
        </h2>
        <p className="text-base text-[#525252] leading-relaxed">
          Graphixl is an open-source tool for creating shareable images from public links. Customize your cards and export them directly without signing in.
        </p>
        <div className="pt-2">
          <a
            href="https://github.com/aldevvv/graphixl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#0A0A0A] hover:underline"
          >
            <GitHubIcon className="size-4" />
            <span>GitHub repository</span>
          </a>
        </div>
      </div>
    </section>
  );
}
