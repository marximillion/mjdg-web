import { createCookieSessionStorage } from "react-router";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "mjdg_session",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    secrets: ["mjdg-secret-key"],
    maxAge: 60 * 60 * 24 * 7,
  },
});

export async function getUserFromSession(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  return session.get("userId") ?? null;
}