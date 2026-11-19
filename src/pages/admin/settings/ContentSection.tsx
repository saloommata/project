import type { Dispatch, SetStateAction } from 'react';
import type { SettingsFormData } from './types';
import { INPUT_CLASS } from '../shared';

interface Props {
  formData: SettingsFormData;
  setFormData: Dispatch<SetStateAction<SettingsFormData>>;
}

interface BilingualFieldConfig {
  enKey: keyof SettingsFormData;
  arKey: keyof SettingsFormData;
  label: string;
  multiline?: boolean;
}

const FIELDS: BilingualFieldConfig[] = [
  { enKey: 'announcementTextEn', arKey: 'announcementTextAr', label: 'Announcement Bar Text' },
  { enKey: 'heroBadgeEn', arKey: 'heroBadgeAr', label: 'Hero Badge' },
  { enKey: 'heroTitleEn', arKey: 'heroTitleAr', label: 'Hero Title (falls back to brand name)' },
  { enKey: 'heroSubtitleEn', arKey: 'heroSubtitleAr', label: 'Hero Subtitle', multiline: true },
  { enKey: 'footerTaglineEn', arKey: 'footerTaglineAr', label: 'Footer Tagline' },
  { enKey: 'aboutTitleEn', arKey: 'aboutTitleAr', label: 'Our Story — Title' },
  { enKey: 'aboutBodyEn', arKey: 'aboutBodyAr', label: 'Our Story — Body', multiline: true },
  { enKey: 'contactCtaTextEn', arKey: 'contactCtaTextAr', label: 'Contact Section Intro Line' },
];

export default function ContentSection({ formData, setFormData }: Props) {
  const set = (key: keyof SettingsFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="bg-white border border-border/70 rounded-2xl p-6 shadow-soft space-y-4">
      <div>
        <h4 className="font-display text-lg font-semibold text-secondary">Site Copy</h4>
        <p className="text-muted text-sm">Leave a field blank to use the built-in default text for it.</p>
      </div>
      {FIELDS.map(({ enKey, arKey, label, multiline }) => (
        <div key={enKey}>
          <label className="block text-xs text-muted mb-1.5">{label}</label>
          <div className="grid md:grid-cols-2 gap-3">
            {multiline ? (
              <textarea value={formData[enKey]} onChange={set(enKey)} placeholder="English" rows={3} className={INPUT_CLASS} />
            ) : (
              <input value={formData[enKey]} onChange={set(enKey)} placeholder="English" className={INPUT_CLASS} />
            )}
            {multiline ? (
              <textarea value={formData[arKey]} onChange={set(arKey)} placeholder="Arabic" rows={3} dir="rtl" className={INPUT_CLASS} />
            ) : (
              <input value={formData[arKey]} onChange={set(arKey)} placeholder="Arabic" dir="rtl" className={INPUT_CLASS} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
