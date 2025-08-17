import { Button } from "@/components/ui/button-enhanced"
import { ProjectCard } from "./ProjectCard"
import { Plus, ArrowRight } from "lucide-react"

// Sample project data
const recentProjects = [
  {
    title: "Product Launch Campaign",
    description: "Complete visual identity and marketing materials for a tech startup",
    type: "brand" as const,
    createdAt: "2 hours ago",
    status: "completed" as const,
  },
  {
    title: "Blog Article: AI in Healthcare",
    description: "Comprehensive article about AI applications in modern healthcare",
    type: "text" as const,
    createdAt: "5 hours ago", 
    status: "completed" as const,
  },
  {
    title: "Social Media Graphics",
    description: "Series of Instagram posts for fashion brand campaign",
    type: "image" as const,
    createdAt: "1 day ago",
    status: "processing" as const,
  },
  {
    title: "Product Demo Video",
    description: "Animated explainer video for SaaS platform features",
    type: "video" as const,
    createdAt: "2 days ago",
    status: "draft" as const,
  },
  {
    title: "Website Redesign Concepts",
    description: "Modern UI designs for e-commerce platform",
    type: "image" as const,
    createdAt: "3 days ago",
    status: "completed" as const,
  },
  {
    title: "Email Marketing Copy",
    description: "Converting email sequences for product launch",
    type: "text" as const,
    createdAt: "4 days ago",
    status: "completed" as const,
  }
]

export function RecentProjects() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-1">
            Recent Projects
          </h2>
          <p className="text-text-secondary">
            Continue working on your latest creations
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
          <Button variant="ghost" className="gap-2">
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentProjects.map((project, index) => (
          <ProjectCard
            key={`${project.title}-${index}`}
            {...project}
            className="animate-scale-in"
          />
        ))}
      </div>
    </div>
  )
}