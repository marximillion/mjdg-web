// Copyright © MJMDG 2026
import type { Route } from "./+types/mockups.stmarys.stub";
import PageLayout from "~/components/PageLayout";
import ComingSoon from "~/components/ComingSoon";
import { getUserFromSession } from "~/db/session.server";

const PAGES: Record<string, { eyebrow: string; headline: string }> = {
  sacraments: { eyebrow: "SACRAMENTS", headline: "Sacraments — coming soon." },
  giving: { eyebrow: "GIVING", headline: "Giving — coming soon." },
  events: { eyebrow: "EVENTS", headline: "Events — coming soon." },
  bulletin: { eyebrow: "BULLETIN", headline: "Bulletin archive — coming soon." },
  contact: { eyebrow: "CONTACT", headline: "Contact — coming soon." },
};

export function meta({ params }: Route.MetaArgs) {
  const page = PAGES[params.page ?? ""];
  return [
    { title: `${page ? page.eyebrow : "St. Mary's"} — Home Mockup | LAB<3` },
    { name: "robots", content: "noindex" },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const userId = await getUserFromSession(request);
  if (!PAGES[params.page ?? ""]) throw new Response("Not Found", { status: 404 });
  return { isAuthenticated: !!userId, page: params.page as string };
}

export default function StMarysStub({ loaderData }: Route.ComponentProps) {
  const copy = PAGES[loaderData.page];
  return (
    <PageLayout isAuthenticated={loaderData.isAuthenticated}>
      <ComingSoon
        eyebrow={copy.eyebrow}
        headline={copy.headline}
        sub="This pass focused on the home page — this section comes next."
        backHref="/mockups/stmarys"
        backLabel="Back to home mockup"
      />
    </PageLayout>
  );
}
