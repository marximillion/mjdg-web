// Copyright © MJMDG 2026
// Desktop navigation — hidden on mobile via CSS
import { NavLink, Form, Link } from "react-router";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import darkLogo from "../assets/images/logos/v1.0.1.6/white-1.png";
import lightLogo from "../assets/images/logos/v1.0.1.6/black-1.png";

interface NavBarProps {
  isAuthenticated?: boolean;
}

export default function NavBar({ isAuthenticated = false }: NavBarProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const update = () => {
      setTheme((document.documentElement.getAttribute("data-theme") as "dark" | "light") ?? "dark");
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const logo = theme === "light" ? lightLogo : darkLogo;

  return (
    <nav className="nav-desktop">
      <div className="nav-left">
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
            <NavLink to="/catalogue" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Catalogue</NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Profile</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
            <NavLink to="/portfolio" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Portfolio</NavLink>
          </>
        )}
      </div>

      <Link to={isAuthenticated ? "/dashboard" : "/"} className="nav-brand">
        <img src={logo} alt="MJMDG" className="nav-brand-logo" />
        <span className="nav-brand-wordmark">MJMDG</span>
      </Link>

      <div className="nav-right">
        <ThemeToggle />
        {isAuthenticated ? (
          <Form method="post" action="/logout">
            <button type="submit" className="nav-link">Logout</button>
          </Form>
        ) : (
          <NavLink to="/register" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Register</NavLink>
        )}
      </div>
    </nav>
  );
}
