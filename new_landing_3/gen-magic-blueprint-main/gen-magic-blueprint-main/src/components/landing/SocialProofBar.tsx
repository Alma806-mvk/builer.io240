export const SocialProofBar = () => {
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