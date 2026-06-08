import { useEffect } from 'react';
import type { SeoHeadProps } from '../types';

function upsertMeta(
  attribute: 'name' | 'property',
  key: string,
  content: string,
): void {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function upsertLink(rel: string, href: string): void {
  let element = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

export function SeoHead({ meta, profile, socialUrls }: SeoHeadProps) {
  useEffect(() => {
    const ogImage = meta.ogImage ?? profile.avatarUrl;

    document.title = meta.title;
    upsertMeta('name', 'description', meta.description);

    upsertMeta('property', 'og:title', meta.title);
    upsertMeta('property', 'og:description', meta.description);
    upsertMeta('property', 'og:type', 'profile');
    upsertMeta('property', 'og:image', ogImage);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', meta.title);
    upsertMeta('name', 'twitter:description', meta.description);
    upsertMeta('name', 'twitter:image', ogImage);

    if (meta.canonicalUrl) {
      upsertLink('canonical', meta.canonicalUrl);
    }

    const scriptId = 'biolink-jsonld-person';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      image: ogImage,
      sameAs: socialUrls,
      url: meta.canonicalUrl,
    });
  }, [meta, profile, socialUrls]);

  return null;
}
