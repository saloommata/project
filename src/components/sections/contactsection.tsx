import { MapPin, Clock, Phone, Mail, MessageCircle, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/appcontext';
import { useStoreConfig } from '../../context/storeconfig';
import { getText } from '../../utils/helpers';
import { translations } from '../../utils/translations';
import Reveal from '../reveal';

export default function ContactSection() {
  const { state } = useApp();
  const storeConfig = useStoreConfig();
  const { contact } = storeConfig;
  const language = state.language;

  const addressText = getText(contact.address, language);
  const hoursText = getText(contact.hoursText, language);
  const whatsappHref = contact.whatsappUrl
    || (contact.whatsappNumber ? `https://wa.me/${contact.whatsappNumber.replace(/[^\d]/g, '')}` : undefined);

  const mapEmbedSrc = addressText
    ? `https://maps.google.com/maps?q=${encodeURIComponent(addressText)}&t=&z=14&ie=UTF8&iwloc=&output=embed`
    : undefined;

  return (
    <section id="contact" className="anchor-offset relative bg-secondary text-[#EFE9DD] py-24 sm:py-32 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="max-w-xl mb-14">
          <span className="font-mono-label text-xs text-[#B1793A] block mb-4">
            {language === 'en' ? 'FIND US' : 'موقعنا'}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-balance mb-5">
            {getText(translations.contact, language)}
          </h2>
          <p className="text-[#EFE9DD]/65 text-[17px] leading-relaxed">
            {getText(storeConfig.content.contactCtaText, language) || (language === 'en'
              ? "Drop by, or reach out before you do — we'll have a table (and a flat white) ready."
              : 'تفضلوا بزيارتنا، أو تواصلوا معنا مسبقاً - سنجهز لكم طاولة وفلات وايت.')}
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <Reveal direction="right" className="space-y-5">
            {hoursText && (
              <div className="flex gap-4 rounded-2xl bg-white/5 border border-white/10 p-5">
                <Clock className="text-[#B1793A] shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-medium text-[#EFE9DD] mb-1">{getText(translations.openingHours, language)}</h4>
                  <p className="text-[#EFE9DD]/65 text-sm leading-relaxed">{hoursText}</p>
                </div>
              </div>
            )}

            {addressText && (
              <div className="flex gap-4 rounded-2xl bg-white/5 border border-white/10 p-5">
                <MapPin className="text-[#B1793A] shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <h4 className="font-medium text-[#EFE9DD] mb-1">{getText(translations.ourLocation, language)}</h4>
                  <p className="text-[#EFE9DD]/65 text-sm leading-relaxed">{addressText}</p>
                  {contact.mapUrl && (
                    <a
                      href={contact.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#B1793A] text-sm mt-2 hover:text-[#EFE9DD] transition-colors"
                    >
                      {getText(translations.getDirections, language)}
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {(contact.phone || contact.email) && (
              <div className="flex gap-4 rounded-2xl bg-white/5 border border-white/10 p-5">
                <Phone className="text-[#B1793A] shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-[#EFE9DD]/65 space-y-1">
                  {contact.phone && <p>{contact.phone}</p>}
                  {contact.email && (
                    <p className="flex items-center gap-1.5">
                      <Mail size={14} className="opacity-70" />
                      {contact.email}
                    </p>
                  )}
                </div>
              </div>
            )}

            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#B1793A] text-[#2B1C12] font-semibold hover:bg-[#EFE9DD] transition-colors"
              >
                <MessageCircle size={18} />
                {getText(translations.orderOnWhatsapp, language)}
              </a>
            )}
          </Reveal>

          <Reveal direction="left" delay={0.1} className="min-h-[320px] rounded-2xl overflow-hidden border border-white/10 shadow-lift">
            {mapEmbedSrc ? (
              <iframe
                title={language === 'en' ? 'Map to our location' : 'خريطة الموقع'}
                src={mapEmbedSrc}
                className="w-full h-full min-h-[320px] grayscale-[0.3] contrast-[1.05]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full min-h-[320px] flex items-center justify-center bg-white/5">
                <MapPin className="text-[#B1793A]/60" size={40} />
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
