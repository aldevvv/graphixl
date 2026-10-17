"use client";

import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu } from "lucide-react";
import { GraphixlLogo } from "./logo";
import { GitHubIcon } from "./github-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_ITEMS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#templates", label: "Templates" },
  { href: "#about", label: "About" },
] as const;

export function SiteHeader(): React.JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (val) => {
    setIsScrolled(val > 10);
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-40 w-full transition-all duration-200 bg-white ${
        isScrolled
          ? "border-b border-[#E5E5E5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          : "border-b border-[#E5E5E5]"
      }`}
    >
      <div className="mx-auto grid h-[70px] w-[min(1200px,calc(100%-48px))] grid-cols-[1fr_auto_1fr] items-center">
        {/* Left: Brand */}
        <div className="flex items-center justify-start">
          <a
            href="#"
            className="group outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] rounded-md"
            aria-label="Graphixl home"
          >
            <GraphixlLogo />
          </a>
        </div>

        {/* Center: True Centered Navigation (Desktop) */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#525252]"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="py-1 transition-colors hover:text-[#0A0A0A]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3">
          <a
            href="https://github.com/aldevvv/graphixl"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-[8px] border border-[#E5E5E5] bg-white px-3.5 h-10 text-sm font-medium text-[#0A0A0A] transition-colors hover:bg-[#F7F7F7]"
          >
            <GitHubIcon className="size-4" />
            <span>GitHub</span>
          </a>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="inline-flex size-10 items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white text-[#0A0A0A] hover:bg-[#F7F7F7]"
                aria-label="Open navigation menu"
              >
                <Menu className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 p-1.5 border border-[#E5E5E5] bg-white text-[#0A0A0A] rounded-[10px] shadow-sm"
              >
                <DropdownMenuGroup>
                  {NAV_ITEMS.map((item) => (
                    <DropdownMenuItem
                      key={item.href}
                      className="cursor-pointer rounded-md text-sm font-medium text-[#525252] hover:bg-[#F7F7F7] hover:text-[#0A0A0A]"
                      render={<a href={item.href} />}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                  <div className="my-1 border-t border-[#E5E5E5]" />
                  <DropdownMenuItem
                    className="cursor-pointer rounded-md text-sm font-medium text-[#0A0A0A] hover:bg-[#F7F7F7]"
                    render={
                      <a
                        href="https://github.com/aldevvv/graphixl"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <GitHubIcon className="size-4 mr-2" />
                    <span>GitHub</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
