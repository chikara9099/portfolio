import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { PROFILE } from '../data/content';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Magnetic } from './Magnetic';
import resumePdf from '../assets/Shahriar_Alam_Patwary_Resume.pdf';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

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

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
        </div>
      </div>
    </motion.nav>
  );
};
