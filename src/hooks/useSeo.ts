import { useEffect } from 'react';

interface SeoOptions {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE_NAME = 'Helix Amino';
const SITE_URL = 'https://helixamino.com';
const DEFAULT_IMAGE = `${SITE_URL}/IMG_2185.jpeg`;
const DEFAULT_DESCRIPTION =
  'Premium ≥99% purity research peptides, blends, and compounds. Third-party COAs on every batch, HPLC-verified purity, USA domestic shipping. Strictly for laboratory research use only.';

function setMeta(
  attr: 'name' | 'property',
  key: string,
  value: string | undefined,
) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!value) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setLink(rel: string, href: string | undefined) {
  const selector = `link[rel="${rel}"][data-seo="1"]`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!href) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    el.setAttribute('data-seo', '1');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(data: SeoOptions['jsonLd']) {
  document.head
    .querySelectorAll('script[data-seo-jsonld="1"]')
    .forEach((n) => n.remove());
  if (!data) return;
  const blocks = Array.isArray(data) ? data : [data];
  for (const block of blocks) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-jsonld', '1');
    script.textContent = JSON.stringify(block);
    document.head.appendChild(script);
  }
}

export function useSeo(options: SeoOptions) {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    canonical,
    image = DEFAULT_IMAGE,
    type = 'website',
    keywords,
    noindex = false,
    jsonLd,
  } = options;

  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large');

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:url', canonical ?? SITE_URL);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    setLink('canonical', canonical ?? window.location.origin + window.location.pathname);

    setJsonLd(jsonLd);
  }, [title, description, canonical, image, type, keywords, noindex, JSON.stringify(jsonLd)]);
}

export { SITE_NAME, SITE_URL, DEFAULT_IMAGE, DEFAULT_DESCRIPTION };
