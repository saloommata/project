import type { Dispatch, SetStateAction } from 'react';
import type { SettingsFormData } from './types';
import { INPUT_CLASS } from '../shared';

interface Props {
  formData: SettingsFormData;
  setFormData: Dispatch<SetStateAction<SettingsFormData>>;
}

export default function SeoSection({ formData, setFormData }: Props) {
  const set = (key: keyof SettingsFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="bg-white border border-border/70 rounded-2xl p-6 shadow-soft space-y-3">
      <h4 className="font-display text-lg font-semibold text-secondary">SEO</h4>
      <p className="text-muted text-sm">
        Controls the page title, meta description, and social-share preview (Open Graph) for the site.
      </p>
      <input value={formData.seoDefaultTitle} onChange={set('seoDefaultTitle')} placeholder="Default Page Title" className={INPUT_CLASS} />
      <input value={formData.seoTitleSuffix} onChange={set('seoTitleSuffix')} placeholder="Title Suffix (e.g. ' | Ryvano')" className={INPUT_CLASS} />
      <textarea value={formData.seoDefaultDescription} onChange={set('seoDefaultDescription')} placeholder="Default Meta Description" rows={2} className={INPUT_CLASS} />
      <input value={formData.seoOgImage} onChange={set('seoOgImage')} placeholder="Open Graph Image URL (shown in link previews)" className={INPUT_CLASS} />
    </div>
  );
}
