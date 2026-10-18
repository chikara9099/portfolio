import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { useRespectfulMotion } from '../motion';

interface SectionHeaderProps {
  label: string;
  title: string;
  children?: ReactNode;
}

export const SectionHeader = ({ label, title }: SectionHeaderProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { reduced, transition } = useRespectfulMotion();

  return (
    <motion.div
      ref={ref}
      className="section-header"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={isInView ? (reduced ? { opacity: 1 } : { opacity: 1, y: 0 }) : {}}
      transition={transition}
    >
      <span className="section-header__label">{label}</span>
      <h2 className="section-header__title">{title}</h2>
    </motion.div>
  );
};
