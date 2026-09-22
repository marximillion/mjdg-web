// Copyright © MJMDG 2026
import { Link } from "react-router";
import type { Route } from "./+types/dev-settings.styles";
import PageLayout from "~/components/PageLayout";
import { getUserFromSession } from "~/db/session.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Styles | Developer Settings" },
    { name: "robots", content: "noindex" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserFromSession(request);
  return { isAuthenticated: !!userId };
}

const colorTokens = [
  { name: "--bg-main", var: "var(--bg-main)" },
  { name: "--bg-panel", var: "var(--bg-panel)" },
  { name: "--bg-elevated", var: "var(--bg-elevated)" },
  { name: "--brand-red", var: "var(--brand-red)" },
  { name: "--brand-gold", var: "var(--brand-gold)" },
  { name: "--brand-blue", var: "var(--brand-blue)" },
  { name: "--brand-green", var: "var(--brand-green)" },
  { name: "--text-primary", var: "var(--text-primary)" },
  { name: "--text-muted", var: "var(--text-muted)" },
  { name: "--text-subtle", var: "var(--text-subtle)" },
];

export default function DevStyles({ loaderData }: Route.ComponentProps) {
  return (
    <PageLayout isAuthenticated={loaderData.isAuthenticated}>
      <div className="page-content devsettings-page">
        <div className="page-header">
          <h1>Styles</h1>
          <p>MJMDG brand tokens — follows the active theme (dark/light) automatically.</p>
        </div>

        <section className="devstyles-section">
          <h2>Color Tokens</h2>
          <div className="devstyles-swatch-grid">
            {colorTokens.map((t) => (
              <div key={t.name} className="devstyles-swatch">
                <div className="devstyles-swatch-fill" style={{ background: t.var }} />
                <span className="devstyles-swatch-name">{t.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="devstyles-section">
          <h2>Type Scale</h2>
          <div className="devstyles-type-sample">
            <h1>Heading 1 — Archivo 600</h1>
            <h2>Heading 2 — Archivo 600</h2>
            <p>Body text — Archivo 400. The quick brown fox jumps over the lazy dog.</p>
            <p className="devstyles-mono">JetBrains Mono — the quick brown fox jumps over the lazy dog.</p>
          </div>
        </section>

        <section className="devstyles-section">
          <h2>Buttons</h2>
          <div className="devstyles-btn-row">
            <button className="devstyles-btn devstyles-btn--primary" type="button">Primary</button>
            <button className="devstyles-btn devstyles-btn--ghost" type="button">Ghost</button>
            <button className="devstyles-btn devstyles-btn--disabled" type="button" disabled>Disabled</button>
          </div>
        </section>

        <Link to="/dev-settings" className="devsettings-back">
          ← Developer Settings
        </Link>
      </div>
    </PageLayout>
  );
}
