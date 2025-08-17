import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button-enhanced"
import { Badge } from "@/components/ui/badge"
import { 
  MoreHorizontal, 
  Play, 
  Edit3, 
  Copy,
  Trash2,
  Clock,
  Eye
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  title: string
  description?: string
  type: "image" | "text" | "video" | "brand"
  thumbnail?: string
  createdAt: string
  status: "completed" | "processing" | "draft"
  className?: string
}

const typeColors = {
  image: "bg-accent-purple/20 text-accent-purple border-accent-purple/30",
  text: "bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30", 
  video: "bg-accent-success/20 text-accent-success border-accent-success/30",
  brand: "bg-accent-warning/20 text-accent-warning border-accent-warning/30"
}

const statusIcons = {
  completed: <Eye className="w-3 h-3" />,
  processing: <Clock className="w-3 h-3 animate-spin" />,
  draft: <Edit3 className="w-3 h-3" />
}

export function ProjectCard({ 
  title, 
  description, 
  type, 
  thumbnail, 
  createdAt, 
  status,
  className 
}: ProjectCardProps) {
  return (
    <Card className={cn(
      "group interactive-surface rounded-xl overflow-hidden transition-all duration-normal hover:shadow-design-lg",
      className
    )}>
      {/* Thumbnail */}
      <div className="aspect-[16/10] bg-bg-tertiary relative overflow-hidden">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-primary-muted flex items-center justify-center">
            <div className="text-text-tertiary text-4xl font-light">
              {title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-normal flex items-center justify-center gap-2">
          <Button variant="secondary" size="sm" className="backdrop-blur-sm">
            <Play className="w-4 h-4" />
            Open
          </Button>
          <Button variant="ghost" size="sm" className="backdrop-blur-sm">
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge 
            variant="secondary" 
            className={cn(
              "glass-card border text-xs gap-1 font-medium",
              typeColors[type]
            )}
          >
            {statusIcons[status]}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-text-primary text-sm leading-tight line-clamp-2 flex-1">
            {title}
          </h3>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="gap-2">
                <Edit3 className="w-4 h-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Copy className="w-4 h-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-accent-error">
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {description && (
          <p className="text-text-tertiary text-xs mb-3 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs">
          <span className="text-text-quaternary">{createdAt}</span>
          <div className="flex items-center gap-1 text-text-tertiary capitalize">
            {statusIcons[status]}
            <span>{status}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}