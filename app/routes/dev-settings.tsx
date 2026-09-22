// Copyright © MJMDG 2026
import { Link } from "react-router";
import type { Route } from "./+types/dev-settings";
import PageLayout from "~/components/PageLayout";
import { getUserFromSession } from "~/db/session.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Developer Settings | LAB<3" },
    { name: "robots", content: "noindex" },
  ];
}

// No auth gate — see app/docs/DEV_SETTINGS.md. This is only reachable via a
// hidden gesture on the home page (click the MJMDG logo 5x), not linked from
// nav, and login isn't wired to a local DB in most dev environments right now.
export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserFromSession(request);
  return { isAuthenticated: !!userId };
}

export default function DevSettings({ loaderData }: Route.ComponentProps) {
  return (
    <PageLayout isAuthenticated={loaderData.isAuthenticated}>
      <div className="page-content devsettings-page">
        <div className="page-header">
          <h1>Developer Settings</h1>
          <p>Hidden screen — reached by clicking the MJMDG logo 5x on the home page.</p>
        </div>

        <div className="devsettings-grid">
          <Link to="/dev-settings/styles" className="devsettings-tile">
            <span className="devsettings-tile-icon">🎨</span>
            <span className="devsettings-tile-label">Styles</span>
            <span className="devsettings-tile-desc">Color tokens, type scale, buttons</span>
          </Link>
          <Link to="/dev-settings/mockups" className="devsettings-tile">
            <span className="devsettings-tile-icon">🧩</span>
            <span className="devsettings-tile-label">Mockups</span>
            <span className="devsettings-tile-desc">In-progress design mockups</span>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
