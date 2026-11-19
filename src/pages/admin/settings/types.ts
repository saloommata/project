// src/pages/admin/settings/types.ts
//
// Flat, form-friendly shape for every field the admin Settings page edits,
// plus the two conversions to/from the real `Settings` type (which uses
// nested { en, ar } objects for bilingual fields — awkward to bind directly
// to a pair of <input>s).
import type { Settings } from '../../../types';

export interface SettingsFormData {
  // Branding
  logoUrl: string;
  brandNameEn: string;
  brandNameAr: string;

  // Theme (11 roles)
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  foregroundColor: string;
  mutedColor: string;
  borderColor: string;
  cardColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;

  // Contact & location
  whatsappNumber: string;
  whatsappUrl: string;
  contactPhone: string;
  contactEmail: string;
  contactAddressEn: string;
  contactAddressAr: string;
  mapUrl: string;
  hoursTextEn: string;
  hoursTextAr: string;
  qrCodeImage: string;

  // Social
  instagramUrl: string;
  tiktokUrl: string;
  facebookUrl: string;
  snapchatUrl: string;
  youtubeUrl: string;
  twitterUrl: string;

  // Bilingual site copy
  announcementTextEn: string;
  announcementTextAr: string;
  heroBadgeEn: string;
  heroBadgeAr: string;
  heroTitleEn: string;
  heroTitleAr: string;
  heroSubtitleEn: string;
  heroSubtitleAr: string;
  footerTaglineEn: string;
  footerTaglineAr: string;
  aboutTitleEn: string;
  aboutTitleAr: string;
  aboutBodyEn: string;
  aboutBodyAr: string;
  contactCtaTextEn: string;
  contactCtaTextAr: string;

  // SEO
  seoDefaultTitle: string;
  seoTitleSuffix: string;
  seoDefaultDescription: string;
  seoOgImage: string;

  // Password (write-only; see SettingsTab's handleSave)
  newAdminPassword: string;
}

export function initFormData(settings: Settings): SettingsFormData {
  return {
    logoUrl: settings.logoUrl ?? '',
    brandNameEn: settings.brandName.en,
    brandNameAr: settings.brandName.ar,

    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
    accentColor: settings.accentColor ?? '',
    backgroundColor: settings.backgroundColor ?? '',
    foregroundColor: settings.foregroundColor ?? '',
    mutedColor: settings.mutedColor ?? '',
    borderColor: settings.borderColor ?? '',
    cardColor: settings.cardColor ?? '',
    successColor: settings.successColor ?? '',
    warningColor: settings.warningColor ?? '',
    errorColor: settings.errorColor ?? '',

    whatsappNumber: settings.whatsappNumber,
    whatsappUrl: settings.whatsappUrl ?? '',
    contactPhone: settings.contactPhone ?? '',
    contactEmail: settings.contactEmail ?? '',
    contactAddressEn: settings.contactAddress?.en ?? '',
    contactAddressAr: settings.contactAddress?.ar ?? '',
    mapUrl: settings.mapUrl ?? '',
    hoursTextEn: settings.hoursText?.en ?? '',
    hoursTextAr: settings.hoursText?.ar ?? '',
    qrCodeImage: settings.qrCodeImage ?? '',

    instagramUrl: settings.instagramUrl ?? '',
    tiktokUrl: settings.tiktokUrl ?? '',
    facebookUrl: settings.facebookUrl ?? '',
    snapchatUrl: settings.snapchatUrl ?? '',
    youtubeUrl: settings.youtubeUrl ?? '',
    twitterUrl: settings.twitterUrl ?? '',

    announcementTextEn: settings.announcementText?.en ?? '',
    announcementTextAr: settings.announcementText?.ar ?? '',
    heroBadgeEn: settings.heroBadge?.en ?? '',
    heroBadgeAr: settings.heroBadge?.ar ?? '',
    heroTitleEn: settings.heroTitle?.en ?? '',
    heroTitleAr: settings.heroTitle?.ar ?? '',
    heroSubtitleEn: settings.heroSubtitle?.en ?? '',
    heroSubtitleAr: settings.heroSubtitle?.ar ?? '',
    footerTaglineEn: settings.footerTagline?.en ?? '',
    footerTaglineAr: settings.footerTagline?.ar ?? '',
    aboutTitleEn: settings.aboutTitle?.en ?? '',
    aboutTitleAr: settings.aboutTitle?.ar ?? '',
    aboutBodyEn: settings.aboutBody?.en ?? '',
    aboutBodyAr: settings.aboutBody?.ar ?? '',
    contactCtaTextEn: settings.contactCtaText?.en ?? '',
    contactCtaTextAr: settings.contactCtaText?.ar ?? '',

    seoDefaultTitle: settings.seoDefaultTitle ?? '',
    seoTitleSuffix: settings.seoTitleSuffix ?? '',
    seoDefaultDescription: settings.seoDefaultDescription ?? '',
    seoOgImage: settings.seoOgImage ?? '',

    newAdminPassword: '',
  };
}

/** Builds the payload to PUT /api/settings from the form + the settings currently in state (as a base, so any field this form doesn't cover is preserved). */
export function buildSettingsPayload(formData: SettingsFormData, current: Settings): Settings {
  const payload: Settings = {
    ...current,
    logoUrl: formData.logoUrl,
    brandName: { en: formData.brandNameEn, ar: formData.brandNameAr },

    primaryColor: formData.primaryColor,
    secondaryColor: formData.secondaryColor,
    accentColor: formData.accentColor,
    backgroundColor: formData.backgroundColor,
    foregroundColor: formData.foregroundColor,
    mutedColor: formData.mutedColor,
    borderColor: formData.borderColor,
    cardColor: formData.cardColor,
    successColor: formData.successColor,
    warningColor: formData.warningColor,
    errorColor: formData.errorColor,

    whatsappNumber: formData.whatsappNumber,
    whatsappUrl: formData.whatsappUrl,
    contactPhone: formData.contactPhone,
    contactEmail: formData.contactEmail,
    contactAddress: { en: formData.contactAddressEn, ar: formData.contactAddressAr },
    mapUrl: formData.mapUrl,
    hoursText: { en: formData.hoursTextEn, ar: formData.hoursTextAr },
    qrCodeImage: formData.qrCodeImage,

    instagramUrl: formData.instagramUrl,
    tiktokUrl: formData.tiktokUrl,
    facebookUrl: formData.facebookUrl,
    snapchatUrl: formData.snapchatUrl,
    youtubeUrl: formData.youtubeUrl,
    twitterUrl: formData.twitterUrl,

    announcementText: { en: formData.announcementTextEn, ar: formData.announcementTextAr },
    heroBadge: { en: formData.heroBadgeEn, ar: formData.heroBadgeAr },
    heroTitle: { en: formData.heroTitleEn, ar: formData.heroTitleAr },
    heroSubtitle: { en: formData.heroSubtitleEn, ar: formData.heroSubtitleAr },
    footerTagline: { en: formData.footerTaglineEn, ar: formData.footerTaglineAr },
    aboutTitle: { en: formData.aboutTitleEn, ar: formData.aboutTitleAr },
    aboutBody: { en: formData.aboutBodyEn, ar: formData.aboutBodyAr },
    contactCtaText: { en: formData.contactCtaTextEn, ar: formData.contactCtaTextAr },

    seoDefaultTitle: formData.seoDefaultTitle,
    seoTitleSuffix: formData.seoTitleSuffix,
    seoDefaultDescription: formData.seoDefaultDescription,
    seoOgImage: formData.seoOgImage,
  };

  // Only include a password in the request when the admin actually typed a
  // new one — omitting it (rather than sending '') keeps the backend from
  // overwriting the real password with a blank value.
  if (formData.newAdminPassword.trim()) {
    payload.adminPassword = formData.newAdminPassword.trim();
  } else {
    delete payload.adminPassword;
  }

  return payload;
}
