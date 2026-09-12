// Copyright © MJMDG 2026
import type { Route } from "./+types/portfolio";
import PageLayout from "../components/PageLayout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Portfolio | Mark De Guzman" },
    { name: "description", content: "Full-stack developer and geomatics engineer — building production systems end to end." },
  ];
}

// ── Data ─────────────────────────────────────────────────────────────────────

const projects = [
  {
    id: "mjmdg",
    eyebrow: "MJMDG",
    title: "MJMDG Platform",
    desc: "Full-stack SSR web platform designed, built, and operated end to end — from database schema to production EC2 deployment.",
    tags: ["React Router 7", "TypeScript", "PostgreSQL", "AWS"],
    img: null, // DEPENDENCY: screenshot of mjmdg.org hero
    imgAlt: "MJMDG Platform screenshot",
  },
  {
    id: "pipeline",
    eyebrow: "Stantec · Capstone",
    title: "Pipeline Impact Estimator",
    desc: "Automated pipeline failure impact estimation system covering data collection, integration, visualization, and cost analysis.",
    tags: ["Python", "FME", "ArcGIS"],
    img: null, // DEPENDENCY: capstone project screenshot or diagram
    imgAlt: "Pipeline Impact Estimator screenshot",
  },
  {
    id: "deepracer",
    eyebrow: "University of Calgary",
    title: "AWS DeepRacer",
    desc: "Reinforcement learning models for an autonomous race car — iterative model training and simulation on AWS.",
    tags: ["Python", "AWS", "ML"],
    img: null, // DEPENDENCY: DeepRacer screenshot or simulation visual
    imgAlt: "AWS DeepRacer screenshot",
  },
];

const techStack = [
  {
    label: "Frontend",
    items: ["React", "React Native", "TypeScript", "JavaScript", "TailwindCSS", "HTML / CSS"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Python", "PostgreSQL", "PHP", "SQL"],
  },
  {
    label: "Tools & Cloud",
    items: ["AWS EC2", "nginx", "PM2", "Git", "Playwright", "Appium"],
  },
  {
    label: "Other",
    items: ["JIRA", "Xcode", "Android Studio", "FME", "ArcGIS", "MATLAB"],
  },
];

const experience = [
  {
    year: "2022",
    company: "McElhanney",
    role: "Jr. Crew Chief",
    period: "May – Aug 2022",
    bullets: [
      "Managed field crew and survey operations",
      "Post-processed data in Microsurvey CAD + TBC",
    ],
    active: false,
  },
  {
    year: "2023",
    company: "Stantec",
    role: "Geomatics EIT",
    period: "Jun 2023 – Mar 2024",
    bullets: [
      "Springbank Off-Stream Reservoir — QA, as-built, UAV",
      "Urban land engineering across active communities",
      "Out-of-town: wind farm, landfill survey, remediation",
    ],
    active: false,
  },
  {
    year: "2024",
    company: "Homewood Health",
    role: "Jr. Mobile Developer",
    period: "Mar 2024 – Mar 2026",
    bullets: [
      "React Native (TypeScript) — iOS and Android",
      "1000+ automated test cases (BAT + Smoke)",
      "First-submission App Store + Play Store approvals",
    ],
    active: false,
  },
  {
    year: "2026",
    company: "Homewood Health",
    role: "DevOps Analyst",
    period: "Mar 2026 – Now",
    bullets: [
      "Full SDLC support via Agile/Kanban in JIRA",
      "Backend testing + build deployment (bash, curl, scp)",
      "Defect triage across system and UAT stages",
    ],
    active: true,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Portfolio() {
  return (
    <PageLayout>
      <div className="pf2-page">

        {/* ── Hero ── */}
        <section className="pf2-hero">
          <div className="pf2-hero-left">
            <h1 className="pf2-headline">
              I BUILD SOFTWARE.<br />
              I SOLVE PROBLEMS.<br />
              <span className="pf2-headline-accent">I LIKE FIGURING<br />THINGS OUT.</span>
            </h1>
            <p className="pf2-hero-sub">
              Full-stack developer with a passion for creating practical solutions,
              building production systems, and exploring what's possible.
            </p>
            <div className="pf2-cta-row">
              <a href="#work" className="pf2-btn-primary">
                Explore my work
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
              <a href="#" className="pf2-btn-ghost">About me</a>
              {/* DEPENDENCY: link to hosted resume PDF or /resume route */}
              <a href="#" className="pf2-btn-resume">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Resume
              </a>
            </div>
            <div className="pf2-terminal-hint">
              <span>&gt; npm run explore</span>
              <span className="pf2-terminal-cursor" />
            </div>
          </div>

          <div className="pf2-hero-right">
            {/* Code card */}
            <div className="pf2-code-card">
              <div className="pf2-code-card-bar">
                <span className="pf2-dot pf2-dot-red" />
                <span className="pf2-dot pf2-dot-gold" />
                <span className="pf2-dot pf2-dot-green" />
              </div>
              <div className="pf2-code-body">
                <div><span className="pf2-code-key">const</span> <span className="pf2-code-fn">mark</span> = {"{"}</div>
                <div>&nbsp;&nbsp;<span className="pf2-code-key">build</span>: [</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="pf2-code-str">"web platforms"</span>,</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="pf2-code-str">"production systems"</span>,</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="pf2-code-str">"automation suites"</span>,</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="pf2-code-str">"the next project"</span>,</div>
                <div>&nbsp;&nbsp;],</div>
                <div>{"}"}</div>
                <br />
                <div><span className="pf2-code-fn">mark</span>.<span className="pf2-code-fn">build</span>.forEach(<span className="pf2-code-fn">build</span>);</div>
                <br />
                <div><span className="pf2-code-comment">// keep going...</span></div>
              </div>
            </div>

            {/* Status widget */}
            <div className="pf2-status-card">
              <div className="pf2-status-header">
                <span>System</span>
                <span className="pf2-status-online">
                  <span className="pf2-status-dot" />
                  mjmdg.org
                </span>
              </div>
              {[
                { label: "CPU", value: "12%", fill: 12 },
                { label: "RAM", value: "39%", fill: 39 },
                { label: "Disk", value: "68%", fill: 68 },
              ].map(({ label, value, fill }) => (
                <div key={label} className="pf2-status-row">
                  <span>{label}</span>
                  <div className="pf2-status-bar-track">
                    <div className="pf2-status-bar-fill" style={{ width: `${fill}%` }} />
                  </div>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Selected Work ── */}
        <section className="pf2-section" id="work">
          <div className="pf2-section-header">
            <div className="pf2-section-label">
              <span>Selected Work</span>
              <div className="pf2-section-rule" />
            </div>
            <a href="#" className="pf2-section-link">
              View all projects
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
          </div>

          <div className="pf2-projects-grid">
            {projects.map((p) => (
              <div key={p.id} className="pf2-project-card">
                {p.img ? (
                  <img src={p.img} alt={p.imgAlt} className="pf2-project-img" />
                ) : (
                  <div className="pf2-project-img-placeholder">
                    <span>[ {p.imgAlt} ]</span>
                  </div>
                )}
                <div className="pf2-project-body">
                  <div className="pf2-project-eyebrow">{p.eyebrow}</div>
                  <div className="pf2-project-title">{p.title}</div>
                  <p className="pf2-project-desc">{p.desc}</p>
                  <div className="pf2-project-footer">
                    <div className="pf2-tag-row">
                      {p.tags.map((t) => <span key={t} className="pf2-tag">{t}</span>)}
                    </div>
                    <div className="pf2-project-arrow">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tech Stack ── */}
        <section className="pf2-section">
          <div className="pf2-section-header">
            <div className="pf2-section-label">
              <span>Tech Stack</span>
              <div className="pf2-section-rule" />
            </div>
          </div>

          <div className="pf2-tech-grid">
            {techStack.map((cat) => (
              <div key={cat.label} className="pf2-tech-category">
                <div className="pf2-tech-cat-label">{cat.label}</div>
                <div className="pf2-tech-list">
                  {cat.items.map((item) => (
                    <div key={item} className="pf2-tech-item">
                      <div className="pf2-tech-icon">
                        {item.slice(0, 2).toUpperCase()}
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Experience ── */}
        <section className="pf2-section">
          <div className="pf2-section-header">
            <div className="pf2-section-label">
              <span>Experience</span>
              <div className="pf2-section-rule" />
            </div>
          </div>

          <div className="pf2-timeline-track">
            <div className="pf2-timeline-line" />
            <div className="pf2-timeline-years">
              {experience.map((e) => (
                <div key={e.year} className={`pf2-timeline-year${e.active ? " active" : ""}`}>
                  {e.year}
                </div>
              ))}
              <div className="pf2-timeline-year active">NOW</div>
            </div>
            <div className="pf2-timeline-cards">
              {experience.map((e) => (
                <div key={e.id ?? e.company + e.role} className="pf2-exp-card">
                  <div className="pf2-exp-company">{e.company}</div>
                  <div className="pf2-exp-role">{e.role}</div>
                  <div className="pf2-exp-period">{e.period}</div>
                  <ul className="pf2-exp-bullets">
                    {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section className="pf2-section" id="about">
          <div className="pf2-section-header">
            <div className="pf2-section-label">
              <span>About Me</span>
              <div className="pf2-section-rule" />
            </div>
          </div>

          <div className="pf2-about-grid">
            <div className="pf2-about-img-placeholder">
              {/* DEPENDENCY: personal photo (portrait or landscape) */}
              <span>[ Photo — portrait or landscape ]</span>
            </div>

            <div>
              <div className="pf2-about-eyebrow">More than just a developer</div>
              <h2 className="pf2-about-headline">
                I'm a builder, problem solver,<br />and lifelong learner.
              </h2>
              <p className="pf2-about-bio">
                I enjoy working with technology, finding efficient solutions, and building
                things that make a difference. Whether it's automating a process, developing
                a new feature, or exploring new tools — I'm always curious about what's next.
              </p>

              <div className="pf2-pillars">
                {[
                  { icon: "🔧", label: "Build" },
                  { icon: "💡", label: "Solve" },
                  { icon: "📖", label: "Learn" },
                  { icon: "🧭", label: "Explore" },
                ].map(({ icon, label }) => (
                  <div key={label} className="pf2-pillar">
                    <span className="pf2-pillar-icon">{icon}</span>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="pf2-contact" id="contact">
          <div className="pf2-contact-eyebrow">Let's Connect</div>
          <h2 className="pf2-contact-headline">
            Have a project in mind?<br />Or just want to say hi?
          </h2>
          <div className="pf2-cta-row" style={{ justifyContent: "center" }}>
            <a href="mailto:pro@mjmdg.org" className="pf2-btn-primary">
              Get in touch
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
            {/* DEPENDENCY: link to hosted resume PDF or /resume route */}
            <a href="#" className="pf2-btn-resume">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              View Resume
            </a>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
