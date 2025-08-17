import { Star, Quote } from "lucide-react";

export const TestimonialsSection = () => {
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