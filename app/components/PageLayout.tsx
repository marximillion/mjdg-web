// Copyright © MJMDG 2026
import NavBar from "./NavigationBar";
import MobileNav from "./MobileNav";
import Footer from "./Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
}

export default function PageLayout({
  children,
  isAuthenticated = false,
}: PageLayoutProps) {
  return (
    <div className="screenContainer">
      <NavBar isAuthenticated={isAuthenticated} />
      <MobileNav isAuthenticated={isAuthenticated} />
      {children}
      <Footer />
    </div>
  );
}
