import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Monitor, Sun, Moon } from 'lucide-react';
import { THEMES, getCurrentTheme, applyTheme, getMode, applyMode } from '../utils/theme';
import type { ThemeColor, ColorMode } from '../utils/theme';
import { playBlip, vibrate } from '../utils/sound';
import { useRespectfulMotion } from '../motion';
import './ThemeSwitcher.css';

const MODES: ColorMode[] = ['auto', 'light', 'dark'];

const MODE_META: Record<ColorMode, { label: string; hint: string; Icon: typeof Sun }> = {
  auto: { label: 'Auto', hint: 'Following system appearance', Icon: Monitor },
  light: { label: 'Light', hint: 'Light appearance', Icon: Sun },
  dark: { label: 'Dark', hint: 'Dark appearance', Icon: Moon },
};

export const ThemeSwitcher = () => {
  // Theme is painted before first render by main.tsx (applyMode → applyTheme chain)
  const [current, setCurrent] = useState<ThemeColor>(getCurrentTheme());
  const [mode, setMode] = useState<ColorMode>(getMode());
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const { reduced, spring, fade } = useRespectfulMotion();

  // Return focus to the palette button (Esc / outside selection)
  const closeAndReturnFocus = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Wrap a light/dark swap in the global `html.theme-fade` ease so colors
  // cross-fade together. Skipped for reduced motion.
  const withModeFade = (apply: () => void) => {
    if (!reduced) {
      document.documentElement.classList.add('theme-fade');
      window.setTimeout(() => document.documentElement.classList.remove('theme-fade'), 300);
    }
    apply();
  };

  const handleMode = (next: ColorMode) => {
    if (next === mode) return;
    withModeFade(() => applyMode(next));
    setMode(next);
    playBlip(1300);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Esc closes the dropdown and returns focus to the trigger
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeAndReturnFocus();
      }
    };
    document.addEventListener('keydown', handleKey, true);
    return () => document.removeEventListener('keydown', handleKey, true);
  }, [isOpen, closeAndReturnFocus]);

  const handleSelect = (t: ThemeColor) => {
    const updated = applyTheme(t.id);
    setCurrent(updated);
    closeAndReturnFocus();
    playBlip(1500);
    vibrate(10); // accent change is a committed choice — pair it with a haptic tap
  };

  return (
    <div className="theme-switcher" ref={containerRef}>
      <button
        ref={triggerRef}
        className="theme-switcher__btn"
        onClick={() => {
          setIsOpen((prev) => !prev);
          playBlip(1200);
        }}
        aria-label="Change Accent Color Theme"
        aria-expanded={isOpen}
        title={`Theme: ${current.name}`}
      >
        <span
          className="theme-switcher__active-dot"
          style={{ backgroundColor: current.accent, boxShadow: `0 0 10px ${current.accent}` }}
        />
        <Palette size={14} className="theme-switcher__icon" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="theme-switcher__dropdown"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            transition={reduced ? fade : spring}
          >
            <div className="theme-switcher__header">Accent Engine</div>

            {/* Color-mode segmented control (Auto / Light / Dark) */}
            <div className="theme-switcher__modes">
              {MODES.map((m) => {
                const { label, Icon } = MODE_META[m];
                return (
                  <button
                    key={m}
                    className={`theme-switcher__mode ${mode === m ? 'theme-switcher__mode--active' : ''}`}
                    onClick={() => handleMode(m)}
                  >
                    <Icon size={11} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tiny system/sun/moon hint under the segment */}
            <div className="theme-switcher__mode-hint">
              {mode === 'auto' && <Monitor size={11} className="theme-switcher__mode-hint-icon" />}
              {mode === 'light' && <Sun size={11} className="theme-switcher__mode-hint-icon" />}
              {mode === 'dark' && <Moon size={11} className="theme-switcher__mode-hint-icon" />}
              <span>{MODE_META[mode].hint}</span>
            </div>

            <div className="theme-switcher__grid">
              {THEMES.map((theme) => {
                const isActive = current.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    className={`theme-switcher__item ${isActive ? 'theme-switcher__item--active' : ''}`}
                    onClick={() => handleSelect(theme)}
                  >
                    <span
                      className="theme-switcher__color-swatch"
                      style={{ backgroundColor: theme.accent }}
                    >
                      {isActive && <Check size={11} color="#0c0c0e" strokeWidth={3} />}
                    </span>
                    <span className="theme-switcher__item-name">{theme.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
