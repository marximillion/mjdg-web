import { redirect } from "react-router";
import type { Route } from "./+types/catalogue";
import PageLayout from "~/components/PageLayout";
import { getUserFromSession } from "~/db/session.server";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Games | LAB<3" },
    { name: "description", content: "Games" },
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
      <section id="games">
        <h1>Catalogue</h1>
        <p>COMING SOON!</p>
      </section>
    </PageLayout>
  );
}