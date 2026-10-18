// ============================================
// THEME ENGINE — accent color themes + light/dark mode
// ============================================

export interface ThemeColor {
  id: string;
  name: string;
  accent: string;
  accentRgb: string; // for rgba() usage: "56, 189, 248"
  accentHover: string;
  aurora: string;
  /** Optional accent variant tuned for light backgrounds (contrast). */
  light?: {
    accent: string;
    accentRgb: string;
    accentHover: string;
    aurora: string;
  };
}

export const THEMES: ThemeColor[] = [
  {
    id: 'noir-gold',
    name: 'Warm Noir (Gold)',
    accent: '#C8A97E',
    accentRgb: '200, 169, 126',
    accentHover: '#D4BA95',
    aurora: '#8a6d3f',
    light: {
      accent: '#A67C4E',
      accentRgb: '166, 124, 78',
      accentHover: '#8A6538',
      aurora: '#A67C4E',
    },
  },
  {
    id: 'cyan',
    name: 'Electric Cyan',
    accent: '#38bdf8',
    accentRgb: '56, 189, 248',
    accentHover: '#7dd3fc',
    aurora: '#0284c7',
    light: {
      accent: '#0284c7',
      accentRgb: '2, 132, 199',
      accentHover: '#0369a1',
      aurora: '#0284c7',
    },
  },
  {
    id: 'emerald',
    name: 'Cyber Emerald',
    accent: '#10b981',
    accentRgb: '16, 185, 129',
    accentHover: '#34d399',
    aurora: '#047857',
    light: {
      accent: '#047857',
      accentRgb: '4, 120, 87',
      accentHover: '#065f46',
      aurora: '#047857',
    },
  },
  {
    id: 'amber',
    name: 'Solar Amber',
    accent: '#f59e0b',
    accentRgb: '245, 158, 11',
    accentHover: '#fbbf24',
    aurora: '#b45309',
    light: {
      accent: '#b45309',
      accentRgb: '180, 83, 9',
      accentHover: '#92400e',
      aurora: '#b45309',
    },
  },
  {
    id: 'violet',
    name: 'Neon Violet',
    accent: '#a855f7',
    accentRgb: '168, 85, 247',
    accentHover: '#c084fc',
    aurora: '#7e22ce',
    light: {
      accent: '#7e22ce',
      accentRgb: '126, 34, 206',
      accentHover: '#6b21a8',
      aurora: '#7e22ce',
    },
  },
  {
    id: 'rose',
    name: 'Rose Crimson',
    accent: '#f43f5e',
    accentRgb: '244, 63, 94',
    accentHover: '#fb7185',
    aurora: '#be123c',
    light: {
      accent: '#be123c',
      accentRgb: '190, 18, 60',
      accentHover: '#a30731',
      aurora: '#be123c',
    },
  },
  {
    id: 'titanium',
    name: 'Titanium',
    accent: '#e2e8f0',
    accentRgb: '226, 232, 240',
    accentHover: '#ffffff',
    aurora: '#64748b',
    light: {
      accent: '#64748b',
      accentRgb: '100, 116, 139',
      accentHover: '#475569',
      aurora: '#64748b',
    },
  },
];

// --------------------------------------------
// Accent color (persisted)
// --------------------------------------------
type ThemeListener = (theme: ThemeColor) => void;
const listeners: ThemeListener[] = [];

export function subscribeToTheme(listener: ThemeListener): () => void {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

export function getCurrentTheme(): ThemeColor {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('portfolio_accent_theme');
    const found = THEMES.find((t) => t.id === saved);
    if (found) return found;
  }
  return THEMES[0]; // Warm Noir (Gold) default — matches index.css tokens
}

function isLightMode(mode: ColorMode): boolean {
  if (mode === 'light') return true;
  if (mode === 'auto') {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    );
  }
  return false;
}

export function applyTheme(themeId: string): ThemeColor {
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  // When in light mode, use the accent variant tuned for light backgrounds
  const mode = typeof localStorage !== 'undefined'
    ? (localStorage.getItem('portfolio_color_mode') as ColorMode | null) || 'auto'
    : 'auto';
  const effective = isLightMode(mode) && theme.light
    ? { ...theme, accent: theme.light.accent, accentRgb: theme.light.accentRgb, accentHover: theme.light.accentHover, aurora: theme.light.aurora }
    : theme;

  const root = document.documentElement;
  root.style.setProperty('--accent', effective.accent);
  root.style.setProperty('--accent-hover', effective.accentHover);
  root.style.setProperty('--accent-rgb', effective.accentRgb);
  root.style.setProperty('--accent-glow', `rgba(${effective.accentRgb}, 0.12)`);
  root.style.setProperty('--border-hover', `rgba(${effective.accentRgb}, 0.35)`);

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('portfolio_accent_theme', theme.id);
  }

  // Notify listeners (like BackgroundCanvas)
  listeners.forEach((fn) => fn(effective));
  return effective;
}

// --------------------------------------------
// Color mode (light / dark / auto, persisted)
// --------------------------------------------
export type ColorMode = 'auto' | 'light' | 'dark';

type ModeListener = (mode: ColorMode) => void;
const modeListeners: ModeListener[] = [];

export function subscribeToMode(listener: ModeListener): () => void {
  modeListeners.push(listener);
  return () => {
    const idx = modeListeners.indexOf(listener);
    if (idx !== -1) modeListeners.splice(idx, 1);
  };
}

export function getMode(): ColorMode {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('portfolio_color_mode');
    if (saved === 'light' || saved === 'dark' || saved === 'auto') return saved;
  }
  // No saved choice → follow the visitor's system preference.
  // The dark identity lives in the design itself, not in overriding it.
  return 'auto';
}

/** Sets the mode and pushes it onto the <html> element as `data-mode`. */
export function applyMode(mode: ColorMode): ColorMode {
  const root = document.documentElement;
  root.dataset.mode = isLightMode(mode) ? 'light' : 'dark';
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('portfolio_color_mode', mode);
  }
  // Accent may need its light variant after a mode switch
  applyTheme(getCurrentTheme().id);
  modeListeners.forEach((fn) => fn(mode));
  return mode;
}

export function nextMode(): ColorMode {
  const order: ColorMode[] = ['auto', 'light', 'dark'];
  const idx = order.indexOf(getMode());
  return order[(idx + 1) % order.length];
}

/** Re-evaluate `data-mode` when the system scheme changes while in auto. */
export function initMode(): void {
  applyMode(getMode());
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener('change', () => {
      if (getMode() === 'auto') applyMode('auto');
    });
  }
}
