import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Github, Linkedin, Mail, ChevronDown, Download, FileText, ArrowRight } from 'lucide-react';
import { PROFILE } from '../data/content';
import { useToast } from './Toast';
import { playSuccessChime } from '../utils/sound';
import profilePic from '../assets/picofme.png';
import resumePdf from '../assets/Shahriar_Alam_Patwary_Resume.pdf';
import { Magnetic } from './Magnetic';
import { useRespectfulMotion } from '../motion';
import type { Variants, Transition } from 'framer-motion';
import './Hero.css';

const nameWords = "Shahriar Alam Patwary".split(' ');

/* Credential strip — the strongest facts, no decoration */
const CREDENTIALS = [
  'IUT ICT Fest Champion 2026',
  'Production software · 180+ units',
  'NASA Space Apps · National Selection',
];

export const Hero = () => {
  const { showToast } = useToast();
  const { reduced, springSlow, fade } = useRespectfulMotion();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  // Scroll depth — the stage content drifts up and dims as it leaves the light
  const contentY = useTransform(scrollYProgress, [0, 0.3], [0, -48]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.25]);

  // Staggered name reveal — springs by default, cross-fade under reduced motion
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : 0.12,
        delayChildren: reduced ? 0 : 0.35,
      },
    },
  };

  const wordVariants: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: fade },
      }
    : {
        hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { ...springSlow, damping: 1 },
        },
      };

  return (
    <section id="hero" className="hero" ref={heroRef}>
      {/* The single ambient spotlight of the site */}
      <div className="hero__spotlight" aria-hidden />

      {/* The stage container shares the spotlight's exit: drift + dim */}
      <motion.div
        className="hero__content container"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        {/* Avatar on the stage light */}
        <motion.div
          className="hero__avatar-frame"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={reduced ? fade : springSlow}
        >
          <img
            src={profilePic}
            alt={PROFILE.name}
            className="hero__avatar-img"
          />
        </motion.div>

        {/* Display name */}
        <motion.h1
          className="hero__name"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          aria-label={PROFILE.name}
        >
          {nameWords.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              className="hero__word"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="hero__tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduced ? fade : ({ ...fade, delay: reduced ? 0 : 0.9 } as Transition)}
        >
          {PROFILE.tagline}
        </motion.p>

        {/* Credential strip */}
        <motion.ul
          className="hero__credentials"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduced ? fade : ({ ...fade, delay: reduced ? 0 : 1.05 } as Transition)}
        >
          {CREDENTIALS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </motion.ul>

        {/* Actions */}
        <motion.div
          className="hero__actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduced ? fade : ({ ...fade, delay: reduced ? 0 : 1.2 } as Transition)}
        >
          <Magnetic strength={0.3}>
            <a
              href="#projects"
              className="pill hero__projects-btn"
              aria-label="Jump to projects"
            >
              <span>View Projects</span>
              <ArrowRight size={14} className="hero__projects-icon" />
            </a>
          </Magnetic>

          <Magnetic strength={0.3}>
            <a
              href={resumePdf}
              download="Shahriar_Alam_Patwary_Resume.pdf"
              className="pill hero__resume-btn"
              target="_blank"
              rel="noreferrer"
              aria-label="Download Resume"
            >
              <FileText size={16} />
              <span>Resume</span>
              <Download size={14} className="hero__resume-icon" />
            </a>
          </Magnetic>

          <div className="hero__links">
            <Magnetic strength={0.35}>
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noreferrer"
                className="hero__link"
                aria-label="GitHub"
              >
                <Github size={19} />
              </a>
            </Magnetic>
            <Magnetic strength={0.35}>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hero__link"
                aria-label="LinkedIn"
              >
                <Linkedin size={19} />
              </a>
            </Magnetic>
            <Magnetic strength={0.35}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(PROFILE.email);
                  playSuccessChime();
                  showToast(`Copied ${PROFILE.email} to clipboard!`);
                }}
                className="hero__link hero__email-btn"
                aria-label="Email (click to copy)"
                title="Click to copy email address"
              >
                <Mail size={19} />
              </button>
            </Magnetic>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="hero__scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduced ? fade : { duration: 0.6, delay: 1.5 }}
          style={{ opacity: scrollHintOpacity }}
        >
          <ChevronDown size={20} className="hero__scroll-icon" />
        </motion.div>
      </motion.div>
    </section>
  );
};
