import type { Metadata, Viewport } from "next";
import { Libre_Franklin, Newsreader, Noto_Serif_Display } from "next/font/google";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/shared/MotionProvider";
import { brand, hero } from "@/lib/content";
import "./globals.css";

const display = Noto_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: "300",
  style: ["normal", "italic"],
  adjustFontFallback: false,
  fallback: ["PS Display Fallback", "serif"],
});

const text = Newsreader({
  variable: "--font-text",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: "normal",
  preload: false,
  adjustFontFallback: false,
  fallback: ["PS Text Fallback", "serif"],
});

const ui = Libre_Franklin({
  variable: "--font-ui",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: brand.name,
  description: hero.eyebrow,
  openGraph: {
    title: brand.name,
    description: hero.eyebrow,
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: hero.image.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: brand.name,
    description: hero.eyebrow,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
  themeColor: "#FBF8F1",
  colorScheme: "only light",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-IN" className={`${display.variable} ${text.variable} ${ui.variable}`}>
      <body>
        <a href="#top" className="skip-link">
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
