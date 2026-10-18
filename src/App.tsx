import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Education } from './components/Education';
import { LeadershipResearch } from './components/LeadershipResearch';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { KonamiCode } from './components/KonamiCode';
import { ToastProvider } from './components/Toast';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <div className="app">
        {/* Skip link — first tab stop for keyboard users */}
        <a href="#main-content" className="skip-link">Skip to content</a>

        {/* Scroll Progress Telemetry Bar */}
        <ScrollProgress />

        {/* Main Page Layout — Zen Spotlight: quiet stage, evidence leads */}
        <div className="main-content" id="main-content">
          <Navbar />
          <Hero />
          <Projects />
          <About />
          <Skills />
          <Education />
          <LeadershipResearch />
          <Contact />

          {/* Wayfinding: mini-nav + status + back to top */}
          <Footer />
        </div>

        {/* Secret Konami Code Easter Egg (↑ ↑ ↓ ↓ ← → ← → B A) */}
        <KonamiCode />
      </div>
    </ToastProvider>
  );
}

export default App;
