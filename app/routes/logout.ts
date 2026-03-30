// Copyright © MJDG 2026
import { redirect } from "react-router";
import { sessionStorage } from "../db/session.server";

export async function loader() {
  return redirect("/");
}

export async function action({ request }: { request: Request }) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return redirect("/", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
  });
}