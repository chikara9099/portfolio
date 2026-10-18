import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Github, Linkedin, Mail, ArrowUpRight, Copy, Check } from 'lucide-react';
import { PROFILE, AVAILABILITY } from '../data/content';
import { useRespectfulMotion } from '../motion';
import { useToast } from './Toast';
import { playSuccessChime, playBlip } from '../utils/sound';
import './Contact.css';

export const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { reduced, transitionSlow } = useRespectfulMotion();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(PROFILE.email);
    setCopied(true);
    playSuccessChime();
    showToast(`Copied ${PROFILE.email} to clipboard!`);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer id="contact" className="section contact">
      <div className="container">
        <motion.div
          ref={ref}
          className="contact__content"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30 }}
          animate={isInView ? (reduced ? { opacity: 1 } : { opacity: 1, y: 0 }) : {}}
          transition={transitionSlow}
        >
          <span className="contact__label">06 — Contact</span>
          <h2 className="contact__heading">Let&apos;s connect</h2>
          <span className="contact__status">
            <span className="contact__status-dot" aria-hidden />
            {AVAILABILITY}
          </span>
          <p className="contact__subtext">
            Open to research opportunities, prototypes, systems work, and interesting technical conversations.
          </p>

          <div className="contact__links">
            {/* Direct Mailto + Copy trigger */}
            <div className="contact__email-group">
              <a
                href={`mailto:${PROFILE.email}`}
                className="contact__link-item"
                onClick={() => playBlip(1400)}
              >
                <Mail size={18} />
                <span>{PROFILE.email}</span>
                <ArrowUpRight size={14} className="contact__arrow" />
              </a>
              <button
                className="contact__copy-btn"
                onClick={handleCopyEmail}
                title="Copy email to clipboard"
                aria-label="Copy email address"
              >
                {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
              </button>
            </div>

            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="contact__link-item"
              onClick={() => playBlip(1400)}
            >
              <Github size={18} />
              <span>GitHub</span>
              <ArrowUpRight size={14} className="contact__arrow" />
            </a>

            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              className="contact__link-item"
              onClick={() => playBlip(1400)}
            >
              <Linkedin size={18} />
              <span>LinkedIn</span>
              <ArrowUpRight size={14} className="contact__arrow" />
            </a>
          </div>

          <div className="contact__footer">
            <p>&copy; {new Date().getFullYear()} {PROFILE.name} · Built with React &amp; Precision</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
