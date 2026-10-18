import { CalendarHeart } from 'lucide-react';
import { PROFILE, AVAILABILITY } from '../data/content';
import { playBlip } from '../utils/sound';
import './Footer.css';

const FOOTER_LINKS = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

/**
 * Site footer — wayfinding ("where can I go / how do I leave"):
 * mini-nav, availability status, back to top.
 */
export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <a href="#hero" className="footer__brand" aria-label="Back to top — Shahriar Alam Patwary">
          <span className="footer__brand-dot" aria-hidden />
          Shahriar Alam Patwary
        </a>

        <span className="footer__status">
          <CalendarHeart size={12} aria-hidden />
          {AVAILABILITY}
        </span>

        <nav className="footer__nav" aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="footer__link"
              onClick={() => playBlip(1100)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#hero" className="footer__back-to-top" onClick={() => playBlip(1100)}>
          Back to top<span aria-hidden> ↑</span>
        </a>
      </div>

      <div className="container footer__bar">
        <span>© {year} {PROFILE.name}</span>
        <span className="footer__bar-dot" aria-hidden>·</span>
        <span>{PROFILE.tagline}</span>
      </div>
    </footer>
  );
};
