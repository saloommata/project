import { useApp } from '../../context/appcontext';
import { useStoreConfig } from '../../context/storeconfig';
import { getText } from '../../utils/helpers';
import Reveal from '../reveal';

export default function About() {
  const { state } = useApp();
  const storeConfig = useStoreConfig();

  const title = getText(storeConfig.content.aboutTitle, state.language);
  const body = getText(storeConfig.content.aboutBody, state.language);

  return (
    <section id="about" className="anchor-offset relative bg-surface py-24 sm:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-2 gap-14 md:gap-20 items-center">
          <Reveal direction="right">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-secondary shadow-lift">
              <div className="absolute inset-0 bg-gradient-to-br from-[#86571F] via-[#2B1C12] to-[#2B1C12]" />
              <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-[#B1793A]/25 blur-3xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/logo/ryvano-glyph-reversed.svg"
                  alt=""
                  aria-hidden="true"
                  className="w-40 sm:w-52 opacity-90"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-mono-label text-[11px] text-[#EFE9DD]/60">EST. IN A SINGLE ESPRESSO MACHINE</p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.1}>
            <span className="font-mono-label text-xs text-primary block mb-4">
              {state.language === 'en' ? 'OUR STORY' : 'قصتنا'}
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-secondary mb-6 text-balance">
              {title}
            </h2>
            <p className="text-foreground/70 text-[17px] leading-[1.8] whitespace-pre-line">
              {body}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
