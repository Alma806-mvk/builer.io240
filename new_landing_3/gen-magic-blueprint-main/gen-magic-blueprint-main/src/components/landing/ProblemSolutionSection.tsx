import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

export const ProblemSolutionSection = () => {
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