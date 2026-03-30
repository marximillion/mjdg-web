import type { Route } from "./+types/register";
import PageLayout from "~/components/PageLayout";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Register | LAB<3" },
        { name: "description", content: "Register for an account" },
    ];
}

export default function Register() {
    return (
        <PageLayout>
            <section id="games">
                <h1>Register</h1>
                <p>COMING SOON!</p>
            </section>
        </PageLayout>
    );
}