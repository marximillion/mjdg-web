// Copyright © MJMDG 2026
// Mobile navigation — hidden on desktop via CSS
import { NavLink, Form, Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import darkLogo from "../assets/images/logos/v1.0.1.6/white-1.png";
import darkLogoText from "../assets/images/logos/v1.0.1.6/white-text-1.png";
import lightLogo from "../assets/images/logos/v1.0.1.6/black-1.png";
import lightLogoText from "../assets/images/logos/v1.0.1.6/black-text-1.png";

interface MobileNavProps {
  isAuthenticated?: boolean;
}

export default function MobileNav({ isAuthenticated = false }: MobileNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const update = () => {
      setTheme((document.documentElement.getAttribute("data-theme") as "dark" | "light") ?? "dark");
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const close = () => setMenuOpen(false);
  const logo = theme === "light" ? lightLogo : darkLogo;
  const logoText = theme === "light" ? lightLogoText : darkLogoText;

  return (
    <div ref={menuRef} className={isAuthenticated ? "nav-mobile-wrapper nav-mobile-wrapper--auth" : "nav-mobile-wrapper"}>
      <div className="nav-mobile-bar">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="nav-brand">
          <img src={logo} alt="MJMDG" className="nav-brand-logo" />
          <img src={logoText} alt="MJMDG" className="nav-brand-logo-text" />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <ThemeToggle />
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="nav-mobile-menu">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-mobile-link active" : "nav-mobile-link"} onClick={close}>Dashboard</NavLink>
              <NavLink to="/catalogue" className={({ isActive }) => isActive ? "nav-mobile-link active" : "nav-mobile-link"} onClick={close}>Catalogue</NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-mobile-link active" : "nav-mobile-link"} onClick={close}>Profile</NavLink>
              <div className="nav-mobile-divider" />
              <Form method="post" action="/logout">
                <button type="submit" className="nav-mobile-link nav-mobile-logout">Logout</button>
              </Form>
            </>
          ) : (
            <>
              <NavLink to="/" className={({ isActive }) => isActive ? "nav-mobile-link active" : "nav-mobile-link"} onClick={close}>Home</NavLink>
              <NavLink to="/portfolio" className={({ isActive }) => isActive ? "nav-mobile-link active" : "nav-mobile-link"} onClick={close}>Portfolio</NavLink>
              <div className="nav-mobile-divider" />
              <NavLink to="/register" className={({ isActive }) => isActive ? "nav-mobile-link active" : "nav-mobile-link"} onClick={close}>Register</NavLink>
            </>
          )}
        </div>
      )}
    </div>
  );
}
