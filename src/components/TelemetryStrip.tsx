import { motion } from 'framer-motion';
import { Trophy, GraduationCap, Building2, Rocket } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { useRespectfulMotion } from '../motion';
import './TelemetryStrip.css';

const STATS = [
  {
    icon: GraduationCap,
    value: '3.97',
    label: 'Undergraduate CGPA',
    sub: 'B.Sc. in CSE, BUET (Scale of 4.00)',
  },
  {
    icon: Building2,
    value: '180+',
    label: 'Units in Production',
    sub: 'BADHAN digital reporting system',
  },
  {
    icon: Trophy,
    value: 'Champion',
    label: 'IUT 12th ICT Fest',
    sub: 'AgriSense Agentic AI (2026)',
  },
  {
    icon: Rocket,
    value: 'National',
    label: 'NASA Space Apps',
    sub: 'Selection · Dheu Ocean Watch (2025)',
  },
];

export const TelemetryStrip = () => {
  const { reduced, spring } = useRespectfulMotion();

  return (
    <div className="telemetry-wrapper container">
      <div className="telemetry-grid">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ ...spring, delay: i * 0.08 }}
            >
              <SpotlightCard className="telemetry-card">
                <div className="telemetry-card__inner">
                  <div className="telemetry-card__header">
                    <div className="telemetry-card__icon-wrap">
                      <Icon size={16} className="telemetry-card__icon" />
                    </div>
                    <span className="telemetry-card__pulse-dot" />
                  </div>
                  <div className="telemetry-card__value">{stat.value}</div>
                  <div className="telemetry-card__label">{stat.label}</div>
                  <div className="telemetry-card__sub">{stat.sub}</div>
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
