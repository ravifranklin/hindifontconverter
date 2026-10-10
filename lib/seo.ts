import type { Metadata } from 'next';
import { names, routes } from './routes';

export const SITE_ORIGIN = 'https://krutidevunicodefontconverter.com';
export const HOME_TITLE = 'Kruti Dev to Unicode Converter | Hindi Font Converter';
const support: Record<string, [string, string]> = {
  typing: ['Kruti Dev Typing to Unicode | Akshar', 'Type Hindi with the Remington keyboard and see Unicode text as you type. Review and copy your text in Akshar.'],
  keyboard: ['Kruti Dev Remington Keyboard Guide | Akshar', 'Explore the Kruti Dev Remington keyboard layout and learn which keys produce Hindi letters and marks.'],
  fonts: ['Hindi Font Installation and Conversion Guides | Akshar', 'Compare Kruti Dev 010, DevLys 010, Preeti and Chanakya with Unicode Hindi. Identify your source font and find the matching converter and licensed installation guidance.'],
  'font-krutidev': ['Kruti Dev 010 Font Installation Guide | Akshar', 'Learn about the Kruti Dev 010 legacy Hindi font, installing a licensed copy, and converting its text to Unicode.'],
  'font-preeti': ['Preeti Font Installation Guide | Akshar', 'Learn about the Preeti legacy font, installing a licensed copy, and converting between Preeti and Unicode text.'],
  'font-chanakya': ['Chanakya Font Installation Guide | Akshar', 'Learn about the Chanakya legacy Hindi font, installing a licensed copy, and converting its text to Unicode.'],
  contact: ['Contact Us | Hindi Font Converter', 'Contact our team for help with Hindi font conversion, report conversion issues, or send feedback about our free online Hindi font converter.'],
  privacy: ['Privacy Policy | Akshar Font Converter', 'Read how Akshar handles browser-based text conversion, shared drafts, contact messages and hosting access.'],
};
const converterMetadata: Record<string, [string, string]> = {
  'unicode-to-krutidev': ['Unicode to Kruti Dev 010 Converter | Akshar', 'Convert Unicode Hindi text to Kruti Dev 010 codes. Copy the result into Word and apply a licensed Kruti Dev font, or download a Word file.'],
  'krutidev-to-mangal': ['Kruti Dev to Mangal Unicode Converter | Akshar', 'Convert Kruti Dev 010 text to Unicode Hindi for use with Mangal. Review the result, copy the text or download a Word file using Mangal.'],
  'mangal-to-krutidev': ['Mangal to Kruti Dev 010 Converter | Akshar', 'Paste Hindi text from a Mangal document and convert it to Kruti Dev 010. Review the legacy codes, copy them or download a Word file.'],
};
export const indexableSlugs = ['home', ...routes.map(route => route.slug), ...Object.keys(support)];
export function pageSeo(slug: string) {
  const route = routes.find(item => item.slug === slug);
  const home = slug === 'home';
  const title = home ? HOME_TITLE : converterMetadata[slug]?.[0] ?? (route ? `${names[route.from]} to ${names[route.to]} Converter | Akshar` : support[slug]?.[0]);
  const description = home
    ? 'Convert Kruti Dev 010 Hindi text to Unicode online. Paste, review and copy the result, or download a Word file. Conversion runs in your browser.'
    : converterMetadata[slug]?.[1] ?? (route ? `Convert ${names[route.from]} text to ${names[route.to]} in your browser with Akshar. Paste, review and copy your converted Hindi text.` : support[slug]?.[1]);
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
