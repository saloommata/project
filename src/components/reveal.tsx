// src/components/reveal.tsx
//
// Small, reusable scroll-entrance wrapper used throughout the public site so
// every section animates in the same restrained way (fade + gentle rise)
// instead of each page hand-rolling its own framer-motion boilerplate.
// Respects prefers-reduced-motion automatically via framer-motion's
// useReducedMotion, and only plays once per element (viewport `once: true`)
// so re-scrolling past a section doesn't replay the animation.
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds, e.g. 0.1 for the 2nd item in a grid. */
  delay?: number;
  /** Direction the content rises from. Defaults to 'up'. */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Element tag to render — defaults to div. */
  as?: 'div' | 'span';
}

const DISTANCE = 28;

function offsetFor(direction: RevealProps['direction']) {
  switch (direction) {
    case 'down': return { y: -DISTANCE };
    case 'left': return { x: DISTANCE };
    case 'right': return { x: -DISTANCE };
    case 'none': return {};
    case 'up':
    default: return { y: DISTANCE };
  }
}

export default function Reveal({ children, className, delay = 0, direction = 'up', as = 'div' }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = shouldReduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, ...offsetFor(direction) },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
        },
      };

  const MotionTag = as === 'span' ? motion.span : motion.div;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

/** Container variant for staggered children — pair with <StaggerItem>. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
