import { useState } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  LineChart, 
  Sparkles, 
  Image as ImageIcon, 
  Calendar as CalendarIcon,
  ArrowRight,
  Play
} from "lucide-react";

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
    className={`text-left p-3 rounded-lg border transition-all ${
      isActive 
        ? 'border-[hsl(var(--accent-start)/0.3)] bg-gradient-to-r from-[hsl(var(--accent-start)/0.1)] to-[hsl(var(--accent-end)/0.1)]' 
        : 'border-white/10 hover:border-white/20'
    }`}
  >
    <div className="flex items-start gap-3">
      <div className={`mt-1 rounded-md p-2 ${
        isActive 
          ? 'bg-gradient-to-br from-[hsl(var(--accent-start))] to-[hsl(var(--accent-end))]' 
          : 'bg-white/5 border border-white/10'
      }`}>
        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
      </div>
      <div>
        <h4 className={`font-medium text-sm ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
          {title}
        </h4>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  </button>
);

export default function InteractiveDemo() {
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
          <Play className="h-4 w-4 text-[hsl(var(--accent-start))]" />
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
            <div className="h-32 bg-gradient-to-br from-[hsl(var(--accent-start)/0.15)] to-[hsl(var(--accent-end)/0.15)] rounded-lg flex items-center justify-center mb-3">
              <div className="text-center">
                {React.createElement(steps[activeStep].icon, { className: "h-8 w-8 mx-auto mb-2 text-[hsl(var(--accent-start))]" })}
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
}