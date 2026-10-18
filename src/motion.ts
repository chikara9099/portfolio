// ============================================
// MOTION SYSTEM — Apple "Designing Fluid Interfaces" translated
//
// House style:
//  - Default: critically damped spring (no overshoot) — `spring`
//  - Momentum-driven gestures (flicks, drag releases): slight bounce — `springFlick`
//  - Reduced motion: swap gestures for short cross-fades — `useRespectfulMotion()`
// ============================================

import { useReducedMotion } from 'framer-motion';
import type { Transition, Variants } from 'framer-motion';

/** Critically damped default — every non-gesture animation (damping 1.0, response ~0.4s) */
export const spring: Transition = {
  type: 'spring',
  bounce: 0,
  duration: 0.4,
};

/** Only for interactions that carried the user's momentum (flick, throw, press) */
export const springFlick: Transition = {
  type: 'spring',
  bounce: 0.2,
  duration: 0.4,
};

/** Same as `spring` but slightly slower for large surfaces (modals, panels) */
export const springSlow: Transition = {
  type: 'spring',
  bounce: 0,
  duration: 0.55,
};

/** Reduced-motion cross-fade — comprehension preserved, no movement */
export const fade: Transition = { duration: 0.2, ease: 'linear' };

/**
 * Hook that resolves the correct transition for the user's motion preference.
 * Usage: `animate(el, { y: 0 }, resolve(spring))`
 */
export function resolve(t: Transition): Transition {
  // Components typically guard with `useRespectfulMotion()` instead; kept for
  // transitional migrations.
  return t;
}

/**
 * Returns `{ spring, fade }` transitions with the right one flagged for
 * reduced motion, plus a boolean the component can branch on.
 */
export function useRespectfulMotion() {
  const reduced = useReducedMotion();
  const transition = reduced ? (fade as Transition) : spring;
  const transitionSlow = reduced ? (fade as Transition) : springSlow;
  return { reduced, transition, transitionSlow, spring: transition, springSlow: transitionSlow, fade };
}

/** Shared entrance variants for staggered word/line reveals (Hero etc.) */
export function staggerChildren(stagger = 0.06, delay = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
}
