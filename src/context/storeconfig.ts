// src/context/storeconfig.ts
//
// Single hook every component should use to read site branding/content/
// theme info. It merges the live, admin-editable backend settings (fetched
// in AppProvider) over the static defaults in src/config/store.config.ts —
// so components never need to know which fields are backend-backed yet and
// which are still frontend-only defaults; that boundary can move over time
// (as the backend Settings page grows) without touching any component that
// calls useStoreConfig().
import { useMemo } from 'react';
import { useApp } from './appcontext';
import { defaultStoreConfig, type StoreConfig } from '../config/store.config';
import type { BilingualText } from '../types';

// The admin Settings form always saves bilingual fields as a real
// `{ en, ar }` object - even when the admin has left both boxes blank, in
// which case it's `{ en: '', ar: '' }` rather than null/undefined. That
// object is still truthy, so a plain `s.field || default` never falls back
// and every unfilled bilingual field (hero copy, About text, hours, etc.)
// renders as visibly blank instead of using the sensible default from
// store.config.ts. This checks for actual text in either language before
// treating the saved value as "set".
function bilingualOrDefault(
  value: BilingualText | undefined | null,
  fallback: BilingualText | undefined
): BilingualText | undefined {
  const hasContent = !!(value && (value.en?.trim() || value.ar?.trim()));
  return hasContent ? value : fallback;
}

export function useStoreConfig(): StoreConfig {
  const { state } = useApp();
  const s = state.settings;

  return useMemo<StoreConfig>(() => ({
    brandName: s.brandName ?? defaultStoreConfig.brandName,
    logoUrl: s.logoUrl || defaultStoreConfig.logoUrl,
    faviconUrl: defaultStoreConfig.faviconUrl,
    contact: {
      ...defaultStoreConfig.contact,
      whatsappNumber: s.whatsappNumber || defaultStoreConfig.contact.whatsappNumber,
      whatsappUrl: s.whatsappUrl || defaultStoreConfig.contact.whatsappUrl,
      phone: s.contactPhone || defaultStoreConfig.contact.phone,
      email: s.contactEmail || defaultStoreConfig.contact.email,
      address: bilingualOrDefault(s.contactAddress, defaultStoreConfig.contact.address),
      mapUrl: s.mapUrl || defaultStoreConfig.contact.mapUrl,
      hoursText: bilingualOrDefault(s.hoursText, defaultStoreConfig.contact.hoursText),
      qrCodeImage: s.qrCodeImage || defaultStoreConfig.contact.qrCodeImage,
    },
    social: {
      ...defaultStoreConfig.social,
      instagramUrl: s.instagramUrl || defaultStoreConfig.social.instagramUrl,
      tiktokUrl: s.tiktokUrl || defaultStoreConfig.social.tiktokUrl,
      facebookUrl: s.facebookUrl || defaultStoreConfig.social.facebookUrl,
      snapchatUrl: s.snapchatUrl || defaultStoreConfig.social.snapchatUrl,
      youtubeUrl: s.youtubeUrl || defaultStoreConfig.social.youtubeUrl,
      twitterUrl: s.twitterUrl || defaultStoreConfig.social.twitterUrl,
    },
    content: {
      ...defaultStoreConfig.content,
      announcementText: bilingualOrDefault(s.announcementText, defaultStoreConfig.content.announcementText),
      heroBadge: bilingualOrDefault(s.heroBadge, defaultStoreConfig.content.heroBadge),
      heroTitle: bilingualOrDefault(s.heroTitle, defaultStoreConfig.content.heroTitle),
      heroSubtitle: bilingualOrDefault(s.heroSubtitle, defaultStoreConfig.content.heroSubtitle),
      footerTagline: bilingualOrDefault(s.footerTagline, defaultStoreConfig.content.footerTagline),
      aboutTitle: bilingualOrDefault(s.aboutTitle, defaultStoreConfig.content.aboutTitle),
      aboutBody: bilingualOrDefault(s.aboutBody, defaultStoreConfig.content.aboutBody),
      contactCtaText: bilingualOrDefault(s.contactCtaText, defaultStoreConfig.content.contactCtaText),
    },
    theme: {
      ...defaultStoreConfig.theme,
      primary: s.primaryColor || defaultStoreConfig.theme.primary,
      secondary: s.secondaryColor || defaultStoreConfig.theme.secondary,
      accent: s.accentColor || defaultStoreConfig.theme.accent,
      background: s.backgroundColor || defaultStoreConfig.theme.background,
      foreground: s.foregroundColor || defaultStoreConfig.theme.foreground,
      muted: s.mutedColor || defaultStoreConfig.theme.muted,
      border: s.borderColor || defaultStoreConfig.theme.border,
      card: s.cardColor || defaultStoreConfig.theme.card,
      success: s.successColor || defaultStoreConfig.theme.success,
      warning: s.warningColor || defaultStoreConfig.theme.warning,
      error: s.errorColor || defaultStoreConfig.theme.error,
    },
    seo: {
      ...defaultStoreConfig.seo,
      defaultTitle: s.seoDefaultTitle || defaultStoreConfig.seo.defaultTitle,
      titleSuffix: s.seoTitleSuffix || defaultStoreConfig.seo.titleSuffix,
      defaultDescription: s.seoDefaultDescription || defaultStoreConfig.seo.defaultDescription,
      ogImage: s.seoOgImage || defaultStoreConfig.seo.ogImage,
    },
  }), [s]);
}
