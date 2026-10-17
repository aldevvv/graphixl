import React from "react";
import { SiteHeader } from "@/components/graphixl/site-header";
import { CardApp } from "@/components/graphixl/card-app";
import { SiteFooter } from "@/components/graphixl/site-footer";

export default function HomePage(): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0A0A0A]">
      <SiteHeader />
      <main className="flex-1 w-full">
        <CardApp />
      </main>
      <SiteFooter />
    </div>
  );
}
