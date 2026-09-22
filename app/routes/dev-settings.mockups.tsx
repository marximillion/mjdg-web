// Copyright © MJMDG 2026
import { Link } from "react-router";
import type { Route } from "./+types/dev-settings.mockups";
import PageLayout from "~/components/PageLayout";
import { getUserFromSession } from "~/db/session.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mockups | Developer Settings" },
    { name: "robots", content: "noindex" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserFromSession(request);
  return { isAuthenticated: !!userId };
}

const mockups = [
  {
    to: "/mockups/stmarys",
    label: "St. Mary's Cathedral — Home",
    desc: "Two design variants, switchable. Other core pages stubbed with Coming Soon.",
  },
];

export default function DevMockups({ loaderData }: Route.ComponentProps) {
  return (
    <PageLayout isAuthenticated={loaderData.isAuthenticated}>
      <div className="page-content devsettings-page">
        <div className="page-header">
          <h1>Mockups</h1>
          <p>In-progress design mockups. Not linked from the public site.</p>
        </div>

        <div className="devsettings-list">
          {mockups.map((m) => (
            <Link key={m.to} to={m.to} className="devsettings-list-item">
              <span className="devsettings-list-label">{m.label}</span>
              <span className="devsettings-list-desc">{m.desc}</span>
            </Link>
          ))}
        </div>

        <Link to="/dev-settings" className="devsettings-back">
          ← Developer Settings
        </Link>
      </div>
    </PageLayout>
  );
}
