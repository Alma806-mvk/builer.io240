import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between">
        <a href="#" className="inline-flex items-center gap-2 font-semibold tracking-tight">
          <span className="h-2 w-2 rounded-full bg-brand-alt shadow-glow" />
          <span>CreateGen Studio</span>
        </a>
        <div className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <a href="#pricing" className="hidden md:inline-flex"><Button variant="outline" size="sm">See Pricing</Button></a>
          <a href="#pricing"><Button variant="gradient" size="sm">Get started</Button></a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
