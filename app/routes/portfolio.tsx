// Copyright © MJDG 2026
import type { Route } from "./+types/portfolio";
import PageLayout from "../components/PageLayout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Portfolio | LAB<3" },
    { name: "description", content: "Portfolio" },
  ];
}

export default function Portfolio() {
  return (
    <PageLayout>
      <section id="portfolio">
        <h1>Portfolio</h1>
        <p>Projects and work go here.</p>
      </section>
    </PageLayout>
  );
}