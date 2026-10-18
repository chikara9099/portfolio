import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users } from 'lucide-react';
import { LEADERSHIP, RESEARCH_INTERESTS } from '../data/content';
import { SectionHeader } from './SectionHeader';
import { useRespectfulMotion } from '../motion';
import { SpotlightCard } from './SpotlightCard';
import './LeadershipResearch.css';
import './SectionHeader.css';

/**
 * Merged section: Leadership (evidence card) on the left, Research interests
 * (chip cloud) on the right. One header instead of two thin sections.
 */
export const LeadershipResearch = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { reduced, transitionSlow, spring } = useRespectfulMotion();

  return (
    <section id="leadership-research" className="section">
      <div className="container">
        <SectionHeader label="05" title="Leadership & Research interests" />
        <div ref={ref} className="leadership-research__grid">
          {/* Leadership card */}
          <SpotlightCard
            className="leadership__card"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 25 }}
            animate={isInView ? (reduced ? { opacity: 1 } : { opacity: 1, y: 0 }) : {}}
            transition={{ ...transitionSlow, delay: reduced ? 0 : 0.1 }}
          >
            <div className="leadership__icon-wrap">
              <Users size={22} />
            </div>
            <div className="leadership__info">
              <h3 className="leadership__org">{LEADERSHIP.organization}</h3>
              <p className="leadership__role">{LEADERSHIP.role}</p>
              <p className="leadership__desc">{LEADERSHIP.description}</p>
            </div>
          </SpotlightCard>

          {/* Research interests chip cloud */}
          <div className="leadership-research__interests">
            {RESEARCH_INTERESTS.map((interest, i) => (
              <motion.span
                key={interest}
                className="research__item"
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                animate={isInView ? (reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }) : {}}
                transition={{ ...spring, delay: reduced ? 0 : i * 0.06 }}
              >
                {interest}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
