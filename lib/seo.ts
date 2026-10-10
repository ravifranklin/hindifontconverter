import type { Metadata } from 'next';
import { names, routes } from './routes';

export const SITE_ORIGIN = 'https://krutidevunicodefontconverter.com';
export const HOME_TITLE = 'Kruti Dev to Unicode Converter | Hindi Font Converter';
const support: Record<string, [string, string]> = {
  typing: ["Remington Hindi Typing to Unicode | Akshar","Type Kruti Dev 010 Remington codes and read Unicode Hindi alongside them. Practice verified matra and reph examples with the keyboard chart."],
  keyboard: ["Kruti Dev 010 Remington Hindi Keyboard Guide | Akshar","Read the Kruti Dev 010 Remington key chart, practice matra and reph sequences, and download the keyboard PDF. Includes verified Hindi typing examples."],
  fonts: ['Hindi Font Installation and Conversion Guides | Akshar', 'Compare Kruti Dev 010, DevLys 010, Preeti and Chanakya with Unicode Hindi. Identify your source font and find the matching converter and licensed installation guidance.'],
  'font-krutidev': ["Kruti Dev 010 Font Installation Guide | Akshar","Install a licensed Kruti Dev 010 font for legacy Hindi documents. Check the source encoding, apply the font in Word and choose the appropriate converter."],
  'font-preeti': ["Preeti Font Installation Guide for Hindi Text | Akshar","Install a licensed Preeti font for Hindi legacy text. Apply it in Word, prevent quote substitution in publishing imports and find the matching Unicode converter."],
  'font-chanakya': ["Chanakya Hindi Font Installation Guide | Akshar","Install a licensed Chanakya font for Hindi publishing text. Apply it to legacy codes, review copied characters and choose Unicode or Kruti Dev conversion."],
  contact: ['Contact Us | Hindi Font Converter', 'Contact our team for help with Hindi font conversion, report conversion issues, or send feedback about our free online Hindi font converter.'],
  privacy: ['Privacy Policy | Akshar Font Converter', 'Read how Akshar handles browser-based text conversion, shared drafts, contact messages and hosting access.'],
};
const converterMetadata: Record<string, [string, string]> = {
  "devlys-to-unicode": ["DevLys 010 to Unicode Hindi Converter | Akshar","Convert DevLys 010 codes to readable Unicode Hindi. Check the source font, review matras and half letters, then copy the result or download a Word file."],
  "unicode-to-devlys": ["Unicode Hindi to DevLys 010 Converter | Akshar","Convert Unicode Hindi to DevLys 010 codes. Copy the output into Word, apply a licensed DevLys 010 font and review the Hindi display."],
  "devlys-to-mangal": ["DevLys 010 to Mangal Unicode Converter | Akshar","Convert DevLys 010 text to Unicode Hindi for Mangal. Review the result, copy it into Word and select Mangal, or download a Word file."],
  "mangal-to-devlys": ["Mangal Hindi to DevLys 010 Converter | Akshar","Copy Unicode Hindi from a Mangal document and convert it to DevLys 010 codes. Apply the matching licensed font and compare with your original."],
  "chanakya-to-unicode": ["Chanakya to Unicode Hindi Converter | Akshar","Convert legacy Chanakya codes to Unicode Hindi. Check the original font, review extracted text and copy the result for a Unicode document or message."],
  "unicode-to-chanakya": ["Unicode Hindi to Chanakya Converter | Akshar","Convert Unicode Hindi to Chanakya legacy codes. Apply a licensed Chanakya font in your document and compare the Hindi display with the Unicode original."],
  "krutidev-to-chanakya": ["Kruti Dev 010 to Chanakya Hindi Converter | Akshar","Convert Kruti Dev 010 codes to Chanakya for Hindi publishing. Apply the matching Chanakya font and review the result against your original document."],
  "chanakya-to-krutidev": ["Chanakya to Kruti Dev 010 Hindi Converter | Akshar","Convert Chanakya text to Kruti Dev 010 codes. Paste the result into Word, apply a licensed Kruti Dev font and proofread the Hindi display."],
  "preeti-to-unicode": ["Preeti to Unicode Converter for Hindi Text | Akshar","Convert Hindi text stored in Preeti legacy codes to Unicode Hindi. Review matras, nukta letters and punctuation, then copy or download the result."],
  "unicode-to-preeti": ["Unicode to Preeti Converter for Hindi Text | Akshar","Convert Unicode Hindi to Preeti legacy codes. Apply a licensed Preeti font and check matras, nukta letters and quote settings in your document."],
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
