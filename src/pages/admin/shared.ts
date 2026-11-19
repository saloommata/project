// src/pages/admin/shared.ts
//
// Small pieces shared across the admin tab components: the image-upload
// helper, and the button/input class strings that give every tab the same
// professional look without repeating long Tailwind class lists everywhere.
import { api } from '../../utils/api';

export async function uploadToBackend(file: File): Promise<string> {
  const { url } = await api.upload.image(file);
  return url;
}

export const INPUT_CLASS =
  'w-full bg-[#FBF9F5] border border-border text-secondary placeholder:text-muted px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary transition-colors';

export const PRIMARY_BTN =
  'inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

export const SECONDARY_BTN =
  'inline-flex items-center gap-2 px-4 py-2.5 bg-border/40 text-secondary text-sm font-medium rounded-xl hover:bg-border/70 transition-colors';

export const DANGER_BTN =
  'inline-flex items-center gap-2 px-4 py-2.5 bg-error text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed';
