import type { Metadata } from "next";
import { SITE_ORIGIN, pageMetadata } from "@/lib/seo";
import "./globals.css";
import WebTools from '@/components/web-tools';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  ...pageMetadata("home"),
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
      <body className="antialiased"><WebTools/><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org","@type":"WebSite",name:"Akshar",url:SITE_ORIGIN+"/"})}}/>{children}</body>
    </html>
  );
}
