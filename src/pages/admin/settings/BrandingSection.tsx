import type { Dispatch, SetStateAction } from 'react';
import type { SettingsFormData } from './types';
import { INPUT_CLASS } from '../shared';

interface Props {
  formData: SettingsFormData;
  setFormData: Dispatch<SetStateAction<SettingsFormData>>;
}

export default function BrandingSection({ formData, setFormData }: Props) {
  return (
    <div className="bg-white border border-border/70 rounded-2xl p-6 shadow-soft space-y-3">
      <h4 className="font-display text-lg font-semibold text-secondary">Branding</h4>
      <input
        value={formData.logoUrl}
        onChange={e => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
        placeholder="Logo URL"
        className={INPUT_CLASS}
      />
      <p className="text-muted text-sm">A URL to your logo image, shown in the header. Leave blank to show the brand name as text instead.</p>
      <div className="grid md:grid-cols-2 gap-3">
        <input
          value={formData.brandNameEn}
          onChange={e => setFormData(prev => ({ ...prev, brandNameEn: e.target.value }))}
          placeholder="Brand Name (English)"
          className={INPUT_CLASS}
        />
        <input
          value={formData.brandNameAr}
          onChange={e => setFormData(prev => ({ ...prev, brandNameAr: e.target.value }))}
          placeholder="Brand Name (Arabic)"
          dir="rtl"
          className={INPUT_CLASS}
        />
      </div>
    </div>
  );
}
