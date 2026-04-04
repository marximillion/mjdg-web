// Copyright © MJDG 2026
import type { Route } from "./+types/portfolio";
import PageLayout from "../components/PageLayout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Portfolio | LAB<3" },
    { name: "description", content: "Mark De Guzman — Software & Geomatics Engineer" },
  ];
}

const skills = [
  "JavaScript", "TypeScript", "Python", "SQL", "React Native",
  "Node.js", "HTML", "CSS", "PHP", "C++", "Java",
  "Yarn", "Homebrew", "Xcode", "Android Studio", "Watchman",
  "FME", "ArcGIS", "Microsurvey CAD", "Trimble Business Center",
  "SolidWorks", "Microsoft Office Suite", "Matlab",
];

const experience = [
  {
    company: "Homewood Health",
    location: "Calgary, AB",
    role: "DevOps Analyst",
    period: "March 2026 – Present",
    bullets: [
      "Supporting the full SDLC by coordinating tasks and tracking defects in JIRA through Kanban-based Agile workflows",
      "Performing backend testing and build deployment using bash, curl, scp, and Transmit; identifying and resolving defects at system and user acceptance testing stages",
      "Collaborating with senior developers and QA analysts to reproduce, root-cause, and resolve code defects across all testing levels",
      "Maintaining automated test suites covering Build Acceptance and Smoke testing for web and mobile apps",
    ],
  },
  {
    company: "Homewood Health",
    location: "Calgary, AB",
    role: "Junior Mobile Developer",
    period: "March 2024 – March 2026",
    bullets: [
      "Contributed across the full technical stack, building and iterating on UI components and features in React Native (TypeScript) for iOS and Android",
      "Modelled and integrated RESTful API endpoints, participating in technical planning sessions and providing input on architecture and implementation approaches",
      "Produced flow diagrams and contributed to feature design planning to align engineering and product requirements",
      "Managed the development environment toolchain using Yarn, Node.js, Homebrew, Watchman, Xcode, and Android Studio",
      "Built and maintained automated test suites with 1000+ test cases covering Build Acceptance and Smoke testing for web and mobile apps",
      "Contributed to first-submission App Store and Google Play approvals for the Sentio app",
    ],
  },
  {
    company: "Stantec",
    location: "Calgary, AB",
    role: "Geomatics Engineer In Training",
    period: "June 2023 – Present",
    bullets: [
      "Worked in a multi-disciplinary team environment, managing competing priorities across field and office deliverables",
      "Contributed to technical planning for the Springbank Off-Stream Reservoir project, including quality assurance, as-built surveys, structural monitoring, and UAV drone flights",
      "Supported urban land engineering with construction layout for rough grading, underground construction, and utilities across multiple active communities",
      "Out-of-town projects: wind farm (Halkirk, AB), landfill boundary survey (Iqaluit, NU), utility locates (Sault Ste. Marie, ON), contaminated area remediation (MacDowell Lake, ON)",
    ],
  },
  {
    company: "McElhanney",
    location: "Lloydminster, AB",
    role: "Jr. Crew Chief / Survey Assistant",
    period: "May 2022 – Aug. 2022",
    bullets: [
      "Managed a field crew and coordinated day-to-day survey operations including planning, equipment use, and data verification",
      "Post-processed field data using Microsurvey CAD and Trimble Business Center; prepared safety and quality procedure plans (SQP) in collaboration with client supervisors",
    ],
  },
];

const projects = [
  {
    name: "Capstone Design Project",
    org: "Stantec",
    period: "September 2022 – May 2023",
    bullets: [
      "Led a team of 4 to build an automated pipeline failure impact estimation system using ArcGIS, FME, and Python — covering data collection, integration, visualization, and cost estimation",
      "Delivered the full solution across the entire SDLC: requirements gathering, system design, implementation, and final presentation to stakeholders",
    ],
  },
  {
    name: "AWS DeepRacer Club",
    org: "University of Calgary",
    period: "September 2022 – May 2023",
    bullets: [
      "Developed reinforcement learning models in Python and ran simulations on AWS for an autonomous race car — applying ML concepts in an iterative, results-driven environment",
    ],
  },
];

const certifications = [
  { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", expiry: "December 2028" },
  { name: "Standard First Aid (CSA Intermediate)", issuer: "St. John Ambulance", expiry: "April 2022" },
  { name: "H2S Alive", issuer: "", expiry: "May 2022" },
  { name: "ATV Training Course", issuer: "Canada Safety Council", expiry: "May 2022" },
  { name: "WHMIS", issuer: "", expiry: "May 2022" },
  { name: "Supervising Ground Disturbance 201", issuer: "", expiry: "April 2022" },
  { name: "Transportation of Dangerous Goods by Ground", issuer: "", expiry: "April 2022" },
  { name: "Common Safety Orientation", issuer: "Energy Safety Canada", expiry: "April 2022" },
  { name: "Full Class 5 Driver's License (non-GDL)", issuer: "", expiry: "October 2020" },
];

export default function Portfolio() {
  return (
    <PageLayout>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "2rem 1rem" }}>

        {/* Header */}
        <header style={{ marginBottom: "2rem", borderBottom: "2px solid var(--purple)", paddingBottom: "1.5rem" }}>
          <h1 style={{ marginBottom: "0.25rem" }}>Mark De Guzman</h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", paddingLeft: "0.75rem" }}>
            {[
              { label: "(587) 224-2306", href: "tel:5872242306" },
              { label: "mark.deguzman960@gmail.com", href: "mailto:mark.deguzman960@gmail.com" },
              { label: "linkedin.com/in/mark-de-guzman", href: "https://linkedin.com/in/mark-de-guzman" },
              { label: "Calgary, AB", href: null },
            ].map(({ label, href }) =>
              href ? (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{ color: "var(--cyan)", fontSize: "0.9rem", textDecoration: "none" }}
                >
                  {label}
                </a>
              ) : (
                <span key={label} style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{label}</span>
              )
            )}
          </div>
        </header>

        {/* Profile */}
        <Section title="Profile">
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 0 0.4rem 0" }}>
              Software Skills
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", paddingLeft: "0.75rem" }}>
              {skills.map((skill) => (
                <span key={skill} style={{
                  background: "rgba(159,0,255,0.15)",
                  border: "1px solid var(--purple)",
                  borderRadius: "0.4rem",
                  color: "var(--text-primary)",
                  fontSize: "0.8rem",
                  padding: "0.2rem 0.6rem",
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <BulletList items={[
            "Full-stack contributor with experience across the entire software development lifecycle, from ideation through to release and production monitoring",
            "Hands-on experience with Agile/Kanban workflows, sprint planning, and iterative delivery in fast-paced environments",
            "Strong debugging and root-cause analysis skills across frontend, backend, and mobile platforms",
            "Experience writing and maintaining unit, smoke, build acceptance, and end-to-end test suites",
            "Familiar with DevOps concepts including CI/CD pipelines, automated testing, and build deployment",
            "Intellectually curious and results-driven; thrives in ambiguous, high-growth environments",
          ]} />
        </Section>

        {/* Education */}
        <Section title="Education">
          <div style={{ paddingLeft: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>University of Calgary — Calgary, AB</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Graduation: May 2023</span>
            </div>
            <p style={{ color: "var(--crt-green)", margin: "0 0 0.25rem 0", padding: 0 }}>
              Bachelor of Science in Geomatics Engineering &nbsp;
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>· GPA 3.2</span>
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", padding: 0, margin: 0 }}>
              <strong style={{ color: "var(--text-muted)" }}>Relevant Coursework:</strong>{" "}
              Environmental Modelling, Estimation and Statistical Testing, Engineering Entrepreneurship,
              GIS Design and Implementation, Database Management, Data Analysis, Automation,
              Spectral Analysis, Wireless Location, Satellite Positioning
            </p>
          </div>
        </Section>

        {/* Work Experience */}
        <Section title="Work Experience">
          {experience.map((job) => (
            <div key={job.role + job.period} style={{ marginBottom: "1.5rem", paddingLeft: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                  {job.company} &mdash; {job.location}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{job.period}</span>
              </div>
              <p style={{ color: "var(--neon-pink)", padding: "0.1rem 0 0.4rem 0", margin: 0, fontWeight: 600 }}>
                {job.role}
              </p>
              <BulletList items={job.bullets} />
            </div>
          ))}
        </Section>

        {/* Projects */}
        <Section title="Projects & Technical Clubs">
          {projects.map((proj) => (
            <div key={proj.name} style={{ marginBottom: "1.5rem", paddingLeft: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                  {proj.name} &mdash; {proj.org}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{proj.period}</span>
              </div>
              <BulletList items={proj.bullets} />
            </div>
          ))}
        </Section>

        {/* Certifications */}
        <Section title="Certifications">
          <div style={{ paddingLeft: "0.75rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {certifications.map((cert) => (
              <div key={cert.name} style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <span style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>
                  {cert.name}
                  {cert.issuer && <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}> · {cert.issuer}</span>}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{cert.expiry}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Extracurricular */}
        <Section title="Extracurricular">
          <BulletList items={[
            "Geomatics Engineering Student Society (2019, 2022)",
            "McElhanney Student Representative (2022)",
            "Intramural dodgeball team (2022)",
            "University of Calgary Filipino Students Association (2022)",
            "South Calgary Basketball Club (2017)",
          ]} />
        </Section>

      </div>
    </PageLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "2rem" }}>
      <h2 style={{
        fontFamily: "'Black Ops One', sans-serif",
        fontSize: "1.1rem",
        color: "var(--cyan)",
        borderBottom: "1px solid rgba(0,229,255,0.3)",
        paddingBottom: "0.35rem",
        marginBottom: "0.75rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
      {items.map((item) => (
        <li key={item} style={{
          color: "var(--text-primary)",
          fontSize: "0.9rem",
          lineHeight: "1.6",
          marginBottom: "0.3rem",
          listStyleType: "none",
          position: "relative",
          paddingLeft: "1rem",
        }}>
          <span style={{ position: "absolute", left: 0, color: "var(--crt-green)" }}>›</span>
          {item}
        </li>
      ))}
    </ul>
  );
}
