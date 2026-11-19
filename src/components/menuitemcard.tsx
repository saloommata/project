import type { MenuItem } from '../types';
import { useApp } from '../context/appcontext';
import { getText, formatPrice } from '../utils/helpers';
import { translations } from '../utils/translations';

interface Props {
  item: MenuItem;
}

export default function MenuItemCard({ item }: Props) {
  const { state } = useApp();
  const name = getText(item.name, state.language);
  const description = getText(item.description, state.language);

  return (
    <div
      className={`group relative flex gap-4 rounded-2xl border border-border/70 bg-card p-4 transition-all duration-300 hover:shadow-lift hover:-translate-y-0.5 ${
        !item.isAvailable ? 'opacity-60' : ''
      }`}
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-border/40">
        {item.image ? (
          <img
            src={item.image}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <img src="/logo/ryvano-icon-brass.svg" alt="" className="w-8 h-8 opacity-40" />
          </div>
        )}
        {item.isFeatured && (
          <span className="absolute top-1.5 left-1.5 font-mono-label text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-white">
            {getText(translations.featured, state.language)}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-secondary leading-snug">{name}</h3>
          <span className="font-mono-label text-sm text-primary whitespace-nowrap pt-1">{formatPrice(item.price)}</span>
        </div>
        {description && (
          <p className="text-sm text-muted mt-1 leading-relaxed line-clamp-2">{description}</p>
        )}
        {!item.isAvailable && (
          <span className="mt-auto pt-2 text-xs font-mono-label text-error">
            {getText(translations.unavailable, state.language)}
          </span>
        )}
      </div>
    </div>
  );
}
