// Copyright © MJMDG 2026
import { redirect } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import type { Route } from "./+types/cycling";
import PageLayout from "~/components/PageLayout";
import { getUserFromSession } from "~/db/session.server";
import hybridUrl   from "~/assets/images/bikes/hybrid.png";
import mountainUrl from "~/assets/images/bikes/mountain.png";
import racerUrl    from "~/assets/images/bikes/racer.png";
import vintageUrl  from "~/assets/images/bikes/vintage.png";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cycling | LAB<3" },
    { name: "description", content: "The MJDG bike rack — every ride logged." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserFromSession(request);
  if (!userId) return redirect("/");
  return { isAuthenticated: true };
}

// ── Data ─────────────────────────────────────────────────────────────────────

const bikes = [
  {
    tag:     "BIKE-01",
    status:  "DAILY RIDER",
    accent:  "#C89A00",
    title:   "Escape Hybrid",
    tagline: "The commuter. City streets, bike paths, wherever the day takes it.",
    img:     hybridUrl,
    imgAlt:  "Escape hybrid bike — white and gold frame",
    spec: [
      ["TYPE",    "Hybrid / City"],
      ["FRAME",   "Aluminum alloy"],
      ["GEARS",   "21-speed Shimano"],
      ["WHEELS",  '700c × 35mm'],
      ["USE",     "Daily commute · path rides"],
    ],
  },
  {
    tag:     "BIKE-02",
    status:  "TRAIL READY",
    accent:  "var(--brand-red)",
    title:   "CCM Static 26\"",
    tagline: "Full suspension. Built for loose trail, tight switchbacks, and anything in between.",
    img:     mountainUrl,
    imgAlt:  "CCM Static mountain bike — white with red forks",
    spec: [
      ["TYPE",    "Full-suspension MTB"],
      ["FRAME",   "Steel"],
      ["GEARS",   "21-speed Shimano"],
      ["WHEELS",  '26" × 2.1"'],
      ["USE",     "Trail · off-road"],
    ],
  },
  {
    tag:     "BIKE-03",
    status:  "SPEED BUILD",
    accent:  "var(--brand-red)",
    title:   "Road Racer",
    tagline: "Drop bars, disc brakes, and enough gearing to find your limit. Then exceed it.",
    img:     racerUrl,
    imgAlt:  "Road race bike — black frame with red accents",
    spec: [
      ["TYPE",    "Road / Racing"],
      ["FRAME",   "Aluminum alloy"],
      ["BRAKES",  "Mechanical disc"],
      ["WHEELS",  '700c × 25mm'],
      ["USE",     "Speed · long distance"],
    ],
  },
  {
    tag:     "BIKE-04",
    status:  "LEISURE FLEET",
    accent:  "#2E7D8A",
    title:   "Vintage City",
    tagline: "Steel frame, milk crate, ram-horn bars. Old school done right.",
    img:     vintageUrl,
    imgAlt:  "Vintage city bike — teal frame with milk crate rack",
    spec: [
      ["TYPE",    "Vintage / Leisure"],
      ["FRAME",   "Steel (lugged)"],
      ["GEARS",   "10-speed"],
      ["RACK",    "Milk crate rear"],
      ["USE",     "Casual · errands · vibes"],
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Cycling({ loaderData }: Route.ComponentProps) {
  const trackRef  = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const panels = track.querySelectorAll<HTMLElement>(".cycling-panel");
    panels[i]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }, []);

  // Lock page to viewport (no vertical scroll)
  useEffect(() => {
    document.body.classList.add("page-cycling");
    return () => document.body.classList.remove("page-cycling");
  }, []);

  // Dot sync on scroll — ratio-based so last panel always registers
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) return;
      const ratio = track.scrollLeft / maxScroll;
      const total = bikes.length + 1;
      const i = Math.round(ratio * (total - 1));
      setActive(Math.max(0, Math.min(total - 1, i)));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard left/right
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(Math.min(active + 1, bikes.length - 1));
      if (e.key === "ArrowLeft")  goTo(Math.max(active - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo]);

  return (
    <PageLayout isAuthenticated={loaderData.isAuthenticated}>
      <div className="cycling-page">

        {/* ── Horizontal track ── */}
        <div className="cycling-track" ref={trackRef}>

          {/* Hero panel */}
          <div className="cycling-panel cycling-panel--hero">
            <div className="cycling-hero-inner">
              <div className="cycling-eyebrow">THE RACK</div>
              <h1 className="cycling-h1">Four bikes.<br />All the roads.</h1>
              <p className="cycling-sub">
                Every ride has its own machine. Scroll through the fleet — commuter to racer, city to trail.
              </p>
              <div className="cycling-scroll-cue">
                <span>SCROLL</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Bike panels */}
          {bikes.map((b, i) => (
            <div
              key={b.tag}
              className="cycling-panel cycling-panel--bike"
              style={{ ["--bike-accent" as string]: b.accent }}
            >
              <div className="cycling-bike-inner">
                <div className="cycling-bike-info">
                  <div className="cycling-tag-row">
                    <span className="cycling-tag">{b.tag}</span>
                    <span className="cycling-status">{b.status}</span>
                  </div>
                  <h2 className="cycling-bike-title">{b.title}</h2>
                  <p className="cycling-bike-tagline">{b.tagline}</p>
                  <div className="cycling-spec">
                    {b.spec.map(([label, value]) => (
                      <div key={label} className="cycling-spec-row">
                        <span className="cycling-spec-label">{label}</span>
                        <span className="cycling-spec-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="cycling-bike-visual">
                  <img src={b.img} alt={b.imgAlt} className="cycling-bike-img" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Nav ── */}
        <div className="cycling-nav">
          <button
            className="cycling-nav-arrow"
            onClick={() => goTo(Math.max(active - 1, 0))}
            aria-label="Previous"
            disabled={active === 0}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M11 19l-7-7 7-7"/>
            </svg>
          </button>

          <div className="cycling-dots">
            {Array.from({ length: bikes.length + 1 }, (_, i) => (
              <button
                key={i}
                className={`cycling-dot${active === i ? " cycling-dot--active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={i === 0 ? "Intro" : bikes[i - 1].title}
              />
            ))}
          </div>

          <button
            className="cycling-nav-arrow"
            onClick={() => goTo(Math.min(active + 1, bikes.length))}
            aria-label="Next"
            disabled={active === bikes.length}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

      </div>
    </PageLayout>
  );
}
