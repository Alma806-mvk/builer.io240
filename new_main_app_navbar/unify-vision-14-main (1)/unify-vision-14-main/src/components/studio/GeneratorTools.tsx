import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button-enhanced"
import { 
  Sparkles, 
  Image, 
  FileText, 
  Video,
  Palette,
  Zap,
  ArrowRight,
  Stars
} from "lucide-react"
import { cn } from "@/lib/utils"

interface GeneratorTool {
  title: string
  description: string
  icon: React.ElementType
  gradient: string
  comingSoon?: boolean
}

const tools: GeneratorTool[] = [
  {
    title: "AI Image Generator",
    description: "Create stunning visuals from text descriptions with our advanced AI",
    icon: Image,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Smart Text Writer", 
    description: "Generate compelling copy, articles, and content in seconds",
    icon: FileText,
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    title: "Video Creator",
    description: "Transform ideas into engaging video content automatically",
    icon: Video,
    gradient: "from-green-500 to-emerald-500",
    comingSoon: true
  },
  {
    title: "Brand Designer",
    description: "Build complete brand identities with logos, colors, and assets",
    icon: Palette,
    gradient: "from-orange-500 to-red-500"
  }
]

export function GeneratorTools() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-1">
            AI Generation Tools
          </h2>
          <p className="text-text-secondary">
            Choose your creative tool to get started
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Stars className="w-4 h-4" />
          View All Tools
        </Button>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool, index) => (
          <Card 
            key={tool.title}
            className={cn(
              "interactive-surface p-6 rounded-xl transition-all duration-normal hover:shadow-design-lg group cursor-pointer",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Header with Icon */}
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-normal group-hover:scale-110",
                "bg-gradient-to-br", tool.gradient, "shadow-design-md"
              )}>
                <tool.icon className="w-6 h-6 text-white" />
              </div>
              
              {tool.comingSoon && (
                <div className="bg-accent-warning/20 text-accent-warning text-xs px-2 py-1 rounded-full border border-accent-warning/30">
                  Coming Soon
                </div>
              )}
            </div>

            {/* Content */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:gradient-text transition-all duration-normal">
                {tool.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {tool.description}
              </p>
            </div>

            {/* Action */}
            <div className="flex items-center justify-between">
              <Button 
                variant={tool.comingSoon ? "secondary" : "primary"} 
                size="sm" 
                className="gap-2 group-hover:scale-105 transition-transform duration-fast"
                disabled={tool.comingSoon}
              >
                {tool.comingSoon ? (
                  <>
                    <Zap className="w-4 h-4" />
                    Notify Me
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Create Now
                  </>
                )}
              </Button>
              
              {!tool.comingSoon && (
                <ArrowRight className="w-4 h-4 text-text-quaternary group-hover:text-accent-purple group-hover:translate-x-1 transition-all duration-normal" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="interactive-surface p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">
              Need inspiration?
            </h3>
            <p className="text-text-secondary text-sm">
              Browse our gallery of AI-generated content for ideas
            </p>
          </div>
          <Button variant="gradient-outline" className="gap-2">
            <Stars className="w-4 h-4" />
            Explore Gallery
          </Button>
        </div>
      </Card>
    </div>
  )
}