import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';
import { PROFILE } from '../data/content';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Magnetic } from './Magnetic';
import { useRespectfulMotion } from '../motion';
import resumePdf from '../assets/Shahriar_Alam_Patwary_Resume.pdf';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Leadership', href: '#leadership-research' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { reduced, springSlow, fade } = useRespectfulMotion();

  useEffect(() => {
    let ticking = false;
    let rafId = 0;

    // The scroll handler runs at most once per frame: rect reads + setState
    // are coalesced into a single rAF instead of firing on every scroll event.
    const update = () => {
      ticking = false;
      setScrolled(window.scrollY > 50);

      // Determine active section
      const sections = NAV_LINKS.map((l) => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(sections[i]);
            return;
          }
        }
      }
      setActiveSection('');
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Close the sheet on Escape and on scroll (a menu over a moving page is noise)
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const onScroll = () => setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, [menuOpen]);

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${menuOpen ? 'navbar--menu-open' : ''}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reduced ? { duration: 0.2 } : { ...springSlow, delay: 0.2 }}
    >
      <div className="navbar__inner container">
        <a href="#hero" className="navbar__logo" aria-label="Shahriar Alam Patwary">
          <span className="navbar__logo-dot" />
          <span className="navbar__logo-full">{PROFILE.name}</span>
          <span className="navbar__logo-short">Shahriar Alam</span>
        </a>

        <div className="navbar__right">
          <div className="navbar__links">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`navbar__link ${activeSection === link.href.slice(1) ? 'navbar__link--active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <Magnetic strength={0.3}>
            <a
              href={resumePdf}
              download="Shahriar_Alam_Patwary_Resume.pdf"
              className="navbar__resume-btn"
              target="_blank"
              rel="noreferrer"
              aria-label="Download Resume"
            >
              <Download size={13} />
              <span>Resume</span>
            </a>
          </Magnetic>

          <Magnetic strength={0.3}>
            <ThemeSwitcher />
          </Magnetic>

          {/* Mobile only — hamburger lives in the capsule */}
          <button
            className="navbar__menu-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="navbar-menu-sheet"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile menu sheet — glass panel under the capsule */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="navbar-menu-sheet"
              className="navbar__sheet"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.97 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={reduced ? fade : springSlow}
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`navbar__sheet-link ${activeSection === link.href.slice(1) ? 'navbar__sheet-link--active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href={resumePdf}
                download="Shahriar_Alam_Patwary_Resume.pdf"
                className="navbar__sheet-link navbar__sheet-link--resume"
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                <Download size={14} />
                <span>Download Resume</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
