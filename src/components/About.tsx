import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { PROFILE } from '../data/content';
import { SectionHeader } from './SectionHeader';
import { useRespectfulMotion } from '../motion';
import './About.css';
import './SectionHeader.css';

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { reduced, transitionSlow } = useRespectfulMotion();

  return (
    <section id="about" className="section">
      <div className="container container--narrow">
        <SectionHeader label="02" title="About" />
        <motion.div
          ref={ref}
          className="about__content"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30 }}
          animate={isInView ? (reduced ? { opacity: 1 } : { opacity: 1, y: 0 }) : {}}
          transition={{ ...transitionSlow, delay: 0.15 }}
        >
          <div className="about__accent-bar" />
          <p className="about__text">{PROFILE.bio}</p>
        </motion.div>
      </div>
    </section>
  );
};
