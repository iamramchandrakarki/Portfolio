import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { identity } from "@/data/portfolio";
import { ShellClient } from "@/components/ShellClient";
import "./globals.css";

const display = localFont({ src: "./fonts/archivo-black.ttf", variable: "--font-display", weight: "400", display: "swap" });
const mono = localFont({ src: "./fonts/commit-mono-regular.woff2", variable: "--font-mono", weight: "400", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Ramchandra Karki — Full Stack Developer", template: "%s — Ramchandra Karki" },
  description: identity.intro,
  openGraph: { title: "Ramchandra Karki — Full Stack Developer", description: identity.intro, type: "website" },
};
export const viewport: Viewport = { themeColor: "#101012" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ShellClient>{children}</ShellClient>
      </body>
    </html>
  );
}
