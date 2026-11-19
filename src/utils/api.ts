// src/utils/api.ts
import type {
  MenuItem,
  MenuCategory,
  Testimonial,
  Settings,
  VisitorStats,
} from "../types";

export function getAPIBase(): string {
  return baseUrl();
}

function baseUrl(): string {
  const env = import.meta.env.VITE_API_BASE as string | undefined;
  if (env) return env.replace(/\/+$/, "");

  const proto = window.location.protocol;
  const host = window.location.hostname;

  if (host === "localhost" || host === "127.0.0.1") return "http://localhost:3005";
  return `${proto}//${host}`;
}

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function request<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const url = `${baseUrl()}${path}`;
  const res = await fetch(url, options);

  const text = await res.text();
  const json = text ? (() => { try { return JSON.parse(text); } catch { return null; } })() : null;

  if (!res.ok) {
    const msg = (json && (json.error || json.message)) || `API Error: ${res.status}`;
    throw new ApiError(msg, res.status, json ?? text);
  }
  return (json ?? {}) as T;
}

const admin = (headers?: HeadersInit) => ({
  ...(headers || {}),
});

export const api = {
  menuItems: {
    getAll: (): Promise<MenuItem[]> => request("/api/menu-items"),
    create: (item: Partial<MenuItem>): Promise<MenuItem> =>
      request("/api/menu-items", {
        method: "POST",
        headers: admin({ "Content-Type": "application/json" }),
        body: JSON.stringify(item),
      }),
    update: (id: string, item: Partial<MenuItem>): Promise<MenuItem> =>
      request(`/api/menu-items/${id}`, {
        method: "PUT",
        headers: admin({ "Content-Type": "application/json" }),
        body: JSON.stringify(item),
      }),
    delete: (id: string): Promise<{ success: boolean }> =>
      request(`/api/menu-items/${id}`, {
        method: "DELETE",
        headers: admin(),
      }),
  },

  menuCategories: {
    getAll: (): Promise<MenuCategory[]> => request("/api/menu-categories"),
    create: (category: Partial<MenuCategory>): Promise<MenuCategory> =>
      request("/api/menu-categories", {
        method: "POST",
        headers: admin({ "Content-Type": "application/json" }),
        body: JSON.stringify(category),
      }),
    update: (id: string, category: Partial<MenuCategory>): Promise<MenuCategory> =>
      request(`/api/menu-categories/${id}`, {
        method: "PUT",
        headers: admin({ "Content-Type": "application/json" }),
        body: JSON.stringify(category),
      }),
    delete: (id: string): Promise<{ success: boolean }> =>
      request(`/api/menu-categories/${id}`, {
        method: "DELETE",
        headers: admin(),
      }),
  },

  testimonials: {
    getAll: (): Promise<Testimonial[]> => request("/api/testimonials"),
    create: (t: Partial<Testimonial>): Promise<Testimonial> =>
      request("/api/testimonials", {
        method: "POST",
        headers: admin({ "Content-Type": "application/json" }),
        body: JSON.stringify(t),
      }),
    update: (id: string, t: Partial<Testimonial>): Promise<Testimonial> =>
      request(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: admin({ "Content-Type": "application/json" }),
        body: JSON.stringify(t),
      }),
    delete: (id: string): Promise<{ success: boolean }> =>
      request(`/api/testimonials/${id}`, {
        method: "DELETE",
        headers: admin(),
      }),
  },

  settings: {
    // admin only
    get: (): Promise<Settings> => request("/api/settings", { headers: admin() }),
    update: (settings: Settings): Promise<Settings> =>
      request("/api/settings", {
        method: "PUT",
        headers: admin({ "Content-Type": "application/json" }),
        body: JSON.stringify(settings),
      }),
    // public: safe branding/contact/content fields only, never the admin
    // password. Used by every visitor (not just logged-in admins) so the
    // site's brand name/logo/colors/hours/social links reflect what the
    // admin saved.
    getPublic: (): Promise<Partial<Settings>> => request("/api/public-settings"),
  },

  // admin only
  upload: {
    image: async (file: File): Promise<{ url: string }> => {
      const fd = new FormData();
      fd.append("image", file);
      return request("/api/upload", {
        method: "POST",
        headers: admin(), // don't set Content-Type for FormData
        body: fd,
      });
    },
  },

  // Real, server-side visit tracking for the admin Dashboard (see
  // backend/routes/visitors.js).
  visitors: {
    // Fire-and-forget: records this visit server-side. Deliberately never
    // throws - a blocked/failed tracking call should never break page
    // navigation for a real visitor.
    track: (): void => {
      request("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).catch(() => {});
    },
    // admin only
    getStats: (): Promise<VisitorStats> => request("/api/visitors", { headers: admin() }),
  },
};
