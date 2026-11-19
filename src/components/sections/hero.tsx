import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/appcontext';
import { useStoreConfig } from '../../context/storeconfig';
import { getText } from '../../utils/helpers';
import { translations } from '../../utils/translations';

export default function Hero() {
  const { state } = useApp();
  const storeConfig = useStoreConfig();
  const shouldReduceMotion = useReducedMotion();

  const brand = getText(storeConfig.brandName, state.language);
  const badge = getText(storeConfig.content.heroBadge, state.language);
  const title = getText(storeConfig.content.heroTitle, state.language) || brand;
  const subtitle = getText(storeConfig.content.heroSubtitle, state.language);

  const whatsappHref = storeConfig.contact.whatsappUrl
    || (storeConfig.contact.whatsappNumber ? `https://wa.me/${storeConfig.contact.whatsappNumber.replace(/[^\d]/g, '')}` : undefined);

  const rise = (delay: number) => shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section className="relative overflow-hidden bg-secondary text-[#EFE9DD] min-h-[92vh] flex items-center">
      {/* Ambient brass glow accents */}
      <div className="pointer-events-none absolute -top-40 -right-32 w-[36rem] h-[36rem] rounded-full bg-[#B1793A]/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 -left-32 w-[28rem] h-[28rem] rounded-full bg-[#86571F]/25 blur-[110px]" />

      {/* Oversized watermark glyph */}
      <motion.img
        src="/logo/ryvano-glyph-reversed.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-16 top-1/2 -translate-y-1/2 w-[26rem] sm:w-[34rem] opacity-[0.07]"
        initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
        animate={shouldReduceMotion ? undefined : { opacity: 0.07, scale: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-28 w-full">
        <div className="max-w-2xl">
          {badge && (
            <motion.div {...rise(0)} className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border border-[#B1793A]/40 bg-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B1793A]" />
              <span className="font-mono-label text-xs text-[#EFE9DD]/80">{badge}</span>
            </motion.div>
          )}

          <motion.h1
            {...rise(0.1)}
            className="font-display text-balance text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] mb-6"
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p {...rise(0.22)} className="text-lg sm:text-xl text-[#EFE9DD]/70 leading-relaxed max-w-xl mb-10">
              {subtitle}
            </motion.p>
          )}

          <motion.div {...rise(0.34)} className="flex flex-wrap items-center gap-4">
            <a
              href="#menu"
              className="anchor-offset inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#B1793A] text-[#2B1C12] font-semibold hover:bg-[#EFE9DD] transition-colors shadow-lift"
            >
              {getText(translations.viewMenu, state.language)}
            </a>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#EFE9DD]/25 text-[#EFE9DD] font-medium hover:border-[#EFE9DD]/60 transition-colors"
              >
                <MessageCircle size={18} />
                {getText(translations.orderOnWhatsapp, state.language)}
              </a>
            )}
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        className="anchor-offset absolute bottom-8 left-1/2 -translate-x-1/2 text-[#EFE9DD]/50 hover:text-[#EFE9DD] transition-colors"
        aria-label="Scroll down"
        animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ArrowDown size={22} />
      </motion.a>
    </section>
  );
}
