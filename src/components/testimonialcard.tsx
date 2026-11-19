import { Star, Quote } from 'lucide-react';
import type { Testimonial } from '../types';

interface Props {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white/[0.04] border border-white/10 p-6 h-full backdrop-blur-sm">
      <Quote className="text-[#B1793A] opacity-70" size={26} strokeWidth={1.5} />
      <p className="text-[#EFE9DD]/85 text-[15px] leading-relaxed flex-1">“{testimonial.quote}”</p>
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <span className="text-sm font-medium text-[#EFE9DD]">{testimonial.customerName}</span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < testimonial.rating ? 'text-[#B1793A] fill-[#B1793A]' : 'text-white/20'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
