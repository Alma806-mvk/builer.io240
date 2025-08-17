import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Crown } from "lucide-react";

export const PricingSection = () => {
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