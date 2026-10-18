import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { SKILLS } from '../data/content';
import { SectionHeader } from './SectionHeader';
import { SpotlightCard } from './SpotlightCard';
import { useRespectfulMotion } from '../motion';
import './Skills.css';
import './SectionHeader.css';

/**
 * One quiet elevated panel holding every category — the grid lives inside
 * the panel, and the stagger belongs to the cells, not to separate cards.
 * The panel is a SpotlightCard: cursor spotlight + gentle tilt + lift.
 */
export const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const { reduced, spring } = useRespectfulMotion();

  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeader label="03" title="Technical Skills" />
        <div ref={ref}>
          <SpotlightCard
            className="skills-panel"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 25 }}
            animate={isInView ? (reduced ? { opacity: 1 } : { opacity: 1, y: 0 }) : {}}
            transition={spring}
          >
          <div className="skills-grid">
            {SKILLS.map((category, catIndex) => (
              <motion.div
                key={category.label}
                className="skills-category"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={isInView ? (reduced ? { opacity: 1 } : { opacity: 1, y: 0 }) : {}}
                transition={{ ...spring, delay: catIndex * 0.08 }}
              >
                <h3 className="skills-category__label">{category.label}</h3>
                <div className="skills-category__tags">
                  {category.skills.map((skill) => (
                    <span key={skill} className="tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};
