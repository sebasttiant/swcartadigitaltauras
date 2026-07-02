import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import "./globals.css";

// Self-hosted display serif. Local files (not next/font/google) keep the build
// and dev preview working with no network access inside containers.
const playfair = localFont({
  src: [
    { path: "./fonts/PlayfairDisplay-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/PlayfairDisplay-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/PlayfairDisplay-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Carta Digital Tauras",
  description:
    "Premium bilingual digital menu for Tauras — featured meats, cocktails, and recommendations.",
};

export const viewport: Viewport = {
  themeColor: "#100c0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // NOTE: `lang` is hardcoded to "es" because the public menu currently selects
  // language via a `?lang=` search param resolved inside the page, which the
  // root layout cannot read. Making <html lang> reflect the active language
  // requires moving language into a route segment (e.g. `/[lang]/menu`) with its
  // own layout. Deferred until locale routing is defined; Spanish is the default.
  return (
    <html lang="es" className={playfair.variable}>
      <body>{children}</body>
    </html>
  );
}
