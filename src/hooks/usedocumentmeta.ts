// src/hooks/usedocumentmeta.ts
//
// Keeps document.title, the meta description, the favicon, and the Open
// Graph tags in sync with the store's config (frontend defaults merged with
// whatever the admin has saved, via useStoreConfig()) and the current
// language. This is the one place that reads storeConfig.seo, so a new
// store deployment only has to edit store.config.ts (or, eventually, the
// admin Settings/Appearance page) to change its title/description/favicon
// everywhere — no per-page wiring needed.
import { useEffect } from 'react';
import { useApp } from '../context/appcontext';
import { useStoreConfig } from '../context/storeconfig';
import { getText } from '../utils/helpers';

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export function useDocumentMeta(): void {
  const { state } = useApp();
  const storeConfig = useStoreConfig();

  useEffect(() => {
    const brand = getText(storeConfig.brandName, state.language);
    const title =
      storeConfig.seo.defaultTitle ||
      (storeConfig.seo.titleSuffix ? `${brand} ${storeConfig.seo.titleSuffix}` : brand);

    document.title = title;
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:site_name', brand);

    if (storeConfig.seo.defaultDescription) {
      setMetaTag('name', 'description', storeConfig.seo.defaultDescription);
      setMetaTag('property', 'og:description', storeConfig.seo.defaultDescription);
    }

    if (storeConfig.seo.ogImage) {
      setMetaTag('property', 'og:image', storeConfig.seo.ogImage);
    }

    if (storeConfig.faviconUrl) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = storeConfig.faviconUrl;
    }
  }, [storeConfig, state.language]);
}
