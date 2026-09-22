// Copyright © MJMDG 2026
import type { Route } from "./+types/portfolio";
import PageLayout from "../components/PageLayout";
import NetworkScene from "../components/scenes/NetworkScene";
import mjmdgLogoWhite from "../assets/images/logos/v1.0.1.6/white-1.png";
import mjmdgLogoBlack from "../assets/images/logos/v1.0.1.6/black-1.png";
import schulichGeo from "../assets/images/logos/schulich-geo.png";
import deepracerLogo from "../assets/images/logos/UofC-AWS-DeepRacer.png";
import wfcaPdf from "../assets/data/WFCA-Final-Report.pdf";
// import resumePdf from "../assets/data/MarkDeGuzman_Resume-2024.pdf"; // pending finalization
import aboutPhoto from "../assets/images/peeps/mdg-baguio-portfolio.png";

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
    img: null,
    imgWhite: mjmdgLogoWhite,
    imgBlack: mjmdgLogoBlack,
    imgFill: undefined,
    imgAlt: "MJMDG logo",
    href: undefined,
    pdf: null,
  },
  {
    id: "pipeline",
    eyebrow: "Stantec · Capstone",
    title: "Pipeline Weld Failure Consequence Analysis",
    desc: "Automated pipeline failure impact estimation system covering data collection, integration, visualization, and cost analysis.",
    tags: ["Python", "FME", "ArcGIS"],
    img: schulichGeo,
    imgWhite: undefined,
    imgBlack: undefined,
    imgFill: true,
    imgAlt: "Schulich School of Engineering — Geomatics",
    href: undefined,
    pdf: wfcaPdf,
  },
  {
    id: "deepracer",
    eyebrow: "University of Calgary",
    title: "AWS DeepRacer",
    desc: "Reinforcement learning models for an autonomous race car — iterative model training and simulation on AWS.",
    tags: ["Python", "AWS", "ML"],
    img: deepracerLogo,
    imgWhite: undefined,
    imgBlack: undefined,
    imgFill: undefined,
    imgAlt: "AWS DeepRacer League",
    href: "https://deepracer-website.web.app/",
    pdf: null,
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
      <div className="portfolio-wrapper">
        <NetworkScene />
        <div className="portfolio-page">

        {/* ── Hero ── */}
        <section className="portfolio-hero">
          <div className="portfolio-hero-left">
            <h1 className="portfolio-headline">
              I BUILD SOFTWARE.<br />
              I SOLVE PROBLEMS.<br />
              <span className="portfolio-headline-accent">I LIKE FIGURING<br />THINGS OUT.</span>
            </h1>
            <p className="portfolio-hero-sub">
              Full-stack developer with a passion for creating practical solutions,
              building production systems, and exploring what's possible.
            </p>
            <div className="portfolio-cta-row">
              <a
                href="#work"
                className="portfolio-btn-primary"
                onClick={(e) => { e.preventDefault(); document.getElementById("work")?.scrollIntoView({ behavior: "smooth" }); }}
              >
                Explore my work
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
              <a
                href="#about"
                className="portfolio-btn-ghost"
                onClick={(e) => { e.preventDefault(); document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); }}
              >About me</a>
              {/* <a href={resumePdf} download="MarkDeGuzman_Resume-2024.pdf" className="portfolio-btn-resume">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Resume
              </a> */}
            </div>
            <div className="portfolio-terminal-hint">
              <span>&gt; npm run explore</span>
              <span className="portfolio-terminal-cursor" />
            </div>
          </div>

          <div className="portfolio-hero-right">
            {/* Code card */}
            <div className="portfolio-code-card">
              <div className="portfolio-code-card-bar">
                <span className="portfolio-dot portfolio-dot-red" />
                <span className="portfolio-dot portfolio-dot-gold" />
                <span className="portfolio-dot portfolio-dot-green" />
              </div>
              <div className="portfolio-code-body">
                <div><span className="portfolio-code-key">const</span> <span className="portfolio-code-fn">mark</span> = {"{"}</div>
                <div>&nbsp;&nbsp;<span className="portfolio-code-key">build</span>: [</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="portfolio-code-str">"web platforms"</span>,</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="portfolio-code-str">"production systems"</span>,</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="portfolio-code-str">"automation suites"</span>,</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="portfolio-code-str">"the next project"</span>,</div>
                <div>&nbsp;&nbsp;],</div>
                <div>{"}"}</div>
                <br />
                <div><span className="portfolio-code-fn">mark</span>.<span className="portfolio-code-fn">build</span>.forEach(<span className="portfolio-code-fn">build</span>);</div>
                <br />
                <div><span className="portfolio-code-comment">// keep going...</span></div>
              </div>
            </div>

            {/* Status widget */}
            {/* <div className="portfolio-status-card">
              <div className="portfolio-status-header">
                <span>System</span>
                <span className="portfolio-status-online">
                  <span className="portfolio-status-dot" />
                  mjmdg.org
                </span>
              </div>
              {[
                { label: "CPU", value: "12%", fill: 12 },
                { label: "RAM", value: "39%", fill: 39 },
                { label: "Disk", value: "68%", fill: 68 },
              ].map(({ label, value, fill }) => (
                <div key={label} className="portfolio-status-row">
                  <span>{label}</span>
                  <div className="portfolio-status-bar-track">
                    <div className="portfolio-status-bar-fill" style={{ width: `${fill}%` }} />
                  </div>
                  <span>{value}</span>
                </div>
              ))}
            </div> */}
          </div>
        </section>

        {/* ── Selected Work ── */}
        <section className="portfolio-section" id="work">
          <div className="portfolio-section-header">
            <div className="portfolio-section-label">
              <span>Selected Work</span>
              <div className="portfolio-section-rule" />
            </div>
            <a href="/projects" className="portfolio-section-link">
              View all projects
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
          </div>

          <div className="portfolio-projects-grid">
            {projects.map((p) => (
              <div key={p.id} className="portfolio-project-card">
                {p.imgWhite && p.imgBlack ? (
                  <div className="portfolio-project-img--brand">
                    <img src={p.imgWhite} alt={p.imgAlt} className="theme-logo--dark" />
                    <img src={p.imgBlack} alt={p.imgAlt} className="theme-logo--light" />
                    <span className="portfolio-brand-wordmark">MJMDG</span>
                  </div>
                ) : p.img ? (
                  <img src={p.img} alt={p.imgAlt} className={`portfolio-project-img${p.imgFill ? " portfolio-project-img--fill" : ""}`} />
                ) : (
                  <div className="portfolio-project-img-placeholder">
                    <span>[ {p.imgAlt} ]</span>
                  </div>
                )}
                <div className="portfolio-project-body">
                  <div className="portfolio-project-eyebrow">{p.eyebrow}</div>
                  <div className="portfolio-project-title">{p.title}</div>
                  <p className="portfolio-project-desc">{p.desc}</p>
                  <div className="portfolio-project-footer">
                    <div className="portfolio-tag-row">
                      {p.tags.map((t) => <span key={t} className="portfolio-tag">{t}</span>)}
                    </div>
                    {p.pdf ? (
                      <a href={p.pdf} download className="portfolio-project-download">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Report
                      </a>
                    ) : p.href ? (
                      <a href={p.href} target="_blank" rel="noopener noreferrer" className="portfolio-project-arrow">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                      </a>
                    ) : (
                      <div className="portfolio-project-arrow">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tech Stack ── */}
        <section className="portfolio-section">
          <div className="portfolio-section-header">
            <div className="portfolio-section-label">
              <span>Tech Stack</span>
              <div className="portfolio-section-rule" />
            </div>
          </div>

          <div className="portfolio-tech-grid">
            {techStack.map((cat) => (
              <div key={cat.label} className="portfolio-tech-category">
                <div className="portfolio-tech-cat-label">{cat.label}</div>
                <div className="portfolio-tech-list">
                  {cat.items.map((item) => (
                    <div key={item} className="portfolio-tech-item">
                      <div className="portfolio-tech-icon">
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
        <section className="portfolio-section">
          <div className="portfolio-section-header">
            <div className="portfolio-section-label">
              <span>Experience</span>
              <div className="portfolio-section-rule" />
            </div>
          </div>

          <div className="portfolio-timeline-track">
            <div className="portfolio-timeline-line" />
            <div className="portfolio-timeline-years">
              <div className="portfolio-timeline-year active portfolio-timeline-year--now">NOW</div>
              {experience.slice().reverse().map((e) => (
                <div key={e.year} className={`portfolio-timeline-year${e.active ? " active" : ""}`}>
                  {e.year}
                </div>
              ))}
            </div>
            <div className="portfolio-timeline-cards">
              {experience.slice().reverse().map((e) => (
                <div key={e.company + e.role} data-year={e.active ? "NOW" : e.year} className={`portfolio-exp-card${e.active ? " portfolio-exp-card--active" : ""}`}>
                  <div className="portfolio-exp-company">{e.company}</div>
                  <div className="portfolio-exp-role">{e.role}</div>
                  <div className="portfolio-exp-period">{e.period}</div>
                  <ul className="portfolio-exp-bullets">
                    {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section className="portfolio-section" id="about">
          <div className="portfolio-section-header">
            <div className="portfolio-section-label">
              <span>About Me</span>
              <div className="portfolio-section-rule" />
            </div>
          </div>

          <div className="portfolio-about-grid">
            <img src={aboutPhoto} alt="Mark De Guzman" className="portfolio-about-img" />

            <div>
              <div className="portfolio-about-eyebrow">More than just a developer</div>
              <h2 className="portfolio-about-headline">
                I'm a builder, problem solver,<br />and lifelong learner.
              </h2>
              <p className="portfolio-about-bio">
                I enjoy working with technology, finding efficient solutions, and building
                things that make a difference. Whether it's automating a process, developing
                a new feature, or exploring new tools — I'm always curious about what's next.
              </p>

              <a href="/about" className="portfolio-about-link">
                View full story
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="portfolio-contact" id="contact">
          <div className="portfolio-contact-eyebrow">Let's Connect</div>
          <h2 className="portfolio-contact-headline">
            Have a project in mind?<br />Or just want to say hi?
          </h2>
          <div className="portfolio-cta-row" style={{ justifyContent: "center" }}>
            <a href="mailto:pro@mjmdg.org" className="portfolio-btn-primary">
              Get in touch
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
            {/* <a href={resumePdf} download="MarkDeGuzman_Resume-2024.pdf" className="portfolio-btn-resume">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              View Resume
            </a> */}
          </div>
        </section>

        </div>
      </div>
    </PageLayout>
  );
}
