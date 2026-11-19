// src/config/store.config.ts
//
// ============================================================================
// SINGLE SOURCE OF TRUTH for Ryvano's branding/content/theme defaults.
// ============================================================================
//
// This is the one file that needs editing to reskin the site without
// touching any core component. Fields here fall into two groups:
//
//   1. Fields also present on the backend `settings` row (brandName,
//      logoUrl, whatsappNumber, whatsappUrl, instagramUrl, tiktokUrl,
//      primaryColor/secondaryColor as theme.primary/theme.secondary,
//      hoursText, mapUrl). For these, whatever the admin saves in Settings
//      (fetched at runtime from GET /api/public-settings) always overrides
//      the value below — this file only supplies the fallback before that
//      request resolves, or if it fails.
//
//   2. Fields with no backend column yet (extra social links, extra theme
//      colors, SEO defaults). These are frontend-only for now — the
//      architecture is ready for them to move into the admin Settings page
//      and the public-settings response in a future phase; until then, edit
//      them here.
//
// Nothing in this file should be imported by name into a specific page —
// always go through `useStoreConfig()` (see src/context/storeconfig.ts),
// which merges this file with live backend settings. This codebase started
// from a reusable café/store template (see the earlier e-commerce project's
// store-template) — reused here for Ryvano's OWN site, but the same
// single-file-to-reskin discipline still applies if this ever needs to seed
// another site.
import type { BilingualText } from '../types';

export interface StoreContact {
  phone?: string;
  whatsappNumber?: string;
  whatsappUrl?: string;
  email?: string;
  address?: BilingualText;
  mapUrl?: string;
  hoursText?: BilingualText;
  /** Optional QR code image (e.g. a scannable WhatsApp link) shown in the footer. */
  qrCodeImage?: string;
}

export interface StoreSocialLinks {
  instagramUrl?: string;
  tiktokUrl?: string;
  facebookUrl?: string;
  snapchatUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string; // X / Twitter
}

export interface StoreContent {
  announcementText?: BilingualText;
  heroBadge?: BilingualText;
  /** Falls back to brandName when not set. */
  heroTitle?: BilingualText;
  heroSubtitle?: BilingualText;
  footerTagline?: BilingualText;
  aboutTitle?: BilingualText;
  aboutBody?: BilingualText;
  contactCtaText?: BilingualText;
}

export interface StoreTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  card: string;
  success: string;
  warning: string;
  error: string;
}

export interface StoreSeo {
  defaultTitle?: string;
  titleSuffix?: string;
  defaultDescription?: string;
  ogImage?: string;
}

export interface StoreConfig {
  brandName: BilingualText;
  logoUrl?: string;
  faviconUrl?: string;
  contact: StoreContact;
  social: StoreSocialLinks;
  content: StoreContent;
  theme: StoreTheme;
  seo: StoreSeo;
}

// Ryvano's real brand — espresso/paper/brass identity from the logo pack
// (Ink #2B1C12, Paper #EFE9DD, Brass #B1793A, Brass Deep #86571F,
// Line #D3C7AE). These intentionally match schema.sql's seed row so the
// brief default-content flash on a first-ever visit (before the live
// settings fetch resolves) shows the exact same content as the real data,
// not a placeholder that then visibly swaps.
export const defaultStoreConfig: StoreConfig = {
  brandName: { en: 'Ryvano', ar: 'ريفانو' },
  logoUrl: '/logo/ryvano-lockup-ink.svg',
  faviconUrl: '/favicon.ico',
  contact: {
    whatsappNumber: '+96500000000',
    address: { en: 'Kuwait City, Kuwait', ar: 'مدينة الكويت، الكويت' },
    mapUrl: 'https://maps.google.com/?q=Kuwait+City',
    hoursText: {
      en: 'Sat–Thu 7am–11pm · Fri 2pm–11pm',
      ar: 'السبت–الخميس 7ص–11م · الجمعة 2م–11م',
    },
  },
  social: {},
  content: {
    heroBadge: {
      en: 'Small-batch, slow mornings',
      ar: 'دفعات صغيرة، صباحات هادئة',
    },
    heroTitle: { en: 'Ryvano', ar: 'ريفانو' },
    heroSubtitle: {
      en: 'Coffee worth the walk. A quiet corner for good work and better conversation.',
      ar: 'قهوة تستحق المشوار. ركن هادئ للعمل الجيد والحديث الأفضل.',
    },
    footerTagline: {
      en: 'Coffee worth the walk.',
      ar: 'قهوة تستحق المشوار.',
    },
    contactCtaText: {
      en: 'Say Hello',
      ar: 'تواصل معنا',
    },
    aboutTitle: {
      en: 'Our Story',
      ar: 'قصتنا',
    },
    aboutBody: {
      en: `Ryvano started as a single espresso machine and a stubborn belief that a neighborhood café could hold both a proper flat white and a proper afternoon. We roast in small batches, bake every morning before opening, and keep the room quiet enough to think in. Come for the coffee. Stay for the light through the windows at four in the afternoon.`,
      ar: `بدأ ريفانو بآلة إسبريسو واحدة وإيمان راسخ بأن مقهى الحي يمكن أن يجمع بين فلات وايت متقن وعصر هادئ. نحمّص بدفعات صغيرة، نخبز كل صباح قبل الفتح، ونحافظ على هدوء المكان بما يكفي للتفكير. تعال من أجل القهوة. ابقَ من أجل الضوء المتسلل من النوافذ عند الرابعة عصراً.`,
    },
  },
  theme: {
    primary: '#86571F',   // Brass Deep — buttons, primary actions
    secondary: '#2B1C12', // Ink — dark sections, primary text
    accent: '#B1793A',    // Brass — single-color accents, hover states
    background: '#EFE9DD',// Paper — page background
    foreground: '#2B1C12',// Ink — body text on Paper
    muted: '#8A7A66',     // warm muted brown-gray — secondary text
    border: '#D3C7AE',    // Line — hairlines/dividers
    card: '#FFFFFF',      // cards sit slightly lighter than the Paper ground
    success: '#4B7F52',
    warning: '#B1793A',
    error: '#A23B2E',
  },
  seo: {
    defaultTitle: 'Ryvano — Coffee worth the walk',
    defaultDescription: 'Small-batch coffee, fresh pastries, and a quiet room to sit in. Visit Ryvano today.',
    ogImage: '/logo/ryvano-profile-circle-512.png',
  },
};
