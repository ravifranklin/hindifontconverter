'use client';
import { useEffect, useMemo } from 'react';
import { applicationSchema, pageSeo } from '@/lib/seo';

export default function PageSeo({ slug }: { slug: string }) {
  const seo = useMemo(() => pageSeo(slug), [slug]);
  useEffect(() => {
    if (!seo) return;
    const sync = () => {
      // Framework hydration can reinsert the original route metadata after pushState.
      // Reconcile metadata only; navigation and converter state remain untouched.
      const titles = [...document.querySelectorAll('title')];
      titles.slice(1).forEach(element => element.remove());
      if (document.title !== seo.title) document.title = seo.title;
      const meta = (attribute: 'name' | 'property', key: string, content: string) => {
        const elements = [...document.querySelectorAll<HTMLMetaElement>(`meta[${attribute}="${key}"]`)];
        let element = elements[0];
        elements.slice(1).forEach(duplicate => duplicate.remove());
        if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.appendChild(element); }
        if (element.content !== content) element.content = content;
      };
      const links = [...document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')];
      let canonical = links[0];
      links.slice(1).forEach(element => element.remove());
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
      if (canonical.href !== seo.url) canonical.href = seo.url;
      meta('name', 'description', seo.description);
      for (const [key, value] of Object.entries({ 'og:title': seo.title, 'og:description': seo.description, 'og:url': seo.url, 'og:type': 'website', 'og:site_name': 'Akshar' })) meta('property', key, value);
      for (const [key, value] of Object.entries({ 'twitter:card': 'summary', 'twitter:title': seo.title, 'twitter:description': seo.description, 'twitter:url': seo.url })) meta('name', key, value);
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [seo]);
  const schema = applicationSchema(slug);
  return schema ? <script id="application-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} /> : null;
}
