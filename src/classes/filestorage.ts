import type { Settings } from '../types';
import { defaultStoreConfig } from '../config/store.config';

class FileStorage {
  private static instance: FileStorage;
  private readonly STORAGE_KEYS = {
    SETTINGS: 'ryvano_settings',
  };

  private constructor() {}

  static getInstance(): FileStorage {
    if (!FileStorage.instance) {
      FileStorage.instance = new FileStorage();
    }
    return FileStorage.instance;
  }

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  }

  getSettings(): Settings {
    // Derived from store.config.ts's defaultStoreConfig (the single source
    // of truth for brand/theme) rather than a separate hardcoded set of
    // values, so the brief "flash of default content" every visitor sees
    // before the real settings load (see appcontext.tsx) always matches the
    // site's actual intended default rather than disagreeing with it.
    const defaultSettings: Settings = {
      brandName: defaultStoreConfig.brandName,
      primaryColor: defaultStoreConfig.theme.primary,
      secondaryColor: defaultStoreConfig.theme.secondary,
      accentColor: defaultStoreConfig.theme.accent,
      backgroundColor: defaultStoreConfig.theme.background,
      foregroundColor: defaultStoreConfig.theme.foreground,
      mutedColor: defaultStoreConfig.theme.muted,
      borderColor: defaultStoreConfig.theme.border,
      cardColor: defaultStoreConfig.theme.card,
      successColor: defaultStoreConfig.theme.success,
      warningColor: defaultStoreConfig.theme.warning,
      errorColor: defaultStoreConfig.theme.error,
      logoUrl: defaultStoreConfig.logoUrl,
      whatsappNumber: defaultStoreConfig.contact.whatsappNumber || '',
      qrCodeImage: defaultStoreConfig.contact.qrCodeImage || '',
      // Local-only fallback default; the real password lives in the
      // backend database and is never shipped in frontend code.
      adminPassword: '',
    };
    return this.getItem<Settings>(this.STORAGE_KEYS.SETTINGS, defaultSettings);
  }

  saveSettings(settings: Settings): void {
    this.setItem(this.STORAGE_KEYS.SETTINGS, settings);
  }

  /**
   * True when localStorage already holds real settings for this site -
   * either from a previous successful GET /api/public-settings fetch in
   * this browser, or from an admin edit made locally. saveSettings() is
   * only ever called with real data (never with the placeholder default
   * above), so the key's mere presence is enough to know getSettings() is
   * NOT about to return the generic placeholder. Used to decide whether
   * brand-specific UI can render immediately on boot or should wait for the
   * public-settings fetch to avoid a flash of placeholder branding.
   */
  hasRealSettings(): boolean {
    try {
      return localStorage.getItem(this.STORAGE_KEYS.SETTINGS) !== null;
    } catch {
      return false;
    }
  }

  convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export default FileStorage;
