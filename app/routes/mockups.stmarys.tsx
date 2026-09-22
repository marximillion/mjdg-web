// Copyright © MJMDG 2026
import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/mockups.stmarys";
import PageLayout from "~/components/PageLayout";
import { getUserFromSession } from "~/db/session.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "St. Mary's Cathedral — Home Mockup | LAB<3" },
    { name: "description", content: "Home page design mockup for St. Mary's Cathedral — two variants." },
    { name: "robots", content: "noindex" },
  ];
}

export const links: Route.LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap",
  },
];

// No auth gate — reached via /dev-settings/mockups, same reasoning as dev-settings
// itself (see app/docs/DEV_SETTINGS.md): login isn't wired to a local DB right now.
export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserFromSession(request);
  return { isAuthenticated: !!userId };
}

// ── Mock content ─────────────────────────────────────────────────────────────
// Illustrative placeholder content for the mockup — not scraped or real parish data.

const quickInfo = [
  { label: "Sunday Mass", value: "8:00 AM · 10:00 AM · 12:00 PM · 5:00 PM" },
  { label: "Weekday Mass", value: "Mon–Sat, 8:30 AM" },
  { label: "Confession", value: "Saturdays, 3:30–4:30 PM, or by appointment" },
  { label: "Adoration", value: "First Fridays, 9:00 AM–8:00 PM" },
];

const sampleEvent = {
  tag: "SAMPLE EVENT",
  title: "Parish Advent Mission",
  date: "Dec 1–3",
  blurb: "Three evenings of reflection and music ahead of Advent. Placeholder content for this mockup.",
};

const footerLinks = [
  { to: "/mockups/stmarys/sacraments", label: "Sacraments" },
  { to: "/mockups/stmarys/giving", label: "Giving" },
  { to: "/mockups/stmarys/events", label: "Events" },
  { to: "/mockups/stmarys/bulletin", label: "Bulletin" },
  { to: "/mockups/stmarys/contact", label: "Contact" },
];

type Variant = "a" | "b";

export default function StMarysMockup({ loaderData }: Route.ComponentProps) {
  const [variant, setVariant] = useState<Variant>("a");

  return (
    <PageLayout isAuthenticated={loaderData.isAuthenticated}>
      <div className="page-content stmarys-mock-page">
        <div className="page-header">
          <h1>St. Mary's Cathedral — Home Mockup</h1>
          <p>Preview only, not linked from the public site. Two design directions, same content.</p>
        </div>

        <div className="stmarys-switcher" role="tablist" aria-label="Design variant">
          <button
            type="button"
            role="tab"
            aria-selected={variant === "a"}
            className={`stmarys-switcher-tab${variant === "a" ? " is-active" : ""}`}
            onClick={() => setVariant("a")}
          >
            A — Stone &amp; Stained Glass
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={variant === "b"}
            className={`stmarys-switcher-tab${variant === "b" ? " is-active" : ""}`}
            onClick={() => setVariant("b")}
          >
            B — Light &amp; Sanctuary
          </button>
        </div>

        <div className="stmarys-mock" data-variant={variant}>
          <div className="stmarys-quickinfo">
            {quickInfo.map((item) => (
              <div key={item.label} className="stmarys-quickinfo-row">
                <span className="stmarys-quickinfo-label">{item.label}</span>
                <span className="stmarys-quickinfo-value">{item.value}</span>
              </div>
            ))}
          </div>

          <section className="stmarys-hero">
            <span className="stmarys-eyebrow">Diocese of Calgary</span>
            <h2 className="stmarys-h1">St. Mary's Cathedral</h2>
            <p className="stmarys-hero-sub">
              A vibrant, faith-filled Catholic Church community committed to living the will of God,
              ministry to others, and the spiritual growth of people.
            </p>
            <div className="stmarys-hero-ctas">
              <Link to="/mockups/stmarys/giving" className="stmarys-btn stmarys-btn--primary">
                Give Online
              </Link>
              <Link to="/mockups/stmarys/sacraments" className="stmarys-btn stmarys-btn--ghost">
                Sacraments &amp; Registration
              </Link>
            </div>
          </section>

          <section className="stmarys-event">
            <span className="stmarys-event-tag">{sampleEvent.tag}</span>
            <h3 className="stmarys-event-title">{sampleEvent.title}</h3>
            <span className="stmarys-event-date">{sampleEvent.date}</span>
            <p className="stmarys-event-blurb">{sampleEvent.blurb}</p>
            <Link to="/mockups/stmarys/events" className="stmarys-event-link">
              See all events →
            </Link>
          </section>

          <footer className="stmarys-footer">
            <nav className="stmarys-footer-nav">
              {footerLinks.map((l) => (
                <Link key={l.to} to={l.to} className="stmarys-footer-link">
                  {l.label}
                </Link>
              ))}
            </nav>
          </footer>
        </div>
      </div>
    </PageLayout>
  );
}
