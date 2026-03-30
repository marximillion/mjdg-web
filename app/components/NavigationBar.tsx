import { NavLink, Form } from "react-router";

interface NavBarProps {
  isAuthenticated?: boolean;
}

export default function NavBar({ isAuthenticated = false }: NavBarProps) {
  console.log("MDG::isAuthenticated->", isAuthenticated);
  if (isAuthenticated) {
    return (
      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Dashboard
        </NavLink>
        <NavLink to="/catalogue" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Catalogue
        </NavLink>
        <Form method="post" action="/logout">
          <button type="submit" className="nav-link">
            Logout
          </button>
        </Form>
      </nav>
    );
  }

  return (
    <nav>
      <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        Home
      </NavLink>
      <NavLink to="/portfolio" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        Portfolio
      </NavLink>
    </nav>
  );
}