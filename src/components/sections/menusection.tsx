import { useMemo, useState } from 'react';
import { useApp } from '../../context/appcontext';
import { getText } from '../../utils/helpers';
import { translations } from '../../utils/translations';
import MenuItemCard from '../menuitemcard';
import Reveal, { staggerContainer, staggerItem } from '../reveal';
import { motion } from 'framer-motion';

export default function MenuSection() {
  const { state } = useApp();
  const { menuItems, menuCategories, language } = state;
  const [activeSlug, setActiveSlug] = useState<string>('all');

  const sortedCategories = useMemo(
    () => [...menuCategories].sort((a, b) => a.sortOrder - b.sortOrder),
    [menuCategories]
  );

  const visibleCategories = activeSlug === 'all'
    ? sortedCategories
    : sortedCategories.filter(c => c.slug === activeSlug);

  const itemsFor = (slug: string) =>
    menuItems
      .filter(i => i.categorySlug === slug)
      .sort((a, b) => a.sortOrder - b.sortOrder);

  const hasAnyItems = menuItems.length > 0;

  return (
    <section id="menu" className="anchor-offset relative bg-surface py-24 sm:py-32 border-t border-border/60">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="text-center max-w-xl mx-auto mb-14">
          <span className="font-mono-label text-xs text-primary block mb-4">
            {language === 'en' ? 'ON THE MENU' : 'في القائمة'}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-secondary text-balance">
            {getText(translations.menu, language)}
          </h2>
        </Reveal>

        {sortedCategories.length > 0 && (
          <Reveal delay={0.05} className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
            <button
              onClick={() => setActiveSlug('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeSlug === 'all'
                  ? 'bg-secondary text-[#EFE9DD] border-secondary'
                  : 'border-border text-foreground/70 hover:border-accent hover:text-primary'
              }`}
            >
              {getText(translations.allItems, language)}
            </button>
            {sortedCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveSlug(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  activeSlug === cat.slug
                    ? 'bg-secondary text-[#EFE9DD] border-secondary'
                    : 'border-border text-foreground/70 hover:border-accent hover:text-primary'
                }`}
              >
                {getText(cat.name, language)}
              </button>
            ))}
          </Reveal>
        )}

        {!hasAnyItems ? (
          <p className="text-center text-muted py-16">
            {language === 'en' ? 'The menu is being freshly prepared — check back soon.' : 'القائمة قيد التحضير - تفقدونا قريباً.'}
          </p>
        ) : (
          <div className="space-y-16">
            {visibleCategories.map(cat => {
              const items = itemsFor(cat.slug);
              if (items.length === 0) return null;
              return (
                <div key={cat.id}>
                  {activeSlug === 'all' && (
                    <Reveal className="mb-6 flex items-center gap-4">
                      <h3 className="font-display text-2xl font-semibold text-secondary shrink-0">
                        {getText(cat.name, language)}
                      </h3>
                      <span className="h-px flex-1 bg-border" />
                    </Reveal>
                  )}
                  <motion.div
                    className="grid sm:grid-cols-2 gap-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={staggerContainer}
                  >
                    {items.map(item => (
                      <motion.div key={item.id} variants={staggerItem}>
                        <MenuItemCard item={item} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
