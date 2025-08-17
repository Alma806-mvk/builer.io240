import { Card } from "@/components/ui/card"
import { 
  TrendingUp, 
  Zap, 
  Image, 
  FileText,
  ArrowUpRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCard {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ElementType
  iconColor: string
}

const stats: StatCard[] = [
  {
    title: "Total Generations",
    value: "2,847",
    change: "+23%",
    trend: "up",
    icon: Zap,
    iconColor: "text-accent-purple"
  },
  {
    title: "Images Created",
    value: "1,293",
    change: "+18%", 
    trend: "up",
    icon: Image,
    iconColor: "text-accent-cyan"
  },
  {
    title: "Text Generated",
    value: "967",
    change: "+31%",
    trend: "up",
    icon: FileText,
    iconColor: "text-accent-success"
  },
  {
    title: "AI Credits Used",
    value: "5,670",
    change: "+12%",
    trend: "up",
    icon: TrendingUp,
    iconColor: "text-accent-warning"
  }
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card 
          key={stat.title}
          className={cn(
            "interactive-surface p-6 rounded-xl transition-all duration-normal hover:shadow-design-md group",
            "animate-fade-in"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center bg-bg-tertiary group-hover:scale-110 transition-transform duration-normal",
              stat.iconColor.replace('text-', 'bg-').replace('-', '-') + '/20'
            )}>
              <stat.icon className={cn("w-5 h-5", stat.iconColor)} />
            </div>
            
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              stat.trend === "up" 
                ? "text-accent-success bg-accent-success/20" 
                : "text-accent-error bg-accent-error/20"
            )}>
              <ArrowUpRight className={cn(
                "w-3 h-3",
                stat.trend === "down" && "rotate-90"
              )} />
              {stat.change}
            </div>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-text-primary mb-1 group-hover:gradient-text transition-all duration-normal">
              {stat.value}
            </p>
            <p className="text-text-tertiary text-sm">
              {stat.title}
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}