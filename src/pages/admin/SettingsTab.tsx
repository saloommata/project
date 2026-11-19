
import { useState } from 'react';
import { useApp } from '../../context/appcontext';
import { api } from '../../utils/api';
import { initFormData, buildSettingsPayload } from './settings/types';
import BrandingSection from './settings/BrandingSection';
import ThemeSection from './settings/ThemeSection';
import ContactSocialSection from './settings/ContactSocialSection';
import ContentSection from './settings/ContentSection';
import SeoSection from './settings/SeoSection';
import { PRIMARY_BTN } from './shared';

export default function SettingsTab() {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState(() => initFormData(state.settings));
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setSavedMsg(false);

    try {
      const payload = buildSettingsPayload(formData, state.settings);

      // Do not change the admin password when saving settings.
      payload.newAdminPassword = '';

      const saved = await api.settings.update(payload);
      dispatch({ type: 'UPDATE_SETTINGS', payload: saved });

      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <BrandingSection formData={formData} setFormData={setFormData} />
      <ThemeSection formData={formData} setFormData={setFormData} />
      <ContactSocialSection formData={formData} setFormData={setFormData} />
      <ContentSection formData={formData} setFormData={setFormData} />
      <SeoSection formData={formData} setFormData={setFormData} />

      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/95 backdrop-blur-sm border-t border-border/70 px-5 sm:px-8 py-3 flex items-center justify-end gap-3 z-20">
        {savedMsg && (
          <span className="text-success text-sm font-medium">
            Settings saved
          </span>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className={PRIMARY_BTN}
        >
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
