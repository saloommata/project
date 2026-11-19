import type { Dispatch, SetStateAction } from 'react';
import type { SettingsFormData } from './types';

interface Props {
  formData: SettingsFormData;
  setFormData: Dispatch<SetStateAction<SettingsFormData>>;
}

const COLOR_FIELDS: Array<{ key: keyof SettingsFormData; label: string }> = [
  { key: 'primaryColor', label: 'Primary' },
  { key: 'secondaryColor', label: 'Secondary' },
  { key: 'accentColor', label: 'Accent' },
  { key: 'backgroundColor', label: 'Background' },
  { key: 'foregroundColor', label: 'Foreground (text)' },
  { key: 'mutedColor', label: 'Muted' },
  { key: 'borderColor', label: 'Border' },
  { key: 'cardColor', label: 'Card' },
  { key: 'successColor', label: 'Success' },
  { key: 'warningColor', label: 'Warning' },
  { key: 'errorColor', label: 'Error' },
];

// A hex string this input accepts as a live color-picker value; anything
// else (blank, or an in-progress partial hex the admin is typing) falls back
// to a neutral swatch so <input type="color"> never throws on an invalid value.
function safeHexOrFallback(value: string): string {
  return /^#([0-9a-fA-F]{6})$/.test(value) ? value : '#888888';
}

export default function ThemeSection({ formData, setFormData }: Props) {
  return (
    <div className="bg-white border border-border/70 rounded-2xl p-6 shadow-soft space-y-3">
      <h4 className="font-display text-lg font-semibold text-secondary">Theme Colors</h4>
      <p className="text-muted text-sm">
        These apply live across the site (buttons, backgrounds, text, borders) as soon as you save —
        no rebuild needed. Leave a field blank to use the built-in default for that role.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {COLOR_FIELDS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            <input
              type="color"
              value={safeHexOrFallback(formData[key])}
              onChange={e => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
              className="w-10 h-10 rounded-lg border border-border bg-white shrink-0 cursor-pointer"
              aria-label={`${label} color picker`}
            />
            <div className="flex-1">
              <label className="block text-xs text-muted mb-1">{label}</label>
              <input
                value={formData[key]}
                onChange={e => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder="#hex"
                className="w-full bg-[#FBF9F5] border border-border text-secondary px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
