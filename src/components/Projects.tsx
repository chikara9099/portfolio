import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Trophy, Sparkles, Images } from 'lucide-react';
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

type Category = 'all' | 'ai' | 'systems' | 'fullstack';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'ai', label: 'AI & Machine Learning' },
  { id: 'systems', label: 'Systems & Embedded' },
  { id: 'fullstack', label: 'Full-Stack & Production' },
];

function matchesCategory(project: Project, cat: Category): boolean {
  if (cat === 'all') return true;
  const techLower = project.tech.map((t) => t.toLowerCase());
  if (cat === 'ai') {
    return (
      techLower.some((t) => t.includes('ai') || t.includes('openai') || t.includes('gemini') || t.includes('lancedb') || t.includes('groq')) ||
      project.id === 'agrisense' ||
      project.id === 'dheu'
    );
  }
  if (cat === 'systems') {
    return (
      techLower.some((t) => t.includes('atmega') || t.includes('avr') || t.includes('pwm') || t.includes('sensors') || t.includes('embedded')) ||
      project.id === 'companion-buddy'
    );
  }
  if (cat === 'fullstack') {
    return (
      techLower.some((t) => t.includes('docker') || t.includes('express') || t.includes('postgresql') || t.includes('react') || t.includes('supabase')) ||
      project.id === 'badhan' ||
      project.id === 'agrisense'
    );
  }
  return true;
}

const ProjectCard = ({ project, onOpenGallery }: { project: Project; onOpenGallery: (id: string) => void }) => {
  const gallery = PROJECT_GALLERY[project.id];
  const cover = gallery?.[0];

  return (
    <SpotlightCard className="project-card-spotlight">
      <div className="project-card__content">
        {gallery && cover && (
          <motion.button
            layoutId={`project-shot-${project.id}`}
            className="project-card__shot"
            onClick={() => {
              playBlip(1400);
              onOpenGallery(project.id);
            }}
            whileTap={{ scale: 0.985 }}
            aria-label={`Open gallery — ${project.title} (${gallery.length} screenshots)`}
          >
            <span
              className="project-card__shot-bg"
              style={{ backgroundImage: `url(${cover.src})` }}
              aria-hidden
            />
            <img src={cover.src} alt={cover.caption} loading="lazy" draggable={false} />
            <span className="project-card__shot-count">
              <Images size={11} aria-hidden />
              {gallery.length}
            </span>
          </motion.button>
        )}

        {project.achievement && (
          <div className="project-card__badge">
            <Trophy size={13} />
            <span>{project.achievement}</span>
          </div>
        )}

        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.description}</p>

        <div className="project-card__tech">
          {project.tech.map((t) => (
            <span key={t} className="project-card__tag">
              {t}
            </span>
          ))}
        </div>

        <div className="project-card__links">
          {project.github && project.github !== '#' && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="project-card__link"
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
              className="project-card__link project-card__link--live"
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
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [viewer, setViewer] = useState<{ id: string; index: number } | null>(null);
  const { reduced, transition } = useRespectfulMotion();

  const filteredProjects = PROJECTS.filter((p) => matchesCategory(p, activeCategory));

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    playBlip(1300);
  };

  const openGallery = (id: string) => setViewer({ id, index: 0 });

  const viewerProject = viewer ? PROJECTS.find((p) => p.id === viewer.id) : null;
  const viewerImages = viewerProject ? PROJECT_GALLERY[viewerProject.id] : null;

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="projects__header-row">
          <SectionHeader label="03" title="Projects & Achievements" />
          <div className="projects__pulse-tag">
            <Sparkles size={13} className="projects__pulse-icon" />
            <span>{PROJECTS.length} Featured Systems</span>
          </div>
        </div>

        {/* Interactive Filter Pills */}
        <div className="projects__filters" role="tablist" aria-label="Filter projects">
          {CATEGORIES.map((cat) => {
            const count = PROJECTS.filter((p) => matchesCategory(p, cat.id)).length;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                className={`projects__filter-btn ${isActive ? 'projects__filter-btn--active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                <span>{cat.label}</span>
                <span className="projects__filter-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid with springy layout animation */}
        <motion.div layout={reduced ? undefined : true} transition={transition} className="projects-grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout={reduced ? undefined : true}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                transition={transition}
              >
                <ProjectCard project={project} onOpenGallery={openGallery} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Shared-element zoom: card cover → gallery viewer */}
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
