import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("portfolio", "routes/portfolio.tsx"),
  route("register", "routes/register.tsx"),
  route("catalogue", "routes/catalogue.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("logout", "routes/logout.ts"),
] satisfies RouteConfig;