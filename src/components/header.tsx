import { Menu, X, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../context/appcontext';
import { useStoreConfig } from '../context/storeconfig';
import { getText } from '../utils/helpers';
import { translations } from '../utils/translations';

export default function Header() {
  const { state, dispatch } = useApp();
  const storeConfig = useStoreConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu automatically if the viewport is resized back up
  // to desktop width, so it can never be left open-but-hidden.
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleLanguage = () => {
    dispatch({ type: 'SET_LANGUAGE', payload: state.language === 'en' ? 'ar' : 'en' });
  };

  const navLinks = [
    { href: '#about', label: getText(translations.about, state.language) },
    { href: '#menu', label: getText(translations.menu, state.language) },
    { href: '#contact', label: getText(translations.contact, state.language) },
  ];

  const whatsappHref = storeConfig.contact.whatsappUrl
    || (storeConfig.contact.whatsappNumber ? `https://wa.me/${storeConfig.contact.whatsappNumber.replace(/[^\d]/g, '')}` : undefined);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/90 backdrop-blur-md shadow-soft border-b border-border/70'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <a href="/" className="flex items-center gap-2.5 shrink-0" aria-label={getText(storeConfig.brandName, state.language)}>
            {!state.settingsReady ? (
              <>
                <div className="w-9 h-9 rounded-full bg-border/60 animate-pulse" />
                <div className="h-5 w-24 rounded bg-border/60 animate-pulse" />
              </>
            ) : storeConfig.logoUrl ? (
              <img
                src={storeConfig.logoUrl}
                alt={getText(storeConfig.brandName, state.language)}
                className="h-9 w-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <span className="font-display text-2xl font-semibold text-secondary">
                {getText(storeConfig.brandName, state.language)}
              </span>
            )}
          </a>

          <nav className="hidden md:flex items-center gap-9">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="anchor-offset text-[15px] font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              aria-label={state.language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
              className="font-mono-label text-xs px-3 py-1.5 rounded-full border border-border text-foreground/70 hover:border-accent hover:text-primary transition-colors"
            >
              {state.language === 'en' ? 'AR' : 'EN'}
            </button>

            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-secondary transition-colors shadow-soft"
              >
                <MessageCircle size={16} />
                {getText(translations.orderOnWhatsapp, state.language)}
              </a>
            )}

            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden text-foreground p-1"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-surface border-t border-border/70"
          >
            <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col gap-1">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-foreground/80 hover:text-primary transition-colors py-2.5 text-[15px] font-medium"
                >
                  {link.label}
                </a>
              ))}
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-medium"
                >
                  <MessageCircle size={16} />
                  {getText(translations.orderOnWhatsapp, state.language)}
                </a>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
