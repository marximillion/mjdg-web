// Copyright © MJMDG 2026
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import '~/styles/app.css'
import Loader from "./components/Loader";
import ErrorPage from "./components/ErrorPage";

export async function loader() {
  return {
    version: process.env.VERSION ?? null,
    env: process.env.NODE_ENV,
  };
}

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/png", href: "/favicon.png" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var t = localStorage.getItem('theme');
            if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
          })();
        `}} />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Loader />
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let status: number | undefined;
  let message: string | undefined;
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    status  = error.status;
    message = error.statusText || undefined;
  } else if (error instanceof Error) {
    message = import.meta.env.DEV ? error.message : undefined;
    stack   = import.meta.env.DEV ? error.stack   : undefined;
  }

  return <ErrorPage status={status} message={message} stack={stack} />;
}
