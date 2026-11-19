import type { BilingualText } from '../types';

// Small, fixed UI strings (nav labels, buttons) that aren't part of the
// admin-editable site copy in Settings. Bilingual site copy that IS
// admin-editable (hero text, about body, etc.) lives in store.config.ts /
// the settings table instead — see src/context/storeconfig.ts.
export const translations: Record<string, BilingualText> = {
  home: { en: 'Home', ar: 'الرئيسية' },
  menu: { en: 'Menu', ar: 'القائمة' },
  about: { en: 'Our Story', ar: 'قصتنا' },
  contact: { en: 'Visit Us', ar: 'زورونا' },
  admin: { en: 'Admin', ar: 'الإدارة' },

  viewMenu: { en: 'View Menu', ar: 'عرض القائمة' },
  orderOnWhatsapp: { en: 'Order on WhatsApp', ar: 'اطلب عبر واتساب' },
  getDirections: { en: 'Get Directions', ar: 'احصل على الاتجاهات' },

  allItems: { en: 'All', ar: 'الكل' },
  featured: { en: 'Featured', ar: 'مميز' },
  unavailable: { en: 'Unavailable today', ar: 'غير متوفر اليوم' },

  openingHours: { en: 'Opening Hours', ar: 'ساعات العمل' },
  ourLocation: { en: 'Our Location', ar: 'موقعنا' },
  getInTouch: { en: 'Get in Touch', ar: 'تواصل معنا' },

  whatGuestsSay: { en: 'What guests say', ar: 'آراء ضيوفنا' },

  dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
  settings: { en: 'Settings', ar: 'الإعدادات' },
  logout: { en: 'Logout', ar: 'تسجيل خروج' },
  login: { en: 'Login', ar: 'تسجيل دخول' },

  save: { en: 'Save', ar: 'حفظ' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  delete: { en: 'Delete', ar: 'حذف' },
  edit: { en: 'Edit', ar: 'تعديل' },
  add: { en: 'Add', ar: 'إضافة' },

  contactUs: { en: 'Contact Us', ar: 'اتصل بنا' },
  whatsapp: { en: 'WhatsApp', ar: 'واتساب' },
};
