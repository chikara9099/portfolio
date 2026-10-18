import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Trophy, Images } from 'lucide-react';
import { PROJECTS } from '../data/content';
import type { Project } from '../data/content';
import { PROJECT_GALLERY } from '../data/gallery';
import { SectionHeader } from './SectionHeader';
import { SpotlightCard } from './SpotlightCard';
import { ProjectViewer } from './ProjectViewer';
import { playBlip } from '../utils/sound';
import { useRespectfulMotion } from '../motion';
import './Projects.css';
import './SectionHeader.css';

interface ProjectRowProps {
  project: Project;
  index: number;
  onOpenGallery: (id: string) => void;
}

/**
 * Full-width feature row: large screenshot on one side, content on the
 * other, alternating. The champion row carries the accent spotlight.
 */
const ProjectRow = ({ project, index, onOpenGallery }: ProjectRowProps) => {
  const { reduced, transitionSlow } = useRespectfulMotion();
  const gallery = PROJECT_GALLERY[project.id];
  const cover = gallery?.[0];
  const isSpotlight = Boolean(project.achievement?.includes('Champion'));
  const reversed = index % 2 === 1;

  return (
    <SpotlightCard
      className={`project-row ${reversed ? 'project-row--reversed' : ''} ${isSpotlight ? 'project-row--spotlight' : ''}`}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={transitionSlow}
    >
      {/* Screenshot — shared element into the viewer */}
      {gallery && cover && (
        <motion.button
          layoutId={`project-shot-${project.id}`}
          className="project-row__media"
          onClick={() => {
            playBlip(1400);
            onOpenGallery(project.id);
          }}
          whileTap={{ scale: 0.985 }}
          aria-label={`Open gallery — ${project.title} (${gallery.length} screenshots)`}
        >
          <span
            className="project-row__media-bg"
            style={{ backgroundImage: `url(${cover.src})` }}
            aria-hidden
          />
          <img src={cover.src} alt={cover.caption} loading="lazy" draggable={false} />
          <span className="project-row__media-count">
            <Images size={11} aria-hidden />
            {gallery.length}
          </span>
        </motion.button>
      )}

      {/* Content */}
      <div className="project-row__body">
        <div className="project-row__head">
          {project.achievement && (
            <span className="project-row__badge">
              <Trophy size={13} />
              {project.achievement}
            </span>
          )}
          {isSpotlight && (
            <span className="project-row__flag" aria-hidden>
              Spotlight
            </span>
          )}
        </div>

        <h3 className="project-row__title">{project.title}</h3>
        <p className="project-row__desc">{project.description}</p>

        <div className="project-row__tech">
          {project.tech.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>

        <div className="project-row__links">
          {project.github && project.github !== '#' && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="project-row__link"
              aria-label={`GitHub repo for ${project.title}`}
              onClick={() => playBlip(1600)}
            >
              <Github size={16} />
              <span>Source</span>
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="project-row__link project-row__link--live"
              aria-label={`Live demo of ${project.title}`}
              onClick={() => playBlip(1800)}
            >
              <ExternalLink size={16} />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
};

export const Projects = () => {
  const [viewer, setViewer] = useState<{ id: string; index: number } | null>(null);

  const openGallery = (id: string) => setViewer({ id, index: 0 });

  const viewerProject = viewer ? PROJECTS.find((p) => p.id === viewer.id) : null;
  const viewerImages = viewerProject ? PROJECT_GALLERY[viewerProject.id] : null;

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeader label="01" title="Projects & Achievements" />

        <div className="projects-rows">
          {PROJECTS.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={index}
              onOpenGallery={openGallery}
            />
          ))}
        </div>
      </div>

      {/* Shared-element zoom: screenshot → gallery viewer */}
      <AnimatePresence>
        {viewerProject && viewerImages && viewer && (
          <ProjectViewer
            key={viewerProject.id}
            title={viewerProject.title}
            images={viewerImages}
            index={viewer.index}
            layoutId={`project-shot-${viewerProject.id}`}
            onClose={() => setViewer(null)}
            onNavigate={(index) => setViewer({ id: viewerProject.id, index })}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
