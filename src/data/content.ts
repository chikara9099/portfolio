// ============================================
// PORTFOLIO CONTENT — All data in one place
// ============================================

export interface Project {
  id: string;
  title: string;
  description: string;
  achievement?: string;
  tech: string[];
  github?: string;
  live?: string;
}

export interface SkillCategory {
  label: string;
  skills: string[];
}

export interface Education {
  institution: string;
  degree: string;
  cgpa: string;
  location: string;
  graduation: string;
  coursework: string[];
}

// --- Profile ---
export const PROFILE = {
  name: "Shahriar Alam Patwary",
  tagline: "CSE @ BUET — AI/ML · Systems · Embedded",
  email: "shahriar246d@gmail.com",
  github: "https://github.com/chikara9099",
  linkedin: "https://www.linkedin.com/in/shahriar-alam-patwary-9173b8211/",
  bio: "Third-year CSE undergraduate at BUET interested in AI/ML, systems, embedded systems, research, and technology-driven product development. Experienced in building software and hardware prototypes, developing systems used by real organizations, and working on technical projects in small teams. Interested in transforming research and experimentation into functional prototypes and real-world products.",
};

// --- Education ---
export const EDUCATION: Education = {
  institution: "Bangladesh University of Engineering and Technology (BUET)",
  degree: "B.Sc. in Computer Science and Engineering",
  cgpa: "3.97 / 4.00",
  location: "Dhaka, Bangladesh",
  graduation: "Expected July 2028",
  coursework: [
    "Data Structures & Algorithms",
    "Object-Oriented Programming",
    "Software Engineering",
    "Discrete Mathematics",
    "Calculus",
    "Linear Algebra",
    "Probability & Statistics",
    "Artificial Intelligence",
    "Operating Systems",
    "Compiler",
    "Computer Architecture",
    "Microcontrollers & Embedded Systems",
  ],
};

// --- Projects ---
export const PROJECTS: Project[] = [
  {
    id: "agrisense",
    title: "AgriSense",
    description:
      "Agentic AI platform for agricultural decision support built in a 3-member team. Workflows for crop recommendation, seasonal planning, and financial projections using LLMs, vector search, weather, SMS, voice, and payment services.",
    achievement: "🏆 Champion — IUT 12th ICT Fest 2026",
    tech: ["React", "Node.js", "Express", "Supabase", "LanceDB", "OpenAI", "Gemini", "Groq", "OpenRouter"],
    github: "https://github.com/rayhannn2003/Cive_Voders_AgriSense",
  },
  {
    id: "badhan",
    title: "BADHAN Report Management System",
    description:
      "Digital reporting platform currently used by 180+ BADHAN units nationwide. Built reporting workflows, role-based access, audit logging, bilingual interfaces, automated PDF generation, and deployment infrastructure.",
    achievement: "Production Software — 180+ units nationwide",
    tech: ["React", "Node.js", "Express", "PostgreSQL", "Docker", "Puppeteer"],
    live: "https://rms.badhan.org/",
  },
  {
    id: "companion-buddy",
    title: "Desktop Companion Buddy",
    description:
      "Interactive desktop companion robot using ATmega32 with DC motors, servos, IR cliff detection, ultrasonic obstacle detection, and OLED display. Responsive movement and expressive eye animations via timers, PWM, interrupts, and embedded C.",
    achievement: "CSE 316 — Microcontroller & Microprocessor Sessional",
    tech: ["ATmega32", "AVR C", "PWM", "I2C", "OLED", "Sensors"],
    github: "https://github.com/Project-BOwOt/BOwOt",
  },
  {
    id: "dheu",
    title: "Dheu",
    description:
      "Project using SAR satellite data to observe ocean health. Advanced from local round to national level selection. Built a functional prototype under strict competition constraints.",
    achievement: "NASA Space Apps Challenge 2025 — National Selection",
    tech: ["FastAPI", "Gemini API", "React", "AI/ML"],
    github: "https://github.com/chikara9099/dheu-ocean-watch",
    live: "https://dheu.netlify.app/",
  },
];

// --- Availability status (shown as a pill in Contact) ---
// ✏️ Keep this current — edit this one line when your status changes
export const AVAILABILITY = 'Open to internships & research — Summer 2026';

// --- Technical Skills (4 groups) ---
export const SKILLS: SkillCategory[] = [
  {
    label: "Languages",
    skills: ["C", "C++", "Python", "Java", "JavaScript", "TypeScript", "Bash"],
  },
  {
    label: "AI / ML",
    skills: ["Machine Learning", "LLM APIs", "Agentic AI", "RAG", "Vector Search", "Computer Vision"],
  },
  {
    label: "Systems & Web",
    skills: ["Linux", "xv6", "Operating Systems", "ANTLR4", "Compiler Construction", "React", "Node.js", "Express", "PostgreSQL", "Supabase", "REST APIs"],
  },
  {
    label: "Embedded & Tools",
    skills: ["ATmega32", "AVR C", "Timers", "PWM", "ADC", "Interrupts", "UART", "I2C", "SPI", "Sensors & Actuators", "Git", "GitHub", "Docker", "VS Code", "WSL"],
  },
];

// --- Leadership ---
export const LEADERSHIP = {
  role: "Deputy Head of Media & Outreach Team",
  organization: "BUET Robotics Society",
  description:
    "Involved in organizing robotics competitions, workshops, technical programs, and student initiatives. Contributed to event planning, communications, partnerships, and coordination.",
};

// --- Research Interests ---
export const RESEARCH_INTERESTS: string[] = [
  "AI/ML",
  "AI Systems",
  "Multimodal & Agentic AI",
  "Systems Research",
  "Embedded Intelligence & Robotics",
  "Quantum Computing",
  "Technology Entrepreneurship",
];
