import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, Sparkles } from 'lucide-react';
import { EDUCATION } from '../data/content';
import { SectionHeader } from './SectionHeader';
import { CourseworkModal } from './CourseworkModal';
import { COURSEWORK_DETAILS } from '../data/courseworkDetails';
import type { CourseDetail } from '../data/courseworkDetails';
import { useRespectfulMotion } from '../motion';
import { SpotlightCard } from './SpotlightCard';
import './Education.css';
import './SectionHeader.css';

export const Education = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { reduced, transitionSlow } = useRespectfulMotion();
  const [selectedCourse, setSelectedCourse] = useState<CourseDetail | null>(null);

  const handleCourseClick = (courseName: string) => {
    const detail = COURSEWORK_DETAILS[courseName] || {
      title: courseName,
      focus: "Comprehensive curriculum at the Department of Computer Science & Engineering, BUET.",
      highlights: ["Rigorous theoretical foundations and laboratory sessions"],
      tools: ["BUET CSE"],
    };
    setSelectedCourse(detail);
  };

  return (
    <section id="education" className="section">
      <div className="container">
        <SectionHeader label="04" title="Education" />
        <motion.div
          ref={ref}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 25 }}
          animate={isInView ? (reduced ? { opacity: 1 } : { opacity: 1, y: 0 }) : {}}
          transition={{ ...transitionSlow, delay: 0.15 }}
        >
          <SpotlightCard className="education__spot">
            <div className="education__card">
            <div className="education__header">
              <div className="education__icon-wrap">
                <GraduationCap size={24} />
              </div>
              <div>
                <h3 className="education__institution">{EDUCATION.institution}</h3>
                <p className="education__degree">{EDUCATION.degree}</p>
              </div>
            </div>

            <div className="education__meta">
              <div className="education__meta-item">
                <span className="education__meta-label">CGPA</span>
                <span className="education__meta-value education__cgpa">{EDUCATION.cgpa}</span>
              </div>
              <div className="education__meta-item">
                <MapPin size={14} className="education__meta-icon" />
                <span className="education__meta-value">{EDUCATION.location}</span>
              </div>
              <div className="education__meta-item">
                <Calendar size={14} className="education__meta-icon" />
                <span className="education__meta-value">{EDUCATION.graduation}</span>
              </div>
            </div>

            <div className="education__coursework">
              <div className="education__coursework-header">
                <h4 className="education__coursework-label">Key Coursework</h4>
                <span className="education__coursework-hint">
                  <Sparkles size={11} style={{ display: 'inline', marginRight: '4px', color: 'var(--accent)' }} />
                  Click subject for syllabus &amp; systems built
                </span>
              </div>
              <div className="education__tags">
                {EDUCATION.coursework.map((course) => (
                  <button
                    key={course}
                    className="education__course-btn"
                    onClick={() => handleCourseClick(course)}
                    title={`Inspect ${course} curriculum & lab work`}
                  >
                    <span>{course}</span>
                    <span className="education__course-icon">↗</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          </SpotlightCard>
        </motion.div>
      </div>

      {/* Interactive Coursework Modal */}
      <CourseworkModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </section>
  );
};
