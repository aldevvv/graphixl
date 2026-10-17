import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
