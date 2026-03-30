import NavBar from "./NavigationBar";

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
      {children}
    </div>
  );
}