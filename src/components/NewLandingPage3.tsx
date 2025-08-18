import { useEffect, useState } from "react";
import * as React from "react";
import AuthModal from './AuthModal';

interface NewLandingPage3Props {
  onSignInClick: () => void;
  onStartCreating: () => void;
  onNavigateToSecondary?: () => void;
}

// Utility function for class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Button component with variants (based on original design)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'hero' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";
    
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-luxury",
      hero: "bg-gradient-primary text-white font-semibold shadow-luxury hover:shadow-glow hover:scale-105 transition-all duration-300",
      outline: "border border-border bg-transparent text-foreground hover:bg-secondary/50 hover:border-primary/50",
      ghost: "hover:bg-secondary/50 hover:text-foreground"
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

// Icons - using Lucide React icons
import {
  Sparkles,
  ArrowRight,
  Play,
  Target,
  Zap,
  Palette,
  Calendar,
  Check,
  Star,
  Clock,
  Shield,
  Users,
  BarChart3,
  MessageSquare,
  Database,
  Globe,
  Settings,
  Headphones,
  Menu,
  X,
  CreditCard,
  CheckCircle,
  XCircle,
  TrendingUp,
  Quote,
  Crown
} from "lucide-react";

// Header component (exact replica)
const Header = ({ onSignInClick, onStartCreating }: { onSignInClick: () => void; onStartCreating: () => void; }) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gradient">CreateGen Studio</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
            Reviews
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onSignInClick}>
            Sign In
          </Button>
          <Button variant="hero" size="sm" onClick={onStartCreating}>
            Start Free
          </Button>
        </div>
      </div>
    </header>
  );
};

// Hero Section component (exact replica)
const HeroSection = ({ onStartCreating }: { onStartCreating: () => void; }) => {
  const heroImage = "https://cdn.builder.io/api/v1/image/assets%2Fb625c43ff08c46c7a2bec883d918b9b7%2Fbee1af4b13ce4aa7a9187c1fe55932b2?format=webp&width=800";
  const heroBg = "https://cdn.builder.io/api/v1/image/assets%2F3858cb43d581475eb9237515c89928d6%2F2745ba4a944a4eec8364f79912e0c45d?format=webp&width=800";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2Fb625c43ff08c46c7a2bec883d918b9b7%2F70ab57db01c34146a3f1e4af2002b0b3?format=webp&width=800"
          alt="Hero background"
          className="w-full h-full object-cover scale-120"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-glow border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm text-muted-foreground">Your Confident Co-Pilot for Content Creation</span>
            </div>
            
            <h1 className="text-hero text-gradient leading-tight">
              One Studio.
              <br />
              <span className="text-foreground">Infinite Creation.</span>
            </h1>
            
            <p className="text-body-large text-muted-foreground max-w-xl">
              Transform your chaotic creative workflow into a seamless, intelligent ecosystem. 
              From strategy to creation to organization—all in one powerful platform.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center px-3 py-2 rounded-lg bg-secondary/50 border border-border">
                <Target className="w-4 h-4 text-primary mr-2" />
                <span className="text-sm">Strategy & Insights</span>
              </div>
              <div className="flex items-center px-3 py-2 rounded-lg bg-secondary/50 border border-border">
                <Zap className="w-4 h-4 text-accent mr-2" />
                <span className="text-sm">AI Generation</span>
              </div>
              <div className="flex items-center px-3 py-2 rounded-lg bg-secondary/50 border border-border">
                <Palette className="w-4 h-4 text-primary mr-2" />
                <span className="text-sm">Visual Workspace</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="hero" size="lg" className="group" onClick={onStartCreating}>
                Start Building for Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="group">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-6 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">50K+</div>
                <div className="text-sm text-muted-foreground">Creators</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">1M+</div>
                <div className="text-sm text-muted-foreground">Content Pieces</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative z-20">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-700 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 p-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fb625c43ff08c46c7a2bec883d918b9b7%2Fbee1af4b13ce4aa7a9187c1fe55932b2?format=webp&width=800"
                alt="CreateGen Studio Dashboard"
                className="w-full h-auto rounded-xl hover:scale-105 z-30 relative transition-transform duration-700 ease-out animate-bounce"
                style={{ transform: 'translateY(-2px)', animationDuration: '4s', animationIterationCount: 'infinite' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl z-10" />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-2xl z-40" style={{ animation: 'pulse 2s infinite' }}>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">Live Generation</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-2xl z-40">
              <div className="text-sm text-gray-300">⚡ 47 ideas generated</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Social Proof Bar component (exact replica)
const SocialProofBar = () => {
  const companies = [
    "YouTube",
    "TikTok",
    "Instagram", 
    "Twitter",
    "LinkedIn",
    "Twitch"
  ];

  return (
    <section className="py-16 border-b border-border">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-muted-foreground text-sm uppercase tracking-wider">
            Trusted by creators on every platform
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {companies.map((company, index) => (
            <div 
              key={company}
              className="flex items-center justify-center h-12 px-6 text-muted-foreground font-medium hover:text-foreground transition-colors"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {company}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-8 h-8 rounded-full bg-gradient-primary border-2 border-background flex items-center justify-center text-xs text-white font-medium"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span>Join 50,000+ creators who've transformed their workflow</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Problem Solution Section component (exact replica)
const ProblemSolutionSection = () => {
  const problemPoints = [
    "Juggling 12+ disconnected tools",
    "Spending hours on repetitive tasks",
    "Missing trends and opportunities",
    "Inconsistent content quality",
    "Overwhelming creative chaos"
  ];

  const solutionPoints = [
    "One unified command center",
    "AI-powered automation",
    "Real-time trend insights",
    "Consistent, high-quality output",
    "Organized, streamlined workflow"
  ];

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-display text-gradient mb-6">
            From Chaos to Control
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Stop juggling dozens of tools. Start creating with confidence.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Problem Side */}
          <div className="space-y-6">
            <div className="text-center lg:text-right">
              <h3 className="text-headline text-destructive mb-4">The Old Way</h3>
              <p className="text-muted-foreground mb-6">Scattered, stressful, and inefficient</p>
            </div>
            
            <div className="space-y-4">
              {problemPoints.map((point, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-end space-x-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20"
                >
                  <span className="text-right text-foreground">{point}</span>
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center animate-pulse">
              <ArrowRight className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Solution Side */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h3 className="text-headline text-primary mb-4">The CreateGen Way</h3>
              <p className="text-muted-foreground mb-6">Unified, intelligent, and empowering</p>
            </div>
            
            <div className="space-y-4">
              {solutionPoints.map((point, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg bg-primary/5 border border-primary/20"
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gradient">5x</div>
              <div className="text-muted-foreground">Faster Content Creation</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gradient">90%</div>
              <div className="text-muted-foreground">Less Tool Switching</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gradient">300%</div>
              <div className="text-muted-foreground">Better Engagement</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// How It Works Section component (exact replica)
const HowItWorksSection = () => {
  const steps = [
    {
      icon: TrendingUp,
      title: "Insight & Strategy",
      description: "Analyze trends, research competitors, and plan your content strategy with AI-powered insights.",
      features: ["Trend Analysis", "YT Analytics", "Strategy Planner"]
    },
    {
      icon: Zap,
      title: "Creative Generation",
      description: "Generate high-quality content ideas, scripts, and creative assets with our intelligent AI assistant.",
      features: ["AI Generator", "Content Assistant", "Template Library"]
    },
    {
      icon: Palette,
      title: "Visual Workspace",
      description: "Design thumbnails, create visual content, and organize your creative assets in one unified canvas.",
      features: ["Design Canvas", "Thumbnail Maker", "Asset Library"]
    },
    {
      icon: Calendar,
      title: "Planning & Organization",
      description: "Schedule content, track progress, and maintain a clear overview of your entire creative pipeline.",
      features: ["Studio Hub", "Content Calendar", "Progress Tracking"]
    }
  ];

  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-display text-gradient mb-6">
            How It Works
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            From initial idea to published content, CreateGen Studio guides you through every step of your creative journey.
          </p>
        </div>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm text-primary font-medium">
                      Step {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-headline">{step.title}</h3>
                  <p className="text-body text-muted-foreground">{step.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {step.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 rounded-full bg-secondary text-sm text-secondary-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Visual */}
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="relative rounded-2xl bg-gradient-subtle border border-border p-8 shadow-soft">
                    <div className="w-full h-64 bg-secondary/30 rounded-xl flex items-center justify-center">
                      <step.icon className="w-16 h-16 text-primary animate-float" />
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-4 h-4 bg-primary rounded-full animate-pulse" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 bg-accent/50 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="flex justify-center mt-12">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section component (exact replica)
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      platform: "YouTube (2.5M subscribers)",
      content: "CreateGen Studio transformed my entire workflow. What used to take me 8 hours now takes 2. The AI insights are incredibly accurate.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Social Media Manager",
      platform: "Agency (50+ clients)",
      content: "Managing content for 50+ clients was chaos until CreateGen. The unified dashboard and automation features are game-changers.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emma Thompson",
      role: "TikTok Creator",
      platform: "TikTok (1.2M followers)",
      content: "The trend analysis feature helped me identify viral opportunities before my competitors. My engagement rate increased by 300%.",
      rating: 5,
      avatar: "ET"
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-display text-gradient mb-6">
            Loved by Creators Worldwide
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Join thousands of creators who've transformed their content workflow with CreateGen Studio.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="relative bg-card border border-border rounded-2xl p-8 shadow-soft hover:shadow-luxury transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-primary/20 mb-6" />
              
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-primary fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-body text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  <div className="text-xs text-primary">{testimonial.platform}</div>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-glow opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-6 bg-card border border-border rounded-xl px-8 py-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">4.9/5 average rating</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">2,000+ reviews</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">99.9% satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Pricing Section component (exact replica)
const PricingSection = ({ onStartCreating }: { onStartCreating: () => void; }) => {
  const plans = [
    {
      name: "Free",
      subtitle: "The Starter Kit",
      price: 0,
      description: "Perfect for getting started and exploring the platform",
      icon: Sparkles,
      features: [
        "Limited AI generations (50/month)",
        "Basic templates",
        "Core analytics",
        "Community support",
        "1 workspace"
      ],
      cta: "Start Free",
      popular: false,
      accent: false
    },
    {
      name: "Creator Pro",
      subtitle: "The Growth Engine",
      price: 29,
      description: "Everything you need to scale your content creation",
      icon: Zap,
      features: [
        "Unlimited AI generations",
        "Pro templates & assets",
        "Advanced analytics",
        "Priority support",
        "5 workspaces",
        "Trend insights",
        "Export capabilities",
        "Custom branding"
      ],
      cta: "Start 14-Day Trial",
      popular: true,
      accent: true
    },
    {
      name: "Agency Pro",
      subtitle: "The Command Center",
      price: 79,
      description: "Ultimate power for teams and professional creators",
      icon: Crown,
      features: [
        "Everything in Creator Pro",
        "Unlimited workspaces",
        "Team collaboration",
        "White-label options",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "Enterprise analytics"
      ],
      cta: "Contact Sales",
      popular: false,
      accent: false
    }
  ];

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-display text-gradient mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your creative journey. All plans include our core features with no hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-2xl border p-8 transition-all duration-300 hover:shadow-luxury ${
                plan.popular 
                  ? 'border-primary bg-gradient-glow shadow-glow scale-105' 
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-8">
                <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                  plan.accent ? 'bg-gradient-primary' : 'bg-secondary'
                }`}>
                  <plan.icon className={`w-6 h-6 ${plan.accent ? 'text-white' : 'text-foreground'}`} />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-primary font-medium mb-4">{plan.subtitle}</p>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button 
                variant={plan.popular ? "hero" : "outline"} 
                className="w-full"
                size="lg"
                onClick={onStartCreating}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Questions about pricing? 
            <a href="#" className="text-primary hover:underline ml-1">Contact our team</a>
          </p>
          <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
            <span>✓ 14-day free trial</span>
            <span>✓ Cancel anytime</span>
            <span>✓ No setup fees</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Final CTA Section component (exact replica)
const FinalCTASection = ({ onStartCreating }: { onStartCreating: () => void; }) => {
  return (
    <section className="py-24 bg-gradient-primary relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-white mr-2" />
            <span className="text-sm text-white">Join 50,000+ creators today</span>
          </div>

          <h2 className="text-display text-white mb-6">
            Ready to Transform Your
            <br />
            Creative Workflow?
          </h2>
          
          <p className="text-body-large text-white/80 mb-12 max-w-2xl mx-auto">
            Stop juggling tools and start creating with confidence. Your unified command center for content creation awaits.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 border-white group"
              onClick={onStartCreating}
            >
              Start Building for Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="text-white/60 text-sm">
              No credit card required • 14-day free trial
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-16 pt-16 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">4.9/5</div>
              <div className="text-sm text-white/60">User Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-sm text-white/60">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-white/60">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">SOC 2</div>
              <div className="text-sm text-white/60">Compliant</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer component (exact replica)
const Footer = () => {
  const links = {
    Product: ["Features", "Pricing", "Templates", "Integrations", "API"],
    Company: ["About", "Blog", "Careers", "Press", "Partners"],
    Resources: ["Help Center", "Community", "Tutorials", "Status", "Roadmap"],
    Legal: ["Privacy", "Terms", "Security", "Compliance", "GDPR"]
  };

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">CreateGen Studio</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              The all-in-one creative command center for modern content creators.
            </p>
            <div className="flex space-x-4">
              {["Twitter", "LinkedIn", "YouTube", "Discord"].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground mb-4">{category}</h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a 
                      href="#" 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 CreateGen Studio. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">Made with ❤️ for creators</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const NewLandingPage3 = ({ onSignInClick, onStartCreating, onNavigateToSecondary }: NewLandingPage3Props) => {
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

  return (
    <>
    <div
      className="new-landing-page-3" 
      style={{ 
        // Complete style isolation 
        isolation: 'isolate',
        contain: 'layout style',
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: 'hsl(210, 40%, 98%)',
        background: 'hsl(222, 20%, 6%)',
        lineHeight: '1.5',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        // CSS custom properties for the design system (EXACT GEN MAGIC THEME)
        '--background': '222 20% 6%',
        '--foreground': '210 40% 98%',
        '--card': '225 20% 8%',
        '--card-foreground': '210 40% 98%',
        '--popover': '225 20% 8%',
        '--popover-foreground': '210 40% 98%',
        '--primary': '260 100% 70%',
        '--primary-foreground': '210 40% 98%',
        '--primary-glow': '280 100% 80%',
        '--secondary': '225 15% 12%',
        '--secondary-foreground': '210 40% 98%',
        '--muted': '225 15% 10%',
        '--muted-foreground': '215 20.2% 65.1%',
        '--accent': '190 100% 70%',
        '--accent-foreground': '210 40% 98%',
        '--destructive': '0 62.8% 60%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '225 15% 15%',
        '--input': '225 15% 12%',
        '--ring': '260 100% 70%',
        '--radius': '0.75rem',
        '--gradient-primary': 'linear-gradient(135deg, hsl(260 100% 70%), hsl(190 100% 70%))',
        '--gradient-subtle': 'linear-gradient(180deg, hsl(225 20% 8%), hsl(225 20% 6%))',
        '--gradient-glow': 'linear-gradient(135deg, hsl(260 100% 70% / 0.2), hsl(190 100% 70% / 0.2))',
        '--shadow-luxury': '0 25px 50px -12px hsl(260 100% 70% / 0.25)',
        '--shadow-glow': '0 0 50px hsl(260 100% 70% / 0.3)',
        '--shadow-soft': '0 10px 30px -10px hsl(225 20% 4% / 0.8)',
      }}
    >
      {/* Scoped styles for exact original design system */}
      <style>{`
        .new-landing-page-3 *,
        .new-landing-page-3 *::before,
        .new-landing-page-3 *::after {
          box-sizing: border-box;
        }
        
        .new-landing-page-3 .container {
          max-width: 1280px;
          margin: 0 auto;
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        }
        
        .new-landing-page-3 .text-hero {
          font-size: 3rem;
          line-height: 1.1;
          font-weight: 700;
          letter-spacing: -0.025em;
        }
        
        .new-landing-page-3 .text-display {
          font-size: 2.25rem;
          line-height: 1.2;
          font-weight: 700;
          letter-spacing: -0.025em;
        }
        
        .new-landing-page-3 .text-headline {
          font-size: 1.5rem;
          line-height: 1.3;
          font-weight: 600;
          letter-spacing: -0.025em;
        }
        
        .new-landing-page-3 .text-body-large {
          font-size: 1.125rem;
          line-height: 1.6;
        }
        
        .new-landing-page-3 .text-body {
          font-size: 1rem;
          line-height: 1.6;
        }
        
        .new-landing-page-3 .text-gradient {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .new-landing-page-3 .text-muted-foreground {
          color: hsl(215, 20.2%, 65.1%);
        }

        .new-landing-page-3 .bg-background {
          background-color: hsl(222, 20%, 6%);
        }

        .new-landing-page-3 .bg-card {
          background-color: hsl(225, 20%, 8%);
        }

        .new-landing-page-3 .text-foreground {
          color: hsl(210, 40%, 98%);
        }
        
        .new-landing-page-3 .text-primary {
          color: hsl(260, 100%, 70%);
        }
        
        .new-landing-page-3 .text-accent {
          color: hsl(190, 100%, 70%);
        }
        
        .new-landing-page-3 .text-destructive {
          color: hsl(0, 62.8%, 60%);
        }
        
        .new-landing-page-3 .border-border {
          border-color: hsl(225, 15%, 15%);
        }
        
        .new-landing-page-3 .border-primary\\/20 {
          border-color: hsla(260, 100%, 70%, 0.2);
        }
        
        .new-landing-page-3 .border-primary\\/30 {
          border-color: hsla(260, 100%, 70%, 0.3);
        }
        
        .new-landing-page-3 .border-destructive\\/20 {
          border-color: hsla(0, 62.8%, 60%, 0.2);
        }
        
        .new-landing-page-3 .bg-secondary {
          background-color: hsl(225, 15%, 12%);
        }
        
        .new-landing-page-3 .bg-secondary\\/50 {
          background-color: hsla(225, 15%, 12%, 0.5);
        }
        
        .new-landing-page-3 .bg-secondary\\/30 {
          background-color: hsla(225, 15%, 12%, 0.3);
        }
        
        .new-landing-page-3 .text-secondary-foreground {
          color: hsl(210, 40%, 98%);
        }
        
        .new-landing-page-3 .bg-primary\\/5 {
          background-color: hsla(260, 100%, 70%, 0.05);
        }
        
        .new-landing-page-3 .bg-destructive\\/5 {
          background-color: hsla(0, 62.8%, 60%, 0.05);
        }
        
        .new-landing-page-3 .bg-gradient-primary {
          background: var(--gradient-primary);
        }
        
        .new-landing-page-3 .bg-gradient-subtle {
          background: var(--gradient-subtle);
        }
        
        .new-landing-page-3 .bg-gradient-glow {
          background: var(--gradient-glow);
        }
        
        .new-landing-page-3 .shadow-luxury {
          box-shadow: var(--shadow-luxury);
        }
        
        .new-landing-page-3 .shadow-glow {
          box-shadow: var(--shadow-glow);
        }
        
        .new-landing-page-3 .shadow-soft {
          box-shadow: var(--shadow-soft);
        }
        
        .new-landing-page-3 .backdrop-blur-lg {
          backdrop-filter: blur(16px);
        }
        
        .new-landing-page-3 .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
        
        .new-landing-page-3 .bg-background\\/80 {
          background-color: hsla(222, 20%, 6%, 0.8);
        }
        
        .new-landing-page-3 .bg-background\\/90 {
          background-color: hsla(222, 20%, 6%, 0.9);
        }
        
        .new-landing-page-3 .bg-background\\/70 {
          background-color: hsla(222, 20%, 6%, 0.7);
        }
        
        .new-landing-page-3 .bg-white\\/10 {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .new-landing-page-3 .bg-white\\/90 {
          background-color: rgba(255, 255, 255, 0.9);
        }
        
        .new-landing-page-3 .border-white\\/20 {
          border-color: rgba(255, 255, 255, 0.2);
        }
        
        .new-landing-page-3 .text-white {
          color: white;
        }
        
        .new-landing-page-3 .text-white\\/80 {
          color: rgba(255, 255, 255, 0.8);
        }
        
        .new-landing-page-3 .text-white\\/60 {
          color: rgba(255, 255, 255, 0.6);
        }
        
        .new-landing-page-3 .border-white {
          border-color: white;
        }
        
        .new-landing-page-3 .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .new-landing-page-3 .animate-glow {
          animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes glow {
          from { opacity: 0.5; }
          to { opacity: 1; }
        }
        
        @media (min-width: 640px) {
          .new-landing-page-3 .text-hero {
            font-size: 3.75rem;
          }
          .new-landing-page-3 .text-display {
            font-size: 2.5rem;
          }
          .new-landing-page-3 .text-headline {
            font-size: 1.875rem;
          }
        }
        
        @media (min-width: 1024px) {
          .new-landing-page-3 .text-hero {
            font-size: 4.5rem;
          }
          .new-landing-page-3 .text-display {
            font-size: 3rem;
          }
        }
      `}</style>

      <Header onSignInClick={handleSignIn} onStartCreating={handleStartFree} />
      <main>
        <HeroSection onStartCreating={handleStartFree} />
        <SocialProofBar />
        <ProblemSolutionSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection onStartCreating={handleStartFree} />
        <FinalCTASection onStartCreating={handleStartFree} />
      </main>
      <Footer />
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

export default NewLandingPage3;
