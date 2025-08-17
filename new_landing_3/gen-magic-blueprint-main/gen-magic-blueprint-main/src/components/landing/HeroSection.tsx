import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Zap, Target, Palette } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";
import heroBg from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Hero background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90" />
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
              The All-in-One
              <br />
              <span className="text-foreground">Creator Command Center</span>
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
              <Button variant="hero" size="lg" className="group">
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
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-luxury border border-border bg-gradient-subtle p-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fb625c43ff08c46c7a2bec883d918b9b7%2Fbee1af4b13ce4aa7a9187c1fe55932b2?format=webp&width=800"
                alt="CreateGen Studio Dashboard"
                className="w-full h-auto rounded-xl animate-float"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-xl" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-card border border-border rounded-xl p-4 shadow-soft animate-glow">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">Live Generation</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl p-4 shadow-soft">
              <div className="text-sm text-muted-foreground">⚡ 47 ideas generated</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
