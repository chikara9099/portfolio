import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { PROFILE, EDUCATION, PROJECTS, SKILLS } from '../data/content';
import resumePdf from '../assets/Shahriar_Alam_Patwary_Resume.pdf';
import { playKeyClick, playSuccessChime, playBlip, setSoundMuted, getSoundMuted } from '../utils/sound';
import { THEMES, getCurrentTheme, applyTheme } from '../utils/theme';
import { useRespectfulMotion } from '../motion';
import './TerminalModal.css';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  text: string | React.ReactNode;
}

const HELP_TEXT = [
  'Available commands:',
  '  whoami       - Display personal introduction & profile',
  '  education    - BUET degree, CGPA, and coursework',
  '  skills       - Categorized list of technical skills',
  '  projects     - View featured engineering systems',
  '  resume       - Download official Resume PDF',
  '  contact      - Get direct contact channels',
  '  theme        - View or switch accent theme (cyan, emerald, amber, violet, rose, titanium)',
  '  matrix       - Toggle green Matrix digital rain mode',
  '  clear        - Clear terminal screen buffer',
  '  exit         - Close terminal session',
];

export const TerminalModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: 'system',
      text: (
        <div>
          <div className="terminal__ascii">
            {`   _____ _           _          _             
  / ____| |         | |        (_)            
 | (___ | |__   __ _| |__  _ __ _  __ _ _ __  
  \\___ \\| '_ \\ / _\` | '_ \\| '__| |/ _\` | '__| 
  ____) | | | | (_| | | | | |  | | (_| | |    
 |_____/|_| |_|\\__,_|_| |_|_|  |_|\\__,_|_|    `}
          </div>
          <p className="terminal__welcome-text">
            Welcome to <strong>Shahriar Alam Patwary</strong>&apos;s Interactive Shell [v2.4.0]
          </p>
          <p className="terminal__hint-text">
            Type <span className="terminal__cmd-highlight">help</span> to explore commands, or <span className="terminal__cmd-highlight">resume</span> to download CV.
          </p>
        </div>
      ),
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [isMuted, setIsMuted] = useState(getSoundMuted());
  const [isMaximized, setIsMaximized] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const { reduced, springSlow, fade } = useRespectfulMotion();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const matrixCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const windowRef = useRef<HTMLDivElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // On open: remember the opener, focus the terminal input, lock body scroll.
  // On close: unlock scroll and hand focus back to the element that opened us.
  useEffect(() => {
    if (isOpen) {
      openerRef.current = (document.activeElement as HTMLElement) ?? null;
      const focusTimer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
      document.body.style.overflow = 'hidden';
      playBlip(900);
      return () => {
        window.clearTimeout(focusTimer);
        document.body.style.overflow = '';
      };
    }
    openerRef.current?.focus?.();
  }, [isOpen]);

  // Focus trap + Escape while the terminal is open (capture phase, within modal)
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = windowRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const isInside = !!document.activeElement && root.contains(document.activeElement);
      if (e.shiftKey && (!isInside || document.activeElement === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (!isInside || document.activeElement === last)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKey, true);
    return () => document.removeEventListener('keydown', handleKey, true);
  }, [isOpen, onClose]);

  // Scroll to bottom on new lines
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  // Matrix canvas effect
  useEffect(() => {
    if (!matrixActive) return;

    const canvas = matrixCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = canvas.parentElement?.clientHeight || 400;

    const chars = '0123456789ABCDEFSHAHRIARBUETCSE';
    const fontSize = 13;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(12, 12, 14, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#38bdf8';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 45);

    return () => clearInterval(interval);
  }, [matrixActive]);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    setSoundMuted(next);
    if (!next) playBlip(1200);
  };

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    const args = trimmed.split(' ');
    const command = args[0].toLowerCase();

    const newLines: TerminalLine[] = [
      ...lines,
      { type: 'input', text: `patwary@buet:~$ ${trimmed}` },
    ];

    switch (command) {
      case 'help':
        newLines.push({
          type: 'output',
          text: (
            <div className="terminal__help-block">
              {HELP_TEXT.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          ),
        });
        playBlip(1000);
        break;

      case 'whoami':
      case 'bio':
        newLines.push({
          type: 'output',
          text: (
            <div>
              <p><strong>{PROFILE.name}</strong></p>
              <p className="terminal__cyan">{PROFILE.tagline}</p>
              <p style={{ marginTop: '0.4rem', color: '#94a3b8' }}>{PROFILE.bio}</p>
            </div>
          ),
        });
        playBlip(1100);
        break;

      case 'education':
        newLines.push({
          type: 'output',
          text: (
            <div>
              <p className="terminal__cyan"><strong>{EDUCATION.institution}</strong></p>
              <p>{EDUCATION.degree} — <strong>CGPA: {EDUCATION.cgpa}</strong></p>
              <p style={{ color: '#94a3b8' }}>Location: {EDUCATION.location} | Graduation: {EDUCATION.graduation}</p>
              <p style={{ marginTop: '0.4rem' }}>
                <strong>Key Coursework:</strong> {EDUCATION.coursework.slice(0, 8).join(', ')}...
              </p>
            </div>
          ),
        });
        playBlip(1150);
        break;

      case 'skills':
        newLines.push({
          type: 'output',
          text: (
            <div className="terminal__skills-grid">
              {SKILLS.map((cat) => (
                <div key={cat.label} style={{ marginBottom: '0.4rem' }}>
                  <span className="terminal__cyan">[{cat.label}]:</span>{' '}
                  <span style={{ color: '#cbd5e1' }}>{cat.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          ),
        });
        playBlip(1200);
        break;

      case 'projects':
        newLines.push({
          type: 'output',
          text: (
            <div>
              <p className="terminal__cyan">Featured Projects:</p>
              {PROJECTS.map((p, idx) => (
                <div key={p.id} style={{ margin: '0.4rem 0' }}>
                  <span>{idx + 1}. <strong>{p.title}</strong></span>
                  {p.achievement && (
                    <span style={{ color: '#f59e0b', marginLeft: '0.5rem', fontSize: '0.8rem' }}>
                      [{p.achievement}]
                    </span>
                  )}
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{p.description}</div>
                </div>
              ))}
            </div>
          ),
        });
        playBlip(1250);
        break;

      case 'resume':
      case 'cv': {
        newLines.push({
          type: 'success',
          text: (
            <div>
              <span className="terminal__success">✔ Resume download triggered!</span> (Shahriar_Alam_Patwary_Resume.pdf)
            </div>
          ),
        });
        playSuccessChime();
        // Trigger download
        const link = document.createElement('a');
        link.href = resumePdf;
        link.download = 'Shahriar_Alam_Patwary_Resume.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      }

      case 'contact':
        newLines.push({
          type: 'output',
          text: (
            <div>
              <p>Email: <a href={`mailto:${PROFILE.email}`} style={{ color: '#38bdf8' }}>{PROFILE.email}</a></p>
              <p>GitHub: <a href={PROFILE.github} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>{PROFILE.github}</a></p>
              <p>LinkedIn: <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>{PROFILE.linkedin}</a></p>
            </div>
          ),
        });
        playBlip(1300);
        break;

      case 'theme':
        if (args.length > 1) {
          const target = args[1].toLowerCase();
          const match = THEMES.find((t) => t.id === target || t.name.toLowerCase().includes(target));
          if (match) {
            applyTheme(match.id);
            newLines.push({
              type: 'success',
              text: `✔ Switched accent theme to ${match.name} (${match.accent}).`,
            });
            playSuccessChime();
          } else {
            newLines.push({
              type: 'error',
              text: `Unknown theme "${args[1]}". Available: ${THEMES.map((t) => t.id).join(', ')}`,
            });
            playBlip(600);
          }
        } else {
          const current = getCurrentTheme();
          newLines.push({
            type: 'output',
            text: (
              <div>
                <p>Current theme: <strong style={{ color: current.accent }}>{current.name}</strong></p>
                <p style={{ color: '#94a3b8' }}>
                  Usage: <span className="terminal__cmd-highlight">theme &lt;name&gt;</span>
                </p>
                <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  {THEMES.map((t) => (
                    <span key={t.id} style={{ color: t.accent }}>
                      ● {t.id}
                    </span>
                  ))}
                </div>
              </div>
            ),
          });
          playBlip(1100);
        }
        break;

      case 'matrix':
        setMatrixActive((prev) => !prev);
        newLines.push({
          type: 'success',
          text: matrixActive ? 'Matrix simulation disabled.' : '⚡ Matrix digital rain stream initialized.',
        });
        playBlip(1500);
        break;

      case 'clear':
      case 'cls':
        setLines([]);
        setInputVal('');
        return;

      case 'sudo':
        newLines.push({
          type: 'error',
          text: 'Nice try! User "patwary" is already root on this server. Permission granted for curiosity.',
        });
        playBlip(700);
        break;

      case 'date':
        newLines.push({
          type: 'output',
          text: new Date().toString(),
        });
        break;

      case 'exit':
      case 'quit':
        onClose();
        return;

      default:
        newLines.push({
          type: 'error',
          text: `Command not found: "${trimmed}". Type "help" for a list of available commands.`,
        });
        playBlip(600);
        break;
    }

    setLines(newLines);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    playKeyClick();

    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < history.length) {
          setHistoryIdx(nextIdx);
          setInputVal(history[nextIdx]);
        } else {
          setHistoryIdx(-1);
          setInputVal('');
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const available = ['help', 'whoami', 'bio', 'education', 'skills', 'projects', 'resume', 'contact', 'theme', 'matrix', 'clear', 'exit'];
      const match = available.find((c) => c.startsWith(inputVal.toLowerCase()));
      if (match) {
        setInputVal(match);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
    <motion.div
      className="terminal-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={fade}
      >
        <motion.div
          ref={windowRef}
          className={`terminal-window ${isMaximized ? 'terminal-window--maximized' : ''}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Interactive developer terminal"
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
          transition={reduced ? fade : springSlow}
        >
        {/* Matrix background layer if active */}
        {matrixActive && <canvas ref={matrixCanvasRef} className="terminal__matrix-canvas" />}

        {/* Terminal Title Bar */}
        <div className="terminal__header">
          <div className="terminal__dots">
            <button className="terminal__dot terminal__dot--red" onClick={onClose} aria-label="Close" />
            <button
              className="terminal__dot terminal__dot--yellow"
              onClick={() => setIsMaximized((m) => !m)}
              aria-label="Maximize"
            />
            <button
              className="terminal__dot terminal__dot--green"
              onClick={() => handleCommand('matrix')}
              aria-label="Toggle Matrix"
            />
          </div>

          <div className="terminal__title">
            <TerminalIcon size={14} className="terminal__title-icon" />
            <span>patwary@buet-cse: ~ (zsh)</span>
          </div>

          <div className="terminal__actions">
            <button
              className="terminal__tool-btn"
              onClick={toggleSound}
              title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              aria-label="Toggle sound"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <button
              className="terminal__tool-btn"
              onClick={() => setIsMaximized((m) => !m)}
              aria-label="Toggle full window"
            >
              {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button className="terminal__tool-btn" onClick={onClose} aria-label="Close terminal">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="terminal__body" onClick={() => inputRef.current?.focus()}>
          <div className="terminal__output" aria-live="polite">
            {lines.map((line, idx) => (
              <div key={idx} className={`terminal__line terminal__line--${line.type}`}>
                {line.text}
              </div>
            ))}
          </div>

          {/* Active Input Line */}
          <div className="terminal__input-row">
            <span className="terminal__prompt">patwary@buet:~$</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal__input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div ref={bottomRef} />
        </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};
