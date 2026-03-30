// Copyright © MJDG 2026
import { redirect } from "react-router";
import { Link } from "react-router";
import type { Route } from "./+types/catalogue";
import PageLayout from "~/components/PageLayout";
import { getUserFromSession } from "~/db/session.server";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Catalogue | LAB<3" },
    { name: "description", content: "Catalogue" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserFromSession(request);
  if (!userId) return redirect("/");
  return { isAuthenticated: true };
}

export default function Catalogue({ loaderData }: Route.ComponentProps) {
  return (
    <PageLayout isAuthenticated={loaderData.isAuthenticated}>
      <section id="catalogue">
        <h1>Catalogue</h1>
        <div className="catalogue-grid">
          <Link to="/service-image-generator" className="catalogue-tile">
            <span className="catalogue-tile-icon">🖼️</span>
            <span className="catalogue-tile-label">Text to Image Generator</span>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}