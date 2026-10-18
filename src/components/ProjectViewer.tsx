import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { useRespectfulMotion } from '../motion';
import type { ProjectImage } from '../data/gallery';
import './ProjectViewer.css';

interface ProjectViewerProps {
  title: string;
  images: ProjectImage[];
  index: number;
  layoutId?: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Shared-element project gallery viewer — the card cover zooms fluidly into
 * this surface (same layoutId), exits reverse the same path (§7).
 */
export const ProjectViewer = ({ title, images, index, layoutId, onClose, onNavigate }: ProjectViewerProps) => {
  const { reduced, transitionSlow, fade } = useRespectfulMotion();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<Element | null>(null);

  const prev = useCallback(() => onNavigate((index - 1 + images.length) % images.length), [index, images.length, onNavigate]);
  const next = useCallback(() => onNavigate((index + 1) % images.length), [index, images.length, onNavigate]);

  // Scroll lock + focus + keyboard
  useEffect(() => {
    openerRef.current = document.activeElement;
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        prev();
      } else if (e.key === 'ArrowRight') {
        next();
      } else if (e.key === 'Tab' && closeRef.current) {
        // Small trap: keep focus cycling between prev / close / next
        const focusables = closeRef.current.closest('.project-viewer')?.querySelectorAll('button');
        if (!focusables || focusables.length === 0) return;
        const arr = Array.from(focusables);
        if (e.shiftKey && document.activeElement === arr[0]) {
          e.preventDefault();
          arr[arr.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === arr[arr.length - 1]) {
          e.preventDefault();
          arr[0].focus();
        }
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = overflow;
      (openerRef.current as HTMLElement | null)?.focus?.();
    };
  }, [index, next, prev, onClose]);

  const current = images[index];
  if (!current) return null;

  return (
    <motion.div
      className="project-viewer__scrim"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={fade}
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        className="project-viewer"
        role="dialog"
        aria-modal="true"
        aria-label={`Gallery — ${title}`}
        layoutId={reduced ? undefined : layoutId}
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
        transition={transitionSlow}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="project-viewer__header">
          <div className="project-viewer__meta">
            <Images size={13} aria-hidden />
            <span className="project-viewer__title">{title}</span>
            <span className="project-viewer__count">
              {index + 1} / {images.length}
            </span>
          </div>
          <button ref={closeRef} className="project-viewer__close" onClick={onClose} aria-label="Close gallery">
            <X size={16} />
          </button>
        </header>

        <div className="project-viewer__stage">
          {images.length > 1 && (
            <button
              className="project-viewer__nav project-viewer__nav--prev"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <div className="project-viewer__image-wrap">
            {/* Blurred fill — covers leftover space for any photo ratio */}
            <motion.div
              key={`bd-${current.src}`}
              className="project-viewer__backdrop"
              style={{ backgroundImage: `url(${current.src})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fade}
              aria-hidden
            />
            <AnimatePresence mode="wait">
              <motion.img
                key={current.src}
                src={current.src}
                alt={current.caption}
                draggable={false}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fade}
              />
            </AnimatePresence>
          </div>

          {images.length > 1 && (
            <button
              className="project-viewer__nav project-viewer__nav--next"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        <footer className="project-viewer__footer">
          <motion.p
            key={current.caption}
            initial={{ opacity: 0, y: reduced ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={fade}
          >
            {current.caption}
          </motion.p>
        </footer>
      </motion.div>
    </motion.div>
  );
};
