import type { Metadata } from "next";
import "./globals.css";
import WebTools from '@/components/web-tools';

export const metadata: Metadata = {
  title: "Akshar — Hindi & Nepali Font Converter",
  description: "Private, browser-based conversion for Kruti Dev, DevLys, Chanakya and Preeti.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased"><WebTools/>{children}</body>
    </html>
  );
}
