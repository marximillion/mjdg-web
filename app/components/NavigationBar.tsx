// Copyright © MJMDG 2026
// Desktop navigation — hidden on mobile via CSS
import { NavLink, Form, Link } from "react-router";
import logo from "../assets/images/logos/lab3-logo-v1-mobile.png";

interface NavBarProps {
  isAuthenticated?: boolean;
}

export default function NavBar({ isAuthenticated = false }: NavBarProps) {
  if (isAuthenticated) {
    return (
      <nav className="nav-desktop nav-desktop--auth">
        <div className="nav-left">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
          <NavLink to="/catalogue" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Catalogue</NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Profile</NavLink>
        </div>
        <Link to="/dashboard" className="nav-center-logo">
          <img src={logo} alt="MJDG" className="nav-desktop-logo" />
        </Link>
        <div className="nav-right">
          <Form method="post" action="/logout">
            <button type="submit" className="nav-link">Logout</button>
          </Form>
        </div>
      </nav>
    );
  }

  return (
    <nav className="nav-desktop">
      <div className="nav-left">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
        <NavLink to="/portfolio" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Portfolio</NavLink>
      </div>
      <Link to="/" className="nav-center-logo">
        <img src={logo} alt="MJDG" className="nav-desktop-logo" />
      </Link>
      <div className="nav-right">
        <NavLink to="/register" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Register</NavLink>
      </div>
    </nav>
  );
}
