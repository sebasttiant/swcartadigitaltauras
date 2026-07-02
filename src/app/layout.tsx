import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carta Digital Tauras",
  description:
    "Premium bilingual digital menu for Tauras — featured meats, cocktails, and recommendations.",
};

export const viewport: Viewport = {
  themeColor: "#0f0d0b",
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
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
