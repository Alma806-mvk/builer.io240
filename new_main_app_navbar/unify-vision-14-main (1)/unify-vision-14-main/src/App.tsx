import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import { SimpleTrendsTest } from "./components/SimpleTrendsTest";

const queryClient = new QueryClient();

// Placeholder components for routes
const GeneratorPage = () => <div className="text-center p-8"><h1 className="text-2xl font-bold text-text-primary">Generator</h1><p className="text-text-secondary">AI content generation tools</p></div>;
const CanvasPage = () => <div className="text-center p-8"><h1 className="text-2xl font-bold text-text-primary">Canvas</h1><p className="text-text-secondary">Visual design workspace</p></div>;
const CreativityPage = () => <div className="text-center p-8"><h1 className="text-2xl font-bold text-text-primary">Creativity</h1><p className="text-text-secondary">Creative tools and resources</p></div>;
const ThumbnailsPage = () => <div className="text-center p-8"><h1 className="text-2xl font-bold text-text-primary">Thumbnails</h1><p className="text-text-secondary">Thumbnail creation and optimization</p></div>;
const TrendsPage = () => (
  <div className="p-8">
    <SimpleTrendsTest />
  </div>
);
const YTAnalysisPage = () => <div className="text-center p-8"><h1 className="text-2xl font-bold text-text-primary">YT Analysis</h1><p className="text-text-secondary">YouTube content analysis</p></div>;
const StrategyPage = () => <div className="text-center p-8"><h1 className="text-2xl font-bold text-text-primary">Strategy</h1><p className="text-text-secondary">Content strategy planning</p></div>;
const CalendarPage = () => <div className="text-center p-8"><h1 className="text-2xl font-bold text-text-primary">Calendar</h1><p className="text-text-secondary">Content scheduling</p></div>;
const HistoryPage = () => <div className="text-center p-8"><h1 className="text-2xl font-bold text-text-primary">History</h1><p className="text-text-secondary">Project history and backups</p></div>;
const YTStatsPage = () => <div className="text-center p-8"><h1 className="text-2xl font-bold text-text-primary">YT Stats</h1><p className="text-text-secondary">YouTube analytics and insights</p></div>;
// Remove the placeholder as we now have real components

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/generate" element={<GeneratorPage />} />
          <Route path="/canvas" element={<CanvasPage />} />
          <Route path="/creativity" element={<CreativityPage />} />
          <Route path="/thumbnails" element={<ThumbnailsPage />} />
          <Route path="/trends" element={<TrendsPage />} />
          <Route path="/yt-analysis" element={<YTAnalysisPage />} />
          <Route path="/strategy" element={<StrategyPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/yt-stats" element={<YTStatsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
