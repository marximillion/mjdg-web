// Copyright © MJMDG 2026
import { Link } from "react-router";
import baldUrl from "~/assets/images/peeps/mdg-bald-icon.jpg";

interface ErrorPageProps {
  status?: number;
  message?: string;
  stack?: string;
}

const ERROR_COPY: Record<number, { headline: string; sub: string }> = {
  400: { headline: "Bad request.",        sub: "Something about that request didn't add up." },
  401: { headline: "Not logged in.",      sub: "You need to sign in before you can access this." },
  403: { headline: "Access denied.",      sub: "You're authenticated — but this isn't for you." },
  404: { headline: "Nothing here.",       sub: "That page doesn't exist, or never did." },
  500: { headline: "Server error.",       sub: "Something broke on our end. It's not you." },
  503: { headline: "Service unavailable.", sub: "We're temporarily down. Try again in a moment." },
};

const FALLBACK = { headline: "Something went wrong.", sub: "An unexpected error occurred." };

export default function ErrorPage({ status, message, stack }: ErrorPageProps) {
  const code   = status ?? 0;
  const copy   = ERROR_COPY[code] ?? FALLBACK;
  const isDev  = typeof import.meta !== "undefined" && (import.meta as { env?: { DEV?: boolean } }).env?.DEV;

  return (
    <div className="error-page">
      <div className="error-bald-wrap">
        <img src={baldUrl} alt="Mark De Guzman" className="error-bald" />
        <div className="error-bald-caption">yeah, idk either.</div>
      </div>

      <div className="error-body">
        {code > 0 && <div className="error-code">{code}</div>}
        <h1 className="error-headline">{copy.headline}</h1>
        <p className="error-sub">{message ?? copy.sub}</p>

        <Link to="/" className="error-cta">← Go home</Link>

        {isDev && stack && (
          <details className="error-stack">
            <summary>Stack trace</summary>
            <pre><code>{stack}</code></pre>
          </details>
        )}
      </div>
    </div>
  );
}
