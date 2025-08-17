import { TrendingUp, Zap, Palette, Calendar, ArrowRight } from "lucide-react";

export const HowItWorksSection = () => {
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