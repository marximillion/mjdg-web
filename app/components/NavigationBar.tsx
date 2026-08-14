// Copyright © MJMDG 2026
// Desktop navigation — hidden on mobile via CSS
import { NavLink, Form, Link } from "react-router";
import mark from "../assets/images/logos/v1.0.1.6/white-1.png";
import wordmark from "../assets/images/logos/v1.0.1.6/white-text-1.png";

interface NavBarProps {
  isAuthenticated?: boolean;
}

export default function NavBar({ isAuthenticated = false }: NavBarProps) {
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
        <img src={mark} alt="MJMDG mark" className="nav-brand-mark" />
        <img src={wordmark} alt="MJMDG" className="nav-brand-wordmark" />
      </Link>

      <div className="nav-right">
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
