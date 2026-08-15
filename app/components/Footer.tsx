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
    <footer className="footer">
      <span className="footer-copyright">&copy; MJMDG — LAB&lt;3 Developments 2026</span>
      {versionLabel && <span className="footer-version">{versionLabel}</span>}
    </footer>
  );
}
