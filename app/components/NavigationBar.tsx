import { NavLink } from "react-router";

interface NavBarProps {
  isAuthenticated?: boolean;
}

export default function NavigationBar({ isAuthenticated = false }: NavBarProps) {
  return (
    <nav>
      <NavLink
        to="/"
        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
      >
        Home
      </NavLink>
      <NavLink
        to="/portfolio"
        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
      >
        Portfolio
      </NavLink>
      {isAuthenticated && (
        <NavLink
          to="/dashboard"
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          Dashboard
        </NavLink>
      )}
    </nav>
  );
}