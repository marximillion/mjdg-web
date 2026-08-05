// Copyright © MJMDG 2026
// Mobile navigation — hidden on desktop via CSS
import { NavLink, Form, Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import logo from "../assets/images/logos/lab3-logo-v1-mobile.png";

interface MobileNavProps {
  isAuthenticated?: boolean;
}

export default function MobileNav({ isAuthenticated = false }: MobileNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
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

  const close = () => setMenuOpen(false);

  return (
    <div ref={menuRef} className={isAuthenticated ? "nav-mobile-wrapper nav-mobile-wrapper--auth" : "nav-mobile-wrapper"}>
      <div className="nav-mobile-bar">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="nav-mobile-logo-link">
          <img src={logo} alt="MJDG" className="nav-mobile-logo" />
        </Link>
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
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
                <button type="submit" className="nav-mobile-link nav-mobile-logout" onClick={close}>Logout</button>
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
