import type { Metadata } from "next";
import Script from "next/script";
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
      <body className="antialiased"><WebTools/><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org","@type":"WebSite",name:"Akshar",url:SITE_ORIGIN+"/"})}}/>{children}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-QKH5W4S447"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-QKH5W4S447');
        `}
      </Script>
      </body>
    </html>
  );
}
