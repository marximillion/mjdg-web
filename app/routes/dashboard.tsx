// Copyright © MJMDG 2026
import { getUserFromSession } from "~/db/session.server";
import type { Route } from "./+types/dashboard";
import PageLayout from "~/components/PageLayout";
import { redirect } from "react-router";
import { pool } from "~/db/db.server";
import emblem from "../assets/images/logos/lab3-emblem-v2.png";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Dashboard | LAB<3" },
        { name: "description", content: "Dashboard" },
    ];
}

export async function loader({ request }: Route.LoaderArgs) {
    const userId = await getUserFromSession(request);
    if (!userId) return redirect("/");
    const result = await pool.query(`SELECT username FROM "User" WHERE id = $1`, [userId]);
    const username = result.rows[0]?.username ?? null;
    return { isAuthenticated: true, username };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
    return (
        <PageLayout isAuthenticated={loaderData.isAuthenticated}>
            <section id="dashboard" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem" }}>
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back{loaderData.username ? `, ${loaderData.username}` : ""}!</p>
                </div>
                {/* <img src={emblem} alt="LAB3 Emblem" style={{ width: "500px" }} /> */}
            </section>
        </PageLayout >
    );
}