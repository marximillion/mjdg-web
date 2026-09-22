// Copyright © MJMDG 2026
import type { Route } from "./+types/about";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import PageLayout from "~/components/PageLayout";
import { getUserFromSession } from "~/db/session.server";
import baldPhoto from "~/assets/images/peeps/mdg-bald.jpg";
import baguioPhoto from "~/assets/images/peeps/mdg-baguio-portfolio.png";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About | Mark De Guzman" },
    { name: "description", content: "Personal page — Mark De Guzman. DevOps Analyst, builder, petrolhead, based in Calgary." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserFromSession(request);
  return { isAuthenticated: !!userId };
}

const NAV_SECTIONS = [
  { label: "Story", id: "story" },
  { label: "Moments", id: "moments" },
  { label: "Places", id: "places" },
  { label: "Now", id: "now" },
];

export default function About({ loaderData }: Route.ComponentProps) {
  const [activeSection, setActiveSection] = useState("story");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PageLayout isAuthenticated={loaderData.isAuthenticated}>
      <div className="about-page">

        {/* ── Sticky section nav ── */}
        <nav className="about-section-nav">
          <div className="about-section-nav-inner">
            {NAV_SECTIONS.map(({ label, id }) => (
              <button
                key={id}
                className={`about-snav-item${activeSection === id ? " active" : ""}`}
                onClick={() => scrollTo(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

        {/* ── Profile header ── */}
        <header className="about-profile">
          <div className="about-avatar-wrap">
            <img src={baldPhoto} alt="Mark De Guzman" className="about-avatar" />
          </div>
          <div className="about-profile-info">
            <div className="about-username-row">
              <h1 className="about-username">mjmdg</h1>
            </div>
            <div className="about-stats-row">
              <div className="about-stat">
                <span className="about-stat-num">—</span>
                <span className="about-stat-label">posts</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">[City]</span>
                <span className="about-stat-label">based</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">[Year]</span>
                <span className="about-stat-label">vintage</span>
              </div>
            </div>
            <div className="about-bio">
              <strong>[Name]</strong><br />
              [Title] · [Tag] · [Tag]<br />
              [City, Province] &nbsp;·&nbsp; [Origin] 🇵🇭
            </div>
            <Link to="/portfolio" className="about-portfolio-link">Back to portfolio</Link>
          </div>
        </header>

        {/* ── Story highlights ── */}
        <div className="about-highlights">
          {[
            { label: "[Label]", g: "linear-gradient(135deg, #e8b86d, #c9712a)" },
            { label: "[Label]", g: "linear-gradient(135deg, #4fc3a1, #0e8a6c)" },
            { label: "[Label]", g: "linear-gradient(135deg, #e87c5a, #c94040)" },
            { label: "[Label]", g: "linear-gradient(135deg, #7ab3d4, #2e6fa3)" },
            { label: "[Label]", g: "linear-gradient(135deg, #9b7fd4, #5a3e8e)" },
          ].map(({ label, g }) => (
            <div key={label} className="about-highlight">
              <div className="about-highlight-ring">
                <div className="about-highlight-img" style={{ background: g }} />
              </div>
              <span className="about-highlight-label">{label}</span>
            </div>
          ))}
        </div>

        <div className="about-divider" />

        {/* ── Story ── */}
        <section id="story" className="about-section">
          <div className="about-story-layout">
            <div className="about-post-card">
              <div className="about-post-header">
                <div className="about-post-mini-avatar" />
                <div>
                  <div className="about-post-username">mjmdg</div>
                  <div className="about-post-location">[Location]</div>
                </div>
                <span className="about-post-more">···</span>
              </div>
              <img src={baguioPhoto} alt="Baguio" className="about-post-img" />
              <div className="about-post-actions">
                <button className="about-action-btn" aria-label="like">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
                <button className="about-action-btn" aria-label="comment">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </button>
                <button className="about-action-btn" aria-label="share">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
              <div className="about-post-likes">— likes</div>
              <div className="about-post-caption">
                <strong>mjmdg</strong> [Caption placeholder — a line or two about this photo.]
              </div>
              <div className="about-post-date">[MONTH YEAR]</div>
            </div>

            <div className="about-story-text">
              <div className="about-eyebrow">The Story</div>
              <h2 className="about-section-h2">[Headline placeholder.<br />Second line here.]</h2>
              <p className="about-story-body">
                [Paragraph placeholder — a few sentences about background and where things started.]
              </p>
              <p className="about-story-body">
                [Paragraph placeholder — what I do day-to-day and what I'm building.]
              </p>
            </div>
          </div>
        </section>

        <div className="about-divider" />

        {/* ── Moments ── */}
        <section id="moments" className="about-section">
          <div className="about-section-heading">
            <div className="about-eyebrow">Moments</div>
            <h2 className="about-section-h2">[Subheading placeholder.]</h2>
          </div>
          <div className="about-moments-grid">
            {[
              { filter: "linear-gradient(135deg, #d4a574 0%, #b07a45 100%)", caption: "[Caption placeholder]", likes: 0, date: "[DATE]" },
              { filter: "linear-gradient(135deg, #7ab3d4 0%, #2e6fa3 100%)", caption: "[Caption placeholder]", likes: 0, date: "[DATE]" },
              { filter: "linear-gradient(135deg, #9b7fd4 0%, #5a3e8e 100%)", caption: "[Caption placeholder]", likes: 0, date: "[DATE]" },
              { filter: "linear-gradient(135deg, #c4783c 0%, #8b4a1c 100%)", caption: "[Caption placeholder]", likes: 0, date: "[DATE]" },
              { filter: "linear-gradient(135deg, #4fc3a1 0%, #0e8a6c 100%)", caption: "[Caption placeholder]", likes: 0, date: "[DATE]" },
              { filter: "linear-gradient(135deg, #e87c5a 0%, #c94040 100%)", caption: "[Caption placeholder]", likes: 0, date: "[DATE]" },
            ].map(({ filter, caption, likes, date }, i) => (
              <div key={i} className="about-moment-post">
                <div className="about-moment-img" style={{ background: filter }}>
                  <div className="about-moment-overlay">
                    <span>
                      <svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      {likes}
                    </span>
                  </div>
                </div>
                <div className="about-moment-body">
                  <div className="about-moment-caption"><strong>mjmdg</strong> {caption}</div>
                  <div className="about-moment-date">{date}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="about-divider" />

        {/* ── Places ── */}
        <section id="places" className="about-section">
          <div className="about-section-heading">
            <div className="about-eyebrow">Places</div>
            <h2 className="about-section-h2">[Subheading placeholder.]</h2>
          </div>
          <div className="about-places-list">
            {[
              { name: "[Place name]", sub: "[Short description]", tag: "📍", year: "[Year range]" },
              { name: "[Place name]", sub: "[Short description]", tag: "📍", year: "[Year range]" },
              { name: "[Place name]", sub: "[Short description]", tag: "📍", year: "[Year range]" },
              { name: "[Place name]", sub: "[Short description]", tag: "📍", year: "[Year range]" },
              { name: "[Place name]", sub: "[Short description]", tag: "📍", year: "[Year range]" },
            ].map(({ name, sub, tag, year }) => (
              <div key={name} className="about-place-row">
                <div className="about-place-thumb">{tag}</div>
                <div className="about-place-info">
                  <div className="about-place-name">{name}</div>
                  <div className="about-place-sub">{sub}</div>
                </div>
                <div className="about-place-year">{year}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="about-divider" />

        {/* ── Now ── */}
        <section id="now" className="about-section">
          <div className="about-section-heading">
            <div className="about-eyebrow">Now</div>
            <h2 className="about-section-h2">[Subheading placeholder.]</h2>
          </div>
          <div className="about-now-grid">
            {[
              { icon: "💻", title: "[Title]", sub: "[Short description placeholder.]" },
              { icon: "🏗️", title: "[Title]", sub: "[Short description placeholder.]" },
              { icon: "🚲", title: "[Title]", sub: "[Short description placeholder.]" },
              { icon: "🚗", title: "[Title]", sub: "[Short description placeholder.]" },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="about-now-card">
                <div className="about-now-icon">{icon}</div>
                <div className="about-now-title">{title}</div>
                <div className="about-now-sub">{sub}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="about-divider" />

        <footer className="about-footer">
          <Link to="/portfolio" className="about-portfolio-link">Back to portfolio</Link>
        </footer>

      </div>
    </PageLayout>
  );
}
