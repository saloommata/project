import { useApp } from '../../context/appcontext';
import { getText } from '../../utils/helpers';
import { translations } from '../../utils/translations';
import TestimonialCard from '../testimonialcard';
import Reveal, { staggerContainer, staggerItem } from '../reveal';
import { motion } from 'framer-motion';

export default function TestimonialsSection() {
  const { state } = useApp();
  const { testimonials, language } = state;

  if (testimonials.length === 0) return null;

  const sorted = [...testimonials].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="relative bg-secondary py-24 sm:py-32 overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[24rem] rounded-full bg-[#86571F]/15 blur-[100px]" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="text-center max-w-xl mx-auto mb-14">
          <span className="font-mono-label text-xs text-[#B1793A] block mb-4">
            {language === 'en' ? 'GUEST NOTES' : 'آراء الضيوف'}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-[#EFE9DD] text-balance">
            {getText(translations.whatGuestsSay, language)}
          </h2>
        </Reveal>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          {sorted.map(t => (
            <motion.div key={t.id} variants={staggerItem}>
              <TestimonialCard testimonial={t} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
