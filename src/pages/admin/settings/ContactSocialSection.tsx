import type { Dispatch, SetStateAction } from 'react';
import type { SettingsFormData } from './types';
import { INPUT_CLASS } from '../shared';

interface Props {
  formData: SettingsFormData;
  setFormData: Dispatch<SetStateAction<SettingsFormData>>;
}

export default function ContactSocialSection({ formData, setFormData }: Props) {
  const set = (key: keyof SettingsFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="bg-white border border-border/70 rounded-2xl p-6 shadow-soft space-y-6">
      <div>
        <h4 className="font-display text-lg font-semibold text-secondary mb-3">Contact & Location</h4>
        <div className="grid md:grid-cols-2 gap-3">
          <input value={formData.whatsappNumber} onChange={set('whatsappNumber')} placeholder="WhatsApp Number (with country code)" className={INPUT_CLASS} />
          <input value={formData.whatsappUrl} onChange={set('whatsappUrl')} placeholder="WhatsApp Link (optional — overrides number)" className={INPUT_CLASS} />
          <input value={formData.contactPhone} onChange={set('contactPhone')} placeholder="Phone Number" className={INPUT_CLASS} />
          <input value={formData.contactEmail} onChange={set('contactEmail')} type="email" placeholder="Contact Email" className={INPUT_CLASS} />
          <input value={formData.contactAddressEn} onChange={set('contactAddressEn')} placeholder="Address (English)" className={INPUT_CLASS} />
          <input value={formData.contactAddressAr} onChange={set('contactAddressAr')} placeholder="Address (Arabic)" dir="rtl" className={INPUT_CLASS} />
          <input value={formData.mapUrl} onChange={set('mapUrl')} placeholder="Google Maps Link (Get Directions button)" className={INPUT_CLASS} />
          <input value={formData.qrCodeImage} onChange={set('qrCodeImage')} placeholder="QR Code Image URL (optional)" className={INPUT_CLASS} />
        </div>
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <input value={formData.hoursTextEn} onChange={set('hoursTextEn')} placeholder="Opening Hours (English) — e.g. Sat–Thu 7am–11pm" className={INPUT_CLASS} />
          <input value={formData.hoursTextAr} onChange={set('hoursTextAr')} placeholder="Opening Hours (Arabic)" dir="rtl" className={INPUT_CLASS} />
        </div>
      </div>

      <div>
        <h4 className="font-display text-lg font-semibold text-secondary mb-3">Social Links</h4>
        <div className="grid md:grid-cols-2 gap-3">
          <input value={formData.instagramUrl} onChange={set('instagramUrl')} placeholder="Instagram URL" className={INPUT_CLASS} />
          <input value={formData.tiktokUrl} onChange={set('tiktokUrl')} placeholder="TikTok URL" className={INPUT_CLASS} />
          <input value={formData.facebookUrl} onChange={set('facebookUrl')} placeholder="Facebook URL" className={INPUT_CLASS} />
          <input value={formData.snapchatUrl} onChange={set('snapchatUrl')} placeholder="Snapchat URL" className={INPUT_CLASS} />
          <input value={formData.youtubeUrl} onChange={set('youtubeUrl')} placeholder="YouTube URL" className={INPUT_CLASS} />
          <input value={formData.twitterUrl} onChange={set('twitterUrl')} placeholder="X / Twitter URL" className={INPUT_CLASS} />
        </div>
      </div>
    </div>
  );
}
