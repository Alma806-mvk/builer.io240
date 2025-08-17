import { Card, CardContent } from "@/components/ui/card";
import { Clock, TrendingUp, Users, Zap } from "lucide-react";

const MetricCard = ({ 
  icon: Icon, 
  value, 
  label, 
  description 
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  description: string;
}) => (
  <Card className="border-white/10 bg-white/5 backdrop-blur">
    <CardContent className="p-4 text-center">
      <div className="rounded-full bg-gradient-to-br from-[hsl(var(--accent-start)/0.15)] to-[hsl(var(--accent-end)/0.15)] w-12 h-12 flex items-center justify-center mx-auto mb-3">
        <Icon className="h-6 w-6 text-[hsl(var(--accent-start))]" />
      </div>
      <div className="font-display text-2xl md:text-3xl text-[hsl(var(--accent-start))]">{value}</div>
      <div className="font-medium text-sm">{label}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

export default function ValueProposition() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl mb-3">
            Why creators choose CreateGen
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of creator-entrepreneurs who've streamlined their workflow and boosted productivity
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <MetricCard
            icon={Clock}
            value="15hrs"
            label="Saved weekly"
            description="Avg. time saved vs managing 8+ tools"
          />
          <MetricCard
            icon={TrendingUp}
            value="3x"
            label="Faster creation"
            description="From idea to published content"
          />
          <MetricCard
            icon={Users}
            value="2,500+"
            label="Beta creators"
            description="Already building with CreateGen"
          />
          <MetricCard
            icon={Zap}
            value="94%"
            label="Recommend us"
            description="Would suggest to other creators"
          />
        </div>

        <div className="mt-8 p-6 rounded-xl border border-white/10 bg-gradient-to-r from-[hsl(var(--accent-start)/0.08)] to-[hsl(var(--accent-end)/0.08)] text-center">
          <p className="text-lg font-medium">
            "Stop juggling 8 tools. Start creating with confidence."
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Replace Notion + Airtable + Canva + Buffer + Analytics tools with one focused workspace
          </p>
        </div>
      </div>
    </section>
  );
}