import { Button } from "@/components/ui/button-enhanced"
import { 
  Sparkles, 
  ArrowRight, 
  Play,
  Zap
} from "lucide-react"
import heroBackground from "@/assets/hero-background.jpg"

export function StudioHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-8">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src={heroBackground}
          alt="CreateGen Studio Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/90 via-bg-primary/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-primary-muted" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 lg:p-16">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm font-medium text-text-secondary mb-6 animate-fade-in">
            <Zap className="w-4 h-4 text-accent-purple" />
            Powered by Advanced AI
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <span className="text-text-primary">Create </span>
            <span className="gradient-text">Anything</span>
            <br />
            <span className="text-text-primary">with AI</span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-text-secondary mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: "200ms" }}>
            Transform your ideas into stunning visuals, compelling copy, and engaging content using our suite of AI-powered creative tools.
          </p>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <Button variant="hero" size="xl" className="gap-3 group">
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-normal" />
              Start Creating
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-normal" />
            </Button>
            
            <Button variant="secondary" size="xl" className="gap-3 group">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-normal" />
              Watch Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border-secondary/50 animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div>
              <p className="text-2xl font-bold text-text-primary">50K+</p>
              <p className="text-text-tertiary text-sm">Creators</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">1M+</p>
              <p className="text-text-tertiary text-sm">Generations</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">99.9%</p>
              <p className="text-text-tertiary text-sm">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 right-8 w-2 h-2 bg-accent-purple rounded-full animate-pulse opacity-60" />
      <div className="absolute top-1/2 right-24 w-3 h-3 bg-accent-cyan rounded-full animate-pulse opacity-40" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-1/3 right-16 w-1.5 h-1.5 bg-accent-success rounded-full animate-pulse opacity-50" style={{ animationDelay: "2s" }} />
    </div>
  )
}