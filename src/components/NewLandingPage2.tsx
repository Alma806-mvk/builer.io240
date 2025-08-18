import { useEffect, useRef, useState } from "react";
import * as React from "react";
import AuthModal from './AuthModal';

interface NewLandingPage2Props {
  onSignInClick: () => void;
  onStartCreating: () => void;
  onNavigateToSecondary?: () => void;
}

// Utility function for class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Button component with variants
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'brand' | 'hero' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";
    
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      brand: "bg-gradient-to-r from-[hsl(268_92%_60%)] to-[hsl(190_95%_60%)] text-white shadow-lg hover:opacity-95",
      hero: "border border-[hsl(var(--foreground)/0.08)] bg-[hsl(var(--foreground)/0.05)] backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--foreground)/0.05)] text-foreground hover:bg-[hsl(var(--foreground)/0.08)]",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
    };
    
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8"
    };

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// Card components
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

// GlowField component
const GlowField = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMove = (e: MouseEvent) => {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      node.style.setProperty("--gx", `${x}px`);
      node.style.setProperty("--gy", `${y}px`);
    };

    if (!prefersReduced) window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-60"
      style={{
        background: "radial-gradient(600px 600px at var(--gx) var(--gy), hsl(268 92% 60% / 0.15), transparent 60%)",
        maskImage: "radial-gradient(200px 200px at var(--gx) var(--gy), #000, transparent 70%)"
      }}
    />
  );
};

// InteractiveDemo component
const DemoStep = ({ 
  icon: Icon, 
  title, 
  description, 
  isActive, 
  onClick 
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "text-left p-3 rounded-lg border transition-all",
      isActive 
        ? 'border-[hsl(268_92%_60%/0.3)] bg-gradient-to-r from-[hsl(268_92%_60%/0.1)] to-[hsl(190_95%_60%/0.1)]' 
        : 'border-white/10 hover:border-white/20'
    )}
  >
    <div className="flex items-start gap-3">
      <div className={cn(
        "mt-1 rounded-md p-2",
        isActive 
          ? 'bg-gradient-to-br from-[hsl(268_92%_60%)] to-[hsl(190_95%_60%)]' 
          : 'bg-white/5 border border-white/10'
      )}>
        <Icon className={cn("h-4 w-4", isActive ? 'text-white' : 'text-muted-foreground')} />
      </div>
      <div>
        <h4 className={cn("font-medium text-sm", isActive ? 'text-foreground' : 'text-muted-foreground')}>
          {title}
        </h4>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  </button>
);

const InteractiveDemo = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: LineChart,
      title: "Analyze Trends",
      description: "Get insights on what's working in your niche",
      result: "📈 Trending topic: 'AI productivity tools' - 2.3M views this week"
    },
    {
      icon: Sparkles,
      title: "Generate Content",
      description: "AI creates multiple variations instantly",
      result: "✨ Generated 5 video scripts + 3 thumbnail concepts in 30 seconds"
    },
    {
      icon: ImageIcon,
      title: "Create Visuals",
      description: "Design thumbnails and graphics on the canvas",
      result: "🎨 Thumbnail A/B test ready - predicting 23% higher CTR"
    },
    {
      icon: CalendarIcon,
      title: "Schedule & Track",
      description: "Organize your content pipeline effortlessly",
      result: "📅 Content scheduled for next 2 weeks - all assets organized"
    }
  ];

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Play className="h-4 w-4 text-[hsl(268_92%_60%)]" />
          <span className="text-sm font-medium">Interactive Demo</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {steps.map((step, index) => (
              <DemoStep
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
                isActive={activeStep === index}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </div>
          
          <div className="bg-background/80 rounded-lg p-4 border border-white/10">
            <div className="h-32 bg-gradient-to-br from-[hsl(268_92%_60%/0.15)] to-[hsl(190_95%_60%/0.15)] rounded-lg flex items-center justify-center mb-3">
              <div className="text-center">
                {React.createElement(steps[activeStep].icon, { className: "h-8 w-8 mx-auto mb-2 text-[hsl(268_92%_60%)]" })}
                <p className="text-xs text-muted-foreground">Demo workspace</p>
              </div>
            </div>
            <p className="text-sm">{steps[activeStep].result}</p>
            <Button variant="outline" size="sm" className="w-full mt-3">
              Try this workflow <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ValueProposition component
const MetricCard = ({ 
  icon: Icon, 
  value, 
  label, 
  description 
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  description: string;
}) => (
  <Card className="border-white/10 bg-white/5 backdrop-blur">
    <CardContent className="p-4 text-center">
      <div className="rounded-full bg-gradient-to-br from-[hsl(268_92%_60%/0.15)] to-[hsl(190_95%_60%/0.15)] w-12 h-12 flex items-center justify-center mx-auto mb-3">
        <Icon className="h-6 w-6 text-[hsl(268_92%_60%)]" />
      </div>
      <div className="font-display text-2xl md:text-3xl text-[hsl(268_92%_60%)]">{value}</div>
      <div className="font-medium text-sm">{label}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

const ValueProposition = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl mb-3">
            Why creators choose CreateGen
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of creator-entrepreneurs who've streamlined their workflow and boosted productivity
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <MetricCard
            icon={Clock}
            value="15hrs"
            label="Saved weekly"
            description="Avg. time saved vs managing 8+ tools"
          />
          <MetricCard
            icon={TrendingUp}
            value="3x"
            label="Faster creation"
            description="From idea to published content"
          />
          <MetricCard
            icon={Users}
            value="2,500+"
            label="Beta creators"
            description="Already building with CreateGen"
          />
          <MetricCard
            icon={Zap}
            value="94%"
            label="Recommend us"
            description="Would suggest to other creators"
          />
        </div>

        <div className="mt-8 p-6 rounded-xl border border-white/10 bg-gradient-to-r from-[hsl(268_92%_60%/0.08)] to-[hsl(190_95%_60%/0.08)] text-center">
          <p className="text-lg font-medium">
            "Stop juggling 8 tools. Start creating with confidence."
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Replace Notion + Airtable + Canva + Buffer + Analytics tools with one focused workspace
          </p>
        </div>
      </div>
    </section>
  );
};

// MobileNavigation component
const MobileNavigation = ({ onSignInClick, onStartCreating }: { onSignInClick: () => void; onStartCreating: () => void; }) => {
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
            <Button variant="outline" size="sm" className="w-full mb-2" onClick={onSignInClick}>
              Sign in
            </Button>
            <Button variant="brand" size="sm" className="w-full" onClick={onStartCreating}>
              Start free trial
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Icons - using Lucide React icons
import {
  Sparkles,
  LineChart,
  ClipboardList,
  Image as ImageIcon,
  Calendar as CalendarIcon,
  GitBranch,
  Quote,
  Check,
  ArrowRight,
  Star,
  Shield,
  Clock,
  CreditCard,
  Users,
  Zap,
  BarChart3,
  Palette,
  Calendar,
  MessageSquare,
  Database,
  Globe,
  Settings,
  Headphones,
  Menu,
  X,
  Play,
  TrendingUp
} from "lucide-react";

// FeatureItem component
const FeatureItem = ({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) => (
  <div className="flex items-start gap-4">
    <div className="mt-1 rounded-md border border-white/10 bg-gradient-to-br from-[hsl(268_92%_60%/0.15)] to-[hsl(190_95%_60%/0.15)] p-2">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  </div>
);

// SocialProof component
const SocialProof = () => (
  <section aria-label="Early access metrics" className="py-8 md:py-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center gap-6">
        <p className="text-sm text-muted-foreground">Early access metrics</p>
        <div className="grid grid-cols-3 gap-4 md:gap-8 text-center max-w-2xl">
          <div>
            <div className="font-display text-xl md:text-2xl text-[hsl(268_92%_60%)]">2,500+</div>
            <p className="text-xs md:text-sm text-muted-foreground">Beta signups</p>
          </div>
          <div>
            <div className="font-display text-xl md:text-2xl text-[hsl(268_92%_60%)]">15hrs</div>
            <p className="text-xs md:text-sm text-muted-foreground">Avg. weekly savings</p>
          </div>
          <div>
            <div className="font-display text-xl md:text-2xl text-[hsl(268_92%_60%)]">94%</div>
            <p className="text-xs md:text-sm text-muted-foreground">Would recommend</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Placeholder images
const heroImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f3f4f6'/%3E%3Ctext x='400' y='280' text-anchor='middle' fill='%236b7280' font-size='24' font-family='system-ui'%3ECreateGen Studio%3C/text%3E%3Ctext x='400' y='320' text-anchor='middle' fill='%239ca3af' font-size='16' font-family='system-ui'%3EDashboard Demo%3C/text%3E%3C/svg%3E";
const workflowImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23f3f4f6'/%3E%3Ctext x='300' y='190' text-anchor='middle' fill='%236b7280' font-size='18' font-family='system-ui'%3EWorkflow%3C/text%3E%3Ctext x='300' y='220' text-anchor='middle' fill='%239ca3af' font-size='14' font-family='system-ui'%3EInsight → Creation → Organization%3C/text%3E%3C/svg%3E";

const NewLandingPage2 = ({ onSignInClick, onStartCreating, onNavigateToSecondary }: NewLandingPage2Props) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');

  const handleStartFree = () => {
    setAuthModalTab('signup');
    setIsAuthModalOpen(true);
  };

  const handleSignIn = () => {
    setAuthModalTab('signin'); 
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  // Canonical tag for SEO
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (link) {
      link.href = window.location.origin + "/";
    } else {
      const l = document.createElement("link");
      l.setAttribute("rel", "canonical");
      l.setAttribute("href", window.location.origin + "/");
      document.head.appendChild(l);
    }
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CreateGen Studio",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: "CreateGen Studio is the confident co‑pilot for creator‑entrepreneurs: plan insights, generate content, and organize your studio in one AI command center.",
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        name: "Creator Pro",
        price: "29",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        name: "Agency Pro",
        price: "79",
        priceCurrency: "USD",
      },
    ],
    brand: {
      "@type": "Brand",
      name: "CreateGen Studio",
    },
    url: typeof window !== "undefined" ? window.location.href : "https://creategen.studio/",
    image: heroImage,
  };

  return (
    <>
    <div
      className="new-landing-page-2" 
      style={{ 
        // Complete style isolation 
        isolation: 'isolate',
        contain: 'layout style',
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        color: 'hsl(210, 40%, 98%)',
        background: 'hsl(222.2, 84%, 4.9%)',
        lineHeight: '1.5',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        // CSS custom properties for the design system (DARK THEME)
        '--background': '222.2 84% 4.9%',
        '--foreground': '210 40% 98%',
        '--card': '222.2 84% 6.4%',
        '--card-foreground': '210 40% 98%',
        '--popover': '222.2 84% 6.4%',
        '--popover-foreground': '210 40% 98%',
        '--primary': '210 40% 98%',
        '--primary-foreground': '222.2 47.4% 11.2%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--muted': '217.2 32.6% 17.5%',
        '--muted-foreground': '215 20.2% 65.1%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--destructive': '0 62.8% 30.6%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--input': '217.2 32.6% 17.5%',
        '--ring': '212.7 26.8% 83.9%',
        '--radius': '0.75rem',
        '--accent-start': '268 92% 60%',
        '--accent-end': '190 95% 60%',
      }}
    >
      {/* Scoped styles */}
      <style>{`
        .new-landing-page-2 *,
        .new-landing-page-2 *::before,
        .new-landing-page-2 *::after {
          box-sizing: border-box;
        }
        
        .new-landing-page-2 .container {
          max-width: 1280px;
          margin: 0 auto;
          padding-left: 1rem;
          padding-right: 1rem;
        }
        
        .new-landing-page-2 .font-display {
          font-family: 'Space Grotesk', 'Inter', 'ui-sans-serif', 'sans-serif';
        }
        
        .new-landing-page-2 .text-muted-foreground {
          color: hsl(215, 20.2%, 65.1%);
        }

        .new-landing-page-2 .bg-background {
          background-color: hsl(222.2, 84%, 4.9%);
        }

        .new-landing-page-2 .bg-card {
          background-color: hsl(222.2, 84%, 6.4%);
        }

        .new-landing-page-2 .text-foreground {
          color: hsl(210, 40%, 98%);
        }
        
        .new-landing-page-2 .border-white\\/10 {
          border-color: rgba(255, 255, 255, 0.1);
        }
        
        .new-landing-page-2 .border-white\\/5 {
          border-color: rgba(255, 255, 255, 0.05);
        }
        
        .new-landing-page-2 .bg-white\\/5 {
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .new-landing-page-2 .bg-green-500\\/10 {
          background-color: rgba(34, 197, 94, 0.1);
        }
        
        .new-landing-page-2 .border-green-500\\/20 {
          border-color: rgba(34, 197, 94, 0.2);
        }
        
        .new-landing-page-2 .text-green-400 {
          color: rgb(74, 222, 128);
        }
        
        .new-landing-page-2 .text-green-500 {
          color: rgb(34, 197, 94);
        }
        
        .new-landing-page-2 .backdrop-blur {
          backdrop-filter: blur(8px);
        }
        
        .new-landing-page-2 .supports-\\[backdrop-filter\\]\\:bg-background\\/60 {
          background-color: hsla(222.2, 84%, 4.9%, 0.6);
        }
        
        .new-landing-page-2 .supports-\\[backdrop-filter\\]\\:bg-white\\/5 {
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .new-landing-page-2 .bg-card\\/60 {
          background-color: hsla(222.2, 84%, 6.4%, 0.6);
        }

        .new-landing-page-2 .bg-background\\/95 {
          background-color: hsla(222.2, 84%, 4.9%, 0.95);
        }

        .new-landing-page-2 .bg-background\\/80 {
          background-color: hsla(222.2, 84%, 4.9%, 0.8);
        }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[hsl(268_92%_60%)] to-[hsl(190_95%_60%)]" aria-hidden />
            <span className="font-display text-lg">CreateGen Studio</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Stories</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="hero" className="hidden sm:inline-flex text-sm" onClick={handleSignIn}>
              Sign in
            </Button>
            <Button variant="brand" className="text-sm" onClick={handleStartFree}>
              Start free trial
            </Button>
            <MobileNavigation onSignInClick={handleSignIn} onStartCreating={handleStartFree} />
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(268_92%_60%/0.15),transparent_60%)]" aria-hidden />
          <div className="container mx-auto px-4 pt-16 pb-8 md:pt-24 md:pb-12 relative">
            <GlowField />
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-6">
                <h1 className="font-display text-3xl md:text-5xl lg:text-6xl leading-tight">
                  Stop juggling 8 tools.
                  <span className="block bg-gradient-to-r from-[hsl(268_92%_60%)] to-[hsl(190_95%_60%)] bg-clip-text text-transparent">
                    Start creating faster.
                  </span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-prose">
                  Replace Notion + Airtable + Canva + Buffer with one focused workspace. Save 15+ hours weekly and ship content with confidence.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="brand" size="lg" className="text-base" onClick={handleStartFree}>
                    Start free trial <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button variant="outline" size="lg" className="backdrop-blur text-base">
                    <Star className="h-4 w-4 mr-1" /> View live demo
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-green-500" /> 30-day money back guarantee
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-green-500" /> Setup in under 60 seconds
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" /> No credit card required
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4" /> Cancel anytime
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative order-first md:order-last">
                <div className="hidden md:block">
                  <InteractiveDemo />
                </div>
                <div className="md:hidden">
                  <Card className="border-white/10 bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/5 shadow-xl">
                    <CardContent className="p-3">
                      <img
                        src={heroImage}
                        alt="CreateGen Studio dashboard demo with insights, generator, canvas and studio hub"
                        className="rounded-md shadow-2xl w-full h-auto"
                        loading="eager"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Interactive Demo */}
        <section className="md:hidden py-8">
          <div className="container mx-auto px-4">
            <InteractiveDemo />
          </div>
        </section>

        <SocialProof />

        <ValueProposition />

        {/* Problem / Solution */}
        <section id="problem" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-card/60 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl">Yesterday: chaos and context‑switching</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FeatureItem icon={GitBranch} title="Disconnected tools" desc="Charts, notes, prompts, and assets all live in different tabs." />
                  <FeatureItem icon={ClipboardList} title="Fragile workflows" desc="Manual copy‑paste between systems wastes time and breaks focus." />
                  <FeatureItem icon={ImageIcon} title="Design friction" desc="Visual production blocked by scattered assets and ad‑hoc file names." />
                </CardContent>
              </Card>

              <Card className="bg-card/60 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl">Today with CreateGen: unified mission control</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FeatureItem icon={LineChart} title="Insight & Strategy" desc="Trends, YouTube analysis, and a planner that turns data into direction." />
                  <FeatureItem icon={Sparkles} title="Creative Generation" desc="Generator + AI Assistant that helps you draft, iterate, and refine fast." />
                  <FeatureItem icon={CalendarIcon} title="Plan & Organize" desc="Studio Hub, Calendar, and History keep every asset and decision in one place." />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it works / Feature showcase */}
        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mb-8">
              <h2 className="font-display text-3xl md:text-4xl">From insight to publish — one flow</h2>
              <p className="text-muted-foreground mt-3">
                Strategy informs creation, creation feeds organization. Repeat with momentum.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src={workflowImage}
                  alt="Workflow: Insight & Strategy → Creative Generation → Organization"
                  className="rounded-lg border border-white/10 shadow-xl w-full h-auto"
                  loading="lazy"
                />
              </div>
              <div className="grid gap-6">
                <FeatureItem icon={LineChart} title="Insight & Strategy" desc="Trends, YT analysis, and a focused planner keep you decisive." />
                <FeatureItem icon={Sparkles} title="Generate & Iterate" desc="Use the Generator and AI Assistant to explore variants quickly." />
                <FeatureItem icon={ImageIcon} title="Visual Workspace" desc="Canvas and Thumbnails bring ideas to life without leaving the flow." />
                <FeatureItem icon={CalendarIcon} title="Plan & Organize" desc="Studio Hub, Calendar, and History to manage releases end‑to‑end." />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 md:py-24 bg-[radial-gradient(ellipse_at_center,hsl(268_92%_60%/0.12),transparent_60%)]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Quote className="mx-auto h-8 w-8 mb-6 text-muted-foreground" />
              <p className="text-xl md:text-2xl leading-relaxed">
                "CreateGen is my creative autopilot. I finally ship faster without sacrificing quality — everything I need lives in one clean place."
              </p>
              <p className="mt-4 text-sm text-muted-foreground">Ava M., YouTube Creator & Studio Owner</p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-4">
                <Shield className="h-4 w-4" />
                30-day money back guarantee
              </div>
            </div>
            <div className="max-w-2xl mb-8 md:mb-12 text-center mx-auto">
              <h2 className="font-display text-2xl md:text-4xl">Choose your creative power level</h2>
              <p className="text-muted-foreground mt-3">Start free. Scale when ready. ROI guaranteed or money back.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {/* Free */}
              <Card className="bg-card/60 border-white/10 flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Free</CardTitle>
                  <p className="text-xs text-muted-foreground">Perfect for exploring</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="text-2xl md:text-3xl font-display">$0<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                  <ul className="mt-4 space-y-3 text-sm">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> <span><strong>50 AI generations/month</strong></span></li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> 5 content templates</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Basic trend insights</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Simple canvas tools</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Community support</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Mobile app access</li>
                  </ul>
                  <Button variant="brand" className="mt-6 text-sm" onClick={handleStartFree}>Start free trial</Button>
                </CardContent>
              </Card>

              {/* Creator Pro */}
              <Card className="relative bg-card/60 border-white/10 flex flex-col outline outline-2 outline-offset-0 outline-[hsl(268_92%_60%/0.4)] scale-105">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[hsl(268_92%_60%)] to-[hsl(190_95%_60%)] text-[11px] text-white border border-white/10">
                  Most Popular
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Creator Pro</CardTitle>
                  <p className="text-xs text-muted-foreground">For serious creators</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl md:text-3xl font-display">$29<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                    <div className="text-xs text-muted-foreground line-through">$39</div>
                  </div>
                  <p className="text-xs text-[hsl(268_92%_60%)] mb-4">Save $120/year with annual plan</p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> <span><strong>1,000 AI generations/month</strong></span></li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> <strong>Everything in Free</strong></li>
                    <li className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-green-500" /> Advanced analytics & insights</li>
                    <li className="flex items-center gap-2"><Palette className="h-4 w-4 text-green-500" /> Pro design templates (50+)</li>
                    <li className="flex items-center gap-2"><Calendar className="h-4 w-4 text-green-500" /> Content calendar & scheduling</li>
                    <li className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-green-500" /> AI assistant & chat support</li>
                    <li className="flex items-center gap-2"><Database className="h-4 w-4 text-green-500" /> Unlimited project storage</li>
                    <li className="flex items-center gap-2"><Globe className="h-4 w-4 text-green-500" /> YouTube & TikTok integration</li>
                    <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-green-500" /> Priority processing (2x faster)</li>
                    <li className="flex items-center gap-2"><Shield className="h-4 w-4 text-green-500" /> <strong>ROI guarantee: Save 15+ hrs/week</strong></li>
                  </ul>
                  <Button variant="brand" className="mt-6 text-sm" onClick={handleStartFree}>Start 14-day trial</Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">Then $29/month • Cancel anytime</p>
                </CardContent>
              </Card>

              {/* Agency Pro */}
              <Card className="bg-card/60 border-white/10 flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Agency Pro</CardTitle>
                  <p className="text-xs text-muted-foreground">For teams & agencies</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl md:text-3xl font-display">$79<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                    <div className="text-xs text-muted-foreground line-through">$99</div>
                  </div>
                  <p className="text-xs text-[hsl(268_92%_60%)] mb-4">Save $240/year with annual plan</p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> <span><strong>Unlimited generations</strong></span></li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> <strong>Everything in Creator Pro</strong></li>
                    <li className="flex items-center gap-2"><Users className="h-4 w-4 text-green-500" /> Team collaboration (up to 10 users)</li>
                    <li className="flex items-center gap-2"><Settings className="h-4 w-4 text-green-500" /> Advanced workflow automation</li>
                    <li className="flex items-center gap-2"><Database className="h-4 w-4 text-green-500" /> White-label options available</li>
                    <li className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-green-500" /> Team performance analytics</li>
                    <li className="flex items-center gap-2"><Globe className="h-4 w-4 text-green-500" /> API access & integrations</li>
                    <li className="flex items-center gap-2"><Headphones className="h-4 w-4 text-green-500" /> Dedicated account manager</li>
                    <li className="flex items-center gap-2"><Shield className="h-4 w-4 text-green-500" /> Priority support (1hr response)</li>
                    <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-green-500" /> <strong>Custom training & onboarding</strong></li>
                  </ul>
                  <Button variant="outline" className="mt-6 text-sm">Schedule demo</Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">Custom enterprise plans available</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8 md:mt-12">
              <p className="text-sm text-muted-foreground mb-4">All plans include 30-day money-back guarantee • No setup fees • Cancel anytime</p>
              <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" /> SSL secured
                </div>
                <div className="flex items-center gap-1">
                  <Database className="h-3 w-3" /> GDPR compliant
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3" /> 99.9% uptime
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r from-[hsl(268_92%_60%/0.15)] to-[hsl(190_95%_60%/0.15)] p-8 md:p-12 text-center">
              <h3 className="font-display text-xl md:text-3xl">Join 2,500+ creators building faster</h3>
              <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                Early access metrics: 15hrs saved weekly • 94% recommend • 3x faster content creation
              </p>
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <Button size="lg" variant="brand" className="text-base" onClick={handleStartFree}>
                  Start free trial <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-green-500" /> 30-day guarantee
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-green-500" /> Setup in 60 seconds
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-3 w-3" /> No credit card required
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 border-t border-white/5">
        <div className="container mx-auto px-4 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} CreateGen Studio</p>
          <nav className="flex gap-6">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
          </nav>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:hidden bg-background/95 backdrop-blur border-t border-white/10">
        <Button variant="brand" size="lg" className="w-full text-base" onClick={handleStartFree}>
          Start free trial <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

    </div>

    {/* Render AuthModal outside the isolated container to prevent CSS conflicts */}
    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={handleCloseAuthModal}
      onAuthSuccess={handleAuthSuccess}
      defaultTab={authModalTab}
      onNavigateToTerms={() => {
        const url = window.location.origin + '/terms';
        window.open(url, '_blank');
      }}
      onNavigateToPrivacy={() => {
        const url = window.location.origin + '/privacy';
        window.open(url, '_blank');
      }}
    />
    </>
  );
};

export default NewLandingPage2;
