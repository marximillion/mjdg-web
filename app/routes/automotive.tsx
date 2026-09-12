// Copyright © MJMDG 2026
import { redirect } from "react-router";
import type { Route } from "./+types/automotive";
import PageLayout from "~/components/PageLayout";
import { getUserFromSession } from "~/db/session.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Automotive | LAB<3" },
    { name: "description", content: "Automotive tools and services." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserFromSession(request);
  if (!userId) return redirect("/");
  return { isAuthenticated: true };
}

export default function Automotive({ loaderData }: Route.ComponentProps) {
  return (
    <PageLayout isAuthenticated={loaderData.isAuthenticated}>
      <div className="page-content">
        <div className="page-header">
          <h1>Automotive</h1>
          <p>Coming soon.</p>
        </div>
      </div>
    </PageLayout>
  );
}
