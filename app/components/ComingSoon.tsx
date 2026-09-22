// Copyright © MJMDG 2026
import baldIcon from "~/assets/images/peeps/mdg-bald-icon.jpg";

interface ComingSoonProps {
  eyebrow: string;
  headline?: string;
  sub?: string;
  backHref?: string;
  backLabel?: string;
}

export default function ComingSoon({
  eyebrow,
  headline = "Coming soon.",
  sub = "This page is on the lift. Check back once it rolls out the door.",
  backHref = "/portfolio",
  backLabel = "Back to portfolio",
}: ComingSoonProps) {
  return (
    <div className="coming-soon-page">
      <div className="coming-soon-inner">
        <div className="coming-soon-icon-wrap">
          <img src={baldIcon} alt="MJMDG" className="coming-soon-icon" />
        </div>
        <div className="coming-soon-eyebrow">{eyebrow}</div>
        <h1 className="coming-soon-h1">{headline}</h1>
        <p className="coming-soon-sub">{sub}</p>
        <a href={backHref} className="coming-soon-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M11 19l-7-7 7-7"/>
          </svg>
          {backLabel}
        </a>
      </div>
    </div>
  );
}
