// Copyright © MJMDG 2026
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("portfolio", "routes/portfolio.tsx"),
  route("register", "routes/register.tsx"),
  route("catalogue", "routes/catalogue.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("logout", "routes/logout.ts"),
  route("profile", "routes/profile.tsx"),
  route("service-image-generator", "routes/service_image_generator.tsx"),
  route("game-flappy-bird", "routes/game-flappy-bird.tsx"),
  route("automotive", "routes/automotive.tsx"),
  route("financial", "routes/financial.tsx"),
  route("dev-settings", "routes/dev-settings.tsx"),
  route("dev-settings/styles", "routes/dev-settings.styles.tsx"),
  route("dev-settings/mockups", "routes/dev-settings.mockups.tsx"),
] satisfies RouteConfig;