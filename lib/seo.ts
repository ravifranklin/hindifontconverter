import type { Metadata } from 'next';
import { names, routes } from './routes';

export const SITE_ORIGIN = 'https://krutidevunicodefontconverter.com';
export const HOME_TITLE = 'Akshar - KrutiDev (Kruti Dev) To Unicode Converter';
const support: Record<string, [string, string]> = {
  typing: ['Kruti Dev Typing to Unicode | Akshar', 'Type Hindi with the Remington keyboard and see Unicode text as you type. Review and copy your text in Akshar.'],
  keyboard: ['Kruti Dev Remington Keyboard Guide | Akshar', 'Explore the Kruti Dev Remington keyboard layout and learn which keys produce Hindi letters and marks.'],
  fonts: ['Hindi and Nepali Font Guides | Akshar', 'Find installation and licensing guidance for Kruti Dev, Preeti and Chanakya, and learn how Mangal relates to Unicode.'],
  'font-krutidev': ['Kruti Dev 010 Font Installation Guide | Akshar', 'Learn about the Kruti Dev 010 legacy Hindi font, installing a licensed copy, and converting its text to Unicode.'],
  'font-preeti': ['Preeti Font Installation Guide | Akshar', 'Learn about the Preeti legacy Nepali font, installing a licensed copy, and converting between Preeti and Unicode text.'],
  'font-chanakya': ['Chanakya Font Installation Guide | Akshar', 'Learn about the Chanakya legacy Hindi font, installing a licensed copy, and converting its text to Unicode.'],
  contact: ['Contact Akshar | Hindi and Nepali Font Converter', 'Find out how to contact Akshar about Hindi and Nepali font conversion and report a conversion problem.'],
  privacy: ['Privacy Policy | Akshar Font Converter', 'Read how Akshar handles browser-based text conversion, shared drafts, contact messages and hosting access.'],
};
export const indexableSlugs = ['home', ...routes.map(route => route.slug), ...Object.keys(support)];
export function pageSeo(slug: string) {
  const route = routes.find(item => item.slug === slug);
  const home = slug === 'home';
  const title = home ? HOME_TITLE : route ? `${names[route.from]} to ${names[route.to]} Converter | Akshar` : support[slug]?.[0];
  const description = home
    ? 'Convert Kruti Dev Hindi text to Unicode with Akshar. Paste your text, convert it in your browser, and copy the result.'
    : route ? `Convert ${names[route.from]} text to ${names[route.to]} in your browser with Akshar. Paste, review and copy your converted ${route.from === 'preeti' || route.to === 'preeti' ? 'Nepali' : 'Hindi'} text.` : support[slug]?.[1];
  if (!title || !description) return null;
  const url = SITE_ORIGIN + (home || slug === 'krutidev-to-unicode' ? '/' : `/${slug}`);
  return { title, description, url, application: home || !!route || slug === 'typing' };
}
export function pageMetadata(slug: string): Metadata {
  const seo = pageSeo(slug);
  if (!seo) return {};
  return {
    title: seo.title, description: seo.description,
    alternates: { canonical: seo.url },
    openGraph: { type: 'website', siteName: 'Akshar', title: seo.title, description: seo.description, url: seo.url },
    twitter: { card: 'summary', title: seo.title, description: seo.description },
    other: { 'twitter:url': seo.url },
  };
}
export function applicationSchema(slug: string) {
  const seo = pageSeo(slug);
  if (!seo?.application) return null;
  return { '@context': 'https://schema.org', '@type': 'WebApplication', name: seo.title, url: seo.url, description: seo.description, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web browser' };
}
