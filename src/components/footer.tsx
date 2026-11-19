import { MessageCircle, MapPin } from 'lucide-react';
import { useApp } from '../context/appcontext';
import { useStoreConfig } from '../context/storeconfig';
import { getText } from '../utils/helpers';
import { translations } from '../utils/translations';

export default function Footer() {
  const { state } = useApp();
  const storeConfig = useStoreConfig();
  const { contact, social } = storeConfig;

  const whatsappHref = contact.whatsappUrl
    || (contact.whatsappNumber ? `https://wa.me/${contact.whatsappNumber.replace(/[^\d]/g, '')}` : undefined);

  const socialLinks = [
    { url: social.instagramUrl, label: 'Instagram' },
    { url: social.tiktokUrl, label: 'TikTok' },
    { url: social.facebookUrl, label: 'Facebook' },
    { url: social.snapchatUrl, label: 'Snapchat' },
    { url: social.youtubeUrl, label: 'YouTube' },
    { url: social.twitterUrl, label: 'X' },
  ].filter(s => s.url);

  return (
    <footer className="relative bg-secondary text-[#EFE9DD]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            {!state.settingsReady ? (
              <div className="animate-pulse space-y-3">
                <div className="h-8 w-32 rounded bg-white/10" />
                <div className="h-4 w-56 rounded bg-white/10" />
              </div>
            ) : (
              <>
                <img
                  src="/logo/ryvano-lockup-reversed.svg"
                  alt={getText(storeConfig.brandName, state.language)}
                  className="h-10 w-auto object-contain mb-4"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <p className="text-[#EFE9DD]/60 text-sm max-w-xs leading-relaxed">
                  {getText(storeConfig.content.footerTagline, state.language)}
                </p>
              </>
            )}
          </div>

          <div>
            <h4 className="font-mono-label text-xs text-[#B1793A] mb-4">
              {state.language === 'en' ? 'EXPLORE' : 'استكشف'}
            </h4>
            <div className="flex flex-col gap-2.5">
              <a href="#about" className="text-[#EFE9DD]/70 hover:text-white transition-colors text-sm">
                {getText(translations.about, state.language)}
              </a>
              <a href="#menu" className="text-[#EFE9DD]/70 hover:text-white transition-colors text-sm">
                {getText(translations.menu, state.language)}
              </a>
              <a href="#contact" className="text-[#EFE9DD]/70 hover:text-white transition-colors text-sm">
                {getText(translations.contact, state.language)}
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-mono-label text-xs text-[#B1793A] mb-4">
              {getText(translations.getInTouch, state.language).toUpperCase()}
            </h4>
            <div className="flex flex-col gap-2.5">
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#EFE9DD]/70 hover:text-white transition-colors text-sm"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp</span>
                </a>
              )}
              {contact.address && (
                <a
                  href={contact.mapUrl || '#contact'}
                  target={contact.mapUrl ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-[#EFE9DD]/70 hover:text-white transition-colors text-sm"
                >
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span>{getText(contact.address, state.language)}</span>
                </a>
              )}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-3 pt-1">
                  {socialLinks.map(s => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#EFE9DD]/60 hover:text-white transition-colors text-xs font-mono-label"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#EFE9DD]/40 text-xs">
            {state.settingsReady && (state.language === 'en'
              ? `© ${new Date().getFullYear()} ${getText(storeConfig.brandName, 'en')}. All rights reserved.`
              : `© ${new Date().getFullYear()} ${getText(storeConfig.brandName, 'ar')}. جميع الحقوق محفوظة.`)}
          </p>
          <a href="/admin" className="text-[#EFE9DD]/25 hover:text-[#EFE9DD]/50 transition-colors text-xs font-mono-label">
            admin
          </a>
        </div>
      </div>
    </footer>
  );
}
