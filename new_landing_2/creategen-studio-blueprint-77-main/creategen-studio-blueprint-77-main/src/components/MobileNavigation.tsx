import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-white/10 p-4 space-y-4 z-40">
          <a 
            href="#features" 
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Features
          </a>
          <a 
            href="#pricing" 
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Pricing
          </a>
          <a 
            href="#testimonials" 
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Stories
          </a>
          <div className="pt-2 border-t border-white/10">
            <Button variant="outline" size="sm" className="w-full mb-2">
              Sign in
            </Button>
            <Button variant="brand" size="sm" className="w-full">
              Start free trial
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}