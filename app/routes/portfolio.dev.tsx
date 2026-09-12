// Copyright © MJMDG 2026
import { useEffect, useRef } from "react";
import type { Route } from "./+types/portfolio.dev";
import PageLayout from "../components/PageLayout";
import PitLaneScene from "../components/PitLaneScene";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pit Lane Preview | Mark De Guzman" },
    { name: "description", content: "Preview build — a scroll-driven pit-lane hero concept for the MJDG portfolio." },
    { name: "robots", content: "noindex" },
  ];
}

// ── Data ─────────────────────────────────────────────────────────────────────
// Mirrors the platform's actual scorecards (SCORECARD_MJMDG.md, SCORECARD_MJDG_*.md).

const stops = [
  {
    tag: "WEB-01",
    status: "LIVE IN PRODUCTION",
    accent: "var(--brand-red)",
    title: "MJDG Web",
    tagline: "The flagship. Off the lift and out on the road since August.",
    spec: [
      ["FRAME", "React Router 7.9.2 (SSR) · Vite 7.1.7"],
      ["TRIM", "TypeScript 5.9.2 · Tailwind 4.1.13"],
      ["DRIVETRAIN", "PostgreSQL 18 · session auth (bcryptjs)"],
      ["DELIVERED", "EC2 t3.micro, ca-west-1 · SSL A+"],
      ["DYNO SCORE", "6.1 / 10"],
    ],
    cta: { label: "View repo ↗", href: "https://github.com/marximillion/mjdg-web", kind: "solid" as const },
  },
  {
    tag: "QA-02",
    status: "IN THE SHOP",
    accent: "var(--brand-blue)",
    title: "MJDG Automation",
    tagline: "Test rig for the whole platform. Frame's welded, engine's not in yet.",
    spec: [
      ["TOOLING", "Python 3.11+ · pytest"],
      ["COVERAGE", "Playwright (web) · Appium (mobile)"],
      ["BUILT", "Docs only — no directory structure yet"],
      ["DYNO SCORE", "2.8 / 10"],
    ],
    cta: { label: "Not yet public", href: null, kind: "muted" as const },
  },
  {
    tag: "DB-03",
    status: "ON JACK STANDS",
    accent: "var(--text-muted)",
    title: "MJDG DB",
    tagline: "Sitting on jack stands. Nobody's turned a wrench yet.",
    spec: [
      ["ENGINE", "PostgreSQL"],
      ["STATUS", "Repository exists · untouched"],
      ["DYNO SCORE", "1.2 / 10"],
    ],
    cta: { label: "Not yet public", href: null, kind: "muted" as const },
  },
  {
    tag: "ARC-04",
    status: "LIVE · EASTER EGG",
    accent: "var(--brand-gold)",
    title: "Flappy Me",
    tagline: "A pigeon, some pipes, and nowhere near as easy as it looks. Hidden inside the flagship.",
    spec: [
      ["TYPE", "Browser mini-game · /game-flappy-bird"],
      ["BUILT WITH", "Same stack as WEB-01 · no separate deploy"],
      ["STATUS", "Live at mjmdg.org"],
    ],
    cta: { label: "Visit site ↗", href: "https://mjmdg.org", kind: "outline" as const },
  },
];

export default function PortfolioDev() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const stopEls = track.querySelectorAll<HTMLElement>("[data-stop]");
    if (!("IntersectionObserver" in window)) {
      stopEls.forEach((el) => el.classList.add("is-active"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.target.classList.toggle("is-active", entry.isIntersecting));
      },
      { threshold: 0.5 }
    );
    stopEls.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <PageLayout>
      <div className="pitlane-page">
        <div className="pitlane-fallback" />
        <PitLaneScene />
        <div className="pitlane-scrim" />

        <div className="pitlane-track" data-pitlane-track ref={trackRef}>
          <section className="pitlane-hero">
            <div className="pitlane-eyebrow">MJDG PLATFORM — BUILD SHEET</div>
            <h1 className="pitlane-h1">
              Pit lane.
              <br />
              Four on the lift.
            </h1>
            <p className="pitlane-sub">
              Every build gets its own bay before it goes out the door. Scroll down the line to see
              what's road-ready, what's still on jack stands, and what's just a parts list.
            </p>
            <div className="pitlane-scroll-cue">SCROLL</div>
          </section>

          {stops.map((s, i) => (
            <section
              key={s.tag}
              className={`pitlane-stop pitlane-stop--${i % 2 === 0 ? "left" : "right"}`}
              data-stop
            >
              <div className="pitlane-panel" style={{ ["--accent" as string]: s.accent }}>
                <div className="pitlane-tag-row">
                  <span className="pitlane-chassis-tag">{s.tag}</span>
                  <span className="pitlane-status-pill">{s.status}</span>
                </div>
                <h2 className="pitlane-panel-title">{s.title}</h2>
                <p className="pitlane-tagline">{s.tagline}</p>
                <div className="pitlane-spec">
                  {s.spec.map(([label, value]) => (
                    <div key={label} className="pitlane-spec-row">
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
                {s.cta.href ? (
                  <a
                    className={`pitlane-cta pitlane-cta--${s.cta.kind}`}
                    href={s.cta.href}
                    target="_blank"
                    rel="noopener"
                  >
                    {s.cta.label}
                  </a>
                ) : (
                  <span className="pitlane-cta pitlane-cta--muted">{s.cta.label}</span>
                )}
              </div>
            </section>
          ))}

          <section className="pitlane-closing">
            <div className="pitlane-eyebrow">END OF THE LINE</div>
            <h2 className="pitlane-closing-h2">That's the shop, for now.</h2>
            <p className="pitlane-closing-p">
              QA-02 and DB-03 go up on the lift once CI/CD ships. Windows co-development opens the
              same day — a second set of hands, same pit lane.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
