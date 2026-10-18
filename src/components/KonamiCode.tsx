import { useEffect, useState, useRef, useCallback } from 'react';
import { Sparkles, X, Zap } from 'lucide-react';
import { playOverdriveFanfare } from '../utils/sound';
import './KonamiCode.css';

const KONAMI_SEQUENCE = [
  'arrowup',
  'arrowup',
  'arrowdown',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowleft',
  'arrowright',
  'b',
  'a',
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
}

export const KonamiCode = ({
  active,
  onReset,
}: {
  active?: boolean;
  onReset?: () => void;
}) => {
  const [triggered, setTriggered] = useState(false);
  const inputSequence = useRef<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Auto-dismiss timer id — kept in a ref so unmount / re-trigger can cancel it.
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerEasterEgg = useCallback(() => {
    setTriggered(true);
  }, []);

  // Banner state derived from either trigger source: the Konami sequence or
  // the `active` prop from a parent.
  const celebrating = triggered || !!active;

  // Clear the pending auto-dismiss on unmount (the timer's clear fn used to be
  // returned by triggerEasterEgg and never registered — a setState-on-dead-
  // component leak after navigating away mid-celebration).
  useEffect(() => {
    return () => {
      if (dismissTimer.current !== null) {
        clearTimeout(dismissTimer.current);
        dismissTimer.current = null;
      }
    };
  }, []);

  // Fanfare + haptic once per celebration, whichever way it was triggered
  const announcedRef = useRef(false);
  useEffect(() => {
    if (celebrating && !announcedRef.current) {
      announcedRef.current = true;
      playOverdriveFanfare();
    }
    if (!celebrating) {
      announcedRef.current = false;
    }
  }, [celebrating]);

  // Auto-dismiss after 8 seconds of celebrating
  useEffect(() => {
    if (!celebrating) return;
    const t = setTimeout(() => {
      setTriggered(false);
      if (active) onReset?.();
    }, 8000);
    return () => clearTimeout(t);
  }, [celebrating, active, onReset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA';
      if (isInput) return;

      const key = e.key.toLowerCase();
      inputSequence.current.push(key);
      if (inputSequence.current.length > KONAMI_SEQUENCE.length) {
        inputSequence.current.shift();
      }

      if (
        inputSequence.current.length === KONAMI_SEQUENCE.length &&
        inputSequence.current.every((k, i) => k === KONAMI_SEQUENCE[i])
      ) {
        triggerEasterEgg();
        inputSequence.current = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerEasterEgg]);

  // Confetti / Particle burst animation
  useEffect(() => {
    if (!celebrating) return;

    // Respect prefers-reduced-motion: show the banner, skip the burst
    // (no particle creation, no rAF loop).
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#38bdf8', '#818cf8', '#34d399', '#f59e0b', '#ec4899', '#f43f5e', '#a855f7'];
    const particles: Particle[] = [];

    // Spawn 140 celebratory particles
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 5 + 2,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008,
      });
    }

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // Gravity
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      if (particles.some((p) => p.alpha > 0)) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [celebrating]);

  if (!celebrating) return null;

  return (
    <div className="overdrive-hud">
      <canvas ref={canvasRef} className="overdrive-canvas" />

      <div className="overdrive-banner">
        <div className="overdrive-banner__glow" />
        <div className="overdrive-banner__content">
          <div className="overdrive-banner__icon-wrap">
            <Zap className="overdrive-banner__zap" size={20} />
          </div>
          <div className="overdrive-banner__text">
            <div className="overdrive-banner__title">
              WHOAH YOU DID SOMETHING I GUESS
            </div>
            <div className="overdrive-banner__sub">
              100% Core Power Unlocked · All Systems Operating at Maximum Frequency
            </div>
          </div>
          <Sparkles className="overdrive-banner__sparkle" size={20} />
          <button
            className="overdrive-banner__close"
            onClick={() => {
              setTriggered(false);
              if (onReset) onReset();
            }}
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
