import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { RESEARCH_INTERESTS } from '../data/content';
import { SectionHeader } from './SectionHeader';
import { useRespectfulMotion } from '../motion';
import './Research.css';
import './SectionHeader.css';

export const Research = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const { reduced, spring } = useRespectfulMotion();

  return (
    <section id="research" className="section">
      <div className="container">
        <SectionHeader label="06" title="Research Interests" />
        <div ref={ref} className="research__interests">
          {RESEARCH_INTERESTS.map((interest, i) => (
            <motion.span
              key={interest}
              className="research__item"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              animate={isInView ? (reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }) : {}}
              transition={{ ...spring, delay: i * 0.06 }}
            >
              {interest}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};
