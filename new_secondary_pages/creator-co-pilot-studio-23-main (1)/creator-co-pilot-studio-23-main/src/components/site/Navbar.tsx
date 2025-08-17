import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const navCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground";

  return (
    <header className="sticky top-0 z-40">
      <div className="glass border-b">
        <nav className="container h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-gradient-brand bg-clip-text text-transparent font-display text-lg font-semibold">CreateGen Studio</span>
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            <li><NavLink to="/features" className={navCls}>Features</NavLink></li>
            <li><NavLink to="/pricing" className={navCls}>Pricing</NavLink></li>
            <li><NavLink to="/faq" className={navCls}>FAQ</NavLink></li>
          </ul>

          <div className="flex items-center gap-3">
            <NavLink to="/auth" className="text-sm story-link hidden sm:inline-block">Sign in</NavLink>
            <Link to="/pricing">
              <Button variant="gradient" size="sm">Start free</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
