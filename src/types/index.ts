export interface BilingualText {
  en: string;
  ar: string;
}

export interface MenuCategory {
  id: string;
  name: BilingualText;
  slug: string;
  image?: string;
  sortOrder: number;
  createdAt: number;
}

export interface MenuItem {
  id: string;
  name: BilingualText;
  description: BilingualText;
  price: number;
  categorySlug: string;
  image?: string;
  isFeatured: boolean;
  isAvailable: boolean;
  sortOrder: number;
  createdAt: number;
}

export interface Testimonial {
  id: string;
  customerName: string;
  quote: string;
  rating: number;
  sortOrder: number;
  createdAt: number;
}

export interface Visitor {
  ip: string;
  country?: string;
  lastVisit: number;
  isOnline: boolean;
  hourSlot?: number;
}

/** Shape returned by GET /api/visitors (admin only) - see routes/visitors.js. */
export interface VisitorStats {
  /** Unique visitors seen in the last 2 days. */
  total: number;
  /** Visitors active within the last 5 minutes. */
  online: number;
  /** Visit count per hour-of-day (0-23), for the Dashboard chart. */
  hourly: { [hour: number]: number };
  /** Most recent visitors, newest first. */
  recent: Visitor[];
}

export interface Settings {
  brandName: BilingualText;
  primaryColor: string;
  secondaryColor: string;
  whatsappNumber: string;
  qrCodeImage: string;
  /**
   * Never actually sent back by GET /api/settings (the backend strips it
   * from every response for security) — only ever present, optionally, when
   * writing a PUT request to change it. Treat as write-only.
   */
  adminPassword?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
  logoUrl?: string;

  // Remaining theme colors (primaryColor/secondaryColor above are the rest
  // of the 11-role palette — see src/config/store.config.ts's StoreTheme).
  accentColor?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  mutedColor?: string;
  borderColor?: string;
  cardColor?: string;
  successColor?: string;
  warningColor?: string;
  errorColor?: string;

  // Contact & location (whatsappNumber/whatsappUrl above are the rest)
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: BilingualText;
  mapUrl?: string;
  hoursText?: BilingualText;

  // Remaining social links (tiktokUrl/instagramUrl above are the rest)
  facebookUrl?: string;
  snapchatUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;

  // Bilingual site copy
  announcementText?: BilingualText;
  heroBadge?: BilingualText;
  heroTitle?: BilingualText;
  heroSubtitle?: BilingualText;
  footerTagline?: BilingualText;
  aboutTitle?: BilingualText;
  aboutBody?: BilingualText;
  contactCtaText?: BilingualText;

  // SEO
  seoDefaultTitle?: string;
  seoTitleSuffix?: string;
  seoDefaultDescription?: string;
  seoOgImage?: string;
}

export interface AppState {
  menuItems: MenuItem[];
  menuCategories: MenuCategory[];
  testimonials: Testimonial[];
  settings: Settings;
  language: 'en' | 'ar';
  /** True once the initial public data load has finished (success or failure). */
  isInitialLoadComplete: boolean;
  /** True if the initial public data load (menu/testimonials/etc.) failed. */
  hasDataLoadError: boolean;
  /**
   * True once `state.settings` is known to be the site's real, current
   * settings - either because they were already cached in localStorage from
   * a previous successful load (see FileStorage.hasRealSettings()), or
   * because the GET /api/public-settings fetch for this page load has now
   * finished (success or failure). False only during the brief window on a
   * genuinely first-ever visit (empty cache) before that fetch resolves.
   * Brand-specific UI (header logo/name, hero copy, footer tagline) should
   * gate on this instead of rendering immediately, so a first-time visitor
   * never sees placeholder branding swapped out for the real thing a moment
   * later - they see a neutral loading state once, then the real branding.
   */
  settingsReady: boolean;
}

export type AppAction =
  | { type: 'SET_MENU_ITEMS'; payload: MenuItem[] }
  | { type: 'ADD_MENU_ITEM'; payload: MenuItem }
  | { type: 'UPDATE_MENU_ITEM'; payload: MenuItem }
  | { type: 'DELETE_MENU_ITEM'; payload: string }
  | { type: 'SET_MENU_CATEGORIES'; payload: MenuCategory[] }
  | { type: 'ADD_MENU_CATEGORY'; payload: MenuCategory }
  | { type: 'UPDATE_MENU_CATEGORY'; payload: MenuCategory }
  | { type: 'DELETE_MENU_CATEGORY'; payload: string }
  | { type: 'SET_TESTIMONIALS'; payload: Testimonial[] }
  | { type: 'ADD_TESTIMONIAL'; payload: Testimonial }
  | { type: 'UPDATE_TESTIMONIAL'; payload: Testimonial }
  | { type: 'DELETE_TESTIMONIAL'; payload: string }
  | { type: 'SET_SETTINGS'; payload: Settings }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'ar' }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };
