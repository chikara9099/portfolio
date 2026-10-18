import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users } from 'lucide-react';
import { LEADERSHIP } from '../data/content';
import { SectionHeader } from './SectionHeader';
import { useRespectfulMotion } from '../motion';
import './Leadership.css';
import './SectionHeader.css';

export const Leadership = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { reduced, transitionSlow } = useRespectfulMotion();

  return (
    <section id="leadership" className="section">
      <div className="container">
        <SectionHeader label="05" title="Leadership & Activities" />
        <motion.div
          ref={ref}
          className="leadership__card"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 25 }}
          animate={isInView ? (reduced ? { opacity: 1 } : { opacity: 1, y: 0 }) : {}}
          transition={{ ...transitionSlow, delay: 0.15 }}
        >
          <div className="leadership__icon-wrap">
            <Users size={22} />
          </div>
          <div className="leadership__info">
            <h3 className="leadership__org">{LEADERSHIP.organization}</h3>
            <p className="leadership__role">{LEADERSHIP.role}</p>
            <p className="leadership__desc">{LEADERSHIP.description}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
