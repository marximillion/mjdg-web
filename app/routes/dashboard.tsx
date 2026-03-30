import { getUserFromSession } from "~/db/session.server";
import type { Route } from "./+types/dashboard";
import PageLayout from "~/components/PageLayout";
import { redirect } from "react-router";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Dashboard | LAB<3" },
        { name: "description", content: "Dashboard" },
    ];
}

export async function loader({ request }: Route.LoaderArgs) {
    const userId = await getUserFromSession(request);
    if (!userId) return redirect("/");
    return { isAuthenticated: true };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
    console.log(loaderData);
    return (
        <PageLayout isAuthenticated={loaderData.isAuthenticated}>
            <section id="dashboard">
                <h1>Dashboard</h1>
                <p>Welcome back!</p>
            </section>
        </PageLayout >
    );
}