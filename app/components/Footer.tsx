// Copyright © MJMDG 2026
import { useRouteLoaderData } from "react-router";

export default function Footer() {
  const data = useRouteLoaderData("root") as { version: string | null; env: string } | undefined;

  let versionLabel: string | null = null;
  if (data?.env === "development") {
    versionLabel = "DEV";
  } else if (data?.version) {
    versionLabel = data.version;
  }

  return (
    <footer className="copyright">
      &copy; MJMDG 2026{versionLabel ? ` — ${versionLabel}` : ""}
    </footer>
  );
}
