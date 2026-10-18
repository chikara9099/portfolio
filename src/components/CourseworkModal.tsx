import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, CheckCircle, Wrench } from 'lucide-react';
import type { CourseDetail } from '../data/courseworkDetails';
import { playBlip } from '../utils/sound';
import { useRespectfulMotion } from '../motion';
import './CourseworkModal.css';

interface CourseworkModalProps {
  course: CourseDetail | null;
  onClose: () => void;
}

export const CourseworkModal = ({ course, onClose }: CourseworkModalProps) => {
  const { reduced, springSlow, fade } = useRespectfulMotion();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!course) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const isInside = !!document.activeElement && root.contains(document.activeElement);
      if (e.shiftKey && (!isInside || document.activeElement === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (!isInside || document.activeElement === last)) {
        e.preventDefault();
        first.focus();
      }
    };

    playBlip(1500);
    // Remember what opened the modal so focus can be restored on close
    openerRef.current = (document.activeElement as HTMLElement) ?? null;
    document.addEventListener('keydown', handleKeyDown, true);
    document.body.style.overflow = 'hidden';
    // Focus the first focusable element (the close button)
    const focusTimer = window.setTimeout(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    }, 60);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = '';
      openerRef.current?.focus?.();
    };
  }, [course, onClose]);

  return (
    <AnimatePresence>
      {course && (
        <motion.div
          className="coursework-overlay"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={course.code ? `${course.code}: ${course.title}` : course.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fade}
        >
          <motion.div
            ref={dialogRef}
            className="coursework-modal"
            onClick={(e) => e.stopPropagation()}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
            transition={reduced ? fade : springSlow}
          >
            {/* Header */}
            <div className="coursework-modal__header">
              <div className="coursework-modal__title-group">
                {course.code && <span className="coursework-modal__code">{course.code}</span>}
                <h3 className="coursework-modal__title">{course.title}</h3>
              </div>
              <button className="coursework-modal__close-btn" onClick={onClose} aria-label="Close details">
                <X size={16} />
              </button>
            </div>

            {/* Focus description */}
            <div className="coursework-modal__focus">
              <BookOpen size={16} className="coursework-modal__focus-icon" />
              <p>{course.focus}</p>
            </div>

            {/* Highlights */}
            <div className="coursework-modal__section">
              <h4 className="coursework-modal__section-heading">Core Topics &amp; Implementations</h4>
              <ul className="coursework-modal__highlights">
                {course.highlights.map((h, i) => (
                  <li key={i} className="coursework-modal__highlight-item">
                    <CheckCircle size={14} className="coursework-modal__check-icon" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools & Stack */}
            {course.tools && course.tools.length > 0 && (
              <div className="coursework-modal__section">
                <h4 className="coursework-modal__section-heading">
                  <Wrench size={13} style={{ display: 'inline', marginRight: '6px', color: 'var(--accent)' }} />
                  Technologies &amp; Environments
                </h4>
                <div className="coursework-modal__tools">
                  {course.tools.map((t) => (
                    <span key={t} className="coursework-modal__tool-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
