export const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="bg-gradient-brand bg-clip-text text-transparent font-display text-lg font-semibold">CreateGen Studio</div>
          <p className="text-sm text-muted-foreground mt-2">
            The confident co‑pilot for creator‑entrepreneurs.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          <ul className="space-y-2">
            <li><a href="/features" className="hover:text-foreground">Features</a></li>
            <li><a href="/pricing" className="hover:text-foreground">Pricing</a></li>
            <li><a href="/faq" className="hover:text-foreground">FAQ</a></li>
          </ul>
        </div>
        <div className="text-sm text-muted-foreground">
          <ul className="space-y-2">
            <li><a href="/terms" className="hover:text-foreground">Terms</a></li>
            <li><a href="/privacy" className="hover:text-foreground">Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} CreateGen Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
