import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "Graphixl",
  title: "Graphixl | Turn Links into Shareable Cards",
  description:
    "An open-source tool for turning URLs into polished, customizable social media cards with live previews and high-resolution image exports.",
  keywords: [
    "Graphixl",
    "social media cards",
    "link preview",
    "card generator",
    "open graph",
    "image export",
  ],
  authors: [{ name: "aldevvv" }],
  creator: "aldevvv",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#0A0A0A]">
        {children}
        <Toaster theme="light" />
      </body>
    </html>
  );
}
