import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { SKILLS } from '../data/content';
import { SectionHeader } from './SectionHeader';
import { SpotlightCard } from './SpotlightCard';
import { useRespectfulMotion } from '../motion';
import './Skills.css';
import './SectionHeader.css';

export const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const { reduced, spring } = useRespectfulMotion();

  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeader label="04" title="Technical Skills" />
        <div ref={ref} className="skills-grid">
          {SKILLS.map((category, catIndex) => (
            <motion.div
              key={category.label}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={isInView ? (reduced ? { opacity: 1 } : { opacity: 1, y: 0 }) : {}}
              transition={{ ...spring, delay: catIndex * 0.08 }}
            >
              <SpotlightCard className="skills-category-spotlight">
                <div className="skills-category__inner">
                  <h3 className="skills-category__label">{category.label}</h3>
                  <div className="skills-category__tags">
                    {category.skills.map((skill) => (
                      <span key={skill} className="tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
