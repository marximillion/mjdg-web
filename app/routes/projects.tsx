// Copyright © MJMDG 2026
import type { Route } from "./+types/projects";
import PageLayout from "~/components/PageLayout";
import ComingSoon from "~/components/ComingSoon";
import { getUserFromSession } from "~/db/session.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Projects | Mark De Guzman" },
    { name: "description", content: "All projects — coming soon." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserFromSession(request);
  return { isAuthenticated: !!userId };
}

export default function Projects({ loaderData }: Route.ComponentProps) {
  return (
    <PageLayout isAuthenticated={loaderData.isAuthenticated}>
      <ComingSoon eyebrow="ALL PROJECTS" />
    </PageLayout>
  );
}
