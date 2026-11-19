import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { AppState, AppAction } from '../types';
import FileStorage from '../classes/filestorage';
import { api } from '../utils/api';
import { hexToRgbChannels } from '../utils/color';

const fileStorage = FileStorage.getInstance();

const initialState: AppState = {
  menuItems: [],
  menuCategories: [],
  testimonials: [],
  settings: fileStorage.getSettings(),
  language: 'en',
  isInitialLoadComplete: false,
  hasDataLoadError: false,
  // If real settings are already cached (any prior successful load in this
  // browser, or a local admin edit), state.settings above is already the
  // real thing - no need to wait. Only a genuinely first-ever visit with an
  // empty cache starts this false.
  settingsReady: fileStorage.hasRealSettings(),
};

function appReducer(state: AppState, action: AppAction): AppState {
  const fileStorage = FileStorage.getInstance();
  switch (action.type) {
    case 'SET_MENU_ITEMS': return { ...state, menuItems: action.payload };
    case 'ADD_MENU_ITEM': return { ...state, menuItems: [...state.menuItems, action.payload] };
    case 'UPDATE_MENU_ITEM': return { ...state, menuItems: state.menuItems.map(i => i.id === action.payload.id ? action.payload : i) };
    case 'DELETE_MENU_ITEM': return { ...state, menuItems: state.menuItems.filter(i => i.id !== action.payload) };

    case 'SET_MENU_CATEGORIES': return { ...state, menuCategories: action.payload };
    case 'ADD_MENU_CATEGORY': return { ...state, menuCategories: [...state.menuCategories, action.payload] };
    case 'UPDATE_MENU_CATEGORY': return { ...state, menuCategories: state.menuCategories.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_MENU_CATEGORY': return { ...state, menuCategories: state.menuCategories.filter(c => c.id !== action.payload) };

    case 'SET_TESTIMONIALS': return { ...state, testimonials: action.payload };
    case 'ADD_TESTIMONIAL': return { ...state, testimonials: [...state.testimonials, action.payload] };
    case 'UPDATE_TESTIMONIAL': return { ...state, testimonials: state.testimonials.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TESTIMONIAL': return { ...state, testimonials: state.testimonials.filter(t => t.id !== action.payload) };

    case 'SET_SETTINGS':
      fileStorage.saveSettings(action.payload);
      return { ...state, settings: action.payload };
    case 'UPDATE_SETTINGS': {
      const merged = { ...state.settings, ...action.payload };
      fileStorage.saveSettings(merged);
      return { ...state, settings: merged };
    }

    case 'SET_LANGUAGE': return { ...state, language: action.payload };
    case 'LOAD_STATE': return { ...state, ...action.payload };
    default: return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}
const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ✅ PUBLIC LOAD ONLY (no admin endpoints here)
  useEffect(() => {
    const loadPublic = async () => {
      try {
        const [menuItems, menuCategories, testimonials, publicSettings] = await Promise.all([
          api.menuItems.getAll(),
          api.menuCategories.getAll(),
          api.testimonials.getAll(),
          // Site branding/contact/social/content for anonymous visitors. If
          // this one call fails (e.g. an older backend without the route
          // mounted yet), we still proceed with everything else — the site
          // falls back to the locally cached/default settings rather than
          // failing the whole load.
          api.settings.getPublic().catch(() => null),
        ]);

        // Cache the real, fetched settings back to localStorage so the NEXT
        // page load (a reload, or opening a new tab) starts from the real
        // branding immediately instead of the hardcoded fallback below -
        // without this, every single visit re-showed the default brand/
        // theme for a moment before the fetch resolved and replaced it,
        // which is what caused the "flash of default before the real one"
        // bug on every page load, not just the very first visit ever.
        const mergedSettings = publicSettings ? { ...state.settings, ...publicSettings } : state.settings;
        if (publicSettings) {
          fileStorage.saveSettings(mergedSettings);
        }

        dispatch({
          type: 'LOAD_STATE',
          payload: {
            menuItems,
            menuCategories,
            testimonials,
            settings: mergedSettings,
            isInitialLoadComplete: true,
            hasDataLoadError: false,
            settingsReady: true,
          },
        });
      } catch (error) {
        console.error('Failed to load public data from API:', error);
        dispatch({
          type: 'LOAD_STATE',
          payload: {
            isInitialLoadComplete: true,
            hasDataLoadError: true,
            // Even on failure, stop blocking brand-specific UI - it'll show
            // whatever's cached (or the coherent placeholder default) rather
            // than waiting forever for a fetch that already failed.
            settingsReady: true,
          },
        });
      }
      // Real, server-side visit tracking (see backend/routes/visitors.js) -
      // never tracks the admin panel itself, and never blocks or throws.
      if (!window.location.pathname.startsWith('/admin')) {
        api.visitors.track();
      }
    };

    loadPublic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = state.language;
  }, [state.language]);

  // Apply the site's theme colors as CSS variables so the whole UI (anything
  // built on the Tailwind theme tokens in index.css) re-themes instantly
  // when an admin changes them — no rebuild or redeploy needed.
  useEffect(() => {
    const root = document.documentElement;
    const colorVars: Array<[string | undefined, string]> = [
      [state.settings.primaryColor, '--color-primary'],
      [state.settings.secondaryColor, '--color-secondary'],
      [state.settings.accentColor, '--color-accent'],
      [state.settings.backgroundColor, '--color-background'],
      [state.settings.foregroundColor, '--color-foreground'],
      [state.settings.mutedColor, '--color-muted'],
      [state.settings.borderColor, '--color-border'],
      [state.settings.cardColor, '--color-card'],
      [state.settings.successColor, '--color-success'],
      [state.settings.warningColor, '--color-warning'],
      [state.settings.errorColor, '--color-error'],
    ];
    for (const [hex, cssVar] of colorVars) {
      const rgb = hex ? hexToRgbChannels(hex) : null;
      if (rgb) root.style.setProperty(cssVar, rgb);
    }
  }, [
    state.settings.primaryColor,
    state.settings.secondaryColor,
    state.settings.accentColor,
    state.settings.backgroundColor,
    state.settings.foregroundColor,
    state.settings.mutedColor,
    state.settings.borderColor,
    state.settings.cardColor,
    state.settings.successColor,
    state.settings.warningColor,
    state.settings.errorColor,
  ]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
