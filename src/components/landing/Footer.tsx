interface FooterProps {
  onNavigateToSecondary?: () => void;
}

const Footer = ({ onNavigateToSecondary }: FooterProps) => {
  return (
    <footer className="border-t border-border/60 bg-background/70 py-10">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} CreateGen Studio. All rights reserved.</p>
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <button onClick={() => onNavigateToSecondary && onNavigateToSecondary()} className="hover:text-foreground border-none bg-transparent cursor-pointer">Features</button>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
