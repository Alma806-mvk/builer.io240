import { StudioLayout } from "@/components/layouts/StudioLayout"
import { StudioHero } from "@/components/studio/StudioHero"
import { DashboardStats } from "@/components/studio/DashboardStats"
import { GeneratorTools } from "@/components/studio/GeneratorTools"
import { RecentProjects } from "@/components/studio/RecentProjects"

const Index = () => {
  return (
    <StudioLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Hero Section */}
        <StudioHero />
        
        {/* Dashboard Stats */}
        <DashboardStats />
        
        {/* Generator Tools */}
        <GeneratorTools />
        
        {/* Recent Projects */}
        <RecentProjects />
      </div>
    </StudioLayout>
  );
};

export default Index;
