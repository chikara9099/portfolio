import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, useReducedMotion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import './SpotlightCard.css';

interface SpotlightCardProps extends Omit<HTMLMotionProps<'div'>, 'children' | 'className' | 'style'> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

/**
 * Zen Spotlight card: a raised surface whose spotlight follows the cursor
 * with a spring (no React re-render per mousemove), plus a gentle 3D tilt
 * that springs back on leave and a small hover lift. Compositor-only.
 * All motion props (initial/whileInView/transition) pass straight through.
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(var(--accent-rgb), 0.10)',
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  // Pointer position within the card (updated without re-render)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  // Normalized offset from center, drives the tilt
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  // 0 = idle, 1 = hovered
  const hovered = useMotionValue(0);

  const follow = { stiffness: 220, damping: 26, mass: 0.5 };
  const sx = useSpring(mx, follow);
  const sy = useSpring(my, follow);

  const TILT_MAX = 1.8; // degrees — a whisper of depth, text stays legible
  const rotateX = useSpring(useTransform(ny, [-0.5, 0.5], [TILT_MAX, -TILT_MAX]), follow);
  const rotateY = useSpring(useTransform(nx, [-0.5, 0.5], [-TILT_MAX, TILT_MAX]), follow);

  const spotlightBg = useMotionTemplate`radial-gradient(420px circle at ${sx}px ${sy}px, ${spotlightColor}, transparent 70%)`;
  const glowOpacity = useTransform(useSpring(hovered, follow), (v) => v);

  const updatePointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mx.set(x);
    my.set(y);
    nx.set(x / rect.width - 0.5);
    ny.set(y / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={updatePointer}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return;
        hovered.set(1);
      }}
      onPointerLeave={() => {
        hovered.set(0);
        nx.set(0);
        ny.set(0);
      }}
      className={`spotlight-card ${className}`}
      whileHover={reduced ? undefined : { y: -3 }}
      style={
        reduced
          ? undefined
          : { rotateX, rotateY, transformPerspective: 1100, transformStyle: 'preserve-3d' }
      }
      {...props}
    >
      {/* Spotlight layer */}
      <motion.div className="spotlight-card__glow" style={{ background: spotlightBg, opacity: glowOpacity }} />
      {children}
    </motion.div>
  );
};
