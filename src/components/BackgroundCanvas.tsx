import { useEffect, useRef, useState } from 'react';
import { getCurrentTheme, getMode, subscribeToTheme, subscribeToMode } from '../utils/theme';
import type { ThemeColor, ColorMode } from '../utils/theme';
import './BackgroundCanvas.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  alpha: number;
}

/** Resolve whether a ColorMode actually renders as light (auto follows the OS). */
const isEffectiveLight = (mode: ColorMode): boolean => {
  if (mode === 'light') return true;
  if (mode === 'dark') return false;
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: light)').matches
  );
};

export const BackgroundCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<ThemeColor>(getCurrentTheme());
  const themeRef = useRef<ThemeColor>(theme);
  const modeRef = useRef<ColorMode>(getMode());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let loopRunning = false;
    let documentVisible = !document.hidden;
    let intersecting = true;

    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let width = window.innerWidth;
    let height = window.innerHeight;
    let lastTime = performance.now();

    // Responsive particle count
    const particleCount = width < 768 ? 36 : 72;
    const maxDistance = width < 768 ? 95 : 135;
    const mouseRadius = 160;

    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
    };

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 1.5 + 1;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        baseRadius: radius,
        radius,
        alpha: Math.random() * 0.5 + 0.25,
      });
    }

    // In light mode the canvas sits on a cream background: halve all canvas
    // alpha so dots/links stay subtle instead of glowing on #F7F5F0.
    const alphaFactor = () => (isEffectiveLight(modeRef.current) ? 0.5 : 1);

    // --- Update ----------------------------------------------------------------

    const updateParticles = (speedFactor: number) => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx * speedFactor;
        p.y += p.vy * speedFactor;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Mouse repulsion & interaction (skipped entirely in reduced motion)
        if (mouse.active && !reducedQuery.matches) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius) {
            const force = (mouseRadius - dist) / mouseRadius;
            const angle = Math.atan2(dy, dx);
            p.x -= Math.cos(angle) * force * 2.5 * speedFactor;
            p.y -= Math.sin(angle) * force * 2.5 * speedFactor;
            p.radius = p.baseRadius + force * 1.5;
          } else {
            p.radius = p.baseRadius;
          }
        } else {
          p.radius = p.baseRadius;
        }
      }
    };

    // --- Draw ------------------------------------------------------------------

    const drawMouseLinks = () => {
      if (!mouse.active || reducedQuery.matches) return;
      const rgb = themeRef.current.accentRgb;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius) {
          const force = (mouseRadius - dist) / mouseRadius;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${rgb}, ${force * 0.35 * alphaFactor()})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    };

    const drawParticles = () => {
      const factor = alphaFactor();
      const rgb = themeRef.current.accentRgb;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        // Dark mode: white dots. Light mode: accent-tinted, halved alpha.
        ctx.fillStyle =
          factor === 1
            ? `rgba(255, 255, 255, ${p.alpha * 0.9})`
            : `rgba(${rgb}, ${p.alpha * 0.45})`;
        // No ctx.shadowBlur — per-particle blur shadow was the single biggest
        // paint cost on this canvas; the plain fill looks nearly identical.
        ctx.fill();
      }
    };

    const connectPair = (p1: Particle, p2: Particle) => {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist >= maxDistance) return;
      const alpha = (1 - dist / maxDistance) * 0.16 * alphaFactor();
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = `rgba(${themeRef.current.accentRgb}, ${alpha})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    };

    // O(n²) all-pairs scan replaced with a uniform spatial grid whose cell size
    // equals the link distance. Only same-cell + 4 forward-neighbor cells are
    // tested, so each pair is considered exactly once — visual output unchanged.
    const drawConnections = () => {
      const cols = Math.max(1, Math.ceil(width / maxDistance));
      const rows = Math.max(1, Math.ceil(height / maxDistance));
      const grid: Particle[][] = new Array(cols * rows);
      for (let i = 0; i < grid.length; i++) grid[i] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const cx = Math.min(cols - 1, Math.max(0, (p.x / maxDistance) | 0));
        const cy = Math.min(rows - 1, Math.max(0, (p.y / maxDistance) | 0));
        grid[cy * cols + cx].push(p);
      }

      // Right, bottom, and the two down-diagonals — never the (already
      // visited) left/up cells, which keeps pair testing deduplicated.
      const NEIGHBORS: Array<[number, number]> = [[1, 0], [-1, 1], [0, 1], [1, 1]];

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const cell = grid[cy * cols + cx];
          if (cell.length === 0) continue;

          for (let a = 0; a < cell.length; a++) {
            for (let b = a + 1; b < cell.length; b++) {
              connectPair(cell[a], cell[b]);
            }
          }

          for (const [ox, oy] of NEIGHBORS) {
            const nx = cx + ox;
            const ny = cy + oy;
            if (nx < 0 || nx >= cols || ny >= rows) continue;
            const neighborCell = grid[ny * cols + nx];
            for (let a = 0; a < cell.length; a++) {
              for (let b = 0; b < neighborCell.length; b++) {
                connectPair(cell[a], neighborCell[b]);
              }
            }
          }
        }
      }
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);
      drawMouseLinks();
      drawParticles();
      drawConnections();
    };

    // --- Loop control: rAF runs only when visible AND intersecting AND motion OK

    const shouldRun = () => documentVisible && intersecting && !reducedQuery.matches;

    const frame = (time: number) => {
      loopRunning = false;
      if (!shouldRun()) return;

      // Delta time normalization
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      updateParticles(dt * 60);
      drawFrame();

      rafId = requestAnimationFrame(frame);
      loopRunning = true;
    };

    const stop = () => {
      if (loopRunning) cancelAnimationFrame(rafId);
      loopRunning = false;
    };

    const start = () => {
      if (loopRunning || !shouldRun()) return;
      lastTime = performance.now(); // avoid a huge first delta after idle time
      loopRunning = true;
      rafId = requestAnimationFrame(frame);
    };

    const syncLoop = () => {
      if (shouldRun()) {
        if (!loopRunning) start();
      } else {
        stop();
        // Reduced motion: keep exactly one static, current frame on screen.
        if (reducedQuery.matches) drawFrame();
      }
    };

    // --- Sizing (DPR aware) ---------------------------------------------------

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducedQuery.matches) drawFrame();
    };

    // --- Listeners / observers / subscriptions --------------------------------

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Pause fully while the tab is hidden (no rAF churn).
    const handleVisibility = () => {
      documentVisible = !document.hidden;
      syncLoop();
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        intersecting = entries[0]?.isIntersecting ?? true;
        syncLoop();
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    const unsubscribeTheme = subscribeToTheme((newTheme) => {
      setTheme(newTheme);
      themeRef.current = newTheme;
      if (reducedQuery.matches) drawFrame(); // re-tint static frame
    });

    const unsubscribeMode = subscribeToMode((newMode) => {
      modeRef.current = newMode;
      if (reducedQuery.matches) drawFrame(); // re-tint static frame
    });

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibility);
    reducedQuery.addEventListener('change', syncLoop);

    handleResize();

    // Reduced motion => single static frame; otherwise start the loop.
    if (reducedQuery.matches) {
      drawFrame();
    } else {
      lastTime = performance.now();
      loopRunning = true;
      rafId = requestAnimationFrame(frame);
    }

    return () => {
      stop();
      intersectionObserver.disconnect();
      unsubscribeTheme();
      unsubscribeMode();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      reducedQuery.removeEventListener('change', syncLoop);
    };
  }, []);

  return (
    <div className="bg-canvas-wrapper" aria-hidden="true">
      {/* Dynamic Aurora Ambient Glow Orbs */}
      <div
        className="bg-aurora bg-aurora--top-cyan"
        style={{
          background: `radial-gradient(circle, ${theme.accent} 0%, rgba(${theme.accentRgb}, 0) 70%)`,
        }}
      />
      <div className="bg-aurora bg-aurora--mid-purple" />
      <div
        className="bg-aurora bg-aurora--bottom-blue"
        style={{
          background: `radial-gradient(circle, ${theme.aurora} 0%, rgba(2, 132, 199, 0) 70%)`,
        }}
      />
      <canvas ref={canvasRef} className="bg-canvas" />
    </div>
  );
};
