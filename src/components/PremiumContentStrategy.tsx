import React, { useState, useEffect, useRef } from "react";
import { ContentStrategyPlanOutput, Platform } from "../types";
import { useSubscription } from "../context/SubscriptionContext";
import { useCredits } from "../context/CreditContext";
import { useAuth } from "../context/AuthContext";
import { goalsService } from "../services/goalsService";
import { goalRegenerationService } from "../services/goalRegenerationService";
import { generateStrategyMindMap, convertMindMapToCanvasItems } from "../utils/strategyMindMapGenerator";
import { isProblematicObject, safeObjectToString, debugProblematicObject } from "../utils/safeObjectRenderer";
import { contentPillarsService } from "../services/contentPillarsService";
import { pillarRegenerationService } from "../services/pillarRegenerationService";
import { platformStrategiesService } from "../services/platformStrategiesService";
import { campaignStrategiesService } from "../services/campaignStrategiesService";
import { competitorAnalysisService } from "../services/competitorAnalysisService";
import { customerJourneyService } from "../services/customerJourneyService";
import { resourcePlanningService } from "../services/resourcePlanningService";
import { complianceService } from "../services/complianceService";
import { riskManagementService } from "../services/riskManagementService";
import { analyticsService } from "../services/analyticsService";
import { analyticsRegenerationService } from "../services/analyticsRegenerationService";
import { monetizationService } from "../services/monetizationService";
import { monetizationRegenerationService } from "../services/monetizationRegenerationService";
import { riskManagementRegenerationService } from "../services/riskManagementRegenerationService";

// Import lucide-react icons for modern design
import {
  Target,
  Users,
  Layers,
  MoreVertical,
  Save,
  RefreshCw,
  Copy,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  BarChart3,
  Calendar,
  Compass,
  Zap,
  Clock,
  Share2,
  Play,
  Camera,
  MapPin,
  Shield,
  Eye,
  Briefcase,
  Scale,
  AlertTriangle,
  RotateCcw,
  FileText,
  Network,
  Sparkles,
  Building,
  Gavel,
  Rocket,
  Palette,
  Crown,
  Bookmark,
  Download,
  Search,
  Globe,
  Star,
  Lock,
  Brain,
  Settings,
  ArrowDown,
  ChevronRight,
  Send,
  GitBranch,
  Clipboard
} from "lucide-react";

// Import our world-class design system components
import {
  Button,
  Card,
  Input,
  Badge,
  StatCard,
  QuickActionCard,
  ProgressBar,
  TabHeader,
  GradientText,
} from "./ui/WorldClassComponents";

// Utility function to safely render any value in React
const safeRenderValue = (value: any): string => {
  try {
    if (value === null || value === undefined) {
      return 'Not specified';
    }
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    if (Array.isArray(value)) {
      return value.map(item => {
        if (typeof item === 'object' && item !== null) {
          return JSON.stringify(item);
        }
        return String(item);
      }).join(', ');
    }
    if (typeof value === 'object') {
      try {
        // Handle specific problematic objects (both camelCase and space-separated keys)
        if (value.hasOwnProperty('videoProduction') ||
            value.hasOwnProperty('graphicsAndDesign') ||
            value.hasOwnProperty('seoAndAnalytics') ||
            value.hasOwnProperty('schedulingAndManagement') ||
            value.hasOwnProperty('communicationAndCollaboration') ||
            value.hasOwnProperty('liveStreaming') ||
            value.hasOwnProperty('emailMarketing') ||
            value.hasOwnProperty('Video Production') ||
            value.hasOwnProperty('Graphic Design & Thumbnails') ||
            value.hasOwnProperty('SEO & Analytics') ||
            value.hasOwnProperty('Content Management & Scheduling') ||
            value.hasOwnProperty('Community') ||
            value.hasOwnProperty('Monetization/Sales')) {
          // This appears to be a services categorization object
          return Object.entries(value as Record<string, any>)
            .map(([category, items]) => {
              const categoryName = category.replace(/([A-Z])/g, ' $1').trim();
              if (Array.isArray(items)) {
                return `${categoryName}: ${items.join(', ')}`;
              } else if (typeof items === 'object' && items !== null) {
                return `${categoryName}: ${JSON.stringify(items)}`;
              } else {
                return `${categoryName}: ${String(items)}`;
              }
            })
            .join('\n');
        }

        // Handle nested objects safely
        return Object.entries(value as Record<string, any>)
          .map(([k, v]) => {
            const safeKey = String(k);
            let safeValue;
            if (typeof v === 'object' && v !== null) {
              safeValue = JSON.stringify(v);
            } else {
              safeValue = String(v);
            }
            return `${safeKey}: ${safeValue}`;
          })
          .join(', ');
      } catch (objError) {
        console.warn('Object rendering error:', objError, 'Value:', value);
        return JSON.stringify(value);
      }
    }
    return String(value);
  } catch (error) {
    console.warn('Error in safeRenderValue:', error, 'Value:', value);
    return 'Display error';
  }
};

// Safe wrapper for any React content that might contain objects
const SafeContent = ({ children }: { children: any }) => {
  try {
    // Handle null/undefined
    if (children === null || children === undefined) {
      return <>Not specified</>;
    }

    // Handle React elements
    if (React.isValidElement(children)) {
      return <>{children}</>;
    }

    // Handle arrays
    if (Array.isArray(children)) {
      return <>{children.map(child => typeof child === 'string' ? child : String(child)).join(', ')}</>;
    }

    // Handle objects (prevent direct rendering) - comprehensive detection
    if (typeof children === 'object') {
      console.warn('SafeContent: Converting object to string to prevent React error', children);

      // Check if it's a service categorization object
      const objectKeys = Object.keys(children);
      const serviceKeyWords = ['production', 'design', 'analytics', 'management', 'community', 'monetization', 'sales'];
      const hasServiceKeys = objectKeys.some(key =>
        serviceKeyWords.some(word => key.toLowerCase().includes(word))
      );

      if (hasServiceKeys) {
        // Format service objects nicely
        return <>{Object.entries(children)
          .map(([key, value]) => {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
            const formattedValue = Array.isArray(value) ? value.join(', ') : String(value);
            return `${formattedKey}: ${formattedValue}`;
          })
          .join('\n')}</>;
      }

      return <>{safeRenderValue(children)}</>;
    }

    // Handle primitives
    return <>{String(children)}</>;
  } catch (error) {
    console.error('SafeContent error:', error, 'Children:', children);
    return <>Unable to display content</>;
  }
};

// Enhanced safe rendering for strategy plan properties
const SafeStrategyValue = ({ value }: { value: any }) => {
  // Pre-process the value to ensure it's safe for React
  const processedValue = React.useMemo(() => {
    try {
      // Debug problematic objects in development
      debugProblematicObject(value, 'SafeStrategyValue');

      // If it's a React element, return it as-is
      if (React.isValidElement(value)) {
        return value;
      }

      // Use the utility function to safely convert any value to string
      return safeObjectToString(value);
    } catch (error) {
      console.warn('Error processing strategy value:', error, 'Value:', value);
      return 'Processing error';
    }
  }, [value]);

  // Ensure the processed value is always a string or React element
  const safeValue = React.useMemo(() => {
    if (React.isValidElement(processedValue)) {
      return processedValue;
    }

    if (typeof processedValue === 'object' && processedValue !== null) {
      console.warn('SafeStrategyValue: Converting remaining object to string to prevent React error', processedValue);
      return JSON.stringify(processedValue);
    }

    return String(processedValue);
  }, [processedValue]);

  return <SafeContent>{safeValue}</SafeContent>;
};

// Premium icons
const CompassIcon = ({ className = "" }) => (
  <Compass className={className} />
);
const MoreVerticalIcon = ({ className = "" }) => (
  <MoreVertical className={className} />
);
const SaveIcon = ({ className = "" }) => (
  <Save className={className} />
);
const RefreshIcon = ({ className = "" }) => (
  <RefreshCw className={className} />
);
const CopyIcon = ({ className = "" }) => (
  <Copy className={className} />
);
const CanvasIcon = ({ className = "" }) => (
  <Palette className={className} />
);
const CrownIcon = ({ className = "" }) => <Crown className={className} />;
const ChartBarIcon = ({ className = "" }) => (
  <BarChart3 className={className} />
);
const CalendarIcon = ({ className = "" }) => (
  <Calendar className={className} />
);
const TargetIcon = ({ className = "" }) => (
  <Target className={className} />
);
const TrendingUpIcon = ({ className = "" }) => (
  <TrendingUp className={className} />
);
const FilterIcon = ({ className = "" }) => (
  <Settings className={className} />
);
const BookmarkIcon = ({ className = "" }) => (
  <Bookmark className={className} />
);
const ShareIcon = ({ className = "" }) => <Share2 className={className} />;
const DownloadIcon = ({ className = "" }) => (
  <Download className={className} />
);
const BoltIcon = ({ className = "" }) => <Zap className={className} />;
const EyeIcon = ({ className = "" }) => <Eye className={className} />;
const UsersIcon = ({ className = "" }) => <Users className={className} />;
const BulbIcon = ({ className = "" }) => <Lightbulb className={className} />;
const SearchIcon = ({ className = "" }) => (
  <Search className={className} />
);
const GlobeIcon = ({ className = "" }) => <Globe className={className} />;
const CheckCircleIcon = ({ className = "" }) => (
  <CheckCircle className={className} />
);
const StarIcon = ({ className = "" }) => <Star className={className} />;
const LockClosedIcon = ({ className = "" }) => (
  <Lock className={className} />
);
const DocumentTextIcon = ({ className = "" }) => (
  <FileText className={className} />
);
const BrainIcon = ({ className = "" }) => <Brain className={className} />;
const DocumentArrowDownIcon = ({ className = "" }) => (
  <ArrowDown className={className} />
);

interface PremiumContentStrategyProps {
  strategyPlan: ContentStrategyPlanOutput | null;
  isLoading: boolean;
  error: string | null;
  onGenerateStrategy: (config: StrategyConfig) => void;
  savedStrategies: SavedStrategy[];
  isPremium?: boolean;
  onUpgrade?: () => void;
  onSendToCanvas?: (content: string, title: string) => void;
  onSendStrategyMindMap?: (content: string, strategyPlan: ContentStrategyPlanOutput) => void;
  onAddToCalendar?: (selectedItems?: any[]) => void;
  onUpdateStrategyPlan?: (updatedPlan: ContentStrategyPlanOutput) => void;
  // Persistent state props
  strategyConfig?: StrategyConfig;
  onStrategyConfigChange?: (config: StrategyConfig) => void;
  showAdvancedOptions?: boolean;
  onShowAdvancedOptionsChange?: (show: boolean) => void;
  selectedTemplate?: string | null;
  onSelectedTemplateChange?: (template: string | null) => void;
}

interface StrategyConfig {
  niche: string;
  targetAudience: string;
  goals: string[];
  platforms: Platform[];
  timeframe: "1month" | "3months" | "6months" | "1year";
  budget: "low" | "medium" | "high" | "enterprise";
  contentTypes: string[];
  competitorAnalysis: boolean;
  aiPersona: string;
  industryFocus: string;
  geographicFocus: string[];
  languagePreferences: string[];
}

interface SavedStrategy {
  id: string;
  name: string;
  config: StrategyConfig;
  results: ContentStrategyPlanOutput;
  createdAt: Date;
  performance?: StrategyPerformance;
}

interface StrategyPerformance {
  engagementRate: number;
  reachGrowth: number;
  conversionRate: number;
  contentEffectiveness: number;
  competitorBenchmark: number;
}

interface StrategyMetrics {
  pillarsCount: number;
  expectedReach: number;
  contentVolume: number;
  engagementProjection: number;
  competitiveAdvantage: number;
  difficultyScore: number;
}

interface TrackedTopic {
  id: string;
  name: string;
  category: string;
  addedDate: Date;
  metrics: {
    reach: number;
    engagement: number;
    mentions: number;
    sentiment: "positive" | "neutral" | "negative";
    trendScore: number;
  };
  historicalData: {
    date: string;
    reach: number;
    engagement: number;
    mentions: number;
  }[];
}

interface AnalyticsData {
  totalReach: number;
  totalEngagement: number;
  averageScore: number;
  conversionRate: number;
  topPerformingTopics: TrackedTopic[];
  platformBreakdown: {
    platform: string;
    reach: number;
    engagement: number;
    growth: number;
  }[];
}

interface ScheduledContentItem {
  id: string;
  title: string;
  platform: string;
  contentType: string;
  date: string;
  time: string;
  description: string;
  pillar: string;
  status: "planned" | "in-review" | "ready" | "published";
  performance?: {
    views: number;
    engagement: number;
    score: number;
  };
}

interface ContentIdea {
  id: string;
  title: string;
  pillar: string;
  priority: "high" | "medium" | "low";
  description: string;
  estimatedEngagement: number;
}

interface NewContentForm {
  title: string;
  platform: string;
  contentType: string;
  date: string;
  time: string;
  description: string;
  pillar: string;
  status: "planned" | "in-review" | "ready" | "published";
}

export const PremiumContentStrategy: React.FC<PremiumContentStrategyProps> = ({
  strategyPlan,
  isLoading,
  error,
  onGenerateStrategy,
  savedStrategies,
  isPremium = false,
  onUpgrade = () => {},
  onSendToCanvas,
  onSendStrategyMindMap,
  onAddToCalendar,
  onUpdateStrategyPlan,
  // Persistent state props
  strategyConfig: externalStrategyConfig,
  onStrategyConfigChange,
  showAdvancedOptions: externalShowAdvancedOptions = false,
  onShowAdvancedOptionsChange,
  selectedTemplate: externalSelectedTemplate = null,
  onSelectedTemplateChange,
}) => {
  console.log("����� PremiumContentStrategy component rendering!");
  console.log("Props:", { isPremium, strategyPlan, isLoading, error });
  const [activeView, setActiveView] = useState<
    "create" | "analyze" | "calendar" | "templates"
  >("create");
  const [activeGoalMenu, setActiveGoalMenu] = useState<number | null>(null);
  const [regeneratingGoal, setRegeneratingGoal] = useState<number | null>(null);
  const [activePillarMenu, setActivePillarMenu] = useState<number | null>(null);
  const [regeneratingPillar, setRegeneratingPillar] = useState<number | null>(null);
  const [pillarActionStatus, setPillarActionStatus] = useState<{[key: number]: string}>({});
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState<number | null>(null);
  const [activeRiskMenu, setActiveRiskMenu] = useState<string | null>(null);
  const [activePrimaryMetricMenu, setActivePrimaryMetricMenu] = useState<number | null>(null);
  const [activeAdvancedMetricMenu, setActiveAdvancedMetricMenu] = useState<number | null>(null);
  const [analyticsActionStatus, setAnalyticsActionStatus] = useState<{[key: string]: string}>({});
  const [regeneratingPrimaryMetric, setRegeneratingPrimaryMetric] = useState<number | null>(null);
  const [regeneratingAdvancedMetric, setRegeneratingAdvancedMetric] = useState<number | null>(null);
  const [activeMonetizationMenu, setActiveMonetizationMenu] = useState<string | null>(null);
  const [monetizationActionStatus, setMonetizationActionStatus] = useState<{[key: string]: string}>({});
  const [riskActionStatus, setRiskActionStatus] = useState<{[key: string]: string}>({});

  // Get billing info for checking Agency Pro access
  const { billingInfo } = useSubscription();
  const { canAfford, deductCredits } = useCredits();
  const { user } = useAuth();

  // Save goal to Goals tab
  const saveGoalToGoalsTab = async (goal: string, index: number) => {
    if (!user) {
      alert('Please log in to save goals.');
      return;
    }

    try {
      const newGoal = {
        title: `Strategic Goal ${index + 1}`,
        description: goal,
        category: 'strategy' as const,
        priority: 'high' as const,
        completed: false,
        progress: 0,
        createdAt: new Date().toISOString(),
        dueDate: null,
        source: 'content-strategy-planner'
      };

      await goalsService.saveGoal(user.uid, newGoal);

      // Show success notification
      alert('Goal saved to Goals tab successfully!');
    } catch (error) {
      console.error('Failed to save goal:', error);
      alert('Failed to save goal. Please try again.');
    }
  };

  // Save content pillar to content pillars storage
  const saveContentPillar = async (pillar: any, index: number) => {
    console.log('🚀 Save function called with:', { pillar, index, user: !!user });

    if (!user) {
      console.error('❌ No user logged in');
      alert('Please log in to save content pillars.');
      return;
    }

    console.log('👤 User ID:', user.uid);
    console.log('����� Pillar object:', pillar);

    try {
      console.log('🔄 Starting save process for pillar:', pillar.pillarName);
      setPillarActionStatus(prev => ({...prev, [index]: 'Saving...'}));

      const pillarToSave = {
        pillarName: pillar.pillarName || 'Untitled Pillar',
        description: pillar.description || 'No description provided',
        keywords: Array.isArray(pillar.keywords) ? pillar.keywords : [],
        contentTypes: Array.isArray(pillar.contentTypes) ? pillar.contentTypes : [],
        postingFrequency: pillar.postingFrequency || 'Not specified',
        engagementStrategy: pillar.engagementStrategy || 'Not specified',
        source: 'content-strategy-planner'
      };

      console.log('💾 Formatted pillar data to save:', pillarToSave);
      console.log('📞 Calling contentPillarsService.saveContentPillar...');

      const savedId = await contentPillarsService.saveContentPillar(user.uid, pillarToSave);
      console.log('✅ Content pillar saved successfully with ID:', savedId);

      setPillarActionStatus(prev => ({...prev, [index]: 'Saved!'}));

      // Trigger a refresh event for other components to listen to
      window.dispatchEvent(new CustomEvent('contentPillarSaved', { detail: { pillarId: savedId, pillar: pillarToSave } }));

      // Show success message
      console.log('����� Showing success message');
      alert(`Content pillar "${pillar.pillarName}" saved successfully!`);

      setTimeout(() => {
        setPillarActionStatus(prev => {
          const newStatus = {...prev};
          delete newStatus[index];
          return newStatus;
        });
      }, 3000);

    } catch (error) {
      console.error('❌ Failed to save content pillar:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });

      setPillarActionStatus(prev => ({...prev, [index]: 'Error'}));

      // Show user-friendly error message
      alert(`Failed to save content pillar. Error: ${error.message || 'Unknown error'}`);

      setTimeout(() => {
        setPillarActionStatus(prev => {
          const newStatus = {...prev};
          delete newStatus[index];
          return newStatus;
        });
      }, 3000);
    }
  };

  // Save platform strategy to Platforms tab
  const savePlatformStrategy = async (strategyData: any) => {
    if (!user) {
      alert('Please log in to save platform strategies.');
      return;
    }

    try {
      const platformData = {
        platform: strategyData.platform || 'Multi-platform',
        focus: strategyData.focus || 'Not specified',
        contentTypes: strategyData.contentTypes || [],
        postingFrequency: strategyData.postingFrequency || 'Not specified',
        bestTimes: strategyData.bestTimes || [],
        engagementStrategy: strategyData.engagementStrategy || 'Not specified',
        monetizationApproach: strategyData.monetizationApproach || 'Not specified',
        keyMetrics: strategyData.keyMetrics || [],
        audienceTargeting: strategyData.audienceTargeting || 'Not specified',
        contentMix: strategyData.contentMix || {},
        source: 'content-strategy-planner'
      };

      const savedId = await platformStrategiesService.savePlatformStrategy(user.uid, platformData);

      // Trigger refresh event for StrategyWorldClass component
      window.dispatchEvent(new CustomEvent('strategySaved', { detail: { type: 'platform', strategyId: savedId } }));

      alert('Platform strategy saved successfully!');
      console.log('✅ Platform strategy saved with ID:', savedId);
    } catch (error) {
      console.error('❌ Failed to save platform strategy:', error);
      alert('Failed to save platform strategy. Please try again.');
    }
  };

  // Save campaign strategy to Campaigns tab
  const saveCampaignStrategy = async (strategyData: any) => {
    if (!user) {
      alert('Please log in to save campaign strategies.');
      return;
    }

    try {
      const campaignData = {
        campaignName: strategyData.campaignName || 'Untitled Campaign',
        campaignType: strategyData.campaignType || 'general',
        objective: strategyData.objective || 'Not specified',
        targetAudience: strategyData.targetAudience || 'Not specified',
        timeline: strategyData.timeline || 'Not specified',
        platforms: strategyData.platforms || [],
        contentTypes: strategyData.contentTypes || [],
        keyMessages: strategyData.keyMessages || [],
        callsToAction: strategyData.callsToAction || [],
        successMetrics: strategyData.successMetrics || [],
        budget: strategyData.budget || 'Not specified',
        launchStrategy: strategyData.launchStrategy || 'Not specified',
        engagementTactics: strategyData.engagementTactics || [],
        source: 'content-strategy-planner',
        status: 'planned'
      };

      const savedId = await campaignStrategiesService.saveCampaignStrategy(user.uid, campaignData);

      // Trigger refresh event for StrategyWorldClass component
      window.dispatchEvent(new CustomEvent('strategySaved', { detail: { type: 'campaign', strategyId: savedId } }));

      alert('Campaign strategy saved successfully!');
      console.log('✅ Campaign strategy saved with ID:', savedId);
    } catch (error) {
      console.error('❌ Failed to save campaign strategy:', error);
      alert('Failed to save campaign strategy. Please try again.');
    }
  };

  // Save competitor analysis to Competitors tab
  const saveCompetitorAnalysis = async (analysisData: any) => {
    if (!user) {
      alert('Please log in to save competitor analyses.');
      return;
    }

    try {
      const competitorData = {
        competitorName: analysisData.competitorName || 'Untitled Competitor',
        competitorType: analysisData.competitorType || 'Direct',
        industry: analysisData.industry || 'Not specified',
        platforms: analysisData.platforms || [],
        audienceSize: analysisData.audienceSize || 'Not specified',
        engagementRate: analysisData.engagementRate || 'Not specified',
        contentStrategy: analysisData.contentStrategy || 'Not specified',
        strengthsWeaknesses: analysisData.strengthsWeaknesses || [],
        contentGaps: analysisData.contentGaps || [],
        opportunities: analysisData.opportunities || [],
        keyTakeaways: analysisData.keyTakeaways || [],
        competitiveAdvantages: analysisData.competitiveAdvantages || [],
        monitoringFrequency: analysisData.monitoringFrequency || 'Monthly',
        source: 'content-strategy-planner'
      };

      const savedId = await competitorAnalysisService.saveCompetitorAnalysis(user.uid, competitorData);

      // Trigger refresh event for StrategyWorldClass component
      window.dispatchEvent(new CustomEvent('strategySaved', { detail: { type: 'competitor', strategyId: savedId } }));

      alert('Competitor analysis saved successfully!');
      console.log('✅ Competitor analysis saved with ID:', savedId);
    } catch (error) {
      console.error('❌ Failed to save competitor analysis:', error);
      alert('Failed to save competitor analysis. Please try again.');
    }
  };

  // Save customer journey to Journey tab
  const saveCustomerJourney = async (journeyData: any) => {
    if (!user) {
      alert('Please log in to save customer journeys.');
      return;
    }

    try {
      const customerJourneyData = {
        journeyName: journeyData.journeyName || 'Untitled Journey',
        targetPersona: journeyData.targetPersona || 'Not specified',
        industry: journeyData.industry || 'Not specified',
        overallObjective: journeyData.overallObjective || 'Not specified',
        stages: journeyData.stages || [],
        conversionPath: journeyData.conversionPath || [],
        keyTouchpoints: journeyData.keyTouchpoints || [],
        contentRequirements: journeyData.contentRequirements || [],
        automationOpportunities: journeyData.automationOpportunities || [],
        optimizationRecommendations: journeyData.optimizationRecommendations || [],
        expectedTimeline: journeyData.expectedTimeline || 'Not specified',
        successMetrics: journeyData.successMetrics || [],
        source: 'content-strategy-planner'
      };

      const savedId = await customerJourneyService.saveCustomerJourney(user.uid, customerJourneyData);

      // Trigger refresh event for StrategyWorldClass component
      window.dispatchEvent(new CustomEvent('strategySaved', { detail: { type: 'journey', strategyId: savedId } }));

      alert('Customer journey saved successfully!');
      console.log('✅ Customer journey saved with ID:', savedId);
    } catch (error) {
      console.error('❌ Failed to save customer journey:', error);
      alert('Failed to save customer journey. Please try again.');
    }
  };

  // Save resource plan to Resources tab
  const saveResourcePlan = async (planData: any) => {
    if (!user) {
      alert('Please log in to save resource plans.');
      return;
    }

    try {
      const resourceData = {
        planName: planData.planName || 'Untitled Resource Plan',
        projectScope: planData.projectScope || 'Not specified',
        timeline: planData.timeline || 'Not specified',
        totalBudget: planData.totalBudget || 'Not specified',
        teamStructure: planData.teamStructure || [],
        budgetAllocations: planData.budgetAllocations || [],
        toolStack: planData.toolStack || [],
        skillGaps: planData.skillGaps || [],
        trainingNeeds: planData.trainingNeeds || [],
        milestones: planData.milestones || [],
        riskFactors: planData.riskFactors || [],
        scalingConsiderations: planData.scalingConsiderations || [],
        source: 'content-strategy-planner'
      };

      const savedId = await resourcePlanningService.saveResourcePlan(user.uid, resourceData);

      // Trigger refresh event for StrategyWorldClass component
      window.dispatchEvent(new CustomEvent('strategySaved', { detail: { type: 'resource', strategyId: savedId } }));

      alert('Resource plan saved successfully!');
      console.log('✅ Resource plan saved with ID:', savedId);
    } catch (error) {
      console.error('❌ Failed to save resource plan:', error);
      alert('Failed to save resource plan. Please try again.');
    }
  };

  // Save compliance plan to Compliance tab
  const saveCompliancePlan = async (planData: any) => {
    if (!user) {
      alert('Please log in to save compliance plans.');
      return;
    }

    try {
      const complianceData = {
        planName: planData.planName || 'Untitled Compliance Plan',
        industry: planData.industry || 'Not specified',
        applicableRegulations: planData.applicableRegulations || [],
        platformGuidelines: planData.platformGuidelines || [],
        legalTemplates: planData.legalTemplates || [],
        copyrightPolicies: planData.copyrightPolicies || [],
        dataPrivacyMeasures: planData.dataPrivacyMeasures || [],
        disclosureRequirements: planData.disclosureRequirements || [],
        contentReviewProcess: planData.contentReviewProcess || [],
        crisisManagementPlan: planData.crisisManagementPlan || [],
        trainingRequirements: planData.trainingRequirements || [],
        auditSchedule: planData.auditSchedule || 'Quarterly',
        source: 'content-strategy-planner'
      };

      const savedId = await complianceService.saveCompliancePlan(user.uid, complianceData);

      // Trigger refresh event for StrategyWorldClass component
      window.dispatchEvent(new CustomEvent('strategySaved', { detail: { type: 'compliance', strategyId: savedId } }));

      alert('Compliance plan saved successfully!');
      console.log('✅ Compliance plan saved with ID:', savedId);
    } catch (error) {
      console.error('�� Failed to save compliance plan:', error);
      alert('Failed to save compliance plan. Please try again.');
    }
  };

  // Save risk management item to Risk Management tab
  const saveRiskManagementPlan = async (itemData: any, itemType: string) => {
    if (!user) {
      alert('Please log in to save risk management items.');
      return;
    }

    try {
      const riskItemData = {
        name: itemData.name || `${itemType} Plan`,
        content: itemData.content || itemData,
        type: itemType as 'Content Backups' | 'Crisis Management' | 'Platform Changes' | 'Burnout Prevention',
        tags: ['strategy-generated'],
        priority: 'medium' as const,
        status: 'active' as const
      };

      const savedId = await riskManagementService.saveRiskManagementItem(user.uid, riskItemData);

      // Trigger refresh event for StrategyWorldClass component
      window.dispatchEvent(new CustomEvent('strategySaved', { detail: { type: 'riskManagement', strategyId: savedId } }));

      alert(`${itemType} saved to Risk Management tab successfully!`);
      console.log(`✅ ${itemType} saved with ID:`, savedId);
    } catch (error) {
      console.error(`🚨 Failed to save ${itemType}:`, error);
      alert(`Failed to save ${itemType}. Please try again.`);
    }
  };

  // Save analytics metric to Analytics tab
  const saveAnalyticsMetric = async (metric: string, index: number, type: 'primary' | 'advanced', title?: string) => {
    if (!user) {
      alert('Please log in to save analytics metrics.');
      return;
    }

    const key = `${type}-${index}`;

    try {
      setAnalyticsActionStatus(prev => ({...prev, [key]: 'Saving...'}));

      const analyticsData = {
        title: title || `${type === 'primary' ? 'Primary' : 'Advanced'} Metric ${index + 1}`,
        description: metric,
        type: type,
        category: 'performance',
        source: 'content-strategy-planner'
      };

      const savedId = await analyticsService.saveAnalyticsMetric(user.uid, analyticsData);

      // Trigger refresh event for StrategyWorldClass component
      window.dispatchEvent(new CustomEvent('strategySaved', { detail: { type: 'analytics', strategyId: savedId } }));

      setAnalyticsActionStatus(prev => ({...prev, [key]: 'Saved!'}));
      alert('Analytics metric saved successfully!');

      setTimeout(() => {
        setAnalyticsActionStatus(prev => {
          const newStatus = {...prev};
          delete newStatus[key];
          return newStatus;
        });
      }, 3000);

    } catch (error) {
      console.error('❌ Failed to save analytics metric:', error);
      setAnalyticsActionStatus(prev => ({...prev, [key]: 'Error'}));
      alert('Failed to save analytics metric. Please try again.');

      setTimeout(() => {
        setAnalyticsActionStatus(prev => {
          const newStatus = {...prev};
          delete newStatus[key];
          return newStatus;
        });
      }, 3000);
    }
  };

  // Regenerate specific primary metric
  const regeneratePrimaryMetric = async (metricIndex: number) => {
    if (!canAfford('regenerate', 1)) {
      alert('Insufficient credits for regeneration. Please upgrade your plan.');
      return;
    }

    if (!strategyPlan) {
      alert('No strategy plan available for regeneration.');
      return;
    }

    try {
      setRegeneratingPrimaryMetric(metricIndex);
      console.log('🔄 Starting primary metric regeneration for index:', metricIndex);

      // Deduct credit first
      await deductCredits('regenerate', 1);
      console.log('💳 Credit deducted for primary metric regeneration');

      const currentMetric = strategyPlan.analyticsAndKPIs.primaryMetrics[metricIndex];
      const strategyConfig = {
        niche: strategyPlan.niche || 'General',
        targetAudience: strategyPlan.targetAudienceOverview || 'General audience',
        platforms: strategyPlan.platforms || ['Social Media'],
        timeframe: '6 months',
        budget: 'Standard'
      };

      console.log('📊 Regenerating primary metric:', currentMetric);
      const newMetric = await analyticsRegenerationService.regeneratePrimaryMetric(
        strategyPlan,
        currentMetric,
        metricIndex,
        strategyConfig
      );

      // Update the strategy plan with the new metric
      if (onUpdateStrategyPlan) {
        const updatedMetrics = [...strategyPlan.analyticsAndKPIs.primaryMetrics];
        updatedMetrics[metricIndex] = newMetric;

        const updatedStrategyPlan = {
          ...strategyPlan,
          analyticsAndKPIs: {
            ...strategyPlan.analyticsAndKPIs,
            primaryMetrics: updatedMetrics
          }
        };

        onUpdateStrategyPlan(updatedStrategyPlan);
        console.log('✅ Strategy plan updated with new primary metric');
      }

      alert(`Primary metric regenerated successfully!`);
    } catch (error) {
      console.error('❌ Failed to regenerate primary metric:', error);
      alert(`Failed to regenerate metric. Error: ${error.message || 'Unknown error'}`);
    } finally {
      setRegeneratingPrimaryMetric(null);
    }
  };

  // Regenerate specific advanced metric
  const regenerateAdvancedMetric = async (metricIndex: number, metricTitle: string, currentMetric: string) => {
    if (!canAfford('regenerate', 1)) {
      alert('Insufficient credits for regeneration. Please upgrade your plan.');
      return;
    }

    if (!strategyPlan) {
      alert('No strategy plan available for regeneration.');
      return;
    }

    try {
      setRegeneratingAdvancedMetric(metricIndex);
      console.log('🔄 Starting advanced metric regeneration for:', metricTitle);

      // Deduct credit first
      await deductCredits('regenerate', 1);
      console.log('�������� Credit deducted for advanced metric regeneration');

      const strategyConfig = {
        niche: strategyPlan.niche || 'General',
        targetAudience: strategyPlan.targetAudienceOverview || 'General audience',
        platforms: strategyPlan.platforms || ['Social Media'],
        timeframe: '6 months',
        budget: 'Standard'
      };

      const newMetric = await analyticsRegenerationService.regenerateAdvancedMetric(
        strategyPlan,
        currentMetric,
        metricTitle,
        strategyConfig
      );

      // For default metrics, we need to update them differently since they're not in an array
      if (metricIndex === 0) { // Conversion Rate
        alert(`${metricTitle} regenerated: ${newMetric}`);
      } else if (metricIndex === 1) { // Customer Lifetime Value
        alert(`${metricTitle} regenerated: ${newMetric}`);
      } else if (metricIndex === 2) { // Return on Ad Spend
        alert(`${metricTitle} regenerated: ${newMetric}`);
      } else if (metricIndex === 3) { // Content Performance Index
        alert(`${metricTitle} regenerated: ${newMetric}`);
      }

      console.log('✅ Advanced metric regenerated successfully');
    } catch (error) {
      console.error('❌ Failed to regenerate advanced metric:', error);
      alert(`Failed to regenerate metric. Error: ${error.message || 'Unknown error'}`);
    } finally {
      setRegeneratingAdvancedMetric(null);
    }
  };

  // Save monetization item
  const saveMonetizationItem = async (itemContent: string, itemType: 'revenue-stream' | 'pricing-strategy' | 'conversion-funnel', title: string, index: number) => {
    if (!user) {
      alert('Please log in to save monetization items.');
      return;
    }

    const key = `${itemType}-${index}`;

    try {
      setMonetizationActionStatus(prev => ({...prev, [key]: 'Saving...'}));

      const monetizationData = {
        title: title,
        description: itemContent,
        type: itemType,
        category: itemType.replace('-', ' '),
        source: 'content-strategy-planner'
      };

      const savedId = await monetizationService.saveMonetizationItem(user.uid, monetizationData);

      // Trigger refresh event for StrategyWorldClass component
      window.dispatchEvent(new CustomEvent('strategySaved', { detail: { type: 'monetization', strategyId: savedId } }));

      setMonetizationActionStatus(prev => ({...prev, [key]: 'Saved!'}));
      alert(`${title} saved successfully!`);

      setTimeout(() => {
        setMonetizationActionStatus(prev => {
          const newStatus = {...prev};
          delete newStatus[key];
          return newStatus;
        });
      }, 3000);

    } catch (error) {
      console.error('❌ Failed to save monetization item:', error);
      setMonetizationActionStatus(prev => ({...prev, [key]: 'Error'}));
      alert('Failed to save monetization item. Please try again.');

      setTimeout(() => {
        setMonetizationActionStatus(prev => {
          const newStatus = {...prev};
          delete newStatus[key];
          return newStatus;
        });
      }, 3000);
    }
  };

  // Save risk management item
  const saveRiskManagementItem = async (itemContent: string, riskType: string, title: string, index: number) => {
    if (!user) {
      alert('Please log in to save risk management strategies.');
      return;
    }

    const key = `risk-${riskType}-${index}`;

    try {
      setRiskActionStatus(prev => ({...prev, [key]: 'Saving...'}));

      // Map risk types to service-expected types
      const typeMapping: { [key: string]: 'Content Backups' | 'Crisis Management' | 'Platform Changes' | 'Burnout Prevention' } = {
        'contentBackup': 'Content Backups',
        'contentBackups': 'Content Backups',
        'crisis': 'Crisis Management',
        'crisisManagement': 'Crisis Management',
        'platform': 'Platform Changes',
        'platformChanges': 'Platform Changes',
        'burnout': 'Burnout Prevention',
        'burnoutPrevention': 'Burnout Prevention'
      };

      // Determine the correct type based on risk type or content
      let mappedType: 'Content Backups' | 'Crisis Management' | 'Platform Changes' | 'Burnout Prevention' = 'Crisis Management';

      const lowerRiskType = riskType.toLowerCase();
      if (lowerRiskType.includes('content') || lowerRiskType.includes('backup')) {
        mappedType = 'Content Backups';
      } else if (lowerRiskType.includes('platform') || lowerRiskType.includes('algorithm')) {
        mappedType = 'Platform Changes';
      } else if (lowerRiskType.includes('burnout') || lowerRiskType.includes('mental') || lowerRiskType.includes('health')) {
        mappedType = 'Burnout Prevention';
      } else {
        mappedType = 'Crisis Management';
      }

      const riskData = {
        name: title,
        content: itemContent,
        type: mappedType,
        tags: ['strategy-generated', 'risk-management', riskType.toLowerCase()],
        priority: 'medium' as const,
        status: 'active' as const
      };

      const savedId = await riskManagementService.saveRiskManagementItem(user.uid, riskData);

      // Trigger refresh event for StrategyWorldClass component
      window.dispatchEvent(new CustomEvent('strategySaved', { detail: { type: 'risk-management', strategyId: savedId } }));

      setRiskActionStatus(prev => ({...prev, [key]: 'Saved!'}));
      alert(`${title} saved successfully!`);

      setTimeout(() => {
        setRiskActionStatus(prev => {
          const newStatus = {...prev};
          delete newStatus[key];
          return newStatus;
        });
      }, 3000);

    } catch (error) {
      console.error('❌ Failed to save risk management item:', error);
      setRiskActionStatus(prev => ({...prev, [key]: 'Error'}));
      alert('Failed to save risk management strategy. Please try again.');

      setTimeout(() => {
        setRiskActionStatus(prev => {
          const newStatus = {...prev};
          delete newStatus[key];
          return newStatus;
        });
      }, 3000);
    }
  };

  // Copy content pillar text
  const copyContentPillar = async (pillar: any, index: number) => {
    try {
      console.log('📋 Copying content pillar text for:', pillar.pillarName);
      setPillarActionStatus(prev => ({...prev, [index]: 'Copying...'}));

      await contentPillarsService.copyPillarText(pillar);
      console.log('✅ Content pillar text copied to clipboard');

      setPillarActionStatus(prev => ({...prev, [index]: 'Copied!'}));

      setTimeout(() => {
        setPillarActionStatus(prev => {
          const newStatus = {...prev};
          delete newStatus[index];
          return newStatus;
        });
      }, 2000);
    } catch (error) {
      console.error('❌ Failed to copy pillar text:', error);
      setPillarActionStatus(prev => ({...prev, [index]: 'Error'}));

      // Show user-friendly error message
      alert(`Failed to copy text. Error: ${error.message || 'Clipboard access denied'}`);

      setTimeout(() => {
        setPillarActionStatus(prev => {
          const newStatus = {...prev};
          delete newStatus[index];
          return newStatus;
        });
      }, 2000);
    }
  };

  // Regenerate specific content pillar
  const regenerateContentPillar = async (pillarIndex: number) => {
    console.log('���� Regenerate function called with index:', pillarIndex);
    console.log('💰 Can afford check:', canAfford('regenerate', 1));

    if (!canAfford('regenerate', 1)) {
      console.error('❌ Insufficient credits');
      alert('Insufficient credits. You need 1 credit to regenerate a content pillar.');
      return;
    }


    try {
      console.log('🔄 Starting content pillar regeneration for index:', pillarIndex);
      console.log('📊 Strategy plan available:', !!strategyPlan);
      console.log('�� Content pillars available:', strategyPlan?.contentPillars?.length || 0);

      setRegeneratingPillar(pillarIndex);

      console.log('💳 Attempting to deduct 1 credit for Content Pillar Regeneration');
      const creditDeducted = await deductCredits('regenerate', 1, 'Content Pillar Regeneration');
      console.log('💳 Credit deduction result:', creditDeducted);

      if (!strategyPlan?.contentPillars) {
        throw new Error('No content pillars found in strategy plan');
      }

      const currentPillar = strategyPlan.contentPillars[pillarIndex];
      const otherPillars = strategyPlan.contentPillars.filter((_, i) => i !== pillarIndex);

      console.log('📋 Current pillar:', currentPillar);
      console.log('📋 Other pillars count:', otherPillars.length);
      console.log('📋 Other pillars:', otherPillars.map(p => p.pillarName));

      const context = {
        currentPillar,
        otherPillars,
        niche: externalStrategyConfig?.niche || 'General content creation',
        targetAudience: externalStrategyConfig?.targetAudience || 'General audience',
        platforms: externalStrategyConfig?.platforms?.map(p => p.toString()) || ['Multi-platform'],
        goals: strategyPlan.goals || ['Engagement', 'Growth']
      };

      console.log('🎯 Regeneration context:', context);
      console.log('🔗 pillarRegenerationService available:', !!pillarRegenerationService);

      console.log('🤖 Calling pillar regeneration service...');
      const newPillar = await pillarRegenerationService.regenerateContentPillar(context);
      console.log('✅ New pillar generated:', newPillar);

      // Update the strategy plan with the new pillar
      if (onUpdateStrategyPlan) {
        console.log('📝 onUpdateStrategyPlan function available, updating...');
        const updatedPillars = [...strategyPlan.contentPillars];
        updatedPillars[pillarIndex] = newPillar;

        const updatedStrategyPlan = {
          ...strategyPlan,
          contentPillars: updatedPillars
        };

        console.log('📝 Calling onUpdateStrategyPlan with updated data');
        onUpdateStrategyPlan(updatedStrategyPlan);
        console.log('✅ Strategy plan updated successfully');
      } else {
        console.warn('⚠��� onUpdateStrategyPlan function not available');
      }

      console.log('🎉 Showing success message');
      alert(`Content pillar "${newPillar.pillarName}" regenerated successfully!`);
    } catch (error) {
      console.error('❌ Failed to regenerate content pillar:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });

      alert(`Failed to regenerate content pillar. Error: ${error.message || 'Unknown error'}`);

      // Try to refund the credit if regeneration failed
      try {
        console.log('🔄 Attempting to refund credit due to regeneration failure');
        // Note: You might want to implement a refund mechanism in your credits service
      } catch (refundError) {
        console.error('❌ Failed to refund credit:', refundError);
      }
    } finally {
      console.log('🏁 Cleaning up regeneration state');
      setRegeneratingPillar(null);
      setActivePillarMenu(null);
    }
  };

  // Regenerate specific goal
  const regenerateSpecificGoal = async (goalIndex: number) => {
    if (!canAfford('regenerate', 1)) {
      alert('Insufficient credits. You need 1 credit to regenerate.');
      return;
    }

    if (!confirm('Regenerate this goal? This will cost 1 credit.')) {
      return;
    }

    try {
      setRegeneratingGoal(goalIndex);
      await deductCredits('regenerate', 1, 'Strategic Goal Regeneration');

      // Create fallback strategy plan and config if not available
      const fallbackStrategyPlan = strategyPlan || {
        goals: ['Sample strategic goal', 'Another goal', 'Third goal', 'Fourth goal', 'Fifth goal']
      };

      const fallbackConfig = externalStrategyConfig || {
        niche: 'Content Creation',
        targetAudience: 'Content creators and marketers',
        platforms: ['YouTube', 'Instagram'],
        timeframe: '3months',
        budget: 'medium'
      };

      // Regenerate only the specific goal
      const newGoal = await goalRegenerationService.regenerateSpecificGoal(
        fallbackStrategyPlan,
        goalIndex,
        fallbackConfig
      );

      // Update the strategy plan with the new goal if we have one
      if (strategyPlan && onUpdateStrategyPlan) {
        const updatedGoals = [...strategyPlan.goals];
        updatedGoals[goalIndex] = newGoal;

        const updatedStrategyPlan = {
          ...strategyPlan,
          goals: updatedGoals
        };

        onUpdateStrategyPlan(updatedStrategyPlan);
      }

      alert(`Goal ${goalIndex + 1} regenerated successfully!`);
    } catch (error) {
      console.error('Failed to regenerate goal:', error);
      alert('Failed to regenerate goal. Please try again.');
    } finally {
      setRegeneratingGoal(null);
      setActiveGoalMenu(null);
    }
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setActiveGoalMenu(null);
      setActivePillarMenu(null);
      setActiveRiskMenu(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Development override check
  const devPremiumOverride =
    import.meta.env.DEV &&
    (localStorage.getItem("dev_force_premium") === "true" ||
      localStorage.getItem("emergency_premium") === "true");

  // Debug logging for Ultimate Templates access
  if (import.meta.env.DEV) {
    console.log("🔧 Ultimate Templates Debug:", {
      devPremiumOverride,
      devForceFlag: localStorage.getItem("dev_force_premium"),
      emergencyFlag: localStorage.getItem("emergency_premium"),
      isDEV: import.meta.env.DEV,
      planId: billingInfo?.subscription?.planId,
      billingInfo,
    });

    // Add global debugging functions
    (window as any).forceUltimateTemplates = () => {
      localStorage.setItem("force_ultimate", "true");
      console.log("🔧 Force Ultimate Templates enabled - refresh page");
    };

    (window as any).disableUltimateForce = () => {
      localStorage.removeItem("force_ultimate");
      console.log("����� Force Ultimate Templates disabled - refresh page");
    };

    (window as any).testUltimateAccess = () => {
      console.log("����� Ultimate Templates Test:", {
        hasAccess: hasUltimateAccess(),
        devPremiumOverride,
        planId: billingInfo?.subscription?.planId,
        status: billingInfo?.status,
        forceFlag: localStorage.getItem("force_ultimate"),
      });
    };
  }

  // Helper function to check Ultimate Templates access (Agency Pro, Enterprise, or dev override)
  const hasUltimateAccess = () => {
    // Manual force unlock for debugging (temporary)
    const manualOverride = import.meta.env.DEV && localStorage.getItem("force_ultimate") === "true";

    const access = manualOverride ||
           devPremiumOverride ||
           (billingInfo?.status === "active" && (
             billingInfo?.subscription?.planId === "business" ||
             billingInfo?.subscription?.planId === "enterprise" ||
             billingInfo?.subscription?.planId === "business_yearly" ||
             billingInfo?.subscription?.planId === "enterprise_yearly"
           ));

    if (import.meta.env.DEV) {
      console.log("��� hasUltimateAccess:", access, {
        manualOverride,
        devPremiumOverride,
        billingStatus: billingInfo?.status,
        planId: billingInfo?.subscription?.planId,
        fullBillingInfo: billingInfo,
      });
    }

    return access;
  };

  // Use external state if provided, otherwise fall back to local state
  const [localShowAdvancedOptions, setLocalShowAdvancedOptions] =
    useState(false);
  const [localSelectedTemplate, setLocalSelectedTemplate] = useState<
    string | null
  >(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const defaultStrategyConfig = {
    niche: "",
    targetAudience: "",
    goals: [],
    platforms: [],
    contentTypes: [],
    timeframe: "3months",
    budget: "medium",
    competitorAnalysis: false,
    aiPersona: "expert",
    industryFocus: "",
    geographicFocus: [],
    languagePreferences: ["English"],
  };

  const [localStrategyConfig, setLocalStrategyConfig] =
    useState<StrategyConfig>(defaultStrategyConfig);

  // Generate dynamic metrics based on niche and config
  const generateDynamicSummary = () => {
    if (!strategyConfig?.niche)
      return { roi: "8:1", timeline: "12-18mo", revenue: "$500K+" };

    const niche = strategyConfig.niche.toLowerCase();
    const timeframe = strategyConfig.timeframe || "3months";
    const budget = strategyConfig.budget || "medium";
    const pillarsCount = strategyPlan?.contentPillars?.length || 5;

    // Calculate ROI based on niche and budget
    let baseROI = 8;
    if (
      niche.includes("tech") ||
      niche.includes("saas") ||
      niche.includes("ai")
    )
      baseROI = 12;
    if (niche.includes("finance") || niche.includes("crypto")) baseROI = 15;
    if (niche.includes("health") || niche.includes("fitness")) baseROI = 6;
    if (niche.includes("education") || niche.includes("course")) baseROI = 10;

    if (budget === "high" || budget === "enterprise") baseROI += 3;
    if (budget === "low") baseROI -= 2;

    // Calculate timeline based on timeframe and complexity
    let timelineMonths =
      {
        "1month": 3,
        "3months": 8,
        "6months": 12,
        "1year": 18,
      }[timeframe] || 8;

    if (pillarsCount > 5) timelineMonths += 2;

    // Calculate revenue based on niche, budget, and timeframe
    let baseRevenue = 250000;
    if (niche.includes("enterprise") || niche.includes("b2b"))
      baseRevenue = 800000;
    if (niche.includes("ecommerce") || niche.includes("retail"))
      baseRevenue = 400000;
    if (niche.includes("local") || niche.includes("small business"))
      baseRevenue = 150000;

    const budgetMultiplier =
      {
        low: 0.6,
        medium: 1.0,
        high: 1.8,
        enterprise: 3.2,
      }[budget] || 1.0;

    const timeframeMultiplier =
      {
        "1month": 0.3,
        "3months": 0.7,
        "6months": 1.0,
        "1year": 1.5,
      }[timeframe] || 1.0;

    const finalRevenue = Math.round(
      baseRevenue * budgetMultiplier * timeframeMultiplier,
    );

    return {
      roi: `${Math.max(3, baseROI)}:1`,
      timeline:
        timelineMonths > 12
          ? `${Math.round(timelineMonths / 12)}-${Math.round(timelineMonths / 12 + 0.5)}yr`
          : `${timelineMonths}-${timelineMonths + 4}mo`,
      revenue:
        finalRevenue >= 1000000
          ? `$${(finalRevenue / 1000000).toFixed(1)}M+`
          : `$${Math.round(finalRevenue / 1000)}K+`,
    };
  };

  // Send to canvas functions
  const sendSectionToCanvas = (sectionTitle: string, content: string) => {
    if (onSendToCanvas) {
      onSendToCanvas(content, `Strategy: ${sectionTitle}`);
    }
  };

  const sendPillarToCanvas = (pillar: any) => {
    if (onSendToCanvas) {
      const content = `# ${pillar.pillarName}\n\n${pillar.description}\n\n**Keywords:** ${pillar.keywords.join(", ")}\n\n**Content Types:** ${pillar.contentTypes.join(", ")}\n\n**Posting Frequency:** ${pillar.postingFrequency}\n\n**Engagement Strategy:** ${pillar.engagementStrategy}`;
      onSendToCanvas(content, `Pillar: ${pillar.pillarName}`);
    }
  };

  const sendEntireStrategyToCanvas = () => {
    if (!strategyPlan || !onSendToCanvas) return;

    let fullContent = `# Content Strategy Plan\n\n`;
    fullContent += `## Target Audience\n${strategyPlan.targetAudienceOverview}\n\n`;
    fullContent += `## Strategic Goals\n${strategyPlan.goals.map((goal, i) => `${i + 1}. ${goal}`).join("\n")}\n\n`;
    fullContent += `## Content Pillars\n${strategyPlan.contentPillars.map((pillar) => `### ${pillar.pillarName}\n${pillar.description}\n\n**Keywords:** ${pillar.keywords.join(", ")}\n**Content Types:** ${pillar.contentTypes.join(", ")}\n**Posting Frequency:** ${pillar.postingFrequency}\n`).join("\n")}\n`;

    if (strategyPlan.analyticsAndKPIs) {
      fullContent += `## Analytics & KPIs\n**Primary Metrics:** ${strategyPlan.analyticsAndKPIs.primaryMetrics.join(", ")}\n`;
      if (strategyPlan.analyticsAndKPIs.advancedMetrics) {
        fullContent += `**Advanced Metrics:** ${strategyPlan.analyticsAndKPIs.advancedMetrics.join(", ")}\n`;
      }
    }

    onSendToCanvas(fullContent, "Complete Content Strategy Plan");
  };

  const sendStrategyAsMindMap = () => {
    if (!strategyPlan || !onSendStrategyMindMap) return;

    // Create a text representation of the strategy for parsing
    let strategyContent = `# Content Strategy Plan\n\n`;
    strategyContent += `## Target Audience\n${strategyPlan.targetAudienceOverview}\n\n`;
    strategyContent += `## Strategic Goals\n${strategyPlan.goals.map((goal, i) => `${i + 1}. ${goal}`).join("\n")}\n\n`;
    strategyContent += `## Content Pillars\n${strategyPlan.contentPillars.map((pillar) => `### ${pillar.pillarName}\n${pillar.description}\n\n**Keywords:** ${pillar.keywords.join(", ")}\n**Content Types:** ${pillar.contentTypes.join(", ")}\n**Posting Frequency:** ${pillar.postingFrequency}\n`).join("\n")}\n`;

    onSendStrategyMindMap(strategyContent, strategyPlan);
  };

  // Calendar integration functions
  const handleCalendarItemToggle = (index: number) => {
    const newSelected = new Set(selectedCalendarItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedCalendarItems(newSelected);
  };

  const handleAddSelectedToCalendar = () => {
    if (!strategyPlan?.suggestedWeeklySchedule || !onAddToCalendar) return;

    const selectedItems = Array.from(selectedCalendarItems).map(
      index => strategyPlan.suggestedWeeklySchedule[index]
    );

    onAddToCalendar(selectedItems);
    setSelectedCalendarItems(new Set());
    setShowCalendarModal(false);
  };

  const handleAddAllToCalendar = () => {
    if (!strategyPlan?.suggestedWeeklySchedule || !onAddToCalendar) return;

    onAddToCalendar(strategyPlan.suggestedWeeklySchedule);
    setSelectedCalendarItems(new Set());
    setShowCalendarModal(false);
  };

  // Use external state if available, otherwise use local state
  // Ensure all properties are defined to avoid undefined errors and controlled/uncontrolled issues
  const strategyConfig = externalStrategyConfig
    ? {
        niche: externalStrategyConfig.niche || "",
        targetAudience: externalStrategyConfig.targetAudience || "",
        goals: externalStrategyConfig.goals || [],
        platforms: externalStrategyConfig.platforms || [],
        timeframe: externalStrategyConfig.timeframe || "3months",
        budget: externalStrategyConfig.budget || "medium",
        contentTypes: externalStrategyConfig.contentTypes || [],
        competitorAnalysis: externalStrategyConfig.competitorAnalysis || false,
        aiPersona: externalStrategyConfig.aiPersona || "expert",
        industryFocus: externalStrategyConfig.industryFocus || "",
        geographicFocus: externalStrategyConfig.geographicFocus || [],
        languagePreferences: externalStrategyConfig.languagePreferences || [
          "English",
        ],
      }
    : localStrategyConfig;

  // Create a setStrategyConfig function that works with both external and local state
  const setStrategyConfig = onStrategyConfigChange
    ? (updater: any) => {
        const newConfig =
          typeof updater === "function" ? updater(strategyConfig) : updater;
        onStrategyConfigChange(newConfig);
      }
    : setLocalStrategyConfig;
  const showAdvancedOptions = onShowAdvancedOptionsChange
    ? externalShowAdvancedOptions
    : localShowAdvancedOptions;
  const setShowAdvancedOptions =
    onShowAdvancedOptionsChange || setLocalShowAdvancedOptions;
  const selectedTemplate = onSelectedTemplateChange
    ? externalSelectedTemplate
    : localSelectedTemplate;
  const setSelectedTemplate =
    onSelectedTemplateChange || setLocalSelectedTemplate;

  // Analytics tracking state
  const [trackedTopics, setTrackedTopics] = useState<TrackedTopic[]>([]);
  const [newTopicInput, setNewTopicInput] = useState("");
  const [isTrackingTopic, setIsTrackingTopic] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );

  // Content Calendar state
  const [calendarView, setCalendarView] = useState<
    "month" | "quarter" | "year"
  >("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledContent, setScheduledContent] = useState<
    ScheduledContentItem[]
  >([]);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [showNewContentModal, setShowNewContentModal] = useState(false);
  const [showContentDetailsModal, setShowContentDetailsModal] = useState(false);
  const [selectedContentItem, setSelectedContentItem] =
    useState<ScheduledContentItem | null>(null);
  const [newContentForm, setNewContentForm] = useState<NewContentForm>({
    title: "",
    platform: "YouTube",
    contentType: "Video",
    date: "",
    time: "",
    description: "",
    pillar: "",
    status: "planned",
  });

  // State for new components
  const [savedDrafts, setSavedDrafts] = useState<
    { id: string; name: string; config: StrategyConfig }[]
  >([]);
  const [showNicheIdeas, setShowNicheIdeas] = useState(false);
  const [showAudienceIdeas, setShowAudienceIdeas] = useState(false);
  const [saveDraftName, setSaveDraftName] = useState("");
  const [showSaveDraft, setShowSaveDraft] = useState(false);

  // Calendar integration state
  const [selectedCalendarItems, setSelectedCalendarItems] = useState<Set<number>>(new Set());
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Dynamic Strategy Analysis
  const analyzeStrategy = () => {
    const analysis = {
      nicheInsight: "",
      competitionScore: 0,
      keyThemes: [] as string[],
      audienceMatch: "",
      psychographicInsight: "",
      suggestedPlatforms: [] as string[],
      confidence: 0,
      growth: "Unknown",
      difficulty: "Medium",
    };

    if (!strategyConfig.niche) {
      return {
        ...analysis,
        nicheInsight: "Fill out your niche to see real-time analysis",
      };
    }

    const niche = strategyConfig.niche.toLowerCase();

    // Niche Analysis
    if (
      niche.includes("tech") ||
      niche.includes("ai") ||
      niche.includes("software")
    ) {
      analysis.nicheInsight =
        "High-growth technology sector with passionate early adopters.";
      analysis.competitionScore = 8.5;
      analysis.keyThemes = [
        "Innovation",
        "Future Trends",
        "Problem-Solving",
        "Efficiency",
      ];
      analysis.growth = "Very High";
      analysis.difficulty = "High";
    } else if (
      niche.includes("sustainable") ||
      niche.includes("eco") ||
      niche.includes("green")
    ) {
      analysis.nicheInsight =
        "Mission-driven niche with highly engaged, value-conscious audience.";
      analysis.competitionScore = 7.0;
      analysis.keyThemes = [
        "Environmental Impact",
        "Conscious Living",
        "Future Generations",
      ];
      analysis.growth = "High";
    } else if (
      niche.includes("finance") ||
      niche.includes("investment") ||
      niche.includes("crypto")
    ) {
      analysis.nicheInsight =
        "High-value niche with educated, analytical audience.";
      analysis.competitionScore = 9.0;
      analysis.keyThemes = [
        "Wealth Building",
        "Market Analysis",
        "Risk Management",
      ];
      analysis.growth = "Very High";
      analysis.difficulty = "Very High";
    } else if (
      niche.includes("health") ||
      niche.includes("fitness") ||
      niche.includes("wellness")
    ) {
      analysis.nicheInsight =
        "Evergreen niche with personal, transformation-focused content.";
      analysis.competitionScore = 7.5;
      analysis.keyThemes = [
        "Personal Growth",
        "Lifestyle Change",
        "Achievement",
      ];
      analysis.growth = "Steady";
    } else if (
      niche.includes("education") ||
      niche.includes("learning") ||
      niche.includes("course")
    ) {
      analysis.nicheInsight =
        "Knowledge-sharing niche with loyal, growth-minded audience.";
      analysis.competitionScore = 6.5;
      analysis.keyThemes = [
        "Skill Development",
        "Career Growth",
        "Knowledge Sharing",
      ];
      analysis.growth = "High";
    } else if (
      niche.includes("food") ||
      niche.includes("cooking") ||
      niche.includes("recipe")
    ) {
      analysis.nicheInsight =
        "Visual, lifestyle niche with broad appeal and high engagement.";
      analysis.competitionScore = 8.0;
      analysis.keyThemes = ["Lifestyle", "Creativity", "Community", "Culture"];
      analysis.growth = "Steady";
    } else {
      analysis.nicheInsight =
        "Analyzing your unique niche for opportunities...";
      analysis.competitionScore = 6.0;
      analysis.keyThemes = ["Expertise", "Community", "Value Creation"];
    }

    // Audience Analysis
    if (strategyConfig.targetAudience) {
      const audience = strategyConfig.targetAudience.toLowerCase();
      if (audience.includes("millennial") || audience.includes("gen z")) {
        analysis.audienceMatch =
          "Excellent! Digital-native audience with high platform engagement.";
        analysis.psychographicInsight =
          "Values authenticity, social causes, and transparent communication.";
        analysis.suggestedPlatforms = ["Instagram", "TikTok", "YouTube"];
      } else if (
        audience.includes("professional") ||
        audience.includes("b2b")
      ) {
        analysis.audienceMatch =
          "Strong professional audience for thought leadership content.";
        analysis.psychographicInsight =
          "Seeks industry insights, networking, and career advancement.";
        analysis.suggestedPlatforms = ["LinkedIn", "Twitter", "YouTube"];
      } else if (audience.includes("parent") || audience.includes("family")) {
        analysis.audienceMatch =
          "Family-focused audience values practical, trustworthy content.";
        analysis.psychographicInsight =
          "Prioritizes safety, value, and time-efficient solutions.";
        analysis.suggestedPlatforms = ["Facebook", "Instagram", "Pinterest"];
      } else {
        analysis.audienceMatch =
          "Good audience definition - tailor content to their specific needs.";
        analysis.psychographicInsight =
          "Focus on understanding their core challenges and aspirations.";
        analysis.suggestedPlatforms = ["YouTube", "Instagram", "LinkedIn"];
      }
    }

    // Calculate confidence based on inputs
    let confidence = 0;
    if (strategyConfig.niche) confidence += 30;
    if (strategyConfig.targetAudience) confidence += 30;
    if (strategyConfig.goals.length > 0) confidence += 20;
    if (strategyConfig.platforms.length > 0) confidence += 10;
    if (strategyConfig.contentTypes.length > 0) confidence += 10;
    analysis.confidence = confidence;

    return analysis;
  };

  // Generate niche ideas
  const generateNicheIdeas = () => {
    return [
      "Sustainable Technology",
      "AI for Small Business",
      "Remote Work Productivity",
      "Financial Independence",
      "Plant-Based Nutrition",
      "Digital Minimalism",
      "Career Transitions",
      "Creative Side Hustles",
      "Mental Health & Wellness",
      "Sustainable Fashion",
    ];
  };

  // Generate audience ideas based on niche
  const generateAudienceIdeas = () => {
    if (!strategyConfig.niche) return [];

    const niche = strategyConfig.niche.toLowerCase();
    if (niche.includes("tech")) {
      return [
        "Tech-savvy millennials seeking career growth",
        "Small business owners exploring automation",
        "Students preparing for tech careers",
        "Remote workers optimizing productivity",
      ];
    } else if (niche.includes("sustainable")) {
      return [
        "Environmentally conscious consumers",
        "Young families reducing their carbon footprint",
        "Professionals seeking sustainable workplace practices",
        "Students passionate about climate action",
      ];
    } else if (niche.includes("finance")) {
      return [
        "Young professionals building wealth",
        "Families planning for financial security",
        "Entrepreneurs managing business finances",
        "Recent graduates tackling student debt",
      ];
    }
    return [
      "Passionate enthusiasts in your field",
      "Beginners seeking guidance and education",
      "Professionals advancing their expertise",
      "Community-minded individuals sharing interests",
    ];
  };

  // Save draft functionality
  const saveDraft = () => {
    if (!saveDraftName.trim()) return;

    const newDraft = {
      id: Date.now().toString(),
      name: saveDraftName,
      config: strategyConfig,
    };

    setSavedDrafts((prev) => [...prev, newDraft]);
    setSaveDraftName("");
    setShowSaveDraft(false);
  };

  const loadDraft = (draft: {
    id: string;
    name: string;
    config: StrategyConfig;
  }) => {
    setStrategyConfig(draft.config);
  };

  const clearForm = () => {
    setStrategyConfig({
      niche: "",
      targetAudience: "",
      goals: [],
      platforms: [],
      timeframe: "3months",
      budget: "medium",
      contentTypes: [],
      competitorAnalysis: false,
      aiPersona: "expert",
      industryFocus: "",
      geographicFocus: [],
      languagePreferences: ["English"],
    });
  };

  // Mock data for premium features (keeping for other components that might use it)
  const mockMetrics: StrategyMetrics = {
    pillarsCount: 5,
    expectedReach: 125000,
    contentVolume: 240,
    engagementProjection: 8.7,
    competitiveAdvantage: 73,
    difficultyScore: 6.2,
  };

  const predefinedGoals = [
    "Brand Awareness",
    "Lead Generation",
    "Audience Growth",
    "Engagement",
    "Thought Leadership",
    "Community Building",
    "Sales Conversion",
    "Education",
    "Customer Retention",
    "Market Expansion",
  ];

  // Advanced Analytics Engine
  const addTopicToTrack = async () => {
    if (!newTopicInput.trim()) return;

    setIsTrackingTopic(true);

    // Simulate complex analytics processing
    setTimeout(() => {
      const newTopic: TrackedTopic = {
        id: Date.now().toString(),
        name: newTopicInput.trim(),
        category: determineTopicCategory(newTopicInput),
        addedDate: new Date(),
        metrics: generateAdvancedMetrics(newTopicInput.trim()),
        historicalData: generateRealisticHistoricalData(newTopicInput.trim()),
      };

      setTrackedTopics((prev) => [...prev, newTopic]);
      setNewTopicInput("");
      setIsTrackingTopic(false);
      updateAnalyticsData([...trackedTopics, newTopic]);
    }, 1500);
  };

  // Sophisticated metrics generation based on topic analysis
  const generateAdvancedMetrics = (topicName: string) => {
    const topic = topicName.toLowerCase();

    // Topic popularity scoring algorithm
    const popularityFactors = {
      ai: 0.95,
      "artificial intelligence": 0.95,
      chatgpt: 0.92,
      automation: 0.88,
      cryptocurrency: 0.85,
      blockchain: 0.82,
      nft: 0.75,
      metaverse: 0.78,
      "remote work": 0.89,
      productivity: 0.87,
      startup: 0.84,
      entrepreneurship: 0.83,
      "social media": 0.91,
      "content creation": 0.88,
      marketing: 0.86,
      seo: 0.81,
      technology: 0.85,
      innovation: 0.82,
      sustainability: 0.79,
      climate: 0.77,
      fitness: 0.83,
      health: 0.86,
      wellness: 0.84,
      "mental health": 0.89,
      finance: 0.87,
      investing: 0.85,
      stocks: 0.82,
      crypto: 0.85,
    };

    // Calculate base popularity score
    let popularityScore = 0.5; // Default
    for (const [keyword, score] of Object.entries(popularityFactors)) {
      if (topic.includes(keyword)) {
        popularityScore = Math.max(popularityScore, score);
      }
    }

    // Add randomness and time-based trends
    const timeBonus = Math.sin(Date.now() / (1000 * 60 * 60 * 24)) * 0.1; // Daily cycle
    const randomFactor = (Math.random() - 0.5) * 0.2;
    popularityScore += timeBonus + randomFactor;
    popularityScore = Math.max(0.1, Math.min(1.0, popularityScore));

    // Generate correlated metrics
    const baseTrendScore = Math.floor(popularityScore * 100);
    const baseReach = Math.floor(
      popularityScore * 100000 + Math.random() * 50000,
    );
    const baseEngagement = popularityScore * 12 + Math.random() * 3;
    const baseMentions = Math.floor(
      popularityScore * 2000 + Math.random() * 1000,
    );

    // Sentiment analysis based on topic type
    const sentimentWeights = {
      positive: popularityScore > 0.7 ? 0.6 : popularityScore > 0.5 ? 0.4 : 0.2,
      neutral: 0.3,
      negative: popularityScore < 0.3 ? 0.5 : popularityScore < 0.5 ? 0.3 : 0.1,
    };

    const sentimentRandom = Math.random();
    let sentiment: "positive" | "neutral" | "negative" = "neutral";

    if (sentimentRandom < sentimentWeights.positive) {
      sentiment = "positive";
    } else if (
      sentimentRandom <
      sentimentWeights.positive + sentimentWeights.neutral
    ) {
      sentiment = "neutral";
    } else {
      sentiment = "negative";
    }

    return {
      reach: Math.floor(baseReach),
      engagement: Math.round(baseEngagement * 10) / 10,
      mentions: baseMentions,
      sentiment,
      trendScore: Math.max(
        1,
        Math.min(100, baseTrendScore + Math.floor(Math.random() * 20) - 10),
      ),
    };
  };

  const determineTopicCategory = (topic: string): string => {
    const categories = {
      AI: [
        "ai",
        "artificial intelligence",
        "machine learning",
        "chatgpt",
        "automation",
      ],
      Technology: ["tech", "software", "app", "platform", "digital"],
      Business: [
        "business",
        "startup",
        "entrepreneur",
        "marketing",
        "strategy",
      ],
      Education: ["tutorial", "guide", "learn", "course", "tips"],
      Trends: ["trend", "viral", "popular", "trending", "hot"],
    };

    const lowerTopic = topic.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((keyword) => lowerTopic.includes(keyword))) {
        return category;
      }
    }
    return "General";
  };

  // Advanced historical data generation with realistic patterns
  const generateRealisticHistoricalData = (topicName: string) => {
    const topic = topicName.toLowerCase();
    const days = parseInt(selectedTimeRange.replace("d", ""));
    const data = [];

    // Topic lifecycle patterns
    const isViralTopic =
      topic.includes("viral") ||
      topic.includes("trending") ||
      topic.includes("tiktok");
    const isTechTopic =
      topic.includes("ai") ||
      topic.includes("tech") ||
      topic.includes("crypto");
    const isSeasonalTopic =
      topic.includes("holiday") ||
      topic.includes("summer") ||
      topic.includes("winter");

    // Base metrics influenced by topic type
    let baseReach = isTechTopic ? 25000 : isViralTopic ? 40000 : 15000;
    let baseEngagement = isTechTopic ? 6 : isViralTopic ? 9 : 4;
    let baseMentions = isTechTopic ? 300 : isViralTopic ? 600 : 200;

    // Generate realistic time series with patterns
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Day of week effects (weekends typically lower)
      const dayOfWeek = date.getDay();
      const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1.0;

      // Business hours effect (simulate daily cycles)
      const hour = Math.floor(Math.random() * 24);
      const businessHoursMultiplier = hour >= 9 && hour <= 17 ? 1.2 : 0.8;

      // Trend decay/growth over time
      const trendDirection = isViralTopic
        ? Math.exp(-i / (days * 0.3)) // Viral topics decay fast
        : isTechTopic
          ? 1 + (i / days) * 0.3 // Tech topics grow
          : 1 + Math.sin(i / 7) * 0.2; // Regular topics fluctuate weekly

      // Market volatility (some days are just different)
      const volatility = 1 + (Math.random() - 0.5) * 0.4;

      // Correlation between metrics (realistic relationships)
      const reachMultiplier =
        weekendMultiplier *
        businessHoursMultiplier *
        trendDirection *
        volatility;
      const dayReach = Math.floor(baseReach * reachMultiplier);

      // Engagement inversely correlates with reach (smaller audiences more engaged)
      const engagementMultiplier =
        reachMultiplier * (1 + (1 / reachMultiplier - 1) * 0.3);
      const dayEngagement = Math.max(
        0.5,
        baseEngagement * engagementMultiplier,
      );

      // Mentions correlate with both reach and engagement
      const mentionsMultiplier = Math.sqrt(
        reachMultiplier * engagementMultiplier,
      );
      const dayMentions = Math.floor(baseMentions * mentionsMultiplier);

      data.push({
        date: date.toISOString().split("T")[0],
        reach: Math.max(100, dayReach),
        engagement:
          Math.round(Math.max(0.5, Math.min(15, dayEngagement)) * 10) / 10,
        mentions: Math.max(10, dayMentions),
      });
    }

    return data;
  };

  // Advanced Analytics Processing Engine
  const updateAnalyticsData = (topics: TrackedTopic[]) => {
    if (topics.length === 0) {
      setAnalyticsData(null);
      return;
    }

    // Advanced correlation analysis
    const correlatedMetrics = calculateAdvancedCorrelations(topics);
    const marketTrends = analyzeMarketTrends(topics);
    const competitiveInsights = generateCompetitiveAnalysis(topics);
    const predictiveMetrics = calculatePredictiveMetrics(topics);

    const analyticsData: AnalyticsData = {
      totalReach: correlatedMetrics.totalReach,
      totalEngagement: correlatedMetrics.avgEngagement,
      averageScore: correlatedMetrics.avgTrendScore,
      conversionRate: predictiveMetrics.projectedConversion,
      topPerformingTopics: topics
        .sort((a, b) => b.metrics.trendScore - a.metrics.trendScore)
        .slice(0, 3),
      platformBreakdown: calculatePlatformPerformance(topics, marketTrends),
    };

    setAnalyticsData(analyticsData);
  };

  // Advanced correlation calculation with market factors
  const calculateAdvancedCorrelations = (topics: TrackedTopic[]) => {
    const totalReach = topics.reduce(
      (sum, topic) => sum + topic.metrics.reach,
      0,
    );
    const weightedEngagement = calculateWeightedEngagement(topics);
    const sentimentImpact = calculateSentimentImpact(topics);
    const categoryDiversity = calculateCategoryDiversity(topics);

    // Apply market correlation factors
    const marketMultiplier =
      1 + sentimentImpact * 0.3 + categoryDiversity * 0.2;

    return {
      totalReach: Math.floor(totalReach * marketMultiplier),
      avgEngagement: weightedEngagement,
      avgTrendScore:
        topics.reduce((sum, topic) => sum + topic.metrics.trendScore, 0) /
        topics.length,
    };
  };

  // Weighted engagement based on reach and recency
  const calculateWeightedEngagement = (topics: TrackedTopic[]) => {
    let totalWeightedEngagement = 0;
    let totalWeight = 0;

    topics.forEach((topic) => {
      const reachWeight =
        Math.log(topic.metrics.reach + 1) / Math.log(100000 + 1); // Logarithmic weighting
      const recencyWeight =
        1 -
        (Date.now() - topic.addedDate.getTime()) / (1000 * 60 * 60 * 24 * 30); // Decay over 30 days
      const categoryWeight = getCategoryWeight(topic.category);

      const weight =
        reachWeight * Math.max(0.1, recencyWeight) * categoryWeight;
      totalWeightedEngagement += topic.metrics.engagement * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? totalWeightedEngagement / totalWeight : 0;
  };

  // Category performance weights based on current market trends
  const getCategoryWeight = (category: string) => {
    const categoryWeights = {
      AI: 1.3,
      Technology: 1.2,
      Business: 1.1,
      Education: 1.0,
      Trends: 1.4,
      General: 0.9,
    };
    return categoryWeights[category] || 1.0;
  };

  // Sentiment impact calculation
  const calculateSentimentImpact = (topics: TrackedTopic[]) => {
    const sentimentScores = { positive: 0, neutral: 0, negative: 0 };
    topics.forEach((topic) => {
      sentimentScores[topic.metrics.sentiment]++;
    });

    const total = topics.length;
    const positiveRatio = sentimentScores.positive / total;
    const negativeRatio = sentimentScores.negative / total;

    return positiveRatio - negativeRatio; // Range: -1 to 1
  };

  // Category diversity bonus calculation
  const calculateCategoryDiversity = (topics: TrackedTopic[]) => {
    const categories = new Set(topics.map((t) => t.category));
    const diversityScore = Math.min(categories.size / 5, 1); // Max benefit at 5 categories
    return diversityScore;
  };

  // Market trend analysis
  const analyzeMarketTrends = (topics: TrackedTopic[]) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isBusinessHours = hour >= 9 && hour <= 17;

    // Calculate time-based multipliers
    const timeMultiplier = isWeekend ? 0.8 : isBusinessHours ? 1.2 : 0.9;

    // Seasonal trends (simplified)
    const month = now.getMonth();
    const seasonalMultiplier = [
      0.9, 0.9, 1.0, 1.1, 1.1, 1.0, 0.9, 0.8, 1.0, 1.1, 1.0, 0.9,
    ][month];

    return {
      timeMultiplier,
      seasonalMultiplier,
      overallTrend: timeMultiplier * seasonalMultiplier,
    };
  };

  // Platform performance with advanced calculations
  const calculatePlatformPerformance = (
    topics: TrackedTopic[],
    marketTrends: any,
  ) => {
    const totalReach = topics.reduce(
      (sum, topic) => sum + topic.metrics.reach,
      0,
    );
    const avgEngagement =
      topics.reduce((sum, topic) => sum + topic.metrics.engagement, 0) /
      topics.length;

    // Platform-specific algorithms
    const platforms = [
      {
        platform: "YouTube",
        baseShare: 0.35,
        engagementMultiplier: 1.2,
        trendSensitivity: 1.1,
        audienceGrowth: calculatePlatformGrowth("YouTube", topics),
      },
      {
        platform: "LinkedIn",
        baseShare: 0.25,
        engagementMultiplier: 0.9,
        trendSensitivity: 0.8,
        audienceGrowth: calculatePlatformGrowth("LinkedIn", topics),
      },
      {
        platform: "Instagram",
        baseShare: 0.25,
        engagementMultiplier: 1.5,
        trendSensitivity: 1.3,
        audienceGrowth: calculatePlatformGrowth("Instagram", topics),
      },
      {
        platform: "TikTok",
        baseShare: 0.15,
        engagementMultiplier: 1.8,
        trendSensitivity: 1.6,
        audienceGrowth: calculatePlatformGrowth("TikTok", topics),
      },
    ];

    return platforms.map((platform) => ({
      platform: platform.platform,
      reach: Math.floor(
        totalReach * platform.baseShare * marketTrends.overallTrend,
      ),
      engagement:
        Math.round(
          avgEngagement *
            platform.engagementMultiplier *
            platform.trendSensitivity *
            10,
        ) / 10,
      growth: platform.audienceGrowth,
    }));
  };

  // Calculate platform-specific growth rates
  const calculatePlatformGrowth = (
    platformName: string,
    topics: TrackedTopic[],
  ) => {
    const platformFactors = {
      YouTube: { base: 8, volatility: 0.15, trendBonus: 0.2 },
      LinkedIn: { base: 5, volatility: 0.1, trendBonus: 0.1 },
      Instagram: { base: 12, volatility: 0.25, trendBonus: 0.3 },
      TikTok: { base: 20, volatility: 0.4, trendBonus: 0.5 },
    };

    const factor = platformFactors[platformName];
    const avgTrendScore =
      topics.reduce((sum, topic) => sum + topic.metrics.trendScore, 0) /
      topics.length;
    const trendBonus = (avgTrendScore / 100) * factor.trendBonus * 100;
    const randomVariation = (Math.random() - 0.5) * factor.volatility * 100;

    return Math.round((factor.base + trendBonus + randomVariation) * 10) / 10;
  };

  // Predictive metrics calculation
  const calculatePredictiveMetrics = (topics: TrackedTopic[]) => {
    const avgEngagement =
      topics.reduce((sum, topic) => sum + topic.metrics.engagement, 0) /
      topics.length;
    const avgTrendScore =
      topics.reduce((sum, topic) => sum + topic.metrics.trendScore, 0) /
      topics.length;
    const sentimentImpact = calculateSentimentImpact(topics);

    // Advanced conversion rate prediction
    const baseConversion = 2.5;
    const engagementBonus = (avgEngagement - 5) * 0.3; // Engagement above 5% adds bonus
    const trendBonus = (avgTrendScore - 50) * 0.02; // Trend score above 50 adds bonus
    const sentimentBonus = sentimentImpact * 1.5; // Positive sentiment increases conversion

    const projectedConversion = Math.max(
      0.5,
      Math.min(
        8.0,
        baseConversion + engagementBonus + trendBonus + sentimentBonus,
      ),
    );

    return {
      projectedConversion: Math.round(projectedConversion * 10) / 10,
    };
  };

  // Generate competitive analysis insights
  const generateCompetitiveAnalysis = (topics: TrackedTopic[]) => {
    // This would integrate with real competitive data in production
    const competitorPerformance = topics.map((topic) => ({
      topic: topic.name,
      marketShare: Math.random() * 0.3 + 0.1, // 10-40% market share
      competitiveAdvantage: topic.metrics.trendScore / 100,
    }));

    return competitorPerformance;
  };

  const removeTrackedTopic = (topicId: string) => {
    const updatedTopics = trackedTopics.filter((topic) => topic.id !== topicId);
    setTrackedTopics(updatedTopics);
    updateAnalyticsData(updatedTopics);
  };

  // Real-time data updates simulation
  React.useEffect(() => {
    if (trackedTopics.length === 0) return;

    // Update analytics when time range changes
    updateAnalyticsData(trackedTopics);

    // Simulate real-time data updates every 30 seconds
    const realtimeInterval = setInterval(() => {
      setTrackedTopics((prevTopics) => {
        const updatedTopics = prevTopics.map((topic) => ({
          ...topic,
          metrics: simulateRealtimeMetricUpdates(
            topic.metrics,
            topic.category,
            topic.name,
          ),
        }));

        // Update analytics with new data
        setTimeout(() => updateAnalyticsData(updatedTopics), 100);

        return updatedTopics;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(realtimeInterval);
  }, [trackedTopics.length, selectedTimeRange]);

  // Simulate realistic real-time metric updates
  const simulateRealtimeMetricUpdates = (
    currentMetrics: any,
    category: string,
    topicName: string,
  ) => {
    const now = new Date();
    const isBusinessHours = now.getHours() >= 9 && now.getHours() <= 17;
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;

    // Time-based activity multipliers
    const activityMultiplier = isWeekend ? 0.7 : isBusinessHours ? 1.3 : 0.8;

    // Category-specific volatility
    const categoryVolatility =
      {
        AI: 0.15,
        Technology: 0.12,
        Business: 0.08,
        Education: 0.06,
        Trends: 0.25,
        General: 0.1,
      }[category] || 0.1;

    // Calculate realistic incremental changes
    const reachChange = Math.floor(
      (Math.random() - 0.4) *
        currentMetrics.reach *
        categoryVolatility *
        activityMultiplier,
    );

    const engagementChange = (Math.random() - 0.5) * 0.5 * activityMultiplier; // ��0.25% change

    const mentionsChange = Math.floor(
      (Math.random() - 0.3) *
        currentMetrics.mentions *
        categoryVolatility *
        activityMultiplier,
    );

    const trendScoreChange = Math.floor(
      (Math.random() - 0.5) * 5 * activityMultiplier, // ±2.5 points
    );

    // Apply changes with realistic bounds
    const newMetrics = {
      reach: Math.max(100, currentMetrics.reach + reachChange),
      engagement: Math.max(
        0.5,
        Math.min(15, currentMetrics.engagement + engagementChange),
      ),
      mentions: Math.max(10, currentMetrics.mentions + mentionsChange),
      sentiment: updateSentiment(
        currentMetrics.sentiment,
        engagementChange,
        trendScoreChange,
      ),
      trendScore: Math.max(
        1,
        Math.min(100, currentMetrics.trendScore + trendScoreChange),
      ),
    };

    return {
      ...newMetrics,
      engagement: Math.round(newMetrics.engagement * 10) / 10,
    };
  };

  // Dynamic sentiment updates based on performance changes
  const updateSentiment = (
    currentSentiment: string,
    engagementChange: number,
    trendChange: number,
  ) => {
    const performanceIndicator = engagementChange + trendChange * 0.1;

    // Only change sentiment if performance change is significant
    if (Math.abs(performanceIndicator) < 0.3) {
      return currentSentiment;
    }

    if (performanceIndicator > 0.5) {
      return Math.random() > 0.7 ? "positive" : currentSentiment;
    } else if (performanceIndicator < -0.5) {
      return Math.random() > 0.7 ? "negative" : currentSentiment;
    }

    return currentSentiment;
  };

  // Get suggested topics based on strategy plan
  const getSuggestedTopics = () => {
    if (!strategyPlan) return [];

    const suggestions = [];

    // Add topics based on content pillars
    if (strategyPlan.contentPillars) {
      strategyPlan.contentPillars.forEach((pillar) => {
        suggestions.push(pillar.title);
        if (pillar.subTopics) {
          pillar.subTopics.forEach((subTopic) => {
            suggestions.push(subTopic);
          });
        }
      });
    }

    // Add niche-related topics
    if (strategyConfig.niche) {
      suggestions.push(strategyConfig.niche);
      suggestions.push(`${strategyConfig.niche} trends`);
      suggestions.push(`${strategyConfig.niche} tips`);
    }

    // Filter out already tracked topics
    const trackedNames = trackedTopics.map((t) => t.name.toLowerCase());
    return suggestions
      .filter((s) => !trackedNames.includes(s.toLowerCase()))
      .slice(0, 6);
  };

  const addSuggestedTopic = (topicName: string) => {
    setNewTopicInput(topicName);
    addTopicToTrack();
  };

  const exportAnalyticsData = () => {
    if (!analyticsData || trackedTopics.length === 0) return;

    const exportData = {
      summary: {
        totalReach: analyticsData.totalReach,
        averageEngagement: analyticsData.totalEngagement,
        averageTrendScore: analyticsData.averageScore,
        timeRange: selectedTimeRange,
        exportDate: new Date().toISOString(),
      },
      trackedTopics: trackedTopics.map((topic) => ({
        name: topic.name,
        category: topic.category,
        trendScore: topic.metrics.trendScore,
        reach: topic.metrics.reach,
        engagement: topic.metrics.engagement,
        sentiment: topic.metrics.sentiment,
        mentions: topic.metrics.mentions,
      })),
      platformBreakdown: analyticsData.platformBreakdown,
      aiInsights: generateAIInsights(trackedTopics, analyticsData),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `strategy-analytics-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Advanced AI Insights Generation Algorithm
  const generateAIInsights = (
    topics: TrackedTopic[],
    analytics: AnalyticsData | null,
  ) => {
    if (!analytics || topics.length === 0) return [];

    const insights = [];
    const now = new Date();

    // Analyze performance patterns
    const avgTrendScore =
      topics.reduce((sum, topic) => sum + topic.metrics.trendScore, 0) /
      topics.length;
    const avgEngagement =
      topics.reduce((sum, topic) => sum + topic.metrics.engagement, 0) /
      topics.length;
    const sentimentAnalysis = analyzeSentimentDistribution(topics);
    const categoryPerformance = analyzeCategoryPerformance(topics);
    const timeBasedPatterns = analyzeTimeBasedPatterns(topics);

    // High-performing topic detection
    if (avgTrendScore > 75) {
      insights.push({
        type: "opportunity",
        icon: "🚀",
        title: "High Performance Detected",
        message: `Your topics are performing exceptionally well (${avgTrendScore.toFixed(1)}/100 avg). Consider scaling content production around your top performers.`,
        confidence: 92,
        action: "Scale Top Topics",
      });
    }

    // Engagement optimization
    if (avgEngagement < 4) {
      insights.push({
        type: "optimization",
        icon: "💡",
        title: "Engagement Optimization",
        message: `Engagement is below average (${avgEngagement.toFixed(1)}%). Try interactive content formats, asking questions, or controversial takes to boost engagement.`,
        confidence: 87,
        action: "Improve Engagement",
      });
    } else if (avgEngagement > 8) {
      insights.push({
        type: "opportunity",
        icon: "����",
        title: "Excellent Engagement",
        message: `Outstanding engagement rate (${avgEngagement.toFixed(1)}%)! Your audience is highly engaged. Consider increasing posting frequency.`,
        confidence: 94,
        action: "Increase Frequency",
      });
    }

    // Sentiment analysis insights
    if (sentimentAnalysis.negativeRatio > 0.4) {
      insights.push({
        type: "warning",
        icon: "⚠️",
        title: "Negative Sentiment Alert",
        message: `${(sentimentAnalysis.negativeRatio * 100).toFixed(0)}% of your topics have negative sentiment. Consider pivoting to more positive angles.`,
        confidence: 78,
        action: "Adjust Messaging",
      });
    } else if (sentimentAnalysis.positiveRatio > 0.7) {
      insights.push({
        type: "opportunity",
        icon: "😊",
        title: "Strong Positive Sentiment",
        message: `${(sentimentAnalysis.positiveRatio * 100).toFixed(0)}% positive sentiment shows strong audience reception. Keep this messaging strategy.`,
        confidence: 89,
        action: "Maintain Strategy",
      });
    }

    // Category diversity analysis
    const topCategory = Object.entries(categoryPerformance).sort(
      ([, a], [, b]) => b.avgScore - a.avgScore,
    )[0];

    if (topCategory && topCategory[1].avgScore > avgTrendScore + 15) {
      insights.push({
        type: "trend",
        icon: "��",
        title: "Category Leader",
        message: `${topCategory[0]} content significantly outperforms others (+${(topCategory[1].avgScore - avgTrendScore).toFixed(1)} points). Double down on this category.`,
        confidence: 91,
        action: "Focus on " + topCategory[0],
      });
    }

    // Time-based pattern insights
    if (
      timeBasedPatterns.weekendPerformance >
      timeBasedPatterns.weekdayPerformance * 1.2
    ) {
      insights.push({
        type: "timing",
        icon: "���",
        title: "Weekend Advantage",
        message:
          "Your content performs 20%+ better on weekends. Schedule more high-value content for Saturday and Sunday.",
        confidence: 83,
        action: "Optimize Schedule",
      });
    }

    // Platform-specific insights
    const topPlatform = analytics.platformBreakdown.sort(
      (a, b) => b.growth - a.growth,
    )[0];

    if (topPlatform && topPlatform.growth > 15) {
      insights.push({
        type: "opportunity",
        icon: "🎪",
        title: "Platform Growth Leader",
        message: `${topPlatform.platform} shows ${topPlatform.growth.toFixed(1)}% growth. Allocate more resources to this platform for maximum ROI.`,
        confidence: 88,
        action: "Invest in " + topPlatform.platform,
      });
    }

    // Market timing insights
    const currentHour = now.getHours();
    if (currentHour >= 9 && currentHour <= 11) {
      insights.push({
        type: "timing",
        icon: "🌅",
        title: "Prime Time Active",
        message:
          "You're posting during peak morning engagement hours (9-11 AM). This is optimal timing for business content.",
        confidence: 76,
      });
    }

    // Competitive positioning
    if (topics.length >= 3) {
      const diversityScore = new Set(topics.map((t) => t.category)).size;
      if (diversityScore >= 4) {
        insights.push({
          type: "strategy",
          icon: "🎯",
          title: "Strong Diversification",
          message: `Tracking ${diversityScore} different categories gives you competitive advantage through diverse market coverage.`,
          confidence: 85,
          action: "Maintain Diversity",
        });
      }
    }

    // Return top insights (limit to 4-5 for better UX)
    return insights.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  };

  // Helper function for sentiment distribution analysis
  const analyzeSentimentDistribution = (topics: TrackedTopic[]) => {
    const total = topics.length;
    const sentiments = topics.reduce(
      (acc, topic) => {
        acc[topic.metrics.sentiment]++;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 },
    );

    return {
      positiveRatio: sentiments.positive / total,
      neutralRatio: sentiments.neutral / total,
      negativeRatio: sentiments.negative / total,
    };
  };

  // Helper function for category performance analysis
  const analyzeCategoryPerformance = (topics: TrackedTopic[]) => {
    const categoryStats = {};

    topics.forEach((topic) => {
      if (!categoryStats[topic.category]) {
        categoryStats[topic.category] = { scores: [], count: 0 };
      }
      categoryStats[topic.category].scores.push(topic.metrics.trendScore);
      categoryStats[topic.category].count++;
    });

    const result = {};
    Object.entries(categoryStats).forEach(
      ([category, stats]: [string, any]) => {
        result[category] = {
          avgScore: stats.scores.reduce((a, b) => a + b, 0) / stats.count,
          count: stats.count,
        };
      },
    );

    return result;
  };

  // Helper function for time-based pattern analysis
  const analyzeTimeBasedPatterns = (topics: TrackedTopic[]) => {
    // Simulate weekend vs weekday performance analysis
    const now = new Date();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;

    return {
      weekendPerformance:
        (topics.reduce((sum, topic) => sum + topic.metrics.trendScore, 0) /
          topics.length) *
        (isWeekend ? 1.1 : 0.9),
      weekdayPerformance:
        (topics.reduce((sum, topic) => sum + topic.metrics.trendScore, 0) /
          topics.length) *
        (isWeekend ? 0.9 : 1.1),
    };
  };

  // Content Calendar Functions
  const initializeContentCalendar = () => {
    // Initialize with some sample content
    const sampleContent: ScheduledContentItem[] = [
      {
        id: "1",
        title: "AI Tools Tutorial Series - Part 3",
        platform: "YouTube",
        contentType: "Video",
        date: "2025-07-18",
        time: "14:00",
        description: "Deep dive into advanced AI automation tools",
        pillar: "AI Education",
        status: "ready",
        performance: { views: 12400, engagement: 8.2, score: 9.1 },
      },
      {
        id: "2",
        title: "Behind the Scenes: Studio Setup",
        platform: "Instagram",
        contentType: "Story",
        date: "2025-07-20",
        time: "10:30",
        description: "Show the creative process and workspace",
        pillar: "Personal Brand",
        status: "in-review",
      },
      {
        id: "3",
        title: "Industry Trends Analysis",
        platform: "LinkedIn",
        contentType: "Article",
        date: "2025-07-22",
        time: "09:00",
        description: "Weekly roundup of tech industry developments",
        pillar: "Thought Leadership",
        status: "planned",
      },
    ];

    const sampleIdeas: ContentIdea[] = [
      {
        id: "idea1",
        title: "ChatGPT vs Claude: The Ultimate Comparison",
        pillar: "AI Tools",
        priority: "high",
        description: "Comprehensive comparison of leading AI assistants",
        estimatedEngagement: 8.5,
      },
      {
        id: "idea2",
        title: "5 Mistakes New Content Creators Make",
        pillar: "Education",
        priority: "medium",
        description: "Common pitfalls and how to avoid them",
        estimatedEngagement: 6.8,
      },
      {
        id: "idea3",
        title: "My Morning Routine for Productivity",
        pillar: "Personal",
        priority: "low",
        description: "Daily habits that boost creative output",
        estimatedEngagement: 5.2,
      },
      {
        id: "idea4",
        title: "Future of Remote Work in 2025",
        pillar: "Trends",
        priority: "high",
        description: "Predictions and insights for remote work evolution",
        estimatedEngagement: 7.9,
      },
    ];

    setScheduledContent(sampleContent);
    setContentIdeas(sampleIdeas);
  };

  // Initialize calendar data on mount
  React.useEffect(() => {
    if (activeView === "calendar") {
      initializeContentCalendar();
    }
  }, [activeView]);

  // Calendar navigation functions
  const navigateCalendar = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (calendarView === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    } else if (calendarView === "quarter") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 3 : -3));
    } else if (calendarView === "year") {
      newDate.setFullYear(
        newDate.getFullYear() + (direction === "next" ? 1 : -1),
      );
    }
    setCurrentDate(newDate);
  };

  // Content management functions
  const handleNewContent = () => {
    setNewContentForm({
      title: "",
      platform: "YouTube",
      contentType: "Video",
      date: "",
      time: "",
      description: "",
      pillar: "",
      status: "planned",
    });
    setShowNewContentModal(true);
  };

  const handleSaveContent = () => {
    if (!newContentForm.title || !newContentForm.date) return;

    const newContent: ScheduledContentItem = {
      id: Date.now().toString(),
      ...newContentForm,
    };

    setScheduledContent((prev) => [...prev, newContent]);
    setShowNewContentModal(false);
    setNewContentForm({
      title: "",
      platform: "YouTube",
      contentType: "Video",
      date: "",
      time: "",
      description: "",
      pillar: "",
      status: "planned",
    });
  };

  const handleEditContent = (contentItem: ScheduledContentItem) => {
    setSelectedContentItem(contentItem);
    setNewContentForm(contentItem);
    setShowContentDetailsModal(true);
  };

  const handleUpdateContent = () => {
    if (!selectedContentItem) return;

    setScheduledContent((prev) =>
      prev.map((item) =>
        item.id === selectedContentItem.id
          ? { ...item, ...newContentForm }
          : item,
      ),
    );
    setShowContentDetailsModal(false);
    setSelectedContentItem(null);
  };

  const handleDeleteContent = (contentId: string) => {
    setScheduledContent((prev) => prev.filter((item) => item.id !== contentId));
    setShowContentDetailsModal(false);
  };

  const handleScheduleIdea = (idea: ContentIdea) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    setNewContentForm({
      title: idea.title,
      platform: "YouTube",
      contentType: "Video",
      date: tomorrow.toISOString().split("T")[0],
      time: "14:00",
      description: idea.description,
      pillar: idea.pillar,
      status: "planned",
    });
    setShowNewContentModal(true);
  };

  const handleDeleteIdea = (ideaId: string) => {
    setContentIdeas((prev) => prev.filter((idea) => idea.id !== ideaId));
  };

  const generateContentIdea = () => {
    const aiSuggestions = [
      "10 AI Tools Every Creator Needs in 2025",
      "The Psychology Behind Viral Content",
      "Building a Personal Brand from Scratch",
      "Content Strategy Mistakes That Kill Growth",
      "How to Monetize Your Content in 30 Days",
    ];

    const pillars = [
      "AI Tools",
      "Education",
      "Personal Brand",
      "Strategy",
      "Monetization",
    ];
    const priorities = ["high", "medium", "low"] as const;

    const randomSuggestion =
      aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    const randomPillar = pillars[Math.floor(Math.random() * pillars.length)];
    const randomPriority =
      priorities[Math.floor(Math.random() * priorities.length)];

    const newIdea: ContentIdea = {
      id: Date.now().toString(),
      title: randomSuggestion,
      pillar: randomPillar,
      priority: randomPriority,
      description: `AI-generated content idea based on current trends and your strategy`,
      estimatedEngagement: Math.round((Math.random() * 5 + 5) * 10) / 10,
    };

    setContentIdeas((prev) => [...prev, newIdea]);
  };

  // Get content for specific date
  const getContentForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return scheduledContent.filter((content) => content.date === dateString);
  };

  // Get calendar month data
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const content = getContentForDate(date);
      days.push({
        date: i,
        fullDate: date,
        content,
        isToday: date.toDateString() === new Date().toDateString(),
      });
    }
    return days;
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const contentTypeOptions = [
    "Blog Posts",
    "Newsletter",
    "Social Media Posts",
    "Videos",
    "Podcasts",
    "Infographics",
    "Case Studies",
    "Whitepapers",
    "Webinars",
    "Email Campaigns",
    "User Generated Content",
    "Live Streams",
    "Stories",
    "Reels/Shorts",
    "Tutorials",
    "Behind-the-Scenes",
  ];

  const aiPersonaOptions = [
    "Professional",
    "Friendly",
    "Expert",
    "Casual",
    "Authoritative",
    "Inspiring",
    "Educational",
    "Conversational",
    "Bold",
    "Sophisticated",
  ];

  const industryOptions = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "E-commerce",
    "Entertainment",
    "Food & Beverage",
    "Fashion",
    "Travel",
    "Real Estate",
    "Fitness",
    "Beauty",
    "Automotive",
    "B2B Services",
    "Non-Profit",
  ];

  const strategyTemplates = [
    // Free Templates (Everyone can use)
    {
      id: "startup-growth",
      name: "Startup Growth Strategy",
      description:
        "Rapid audience building and brand awareness for new businesses",
      isPremium: false,
      category: "Business",
      pillars: ["Brand Awareness", "Community Building", "Product Demos"],
      platforms: ["LinkedIn", "Twitter", "YouTube"],
      contentTypes: [
        "Educational Posts",
        "Behind-the-Scenes",
        "Product Updates",
      ],
      schedule: "5 posts/week",
      goals: "Build 10K followers in 6 months, Generate 500 qualified leads",
    },
    {
      id: "personal-brand",
      name: "Personal Brand Building",
      description:
        "Build personal authority and following across social platforms",
      isPremium: false,
      category: "Personal",
      pillars: ["Expertise Sharing", "Personal Stories", "Industry Insights"],
      platforms: ["LinkedIn", "Instagram", "Twitter"],
      contentTypes: [
        "Thought Leadership",
        "Personal Updates",
        "Industry Commentary",
      ],
      schedule: "3-4 posts/week",
      goals:
        "Establish thought leadership, Build professional network, Generate speaking opportunities",
    },
    {
      id: "content-creator",
      name: "Content Creator Starter",
      description: "Foundation strategy for new content creators",
      isPremium: false,
      category: "Creator",
      pillars: ["Entertainment", "Education", "Community"],
      platforms: ["TikTok", "Instagram", "YouTube"],
      contentTypes: ["Tutorials", "Entertainment", "Q&A Sessions"],
      schedule: "Daily posting",
      goals:
        "Build engaged audience, Monetize content, Create brand partnerships",
    },

    // Premium Templates (Pro users only)
    {
      id: "b2b-leadership",
      name: "B2B Thought Leadership",
      description: "Establish industry authority and drive enterprise sales",
      isPremium: true,
      category: "B2B",
      pillars: [
        "Industry Expertise",
        "Case Studies",
        "Solution-Focused Content",
      ],
      platforms: ["LinkedIn", "Industry Publications", "Webinars"],
      contentTypes: [
        "Whitepapers",
        "Industry Reports",
        "Executive Insights",
        "Customer Success Stories",
      ],
      schedule: "3 long-form posts/week + daily engagement",
      goals:
        "Position as industry leader, Generate enterprise leads, Build strategic partnerships",
      advanced: {
        competitorAnalysis: "Deep dive into 5 key competitors",
        audienceSegmentation: "C-suite, VPs, Directors in target industries",
        contentCalendar: "6-month strategic planning with seasonal adjustments",
        kpiTracking: "Lead quality, engagement rates, sales attribution",
      },
    },
    {
      id: "ecommerce-conversion",
      name: "E-commerce Conversion Optimization",
      description:
        "Drive sales through strategic content marketing and social commerce",
      isPremium: true,
      category: "E-commerce",
      pillars: ["Product Showcases", "Customer Stories", "Educational Content"],
      platforms: ["Instagram", "TikTok", "Pinterest", "Facebook"],
      contentTypes: [
        "Product Demos",
        "User-Generated Content",
        "Shopping Guides",
        "Lifestyle Content",
      ],
      schedule: "Daily posts + 3 stories/day",
      goals:
        "Increase online sales by 40%, Build brand loyalty, Reduce acquisition costs",
      advanced: {
        salesFunnel: "Awareness → Consideration → Purchase ��� Retention",
        customerJourney: "Detailed mapping with content touchpoints",
        retargeting: "Strategic remarketing content sequences",
        seasonalCampaigns: "Holiday and event-based content planning",
      },
    },
    {
      id: "saas-onboarding",
      name: "SaaS Customer Education & Retention",
      description: "Educate users and reduce churn through strategic content",
      isPremium: true,
      category: "SaaS",
      pillars: ["Product Education", "Feature Highlights", "Success Stories"],
      platforms: ["YouTube", "LinkedIn", "Help Center", "Email"],
      contentTypes: [
        "Tutorial Videos",
        "Feature Announcements",
        "Best Practices",
        "Customer Spotlights",
      ],
      schedule: "2-3 educational posts/week + feature updates",
      goals: "Reduce churn by 25%, Increase feature adoption, Drive upgrades",
      advanced: {
        userOnboarding: "Multi-touch educational content series",
        featureAdoption: "Progressive disclosure content strategy",
        churnPrevention: "At-risk user re-engagement campaigns",
        communityBuilding: "User forum and knowledge base strategy",
      },
    },
    {
      id: "enterprise-marketing",
      name: "Enterprise Marketing Strategy",
      description: "Large-scale content strategy for enterprise organizations",
      isPremium: true,
      category: "Enterprise",
      pillars: ["Thought Leadership", "Industry Solutions", "Global Reach"],
      platforms: [
        "LinkedIn",
        "Industry Events",
        "Owned Media",
        "Partner Channels",
      ],
      contentTypes: [
        "Research Reports",
        "Executive Content",
        "Solution Briefs",
        "Global Campaigns",
      ],
      schedule: "Coordinated multi-channel campaigns",
      goals:
        "Build market leadership, Drive enterprise sales, Global brand recognition",
      advanced: {
        globalStrategy: "Multi-region content localization",
        stakeholderAlignment: "C-suite and board communication",
        industryInfluence: "Market-moving thought leadership",
        partnerEcosystem: "Channel partner content collaboration",
      },
    },
    {
      id: "influencer-marketing",
      name: "Influencer Marketing Mastery",
      description: "Comprehensive influencer collaboration and growth strategy",
      isPremium: true,
      category: "Influencer",
      pillars: [
        "Authentic Partnerships",
        "Brand Collaborations",
        "Audience Growth",
      ],
      platforms: ["Instagram", "TikTok", "YouTube", "Twitter"],
      contentTypes: [
        "Sponsored Content",
        "Product Reviews",
        "Lifestyle Integration",
        "Brand Campaigns",
      ],
      schedule: "Mix of organic and sponsored content",
      goals:
        "Build authentic partnerships, Maximize earning potential, Grow engaged audience",
      advanced: {
        brandPartnerships: "Long-term collaboration strategies",
        rateNegotiation: "Value-based pricing frameworks",
        audienceAnalytics: "Deep demographic and psychographic analysis",
        contentPerformance: "ROI tracking for brand partnerships",
      },
    },
    {
      id: "nonprofit-awareness",
      name: "Nonprofit Awareness & Fundraising",
      description: "Drive donations and awareness for nonprofit organizations",
      isPremium: true,
      category: "Nonprofit",
      pillars: [
        "Mission Storytelling",
        "Impact Demonstration",
        "Community Building",
      ],
      platforms: ["Facebook", "Instagram", "LinkedIn", "Email"],
      contentTypes: [
        "Impact Stories",
        "Donor Spotlights",
        "Educational Content",
        "Fundraising Campaigns",
      ],
      schedule: "Daily storytelling + campaign pushes",
      goals: "Increase donations by 50%, Build volunteer base, Raise awareness",
      advanced: {
        donorJourney: "Cultivation to major gift strategies",
        impactMeasurement: "ROI on social impact",
        volunteerEngagement: "Community building and retention",
        grantWriting: "Content to support funding applications",
      },
    },
    {
      id: "local-business",
      name: "Local Business Growth",
      description: "Community-focused marketing for local businesses",
      isPremium: true,
      category: "Local Business",
      pillars: ["Community Engagement", "Local SEO", "Customer Relationships"],
      platforms: [
        "Google My Business",
        "Facebook",
        "Instagram",
        "Local Directories",
      ],
      contentTypes: [
        "Local Events",
        "Customer Features",
        "Behind-the-Scenes",
        "Community News",
      ],
      schedule: "4-5 local-focused posts/week",
      goals:
        "Increase foot traffic, Build local reputation, Generate word-of-mouth",
      advanced: {
        localSEO: "Geographic content optimization",
        communityPartnerships: "Local business collaboration",
        eventMarketing: "Local event promotion strategies",
        reviewManagement: "Reputation building campaigns",
      },
    },
    {
      id: "tech-startup",
      name: "Tech Startup Launch Strategy",
      description: "Product launch and market penetration for tech companies",
      isPremium: true,
      category: "Tech",
      pillars: [
        "Product Innovation",
        "Technical Education",
        "Market Disruption",
      ],
      platforms: ["Product Hunt", "Twitter", "LinkedIn", "Tech Blogs"],
      contentTypes: [
        "Product Updates",
        "Technical Content",
        "Founder Stories",
        "Industry Analysis",
      ],
      schedule: "Daily during launch phases",
      goals:
        "Successful product launch, Build developer community, Secure funding",
      advanced: {
        productLaunch: "Pre-launch, launch, and post-launch strategies",
        developerRelations: "Technical community building",
        investorContent: "Fundraising support materials",
        competitivePositioning: "Market differentiation strategies",
      },
    },
    {
      id: "creative-agency",
      name: "Creative Agency Showcase",
      description: "Portfolio-driven marketing for creative professionals",
      isPremium: true,
      category: "Agency",
      pillars: ["Portfolio Showcase", "Creative Process", "Client Success"],
      platforms: ["Instagram", "Behance", "LinkedIn", "Pinterest"],
      contentTypes: [
        "Project Showcases",
        "Process Videos",
        "Client Testimonials",
        "Creative Insights",
      ],
      schedule: "Project-based content cycles",
      goals:
        "Attract premium clients, Build creative reputation, Increase project value",
      advanced: {
        portfolioStrategy: "Strategic project presentation",
        clientTestimonials: "Case study development",
        creativeProcess: "Behind-the-scenes documentation",
        industryNetworking: "Creative community engagement",
      },
    },

    // Ultimate Templates (Agency Pro only) - Enterprise-Exclusive Features
    {
      id: "ultimate-ipo-preparation",
      name: "Ultimate IPO Preparation & Public Company Strategy",
      description: "Complete public offering readiness with investor relations, regulatory compliance, and market positioning for billion-dollar valuations",
      isPremium: true,
      isUltimate: true,
      category: "IPO & Public Markets",
      pillars: [
        "Pre-IPO Market Conditioning",
        "Investor Relations Excellence",
        "Regulatory Disclosure Management",
        "Board & C-Suite Communications",
        "Public Market Leadership Transition",
        "Post-IPO Growth Strategy"
      ],
      platforms: ["Bloomberg Terminal", "Reuters", "SEC Filing Systems", "Investor Relations Platforms", "Financial Media", "Analyst Networks", "Institutional Channels"],
      contentTypes: [
        "S-1 Registration Content Strategy",
        "Roadshow Presentation Materials",
        "Analyst Day Communications",
        "Quarterly Earnings Content",
        "Board Meeting Materials",
        "Proxy Statement Communications",
        "Crisis Communication Protocols",
        "Market Maker Relations",
        "Institutional Investor Content"
      ],
      schedule: "Multi-phase IPO timeline with pre-filing, quiet period, marketing, and post-listing strategies",
      goals: "Successful IPO execution, $1B+ valuation achievement, Premium market multiple, Institutional investor base development",
      advanced: {
        valuationOptimization: "Market positioning for premium valuation multiples with comparable analysis and growth narrative development",
        investorTargeting: "Sophisticated institutional investor segmentation and personalized outreach strategies",
        regulatoryCompliance: "SEC compliance management with automated disclosure tracking and legal review processes",
        marketTiming: "Market condition analysis and optimal IPO timing with macroeconomic factor integration",
        riskMitigation: "Comprehensive risk disclosure and crisis communication protocols for public market readiness",
        analystRelations: "Wall Street analyst cultivation and earnings guidance communication strategies",
        shareholderValue: "Long-term shareholder value creation and capital allocation communication frameworks",
        governanceExcellence: "Public company governance standards and board communication best practices"
      },
    },
    {
      id: "ultimate-ma-integration",
      name: "Ultimate M&A Integration & Portfolio Strategy",
      description: "Complex merger, acquisition, and divestiture communication strategy for multi-billion dollar transactions and portfolio optimization",
      isPremium: true,
      isUltimate: true,
      category: "M&A & Corporate Development",
      pillars: [
        "Deal Announcement Strategy",
        "Stakeholder Integration Communications",
        "Cultural Merger Management",
        "Portfolio Optimization Messaging",
        "Regulatory Approval Coordination",
        "Value Creation Demonstration"
      ],
      platforms: ["Financial Media", "Regulatory Filings", "Employee Channels", "Customer Communications", "Partner Networks", "Government Relations", "Investment Banking"],
      contentTypes: [
        "M&A Announcement Materials",
        "Integration Progress Reports",
        "Cultural Alignment Content",
        "Synergy Realization Updates",
        "Stakeholder Impact Communications",
        "Regulatory Filing Content",
        "Employee Retention Materials",
        "Customer Retention Strategies",
        "Partner Transition Plans"
      ],
      schedule: "Multi-phase M&A lifecycle from due diligence through post-merger integration and portfolio optimization",
      goals: "Successful deal closure, Stakeholder approval, Cultural integration, Synergy realization, Portfolio value optimization",
      advanced: {
        dealStructuring: "Complex transaction structure communication with financial and strategic rationale documentation",
        stakeholderManagement: "Multi-stakeholder communication coordination across employees, customers, partners, and regulators",
        integrationExecution: "Post-merger integration communication with milestone tracking and cultural assimilation strategies",
        synergyRealization: "Quantifiable synergy communication and value creation demonstration for shareholders",
        regulatoryStrategy: "Antitrust and regulatory approval communication with government relations and compliance management",
        portfolioOptimization: "Strategic portfolio communication including divestiture strategies and business unit repositioning",
        riskMitigation: "M&A risk communication and contingency planning for deal execution challenges",
        valueCreation: "Long-term value creation communication and strategic positioning for enhanced market multiples"
      },
    },
    {
      id: "ultimate-crisis-recovery",
      name: "Ultimate Crisis Management & Reputation Recovery",
      description: "Enterprise-scale crisis communication and reputation recovery for existential threats, regulatory investigations, and market confidence restoration",
      isPremium: true,
      isUltimate: true,
      category: "Crisis Management & Recovery",
      pillars: [
        "Crisis Response Command Center",
        "Stakeholder Crisis Communications",
        "Regulatory Investigation Management",
        "Media Crisis Navigation",
        "Employee & Culture Preservation",
        "Market Confidence Restoration"
      ],
      platforms: ["All Media Channels", "Regulatory Bodies", "Legal Channels", "Employee Communications", "Customer Channels", "Investor Relations", "Government Affairs"],
      contentTypes: [
        "Crisis Response Protocols",
        "Regulatory Investigation Content",
        "Media Crisis Statements",
        "Internal Crisis Communications",
        "Customer Retention Messages",
        "Investor Confidence Content",
        "Legal Defense Materials",
        "Recovery Strategy Communications",
        "Reputation Rehabilitation Content"
      ],
      schedule: "24/7 crisis response with hour-by-hour communication protocols and long-term recovery strategy implementation",
      goals: "Crisis containment, Stakeholder confidence maintenance, Regulatory compliance, Reputation recovery, Business continuity",
      advanced: {
        crisisCommand: "24/7 crisis command center with real-time monitoring, response coordination, and stakeholder communication management",
        regulatoryDefense: "Sophisticated regulatory investigation response with legal coordination and compliance demonstration",
        mediaManagement: "Advanced media relations during crisis with narrative control and reputation protection strategies",
        stakeholderRetention: "Crisis-time stakeholder retention strategies for employees, customers, partners, and investors",
        legalCoordination: "Legal defense coordination with public relations and regulatory compliance integration",
        recoveryPlanning: "Long-term reputation recovery and business rebuilding with milestone-based communication strategies",
        riskPrevention: "Post-crisis risk prevention and organizational resilience building with systematic improvement protocols",
        confidenceRestoration: "Market confidence restoration with transparency, accountability, and future-focused positioning"
      },
    },
    {
      id: "ultimate-government-relations",
      name: "Ultimate Government Relations & Policy Influence",
      description: "Comprehensive government relations strategy for policy influence, regulatory shaping, and public-private partnership development",
      isPremium: true,
      isUltimate: true,
      category: "Government Relations & Policy",
      pillars: [
        "Policy Development Influence",
        "Regulatory Relationship Management",
        "Legislative Advocacy Strategy",
        "Public-Private Partnership Development",
        "International Government Relations",
        "Compliance & Ethics Leadership"
      ],
      platforms: ["Government Channels", "Policy Forums", "Regulatory Platforms", "Legislative Networks", "International Bodies", "Trade Organizations", "Think Tanks"],
      contentTypes: [
        "Policy Position Papers",
        "Regulatory Comment Letters",
        "Legislative Testimony Materials",
        "Government Partnership Proposals",
        "International Trade Content",
        "Compliance Best Practices",
        "Public Policy Research",
        "Stakeholder Engagement Reports",
        "Ethics & Governance Content"
      ],
      schedule: "Policy cycle-aligned content with legislative sessions, regulatory comment periods, and international summit coordination",
      goals: "Policy influence achievement, Regulatory relationship excellence, Government partnership development, International market access",
      advanced: {
        policyDevelopment: "Direct policy development participation with white paper creation and legislative drafting assistance",
        regulatoryInfluence: "Regulatory agency relationship management with rule-making participation and compliance leadership",
        legislativeAdvocacy: "Congressional and parliamentary advocacy with testimony coordination and legislative strategy development",
        internationalRelations: "Global government relations with trade negotiation participation and international standard setting",
        publicPrivatePartnerships: "Government partnership development with contract negotiation and project management communication",
        complianceLeadership: "Industry compliance standard setting with ethics leadership and regulatory best practice development",
        coalitionBuilding: "Industry coalition leadership and multi-stakeholder alliance building for policy influence",
        riskManagement: "Political risk assessment and government relations crisis management with regulatory investigation response"
      },
    },
    {
      id: "ultimate-succession-leadership",
      name: "Ultimate Leadership Succession & Legacy Strategy",
      description: "Executive succession planning and legacy content strategy for leadership transitions, knowledge transfer, and organizational continuity",
      isPremium: true,
      isUltimate: true,
      category: "Leadership Succession & Legacy",
      pillars: [
        "Executive Succession Planning",
        "Knowledge Transfer Excellence",
        "Leadership Legacy Development",
        "Organizational Continuity Strategy",
        "Mentorship & Development Programs",
        "Cultural Preservation & Evolution"
      ],
      platforms: ["Internal Channels", "Leadership Networks", "Board Communications", "Mentorship Platforms", "Industry Forums", "Legacy Publications", "Educational Institutions"],
      contentTypes: [
        "Succession Planning Documentation",
        "Leadership Transition Materials",
        "Knowledge Transfer Content",
        "Mentorship Program Materials",
        "Legacy Publication Content",
        "Cultural Evolution Strategies",
        "Leadership Development Programs",
        "Board Transition Communications",
        "Industry Wisdom Sharing"
      ],
      schedule: "Multi-year succession timeline with phase-based content delivery and knowledge transfer milestones",
      goals: "Smooth leadership transition, Knowledge preservation, Cultural continuity, Successor development, Legacy establishment",
      advanced: {
        successionPlanning: "Comprehensive succession planning with candidate development and transition timeline management",
        knowledgeTransfer: "Systematic knowledge transfer with documentation systems and experiential learning programs",
        legacyDevelopment: "Leadership legacy creation with thought leadership preservation and industry influence documentation",
        culturalContinuity: "Organizational culture preservation and evolution with values-based leadership development",
        mentorshipExcellence: "Advanced mentorship programs with structured knowledge sharing and leadership development frameworks",
        leadershipDevelopment: "Next-generation leader preparation with accelerated development and succession readiness programs",
        institutionalMemory: "Organizational memory preservation with decision-making framework documentation and historical context preservation",
        industryInfluence: "Industry leadership transition with continued influence and thought leadership legacy management"
      },
    },
    {
      id: "ultimate-global-conglomerate",
      name: "Ultimate Global Conglomerate & Holding Company Strategy",
      description: "Multi-company portfolio management with subsidiary coordination, holding company optimization, and global business unit strategy",
      isPremium: true,
      isUltimate: true,
      category: "Conglomerate & Portfolio Management",
      pillars: [
        "Portfolio Company Coordination",
        "Holding Company Strategy",
        "Cross-Business Synergy Development",
        "Global Subsidiary Management",
        "Capital Allocation Communications",
        "Business Unit Optimization"
      ],
      platforms: ["Portfolio Company Channels", "Holding Company Communications", "Investor Relations", "Subsidiary Networks", "Global Business Platforms", "Capital Markets"],
      contentTypes: [
        "Portfolio Strategy Communications",
        "Subsidiary Performance Reports",
        "Cross-Business Synergy Content",
        "Capital Allocation Strategies",
        "Business Unit Optimization Plans",
        "Global Coordination Materials",
        "Investor Portfolio Updates",
        "M&A Integration Communications",
        "Business Development Content"
      ],
      schedule: "Portfolio-wide coordination with subsidiary-specific strategies and holding company oversight communications",
      goals: "Portfolio optimization, Cross-business synergies, Capital efficiency, Global coordination, Shareholder value maximization",
      advanced: {
        portfolioOptimization: "Advanced portfolio management with business unit performance optimization and strategic positioning",
        synergyRealization: "Cross-business synergy identification and realization with coordinated strategy development",
        capitalAllocation: "Sophisticated capital allocation strategy with investment prioritization and resource optimization",
        globalCoordination: "Multi-country business coordination with regional strategy alignment and global best practice sharing",
        subsidiaryManagement: "Advanced subsidiary management with performance monitoring and strategic guidance systems",
        businessDevelopment: "Cross-portfolio business development with partnership coordination and market expansion strategies",
        riskManagement: "Portfolio-wide risk management with diversification strategies and crisis coordination protocols",
        valueCreation: "Holding company value creation with operational excellence and strategic positioning across all business units"
      },
    },
    {
      id: "ultimate-sovereign-wealth",
      name: "Ultimate Sovereign Wealth & Nation Branding Strategy",
      description: "Nation-state branding and sovereign wealth communication for country positioning, investment attraction, and global influence development",
      isPremium: true,
      isUltimate: true,
      category: "Sovereign Wealth & Nation Branding",
      pillars: [
        "National Brand Development",
        "Sovereign Investment Strategy",
        "Diplomatic Content Excellence",
        "Economic Development Messaging",
        "Cultural Soft Power Projection",
        "International Relations Strategy"
      ],
      platforms: ["Diplomatic Channels", "International Media", "Sovereign Investment Platforms", "Cultural Institutions", "Economic Forums", "International Organizations"],
      contentTypes: [
        "National Branding Materials",
        "Sovereign Investment Communications",
        "Diplomatic Messaging Content",
        "Economic Development Reports",
        "Cultural Exchange Content",
        "International Partnership Materials",
        "Investment Attraction Strategies",
        "Soft Power Projection Content",
        "Global Influence Communications"
      ],
      schedule: "Long-term national strategy with international event coordination and diplomatic calendar alignment",
      goals: "National brand enhancement, Investment attraction, Diplomatic influence, Economic development, Cultural soft power projection",
      advanced: {
        nationBranding: "Comprehensive national brand development with cultural identity and economic positioning strategies",
        sovereignInvestment: "Sovereign wealth fund communication with investment strategy and portfolio positioning",
        diplomaticStrategy: "Advanced diplomatic communication with international relations and soft power projection",
        economicDevelopment: "National economic development communication with investment attraction and business environment promotion",
        culturalInfluence: "Cultural soft power development with international cultural exchange and influence projection",
        internationalPartnerships: "Global partnership development with bilateral and multilateral relationship building",
        investmentAttraction: "Foreign direct investment attraction with competitive positioning and economic opportunity showcase",
        globalInfluence: "International influence development with thought leadership and policy influence at global forums"
      },
    },
    {
      id: "ultimate-family-office",
      name: "Ultimate Family Office & Generational Wealth Strategy",
      description: "Multi-generational wealth management communication with family governance, legacy planning, and philanthropic impact coordination",
      isPremium: true,
      isUltimate: true,
      category: "Family Office & Wealth Management",
      pillars: [
        "Generational Wealth Communication",
        "Family Governance Excellence",
        "Philanthropic Impact Strategy",
        "Legacy Preservation Planning",
        "Next-Generation Preparation",
        "Private Wealth Management"
      ],
      platforms: ["Family Office Networks", "Philanthropic Channels", "Private Banking", "Legacy Platforms", "Educational Institutions", "Cultural Organizations"],
      contentTypes: [
        "Family Governance Materials",
        "Generational Transition Plans",
        "Philanthropic Impact Reports",
        "Legacy Preservation Content",
        "Family Education Programs",
        "Wealth Management Strategies",
        "Next-Generation Development",
        "Family Brand Communications",
        "Impact Investment Content"
      ],
      schedule: "Multi-generational timeline with family milestone coordination and legacy planning phases",
      goals: "Generational wealth preservation, Family unity, Philanthropic impact, Legacy establishment, Next-generation preparation",
      advanced: {
        wealthPreservation: "Advanced generational wealth preservation with tax optimization and asset protection strategies",
        familyGovernance: "Sophisticated family governance systems with decision-making frameworks and conflict resolution protocols",
        philanthropicImpact: "Strategic philanthropic planning with impact measurement and legacy giving coordination",
        legacyPlanning: "Comprehensive legacy planning with cultural preservation and family history documentation",
        nextGenerationDevelopment: "Advanced next-generation preparation with leadership development and wealth stewardship education",
        familyBrand: "Family brand development with reputation management and public engagement strategies",
        impactInvesting: "Impact investment strategy with sustainable development and social responsibility coordination",
        globalCoordination: "International wealth management with multi-jurisdictional planning and global family coordination"
      },
    },
    {
      id: "ultimate-unicorn-scaling",
      name: "Ultimate Unicorn Scaling & Hypergrowth Strategy",
      description: "Billion-dollar valuation scaling strategy with hypergrowth management, investor relations, and market domination positioning",
      isPremium: true,
      isUltimate: true,
      category: "Unicorn Scaling & Hypergrowth",
      pillars: [
        "Hypergrowth Management",
        "Unicorn Investor Relations",
        "Market Domination Strategy",
        "Global Scaling Excellence",
        "Category Creation Leadership",
        "Exit Strategy Preparation"
      ],
      platforms: ["Venture Capital Networks", "Growth Platforms", "Tech Media", "Industry Conferences", "Global Markets", "Innovation Hubs"],
      contentTypes: [
        "Growth Strategy Communications",
        "Investor Update Materials",
        "Market Expansion Content",
        "Category Defining Content",
        "Scaling Best Practices",
        "Innovation Showcases",
        "Global Launch Materials",
        "Exit Preparation Content",
        "Industry Leadership Communications"
      ],
      schedule: "Hypergrowth-aligned content with funding round coordination and market expansion timing",
      goals: "Billion-dollar valuation achievement, Market category domination, Global scaling success, Premium exit execution",
      advanced: {
        hypergrowthManagement: "Advanced hypergrowth management with scaling frameworks and operational excellence during rapid expansion",
        investorRelations: "Sophisticated investor relations with venture capital and growth equity communication strategies",
        marketDomination: "Category domination strategy with competitive positioning and market share capture techniques",
        globalScaling: "International expansion strategy with multi-market entry and localization excellence",
        categoryCreation: "Category creation and market education with thought leadership and industry standard setting",
        exitStrategy: "Exit strategy preparation with IPO readiness and acquisition positioning for maximum valuation",
        innovationLeadership: "Technology innovation communication with product differentiation and competitive moat development",
        talentAttraction: "Hypergrowth talent attraction and retention with employer branding and culture scaling strategies"
      },
    },
  ];

  const handleGenerateStrategy = () => {
    console.log("��� Generate Strategy button clicked!");
    console.log("📊 Current strategy config:", strategyConfig);
    console.log("��� Is loading:", isLoading);
    console.log("✅ Niche filled:", !!strategyConfig.niche);
    console.log("✅ Target audience filled:", !!strategyConfig.targetAudience);
    console.log("🎯 Calling onGenerateStrategy with config...");
    onGenerateStrategy(strategyConfig);
  };

  const saveStrategy = () => {
    if (!strategyPlan) {
      alert("No strategy to save. Please generate a strategy first.");
      return;
    }

    try {
      // Create a save object with timestamp
      const saveData = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        config: strategyConfig,
        plan: strategyPlan,
        name: `${strategyConfig.niche || 'Strategy'} - ${new Date().toLocaleDateString()}`
      };

      // Get existing saved strategies
      const existingSaves = JSON.parse(localStorage.getItem('savedStrategies') || '[]');

      // Add new save to the beginning of the array
      existingSaves.unshift(saveData);

      // Keep only the last 10 saves to prevent localStorage bloat
      const trimmedSaves = existingSaves.slice(0, 10);

      // Save to localStorage
      localStorage.setItem('savedStrategies', JSON.stringify(trimmedSaves));

      // Show success feedback
      alert("Strategy saved successfully!");

      console.log("Strategy saved:", saveData);
    } catch (error) {
      console.error("Error saving strategy:", error);
      alert("Failed to save strategy. Please try again.");
    }
  };

  const handleStartFromScratch = () => {
    setLocalStrategyConfig(defaultStrategyConfig);
    setLocalSelectedTemplate(null);
    if (onUpdateStrategyPlan) {
      onUpdateStrategyPlan(null as any);
    }
    setActiveView("create");
  };

  const exportStrategy = (format: "pdf" | "docx" | "json") => {
    if (!strategyPlan) {
      alert("No strategy to export. Please generate a strategy first.");
      return;
    }

    // Check export limits for free users
    if (!isPremium && format === "pdf") {
      const exportCount = getExportCount();
      if (exportCount >= 5) {
        alert("Free users can export up to 5 PDFs. Upgrade to Premium for unlimited exports!");
        onUpgrade?.();
        return;
      }
      incrementExportCount();
    }

    try {
      if (format === "pdf") {
        // Create enhanced PDF with app styling
        generateStyledPDF();

      } else if (format === "json") {
        // Export as JSON file
        const jsonData = {
          exportDate: new Date().toISOString(),
          config: strategyConfig,
          plan: strategyPlan
        };

        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `strategy-plan-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      console.log(`Strategy exported as ${format}`);
    } catch (error) {
      console.error(`Error exporting strategy as ${format}:`, error);
      alert(`Failed to export strategy as ${format}. Please try again.`);
    }
  };

  // Export count management for free users
  const getExportCount = (): number => {
    try {
      const count = localStorage.getItem('strategyExportCount');
      return count ? parseInt(count, 10) : 0;
    } catch {
      return 0;
    }
  };

  const incrementExportCount = (): void => {
    try {
      const currentCount = getExportCount();
      localStorage.setItem('strategyExportCount', (currentCount + 1).toString());
    } catch (error) {
      console.warn('Unable to track export count:', error);
    }
  };

  const generateStyledPDF = () => {
    // Create a new window for the styled PDF
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Pop-up blocked. Please allow pop-ups and try again.");
      return;
    }

    // Get the current strategy display content
    const styledContent = generateStyledPDFContent();

    // Write the enhanced styled content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Content Strategy Plan - ${strategyConfig.niche || 'Strategy'}</title>
        <meta charset="UTF-8">
        <style>
          /* Reset and base styles */
          * { margin: 0; padding: 0; box-sizing: border-box; }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: #0f172a;
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }

          /* Headers */
          h1 {
            color: #10b981;
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 24px;
            text-align: center;
            background: linear-gradient(135deg, #10b981, #059669);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          h2 {
            color: #3b82f6;
            font-size: 1.75rem;
            font-weight: 700;
            margin: 32px 0 16px 0;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 8px;
          }

          h3 {
            color: #8b5cf6;
            font-size: 1.25rem;
            font-weight: 600;
            margin: 24px 0 12px 0;
          }

          h4 {
            color: #06b6d4;
            font-size: 1.125rem;
            font-weight: 600;
            margin: 16px 0 8px 0;
          }

          /* Cards and sections */
          .section {
            background: rgba(30, 41, 59, 0.5);
            border: 1px solid rgba(148, 163, 184, 0.2);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
          }

          .executive-summary {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
            border: 1px solid rgba(16, 185, 129, 0.3);
          }

          .content-pillars {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1));
            border: 1px solid rgba(59, 130, 246, 0.3);
          }

          .analytics {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1));
            border: 1px solid rgba(139, 92, 246, 0.3);
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 16px 0;
          }

          .card {
            background: rgba(51, 65, 85, 0.5);
            border: 1px solid rgba(148, 163, 184, 0.2);
            border-radius: 8px;
            padding: 16px;
          }

          .pillar-card {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
            border: 1px solid rgba(59, 130, 246, 0.3);
          }

          /* Text styles */
          p {
            color: #cbd5e1;
            margin-bottom: 12px;
            line-height: 1.7;
          }

          .text-highlight {
            color: #10b981;
            font-weight: 600;
          }

          .text-secondary {
            color: #94a3b8;
            font-size: 0.875rem;
          }

          /* Lists */
          ul, ol {
            padding-left: 24px;
            margin-bottom: 16px;
          }

          li {
            color: #cbd5e1;
            margin-bottom: 8px;
            line-height: 1.6;
          }

          /* Tags and badges */
          .tag {
            display: inline-block;
            background: rgba(59, 130, 246, 0.2);
            color: #93c5fd;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 0.75rem;
            font-weight: 500;
            margin: 2px 4px;
            border: 1px solid rgba(59, 130, 246, 0.3);
          }

          .tag-emerald {
            background: rgba(16, 185, 129, 0.2);
            color: #6ee7b7;
            border-color: rgba(16, 185, 129, 0.3);
          }

          .tag-purple {
            background: rgba(139, 92, 246, 0.2);
            color: #c4b5fd;
            border-color: rgba(139, 92, 246, 0.3);
          }

          .tag-yellow {
            background: rgba(245, 158, 11, 0.2);
            color: #fcd34d;
            border-color: rgba(245, 158, 11, 0.3);
          }

          /* Metrics */
          .metric-card {
            text-align: center;
            background: rgba(51, 65, 85, 0.5);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 8px;
            padding: 20px;
          }

          .metric-value {
            font-size: 2rem;
            font-weight: 800;
            color: #10b981;
            display: block;
            margin-bottom: 8px;
          }

          .metric-label {
            color: #93c5fd;
            font-weight: 600;
            font-size: 0.875rem;
          }

          /* Schedule items */
          .schedule-item {
            background: rgba(51, 65, 85, 0.5);
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
          }

          .day-header {
            color: #818cf8;
            font-weight: 700;
            font-size: 1.125rem;
            margin-bottom: 8px;
          }

          /* Footer */
          .footer {
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid rgba(148, 163, 184, 0.2);
            text-align: center;
            color: #64748b;
          }

          .footer-brand {
            background: linear-gradient(135deg, #10b981, #059669);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
          }

          /* Print optimization */
          @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; background: white; }
            h1, h2, h3, h4 { color: #1e293b !important; }
            p, li { color: #374151 !important; }
            .section { border: 1px solid #e5e7eb; background: #f9fafb; }
            .tag { background: #e5e7eb; color: #374151; border-color: #d1d5db; }
          }
        </style>
      </head>
      <body>${styledContent}</body>
      </html>
    `);

    printWindow.document.close();

    // Trigger print dialog after content loads
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const generateStrategyPDFContent = () => {
    const config = strategyConfig;
    const plan = strategyPlan;

    return `
      <h1>📋 Content Strategy Plan</h1>
      <div class="highlight">
        <strong>Generated:</strong> ${new Date().toLocaleDateString()}<br>
        <strong>Niche:</strong> ${config.niche || 'Not specified'}<br>
        <strong>Target Audience:</strong> ${config.targetAudience || 'Not specified'}
      </div>

      <div class="section">
        <h2>🎯 Strategy Overview</h2>
        <div class="grid">
          <div class="card">
            <h3>Goals</h3>
            <ul>
              ${(config.goals || []).map(goal => `<li>${goal}</li>`).join('')}
            </ul>
          </div>
          <div class="card">
            <h3>Platforms</h3>
            <ul>
              ${(config.platforms || []).map(platform => `<li>${platform}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>📊 Content Strategy Details</h2>
        ${plan?.contentStrategy ? `<div class="highlight">${safeRenderValue(plan.contentStrategy)}</div>` : ''}
      </div>

      <div class="section">
        <h2>�� Content Pillars</h2>
        ${plan?.contentPillars ? `<div>${safeRenderValue(plan.contentPillars)}</div>` : ''}
      </div>

      <div class="section">
        <h2>📅 Content Calendar</h2>
        ${plan?.contentCalendar ? `<div>${safeRenderValue(plan.contentCalendar)}</div>` : ''}
      </div>

      <div class="section">
        <h2>�� Content Types</h2>
        ${plan?.contentTypes ? `<div>${safeRenderValue(plan.contentTypes)}</div>` : ''}
      </div>

      <div class="section">
        <h2>���� Audience Analysis</h2>
        ${plan?.audienceAnalysis ? `<div>${safeRenderValue(plan.audienceAnalysis)}</div>` : ''}
      </div>

      <div class="section">
        <h2>��� Competitor Analysis</h2>
        ${plan?.competitorAnalysis ? `<div>${safeRenderValue(plan.competitorAnalysis)}</div>` : ''}
      </div>

      <div class="section">
        <h2>📊 Success Metrics</h2>
        ${plan?.successMetrics ? `<div>${safeRenderValue(plan.successMetrics)}</div>` : ''}
      </div>

      <div class="footer">
        <p>Generated by CreateGen Studio - Content Strategy Plan</p>
        <p>© ${new Date().getFullYear()} - For internal use only</p>
      </div>
    `;
  };

  const generateStyledPDFContent = () => {
    const config = strategyConfig;
    const plan = strategyPlan;
    const summary = generateDynamicSummary();

    return `
      <div class="container">
        <h1>���� Content Strategy Plan</h1>

        <!-- Strategy Overview -->
        <div class="section executive-summary">
          <h2>📊 Executive Summary</h2>
          <div class="grid">
            <div class="metric-card">
              <span class="metric-value">${summary.roi}</span>
              <span class="metric-label">Target ROI</span>
            </div>
            <div class="metric-card">
              <span class="metric-value">${summary.timeline}</span>
              <span class="metric-label">Timeline</span>
            </div>
            <div class="metric-card">
              <span class="metric-value">${summary.revenue}</span>
              <span class="metric-label">Est. Revenue</span>
            </div>
          </div>

          <div style="margin-top: 20px;">
            <p><span class="text-highlight">Niche:</span> ${config.niche || 'Not specified'}</p>
            <p><span class="text-highlight">Target Audience:</span> ${config.targetAudience || 'Not specified'}</p>
            <p><span class="text-highlight">Budget Level:</span> ${config.budget || 'Not specified'}</p>
            <p><span class="text-highlight">Timeframe:</span> ${config.timeframe || 'Not specified'}</p>
            <p class="text-secondary">Generated: ${new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <!-- Target Audience Analysis -->
        <div class="section">
          <h2>��� Target Audience Deep Analysis</h2>
          <div class="card">
            <p>${safeRenderValue(plan?.targetAudienceOverview || 'Target audience analysis not available')}</p>
          </div>
        </div>

        <!-- Strategic Goals -->
        <div class="section">
          <h2>🚀 Strategic Goals & KPIs</h2>
          <ol>
            ${(plan?.goals || []).map((goal, index) => `
              <li><strong>Goal ${index + 1}:</strong> ${safeRenderValue(goal)}</li>
            `).join('')}
          </ol>
        </div>

        <!-- Content Pillars -->
        <div class="section content-pillars">
          <h2>🏛️ Content Pillars Strategy</h2>
          <div class="grid">
            ${(plan?.contentPillars || []).map((pillar, index) => `
              <div class="card pillar-card">
                <h3>${safeRenderValue(pillar.pillarName || `Pillar ${index + 1}`)}</h3>
                <p>${safeRenderValue(pillar.description || 'No description available')}</p>

                <h4>🔑 Keywords</h4>
                <div>
                  ${(pillar.keywords || []).map(keyword => `<span class="tag tag-emerald">${safeRenderValue(keyword)}</span>`).join('')}
                </div>

                <h4>📝 Content Types</h4>
                <div>
                  ${(pillar.contentTypes || []).map(type => `<span class="tag tag-purple">${safeRenderValue(type)}</span>`).join('')}
                </div>

                <div style="margin-top: 12px;">
                  <p class="text-secondary"><strong>Posting Frequency:</strong> ${safeRenderValue(pillar.postingFrequency || 'Not specified')}</p>
                  <p class="text-secondary"><strong>Engagement Strategy:</strong> ${safeRenderValue(pillar.engagementStrategy || 'Not specified')}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Analytics & KPIs -->
        ${plan?.analyticsAndKPIs ? `
          <div class="section analytics">
            <h2>📈 Analytics & KPIs</h2>

            <h3>Primary Metrics</h3>
            <div class="grid">
              ${(plan.analyticsAndKPIs.primaryMetrics || []).map(metric => `
                <div class="card">
                  <p>${safeRenderValue(metric)}</p>
                </div>
              `).join('')}
            </div>

            ${plan.analyticsAndKPIs.advancedMetrics ? `
              <h3>Advanced Metrics</h3>
              <div class="grid">
                ${Array.isArray(plan.analyticsAndKPIs.advancedMetrics)
                  ? plan.analyticsAndKPIs.advancedMetrics.slice(0, 4).map(metric => `
                      <div class="card">
                        <p>${safeRenderValue(metric)}</p>
                      </div>
                    `).join('')
                  : typeof plan.analyticsAndKPIs.advancedMetrics === 'object'
                  ? Object.entries(plan.analyticsAndKPIs.advancedMetrics).slice(0, 4).map(([key, value]) => `
                      <div class="card">
                        <h4>${key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                        <p>${safeRenderValue(value)}</p>
                      </div>
                    `).join('')
                  : `<div class="card"><p>${safeRenderValue(plan.analyticsAndKPIs.advancedMetrics)}</p></div>`
                }
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- Weekly Content Schedule -->
        ${plan?.suggestedWeeklySchedule && plan.suggestedWeeklySchedule.length > 0 ? `
          <div class="section">
            <h2>📅 Weekly Content Schedule</h2>
            ${plan.suggestedWeeklySchedule.map(item => `
              <div class="schedule-item">
                <div class="day-header">${safeRenderValue(item.dayOfWeek || 'Day')}</div>
                <p><strong>Content:</strong> ${safeRenderValue(item.contentType || 'Content')} - ${safeRenderValue(item.topicHint || 'Topic')}</p>
                ${item.optimalTime ? `<p><strong>⏰ Optimal Time:</strong> ${safeRenderValue(item.optimalTime)}</p>` : ''}
                ${item.platform ? `<p><strong>📱 Platform:</strong> <span class="tag">${safeRenderValue(item.platform)}</span></p>` : ''}
                ${item.cta ? `<p><strong>💡 Call to Action:</strong> ${safeRenderValue(item.cta)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Monetization Strategy -->
        ${plan?.monetizationStrategy ? `
          <div class="section">
            <h2>💰 Monetization Strategy</h2>

            ${plan.monetizationStrategy.revenueStreams ? `
              <h3>Revenue Streams</h3>
              <div class="grid">
                ${Array.isArray(plan.monetizationStrategy.revenueStreams)
                  ? plan.monetizationStrategy.revenueStreams.map(stream => `
                      <div class="card">
                        <p>${safeRenderValue(stream)}</p>
                      </div>
                    `).join('')
                  : typeof plan.monetizationStrategy.revenueStreams === 'object'
                  ? Object.entries(plan.monetizationStrategy.revenueStreams).map(([key, value]) => `
                      <div class="card">
                        <h4>${key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                        <p>${safeRenderValue(value)}</p>
                      </div>
                    `).join('')
                  : `<div class="card"><p>${safeRenderValue(plan.monetizationStrategy.revenueStreams)}</p></div>`
                }
              </div>
            ` : ''}

            <div class="grid" style="margin-top: 20px;">
              <div class="card">
                <h4>💵 Pricing Strategy</h4>
                <p>${safeRenderValue(plan.monetizationStrategy.pricingStrategy || 'Pricing strategy not specified')}</p>
              </div>
              <div class="card">
                <h4>��� Conversion Funnel</h4>
                <p>${safeRenderValue(plan.monetizationStrategy.conversionFunnels || 'Conversion funnel not specified')}</p>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Growth & Scalability -->
        ${plan?.scalabilityPlanning ? `
          <div class="section">
            <h2>📈 Growth & Scalability Roadmap</h2>

            ${plan.scalabilityPlanning.growthPhases ? `
              <h3>Growth Phases</h3>
              ${Array.isArray(plan.scalabilityPlanning.growthPhases)
                ? plan.scalabilityPlanning.growthPhases.map((phase, index) => `
                    <div class="card" style="margin-bottom: 12px;">
                      <h4>Phase ${index + 1}</h4>
                      <p>${safeRenderValue(phase)}</p>
                    </div>
                  `).join('')
                : typeof plan.scalabilityPlanning.growthPhases === 'object'
                ? Object.entries(plan.scalabilityPlanning.growthPhases).map(([phase, details]) => `
                    <div class="card" style="margin-bottom: 12px;">
                      <h4>${phase.replace(/([A-Z])/g, ' $1').trim()}</h4>
                      <p>${safeRenderValue(details)}</p>
                    </div>
                  `).join('')
                : `<div class="card"><p>${safeRenderValue(plan.scalabilityPlanning.growthPhases)}</p></div>`
              }
            ` : ''}

            <div class="grid" style="margin-top: 20px;">
              <div class="card">
                <h4>�� Team Structure</h4>
                <p>${safeRenderValue(plan.scalabilityPlanning.teamStructure || 'Team structure not specified')}</p>
              </div>
              <div class="card">
                <h4>🛠️ Technology Stack</h4>
                <p>${safeRenderValue(plan.scalabilityPlanning.technologyStack || 'Technology stack not specified')}</p>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="footer">
          <p class="footer-brand">CreateGen Studio</p>
          <p>Professional Content Strategy Plan</p>
          <p class="text-secondary">Generated on ${new Date().toLocaleDateString()} ��� © ${new Date().getFullYear()} • For internal use only</p>
          ${!isPremium ? '<p style="color: #f59e0b; font-weight: 600;">⭐ Upgrade to Premium for unlimited exports and advanced features!</p>' : ''}
        </div>
      </div>
    `;
  };

  const loadTemplate = (templateId: string) => {
    console.log("����� Loading template:", templateId);
    setIsLoadingTemplate(true);

    const template = strategyTemplates.find((t) => t.id === templateId);
    if (!template) {
      console.error("❌ Template not found:", templateId);
      setIsLoadingTemplate(false);
      return;
    }
    console.log("✅ Found template:", template.name, { isUltimate: template.isUltimate });

    // Check if user has permission for ultimate templates
    if (template.isUltimate && !hasUltimateAccess()) {
      // Show upgrade prompt for Agency Pro
      setIsLoadingTemplate(false);
      onUpgrade?.();
      return;
    }

    // Pre-fill form based on template - comprehensive configurations for all templates
    const templateConfigs: Record<string, Partial<StrategyConfig>> = {
      // Free Templates
      "startup-growth": {
        niche: "Tech Startup",
        targetAudience: "Early adopters, tech enthusiasts, potential customers and investors",
        goals: ["Brand Awareness", "Lead Generation", "Thought Leadership", "Audience Growth"],
        platforms: [Platform.LinkedIn, Platform.Twitter, Platform.YouTube],
        contentTypes: ["Blog Posts", "Behind-the-Scenes", "Videos", "Social Media Posts"],
        timeframe: "6months",
        budget: "medium",
      },
      "personal-brand": {
        niche: "Professional Services",
        targetAudience: "Industry peers, potential clients, and professional network",
        goals: ["Thought Leadership", "Lead Generation", "Brand Awareness", "Community Building"],
        platforms: [Platform.LinkedIn, Platform.Instagram, Platform.Twitter],
        contentTypes: ["Blog Posts", "Social Media Posts", "Newsletter", "Case Studies"],
        timeframe: "6months",
        budget: "medium",
      },
      "content-creator": {
        niche: "Content Creation",
        targetAudience: "Content consumers, potential brand partners, and creative community",
        goals: ["Audience Growth", "Engagement", "Brand Awareness", "Community Building"],
        platforms: [Platform.TikTok, Platform.Instagram, Platform.YouTube],
        contentTypes: ["Videos", "Tutorials", "Behind-the-Scenes", "Reels/Shorts"],
        timeframe: "3months",
        budget: "low",
      },

      // Premium Templates
      "b2b-leadership": {
        niche: "B2B Technology",
        targetAudience: "C-suite executives, VPs, and decision-makers in enterprise technology",
        goals: ["Thought Leadership", "Lead Generation", "Brand Awareness", "Market Expansion"],
        platforms: [Platform.LinkedIn],
        contentTypes: ["Case Studies", "Whitepapers", "Webinars", "Blog Posts"],
        timeframe: "1year",
        budget: "high",
      },
      "ecommerce-conversion": {
        niche: "E-commerce",
        targetAudience: "Online shoppers, brand advocates, and potential customers",
        goals: ["Sales Conversion", "Brand Awareness", "Customer Retention", "Engagement"],
        platforms: [Platform.Instagram, Platform.TikTok, Platform.Pinterest, Platform.Facebook],
        contentTypes: ["Videos", "User Generated Content", "Infographics", "Social Media Posts"],
        timeframe: "6months",
        budget: "medium",
      },
      "saas-onboarding": {
        niche: "SaaS Platform",
        targetAudience: "Current users, potential customers, and software decision-makers",
        goals: ["Customer Retention", "Education", "Lead Generation", "Community Building"],
        platforms: [Platform.YouTube, Platform.LinkedIn],
        contentTypes: ["Tutorials", "Videos", "Case Studies", "Blog Posts"],
        timeframe: "1year",
        budget: "high",
      },
      "enterprise-marketing": {
        niche: "Enterprise Solutions",
        targetAudience: "Global enterprise customers, partners, and industry analysts",
        goals: ["Market Expansion", "Lead Generation", "Thought Leadership", "Brand Awareness"],
        platforms: [Platform.LinkedIn, Platform.YouTube],
        contentTypes: ["Whitepapers", "Case Studies", "Webinars", "Blog Posts"],
        timeframe: "1year",
        budget: "enterprise",
      },
      "influencer-marketing": {
        niche: "Influencer Marketing",
        targetAudience: "Brand partners, followers, and marketing professionals",
        goals: ["Brand Awareness", "Audience Growth", "Engagement", "Sales Conversion"],
        platforms: [Platform.Instagram, Platform.TikTok, Platform.YouTube, Platform.Twitter],
        contentTypes: ["Videos", "Social Media Posts", "Stories", "User Generated Content"],
        timeframe: "6months",
        budget: "medium",
      },
      "nonprofit-awareness": {
        niche: "Nonprofit Organization",
        targetAudience: "Donors, volunteers, community members, and advocacy supporters",
        goals: ["Brand Awareness", "Community Building", "Engagement", "Lead Generation"],
        platforms: [Platform.Facebook, Platform.Instagram, Platform.LinkedIn],
        contentTypes: ["Social Media Posts", "Videos", "Newsletter", "Case Studies"],
        timeframe: "1year",
        budget: "low",
      },
      "local-business": {
        niche: "Local Business",
        targetAudience: "Local customers, community members, and word-of-mouth advocates",
        goals: ["Brand Awareness", "Engagement", "Customer Retention", "Community Building"],
        platforms: [Platform.Facebook, Platform.Instagram, Platform.GoogleMyBusiness],
        contentTypes: ["Social Media Posts", "Behind-the-Scenes", "Stories", "Videos"],
        timeframe: "6months",
        budget: "low",
      },
      "tech-startup-launch": {
        niche: "Tech Startup Launch",
        targetAudience: "Early adopters, tech media, investors, and potential customers",
        goals: ["Brand Awareness", "Lead Generation", "Audience Growth", "Thought Leadership"],
        platforms: [Platform.Twitter, Platform.LinkedIn, Platform.ProductHunt],
        contentTypes: ["Videos", "Blog Posts", "Social Media Posts", "Case Studies"],
        timeframe: "6months",
        budget: "medium",
      },
      "creative-agency": {
        niche: "Creative Agency",
        targetAudience: "Potential clients, creative professionals, and industry partners",
        goals: ["Brand Awareness", "Lead Generation", "Thought Leadership", "Engagement"],
        platforms: [Platform.Instagram, Platform.Behance, Platform.LinkedIn],
        contentTypes: ["Infographics", "Case Studies", "Videos", "Blog Posts"],
        timeframe: "6months",
        budget: "medium",
      },

      // Ultimate Templates
      "ultimate-global-expansion": {
        niche: "Global Enterprise",
        targetAudience: "International markets, local stakeholders, global partners, and regulatory bodies",
        goals: ["Market Expansion", "Thought Leadership", "Brand Awareness", "Lead Generation"],
        platforms: [Platform.LinkedIn, Platform.YouTube, Platform.Twitter, Platform.Facebook],
        contentTypes: ["Case Studies", "Whitepapers", "Videos", "Blog Posts"],
        timeframe: "1year",
        budget: "enterprise",
      },
      "ultimate-ai-transformation": {
        niche: "AI & Digital Transformation",
        targetAudience: "Enterprise leaders, technologists, policy makers, and innovation teams",
        goals: ["Thought Leadership", "Market Expansion", "Education", "Brand Awareness"],
        platforms: [Platform.LinkedIn, Platform.YouTube],
        contentTypes: ["Case Studies", "Whitepapers", "Videos", "Webinars"],
        timeframe: "1year",
        budget: "enterprise",
      },
      "ultimate-sustainability-leadership": {
        niche: "Sustainability & ESG",
        targetAudience: "Stakeholders, investors, policy makers, communities, and ESG analysts",
        goals: ["Thought Leadership", "Brand Awareness", "Education", "Community Building"],
        platforms: [Platform.LinkedIn, Platform.YouTube],
        contentTypes: ["Case Studies", "Whitepapers", "Newsletter", "Blog Posts"],
        timeframe: "1year",
        budget: "enterprise",
      },
      "ultimate-ipo-preparation": {
        niche: "IPO & Public Company",
        targetAudience: "Investors, analysts, regulators, media, and stakeholders",
        goals: ["Market Expansion", "Thought Leadership", "Brand Awareness", "Investor Relations"],
        platforms: [Platform.LinkedIn, Platform.YouTube, Platform.Twitter],
        contentTypes: ["Investor Updates", "Whitepapers", "Videos", "Press Releases"],
        timeframe: "1year",
        budget: "enterprise",
      },
      "ultimate-ma-integration": {
        niche: "M&A & Corporate Strategy",
        targetAudience: "Stakeholders, employees, customers, partners, and industry analysts",
        goals: ["Market Expansion", "Thought Leadership", "Brand Awareness", "Integration Communication"],
        platforms: [Platform.LinkedIn, Platform.YouTube],
        contentTypes: ["Case Studies", "Integration Updates", "Videos", "Executive Insights"],
        timeframe: "1year",
        budget: "enterprise",
      },
      "ultimate-crisis-recovery": {
        niche: "Crisis Management",
        targetAudience: "Stakeholders, media, customers, employees, and regulators",
        goals: ["Reputation Management", "Crisis Communication", "Brand Recovery", "Stakeholder Relations"],
        platforms: [Platform.LinkedIn, Platform.Twitter, Platform.YouTube],
        contentTypes: ["Crisis Updates", "Transparency Reports", "Videos", "Stakeholder Letters"],
        timeframe: "1year",
        budget: "enterprise",
      },
      "ultimate-government-relations": {
        niche: "Government & Policy",
        targetAudience: "Policy makers, regulators, government officials, and public sector stakeholders",
        goals: ["Policy Influence", "Thought Leadership", "Government Relations", "Public Affairs"],
        platforms: [Platform.LinkedIn, Platform.Twitter],
        contentTypes: ["Policy Papers", "Government Briefings", "Regulatory Updates", "Public Statements"],
        timeframe: "1year",
        budget: "enterprise",
      },
      "ultimate-succession-leadership": {
        niche: "Leadership Transition",
        targetAudience: "Board members, executives, employees, stakeholders, and succession candidates",
        goals: ["Leadership Development", "Succession Planning", "Organizational Culture", "Knowledge Transfer"],
        platforms: [Platform.LinkedIn, Platform.YouTube],
        contentTypes: ["Leadership Insights", "Mentorship Content", "Succession Stories", "Cultural Values"],
        timeframe: "1year",
        budget: "enterprise",
      },
      "ultimate-global-conglomerate": {
        niche: "Global Conglomerate",
        targetAudience: "Global stakeholders, subsidiary leaders, investors, and multinational partners",
        goals: ["Global Coordination", "Portfolio Management", "Cross-Market Synergies", "International Expansion"],
        platforms: [Platform.LinkedIn, Platform.YouTube, Platform.Twitter],
        contentTypes: ["Portfolio Updates", "Global Market Analysis", "Cross-Border Insights", "Synergy Cases"],
        timeframe: "1year",
        budget: "enterprise",
      },
      "ultimate-sovereign-wealth": {
        niche: "Sovereign & National Strategy",
        targetAudience: "Government officials, international partners, sovereign entities, and global markets",
        goals: ["National Branding", "International Relations", "Economic Diplomacy", "Global Positioning"],
        platforms: [Platform.LinkedIn, Platform.YouTube],
        contentTypes: ["Economic Reports", "Diplomatic Content", "National Showcases", "Global Partnerships"],
        timeframe: "1year",
        budget: "enterprise",
      },
      "ultimate-family-office": {
        niche: "Family Office & Wealth",
        targetAudience: "High-net-worth families, wealth advisors, estate planners, and private banking",
        goals: ["Wealth Preservation", "Generational Planning", "Family Legacy", "Private Investment"],
        platforms: [Platform.LinkedIn],
        contentTypes: ["Wealth Insights", "Family Governance", "Investment Philosophy", "Legacy Stories"],
        timeframe: "1year",
        budget: "enterprise",
      },
      "ultimate-unicorn-scaling": {
        niche: "Hypergrowth Startup",
        targetAudience: "Investors, employees, customers, partners, and industry disruptors",
        goals: ["Market Disruption", "Unicorn Positioning", "Hypergrowth Management", "Industry Leadership"],
        platforms: [Platform.LinkedIn, Platform.Twitter, Platform.YouTube],
        contentTypes: ["Growth Stories", "Disruption Insights", "Scaling Strategies", "Innovation Showcases"],
        timeframe: "1year",
        budget: "enterprise",
      },
    };

    const config = templateConfigs[templateId];
    console.log("🔍 Looking for config for:", templateId, "Available configs:", Object.keys(templateConfigs).includes(templateId) ? "��� FOUND" : "❌ MISSING");

    if (config) {
      console.log(`✅ Loading template: ${template.name}`, config);

      // Set the configuration to populate form fields
      if (onStrategyConfigChange) {
        onStrategyConfigChange(config as StrategyConfig);
      }

      // For premium users, auto-generate the strategy after setting config
      if (isPremium && onGenerateStrategy) {
        setTimeout(() => {
          onGenerateStrategy(config as StrategyConfig);
          setIsLoadingTemplate(false);
        }, 500); // Small delay to ensure config is set
      } else {
        setIsLoadingTemplate(false);
      }
    } else {
      console.warn(`⚠️ No configuration found for template: ${templateId}. Available templates:`, Object.keys(templateConfigs));
      setIsLoadingTemplate(false);
    }
  };

  return (
    <>
      {/* CSS for Progress Animation */}
      <style>{`
        @keyframes progress-fill {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
        {/* Modern Header with Design System */}
        <div className="relative bg-[var(--surface-secondary)] border-b border-[var(--border-secondary)] flex-shrink-0">
          <div className="p-6">
            <TabHeader
              title="Content Strategy Planner"
              subtitle="AI-powered strategic planning with competitive insights"
              icon={<CompassIcon />}
              badge={isPremium ? "Premium" : "Free"}
              actions={
                <div className="flex items-center space-x-3 mt-8">
                  {isPremium && (
                    <Badge variant="primary">
                      <CrownIcon className="w-3 h-3" />
                      Premium
                    </Badge>
                  )}
                  <Badge variant={isLoading ? 'warning' : strategyPlan ? 'success' : 'neutral'}>
                    {isLoading ? 'Creating...' : strategyPlan ? 'Ready' : 'Configure'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleStartFromScratch}
                    className="ml-2"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start from Scratch
                  </Button>
                </div>
              }
            />

            {/* Modern Navigation Tabs */}
            <div className="flex space-x-1 bg-[var(--surface-tertiary)] p-1 rounded-xl mt-6">
              {[
                { id: "create", label: "Create Strategy", icon: CompassIcon },
                { id: "templates", label: "Templates", icon: BookmarkIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.premium && !isPremium) {
                      onUpgrade();
                      return;
                    }
                    setActiveView(tab.id as any);
                  }}
                  className={`flex items-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                    activeView === tab.id
                      ? "bg-[var(--brand-primary)] text-white shadow-lg"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-quaternary)]"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.premium && !isPremium && (
                    <Badge variant="warning" className="text-xs ml-1">PRO</Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 p-6 overflow-y-auto min-h-0 space-y-8">
          {error && (
            <Card variant="error" className="border-[var(--color-error)]/30 bg-[var(--color-error)]/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[var(--color-error)]/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--color-error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--color-error)]">Error</h4>
                  <p className="text-[var(--color-error)] opacity-90">{error}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Create Strategy View */}
          {activeView === "create" && (
            <div className="space-y-6">
              {/* Strategy Configuration */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Information */}
                  <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/5 via-transparent to-[var(--brand-secondary)]/5" />
                    <div className="relative">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-xl flex items-center justify-center mr-3">
                          <TargetIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[var(--text-primary)]">Basic Information</h3>
                          <p className="text-sm text-[var(--text-secondary)]">Define your strategy foundation</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Niche/Industry"
                          placeholder="e.g., Sustainable Tech, Food Blogging"
                          value={strategyConfig.niche}
                          onChange={(value) =>
                            setStrategyConfig((prev) => ({
                              ...prev,
                              niche: value,
                            }))
                          }
                        />
                        <Input
                          label="Target Audience"
                          placeholder="e.g., Tech-savvy millennials, working parents"
                          value={strategyConfig.targetAudience}
                          onChange={(value) =>
                            setStrategyConfig((prev) => ({
                              ...prev,
                              targetAudience: value,
                            }))
                          }
                        />
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center mb-4">
                          <label className="block text-sm font-semibold text-[var(--text-primary)]">
                            Primary Goals
                          </label>
                          <Badge variant="info" className="ml-2">
                            {strategyConfig.goals.length}/4 selected
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {predefinedGoals.map((goal) => (
                            <button
                              key={goal}
                              onClick={() => {
                                setStrategyConfig((prev) => ({
                                  ...prev,
                                  goals: prev.goals.includes(goal)
                                    ? prev.goals.filter((g) => g !== goal)
                                    : prev.goals.length < 4
                                      ? [...prev.goals, goal]
                                      : prev.goals,
                                }));
                              }}
                              className={`p-3 text-sm rounded-xl border transition-all duration-200 font-medium ${
                                strategyConfig.goals.includes(goal)
                                  ? "bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] border-[var(--brand-primary)] text-white shadow-lg transform scale-105"
                                  : "bg-[var(--surface-tertiary)] border-[var(--border-secondary)] hover:bg-[var(--surface-quaternary)] hover:border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-102"
                              } ${strategyConfig.goals.length >= 4 && !strategyConfig.goals.includes(goal) ? "opacity-50 cursor-not-allowed" : ""}`}
                              disabled={strategyConfig.goals.length >= 4 && !strategyConfig.goals.includes(goal)}
                            >
                              {goal}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Platform & Content Types */}
                  <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-cyan)]/5 via-transparent to-[var(--brand-secondary)]/5" />
                    <div className="relative">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--brand-secondary)] rounded-xl flex items-center justify-center mr-3">
                          <GlobeIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[var(--text-primary)]">Platforms & Content</h3>
                          <p className="text-sm text-[var(--text-secondary)]">Choose your channels and content types</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="label-medium text-[var(--text-primary)] mb-4 block">
                            Target Platforms
                          </label>
                          <div className="space-y-3">
                            {[
                              "YouTube",
                              "TikTok",
                              "Instagram",
                              "Twitter",
                              "LinkedIn",
                              "Facebook",
                            ].map((platform) => (
                              <label
                                key={platform}
                                className="flex items-center space-x-3 p-4 rounded-xl bg-[var(--surface-tertiary)] hover:bg-[var(--surface-quaternary)] border border-[var(--border-secondary)] hover:border-[var(--border-primary)] transition-all duration-200 cursor-pointer group"
                              >
                                <input
                                  type="checkbox"
                                  checked={strategyConfig.platforms.includes(
                                    platform as Platform,
                                  )}
                                  onChange={(e) => {
                                    setStrategyConfig((prev) => ({
                                      ...prev,
                                      platforms: e.target.checked
                                        ? [
                                            ...prev.platforms,
                                            platform as Platform,
                                          ]
                                        : prev.platforms.filter(
                                            (p) => p !== platform,
                                          ),
                                    }));
                                  }}
                                  className="w-5 h-5 text-[var(--accent-cyan)] focus:ring-[var(--accent-cyan)] rounded-md border-[var(--border-secondary)]"
                                />
                                <span className="body-medium text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                                  {platform}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="label-medium text-[var(--text-primary)] mb-4 block">
                            Content Types
                          </label>
                          <div className="max-h-80 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-[var(--border-primary)] scrollbar-track-[var(--surface-tertiary)]">
                            {contentTypeOptions.map((type) => (
                              <label
                                key={type}
                                className="flex items-center space-x-3 p-3 rounded-lg bg-[var(--surface-tertiary)] hover:bg-[var(--surface-quaternary)] border border-[var(--border-secondary)] hover:border-[var(--border-primary)] transition-all duration-200 cursor-pointer group"
                              >
                                <input
                                  type="checkbox"
                                  checked={strategyConfig.contentTypes.includes(
                                    type,
                                  )}
                                  onChange={(e) => {
                                    setStrategyConfig((prev) => ({
                                      ...prev,
                                      contentTypes: e.target.checked
                                        ? [...prev.contentTypes, type]
                                        : prev.contentTypes.filter(
                                            (t) => t !== type,
                                          ),
                                    }));
                                  }}
                                  className="w-4 h-4 text-[var(--accent-cyan)] focus:ring-[var(--accent-cyan)] rounded border-[var(--border-secondary)]"
                                />
                                <span className="body-small text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                                  {type}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Advanced Options (Premium) */}
                  {isPremium && (
                    <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-xl border border-emerald-500/30">
                      <button
                        onClick={() =>
                          setShowAdvancedOptions(!showAdvancedOptions)
                        }
                        className="w-full flex items-center justify-between text-lg font-semibold text-emerald-300 mb-4"
                      >
                        <div className="flex items-center">
                          <BoltIcon className="w-5 h-5 mr-2" />
                          Advanced Options
                        </div>
                        <span
                          className={`transform transition-transform ${showAdvancedOptions ? "rotate-180" : ""}`}
                        >
                          ��
                        </span>
                      </button>

                      {showAdvancedOptions && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">
                                Strategy Timeframe
                              </label>
                              <select
                                value={strategyConfig.timeframe}
                                onChange={(e) =>
                                  setStrategyConfig((prev) => ({
                                    ...prev,
                                    timeframe: e.target
                                      .value as StrategyConfig["timeframe"],
                                  }))
                                }
                                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                              >
                                <option value="1month">1 Month</option>
                                <option value="3months">3 Months</option>
                                <option value="6months">6 Months</option>
                                <option value="1year">1 Year</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">
                                Budget Level
                              </label>
                              <select
                                value={strategyConfig.budget}
                                onChange={(e) =>
                                  setStrategyConfig((prev) => ({
                                    ...prev,
                                    budget: e.target
                                      .value as StrategyConfig["budget"],
                                  }))
                                }
                                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                              >
                                <option value="low">Low ($0-1k/month)</option>
                                <option value="medium">
                                  Medium ($1k-5k/month)
                                </option>
                                <option value="high">
                                  High ($5k-20k/month)
                                </option>
                                <option value="enterprise">
                                  Enterprise ($20k+/month)
                                </option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">
                                AI Persona
                              </label>
                              <select
                                value={strategyConfig.aiPersona}
                                onChange={(e) =>
                                  setStrategyConfig((prev) => ({
                                    ...prev,
                                    aiPersona: e.target.value,
                                  }))
                                }
                                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                              >
                                {aiPersonaOptions.map((persona) => (
                                  <option key={persona} value={persona}>
                                    {persona}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="competitor-analysis"
                              checked={strategyConfig.competitorAnalysis}
                              onChange={(e) =>
                                setStrategyConfig((prev) => ({
                                  ...prev,
                                  competitorAnalysis: e.target.checked,
                                }))
                              }
                              className="text-emerald-500 focus:ring-emerald-500"
                            />
                            <label
                              htmlFor="competitor-analysis"
                              className="text-slate-300"
                            >
                              Include Competitor Analysis & Benchmarking
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Generate Button */}
                  <div className="space-y-4">
                    {(!strategyConfig.niche || !strategyConfig.targetAudience) && !isLoading && (
                      <Card variant="warning" className="border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[var(--color-warning)]/20 rounded-full flex items-center justify-center">
                            <BoltIcon className="w-4 h-4 text-[var(--color-warning)]" />
                          </div>
                          <span className="text-sm text-[var(--color-warning)]">
                            Please fill in both Niche/Industry and Target Audience to generate your strategy
                          </span>
                        </div>
                      </Card>
                    )}

                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      loading={isLoading}
                      disabled={!strategyConfig.niche || !strategyConfig.targetAudience || isLoading}
                      onClick={handleGenerateStrategy}
                      icon={isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <BoltIcon className="w-5 h-5" />
                      )}
                      className={`py-4 text-lg font-bold shadow-xl transition-all duration-300 ${
                        isLoading
                          ? "cursor-not-allowed opacity-90"
                          : "hover:shadow-2xl transform hover:scale-105"
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Generating...</span>
                        </div>
                      ) : (
                        "Generate Premium Strategy"
                      )}
                    </Button>

                  </div>
                </div>

                {/* Strategy Insights Sidebar */}
                <div className="space-y-6">
                  {/* Strategy Potential Widget */}
                  <div className="p-8 bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl hover:border-purple-400/50 transition-all duration-300">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                        <BrainIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Strategy Potential</h3>
                        <p className="text-sm text-slate-400">AI-powered insights</p>
                      </div>
                    </div>
                    {(() => {
                      const analysis = analyzeStrategy();
                      return (
                        <div className="space-y-4">
                          {/* Progress indicator */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-300 text-xs">
                              Analysis Confidence
                            </span>
                            <span className="text-emerald-400 text-xs font-bold">
                              {analysis.confidence}%
                            </span>
                          </div>
                          <div className="bg-slate-700/50 rounded-full h-2 mb-4">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${analysis.confidence}%` }}
                            ></div>
                          </div>

                          {/* Niche Insight */}
                          <div className="bg-slate-800/50 p-3 rounded-lg">
                            <h4 className="text-sm font-semibold text-blue-300 mb-1 flex items-center">
                              <TargetIcon className="w-3 h-3 mr-1" />
                              Niche Analysis
                            </h4>
                            <p className="text-slate-300 text-xs leading-relaxed">
                              {analysis.nicheInsight}
                            </p>
                            {analysis.competitionScore > 0 && (
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-slate-400 text-xs">
                                  Competition Level
                                </span>
                                <div className="flex items-center space-x-2">
                                  <div className="bg-slate-600 rounded-full h-1.5 w-12">
                                    <div
                                      className={`h-1.5 rounded-full ${
                                        analysis.competitionScore > 8
                                          ? "bg-red-500"
                                          : analysis.competitionScore > 6
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                                      }`}
                                      style={{
                                        width: `${(analysis.competitionScore / 10) * 100}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-xs font-bold text-slate-300">
                                    {analysis.competitionScore}/10
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Key Themes */}
                          {analysis.keyThemes.length > 0 && (
                            <div className="bg-slate-800/50 p-3 rounded-lg">
                              <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center">
                                <BulbIcon className="w-3 h-3 mr-1" />
                                Key Themes
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {analysis.keyThemes.map((theme, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-xs border border-purple-500/30"
                                  >
                                    {theme}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Audience Match */}
                          {analysis.audienceMatch && (
                            <div className="bg-slate-800/50 p-3 rounded-lg">
                              <h4 className="text-sm font-semibold text-cyan-300 mb-1 flex items-center">
                                <UsersIcon className="w-3 h-3 mr-1" />
                                Audience Fit
                              </h4>
                              <p className="text-slate-300 text-xs leading-relaxed mb-2">
                                {analysis.audienceMatch}
                              </p>
                              {analysis.psychographicInsight && (
                                <p className="text-slate-400 text-xs leading-relaxed">
                                  ��� {analysis.psychographicInsight}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Platform Suggestions */}
                          {analysis.suggestedPlatforms.length > 0 && (
                            <div className="bg-slate-800/50 p-3 rounded-lg">
                              <h4 className="text-sm font-semibold text-green-300 mb-2 flex items-center">
                                <GlobeIcon className="w-3 h-3 mr-1" />
                                Recommended Platforms
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {analysis.suggestedPlatforms.map(
                                  (platform, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-green-600/20 text-green-300 rounded text-xs border border-green-500/30"
                                    >
                                      {platform}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Creator's Toolkit */}
                  <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center">
                      <FilterIcon className="w-5 h-5 mr-2" />
                      Creator's Toolkit
                    </h3>

                    <div className="space-y-4">
                      {/* Templates Section */}
                      <div>
                        <h4 className="label-medium text-[var(--text-primary)] mb-3">
                          Templates
                        </h4>
                        <Button
                          variant="secondary"
                          onClick={() => setActiveView("templates")}
                          className="w-full justify-start"
                          icon={<BookmarkIcon className="w-4 h-4" />}
                        >
                          <span className="flex-1 text-left">Load Template</span>
                          <span className="text-xs text-[var(--text-tertiary)]">⚡</span>
                        </Button>
                      </div>

                      {/* AI Brainstorming Section */}
                      <div>
                        <h4 className="label-medium text-[var(--text-primary)] mb-3">
                          AI Brainstorming
                        </h4>
                        <div className="space-y-2">
                          <div className="relative">
                            <Button
                              variant="secondary"
                              onClick={() => setShowNicheIdeas(!showNicheIdeas)}
                              className="w-full justify-start"
                              icon={<BulbIcon className="w-4 h-4" />}
                            >
                              <span className="flex-1 text-left">Get Niche Ideas</span>
                              <Badge variant="success" size="sm">AI</Badge>
                            </Button>
                            {showNicheIdeas && (
                              <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-3 shadow-2xl backdrop-blur-sm">
                                <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--border-primary)] scrollbar-track-transparent">
                                  {generateNicheIdeas().map((idea, index) => (
                                    <button
                                      key={index}
                                      onClick={() => {
                                        setStrategyConfig((prev) => ({
                                          ...prev,
                                          niche: idea,
                                        }));
                                        setShowNicheIdeas(false);
                                      }}
                                      className="w-full text-left px-3 py-2 body-small text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)] hover:text-[var(--text-primary)] rounded-lg transition-colors"
                                    >
                                      {idea}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="relative">
                            <button
                              onClick={() =>
                                setShowAudienceIdeas(!showAudienceIdeas)
                              }
                              disabled={!strategyConfig.niche}
                              className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 rounded-lg text-left text-slate-300 hover:text-white transition-colors flex items-center space-x-2"
                            >
                              <UsersIcon className="w-4 h-4" />
                              <span>Suggest Audiences</span>
                              <span className="ml-auto text-xs text-emerald-400">
                                AI
                              </span>
                            </button>
                            {showAudienceIdeas && strategyConfig.niche && (
                              <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-3 shadow-2xl backdrop-blur-sm">
                                <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--border-primary)] scrollbar-track-transparent">
                                  {generateAudienceIdeas().map(
                                    (idea, index) => (
                                      <button
                                        key={index}
                                        onClick={() => {
                                          setStrategyConfig((prev) => ({
                                            ...prev,
                                            targetAudience: idea,
                                          }));
                                          setShowAudienceIdeas(false);
                                        }}
                                        className="w-full text-left px-3 py-2 body-small text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)] hover:text-[var(--text-primary)] rounded-lg transition-colors leading-relaxed"
                                      >
                                        {idea}
                                      </button>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Session Management */}
                      <div>
                        <h4 className="label-medium text-[var(--text-primary)] mb-3">
                          Session Management
                        </h4>
                        <div className="space-y-2">
                          <div className="relative">
                            <button
                              onClick={() => setShowSaveDraft(!showSaveDraft)}
                              disabled={
                                !strategyConfig.niche &&
                                !strategyConfig.targetAudience
                              }
                              className="w-full px-4 py-3 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-800 disabled:opacity-50 rounded-lg text-left text-white transition-colors flex items-center space-x-2"
                            >
                              <DocumentTextIcon className="w-4 h-4" />
                              <span>Save as Draft</span>
                              <span className="ml-auto text-xs text-emerald-300">
                                💾
                              </span>
                            </button>
                            {showSaveDraft && (
                              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
                                <input
                                  type="text"
                                  value={saveDraftName}
                                  onChange={(e) =>
                                    setSaveDraftName(e.target.value)
                                  }
                                  placeholder="Draft name..."
                                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-300 placeholder-slate-400 text-sm mb-2"
                                  onKeyPress={(e) =>
                                    e.key === "Enter" && saveDraft()
                                  }
                                />
                                <div className="flex space-x-2">
                                  <button
                                    onClick={saveDraft}
                                    disabled={!saveDraftName.trim()}
                                    className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:opacity-50 text-white rounded text-sm transition-colors"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setShowSaveDraft(false)}
                                    className="px-3 py-2 bg-slate-600 hover:bg-slate-500 text-slate-300 rounded text-sm transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Load Drafts */}
                          {savedDrafts.length > 0 && (
                            <div className="bg-slate-700/30 p-3 rounded-lg">
                              <h5 className="text-xs font-semibold text-slate-400 mb-2">
                                Saved Drafts
                              </h5>
                              <div className="space-y-1 max-h-24 overflow-y-auto">
                                {savedDrafts.map((draft) => (
                                  <button
                                    key={draft.id}
                                    onClick={() => loadDraft(draft)}
                                    className="w-full text-left px-2 py-1 text-xs text-slate-300 hover:bg-slate-600 rounded transition-colors"
                                  >
                                    {draft.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={clearForm}
                            className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left text-slate-300 hover:text-white transition-colors flex items-center space-x-2"
                          >
                            <span className="text-red-400">🗑</span>
                            <span>Clear Form</span>
                          </button>
                        </div>
                      </div>

                      {/* Export Actions (when strategy exists) */}
                      {strategyPlan && (
                        <div>
                          <h4 className="text-sm font-semibold text-slate-400 mb-2">
                            Export
                          </h4>
                          <div className="space-y-2">
                            <button
                              onClick={saveStrategy}
                              className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left text-slate-300 hover:text-white transition-colors flex items-center space-x-2"
                            >
                              <BookmarkIcon className="w-4 h-4" />
                              <span>Save Strategy</span>
                            </button>
                            <button
                              onClick={() => exportStrategy("pdf")}
                              className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left text-slate-300 hover:text-white transition-colors flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-2">
                                <DownloadIcon className="w-4 h-4" />
                                <span>Export PDF</span>
                              </div>
                              {!isPremium && (
                                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded border border-amber-500/30">
                                  {Math.max(0, 5 - getExportCount())}/5 left
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Click outside handlers */}
                  {(showNicheIdeas || showAudienceIdeas || showSaveDraft) && (
                    <div
                      className="fixed inset-0 z-5"
                      onClick={() => {
                        setShowNicheIdeas(false);
                        setShowAudienceIdeas(false);
                        setShowSaveDraft(false);
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Progress Bar for Strategy Generation */}
              {isLoading && (
                <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-xl border border-blue-500/30 backdrop-blur-sm">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                      <h3 className="text-lg font-semibold text-blue-300">
                        Crafting Your Strategy...
                      </h3>
                    </div>

                    {/* Enhanced Progress Bar */}
                    <div className="w-full max-w-md">
                      <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 h-3 rounded-full transition-all duration-700 ease-out animate-pulse"
                          style={{
                            width: "100%",
                            animation: "progress-fill 3s ease-in-out infinite",
                          }}
                        ></div>
                      </div>
                      <div className="mt-2 text-center text-slate-400 text-sm">
                        🧠 Analyzing market trends and competitive landscape...
                      </div>
                    </div>

                    {/* Strategy Generation Steps - Perfectly Aligned */}
                    <div className="flex justify-center items-center w-full mt-6">
                      <div className="flex items-center justify-between w-full max-w-lg space-x-8">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-slate-300 text-center whitespace-nowrap">Audience Analysis</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          <div
                            className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"
                            style={{ animationDelay: "0.5s" }}
                          ></div>
                          <span className="text-sm text-slate-300 text-center whitespace-nowrap">Content Planning</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          <div
                            className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"
                            style={{ animationDelay: "1s" }}
                          ></div>
                          <span className="text-sm text-slate-300 text-center whitespace-nowrap">Strategy Optimization</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Strategy Results */}
              {strategyPlan && !isLoading && (
                <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-xl border border-emerald-500/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-emerald-300">
                      Generated Strategy Plan
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => exportStrategy("pdf")}
                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center space-x-1"
                      >
                        <DownloadIcon className="w-4 h-4" />
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={() => exportStrategy("docx")}
                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center space-x-1"
                      >
                        <DownloadIcon className="w-4 h-4" />
                        <span>Word</span>
                      </button>
                      <button
                        onClick={saveStrategy}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm flex items-center space-x-1"
                      >
                        <BookmarkIcon className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>

                  {/* PREMIUM STRATEGY DISPLAY - COMPREHENSIVE SECTIONS */}
                  <div className="space-y-8">
                    {/* Executive Summary */}
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-green-500/20 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
                      <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                              <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                Executive Summary
                              </h3>
                              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                Key strategy insights
                              </p>
                            </div>
                          </div>
                        </div>
                        {onSendToCanvas && (
                          <button
                            onClick={() => {
                              const summary = generateDynamicSummary();
                              const content = `# Executive Summary\n\n**Target ROI:** ${summary.roi}\n**Timeline:** ${summary.timeline}\n**Est. Revenue:** ${summary.revenue}\n\n*Based on ${strategyConfig.niche} niche with ${strategyConfig.budget} budget over ${strategyConfig.timeframe}*`;
                              sendSectionToCanvas("Executive Summary", content);
                            }}
                            className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg text-sm border border-emerald-500/30 transition-colors flex items-center space-x-2"
                          >
                            <span>��</span>
                            <span>Send to Canvas</span>
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(() => {
                          const summary = generateDynamicSummary();
                          return [
                            {
                              title: "Target ROI",
                              value: summary.roi,
                              desc: "Expected return on investment",
                            },
                            {
                              title: "Timeline",
                              value: summary.timeline,
                              desc: "Full strategy implementation",
                            },
                            {
                              title: "Est. Revenue",
                              value: summary.revenue,
                              desc: `${strategyConfig.timeframe === "1year" ? "12" : strategyConfig.timeframe === "6months" ? "6" : strategyConfig.timeframe === "3months" ? "3" : "1"}-month revenue target`,
                            },
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] p-5 rounded-lg text-center hover:border-emerald-300/40 transition-all duration-200 group/card"
                            >
                              <div className="flex items-center justify-center mb-3">
                                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                                  {index === 0 && <TrendingUp className="w-4 h-4 text-emerald-600" />}
                                  {index === 1 && <Calendar className="w-4 h-4 text-blue-600" />}
                                  {index === 2 && <BarChart3 className="w-4 h-4 text-green-600" />}
                                </div>
                              </div>
                              <h5 className="text-[var(--text-primary)] font-semibold mb-2 text-sm uppercase tracking-wide">
                                {item.title}
                              </h5>
                              <p className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                                {item.value}
                              </p>
                              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                {item.desc}
                              </p>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    {/* Target Audience Analysis */}
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
                      <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                Target Audience
                              </h3>
                              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                Core audience insights
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[var(--surface-secondary)] rounded-lg p-4 border border-[var(--border-secondary)]">
                          <div className="prose prose-sm max-w-none">
                            <p className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap m-0">
                              <SafeStrategyValue value={strategyPlan.targetAudienceOverview} />
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Strategic Goals */}
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
                      <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                              <Target className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                Strategic Goals
                              </h3>
                              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                {strategyPlan.goals.length} key objectives
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {strategyPlan.goals.map((goal, index) => (
                          <div
                            key={index}
                            className="group/goal relative bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-4 hover:border-emerald-300/40 transition-all duration-200"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[var(--text-primary)] leading-relaxed">
                                  <SafeStrategyValue value={goal} />
                                </p>
                              </div>

                              <div className="flex-shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveGoalMenu(activeGoalMenu === index ? null : index);
                                  }}
                                  className="opacity-0 group-hover/goal:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                                  title="Goal actions"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {/* Premium 8-Figure Style Floating Menu */}
                                {activeGoalMenu === index && (
                                  <div className="absolute right-0 top-full mt-3 w-64 bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98 backdrop-blur-2xl border border-slate-600/30 rounded-3xl shadow-2xl shadow-black/50 z-50 overflow-hidden ring-1 ring-white/5">
                                    {/* Menu Header */}
                                    <div className="px-4 py-3 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                        <span className="ml-2 text-xs font-medium text-slate-300">Goal Actions</span>
                                      </div>
                                    </div>

                                    <div className="p-3 space-y-2">
                                      {/* Save to Goals */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          saveGoalToGoalsTab(goal, index);
                                          setActiveGoalMenu(null);
                                        }}
                                        className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600/10 to-green-600/10 hover:from-emerald-600/20 hover:to-green-600/20 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 ease-out"
                                      >
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                          </div>
                                          <div className="flex-1 text-left">
                                            <div className="font-semibold text-white text-sm group-hover:text-emerald-200 transition-colors">Save Goal</div>
                                            <div className="text-xs text-slate-400 group-hover:text-emerald-300/80 transition-colors">Add to Goals tab</div>
                                          </div>
                                          <svg className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                          </svg>
                                        </div>
                                      </button>

                                      {/* Regenerate Goal */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          regenerateSpecificGoal(index);
                                        }}
                                        disabled={regeneratingGoal === index}
                                        className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            {regeneratingGoal === index ? (
                                              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                              </svg>
                                            )}
                                          </div>
                                          <div className="flex-1 text-left">
                                            <div className="font-semibold text-white text-sm group-hover:text-blue-200 transition-colors">Regenerate</div>
                                            <div className="text-xs text-slate-400 group-hover:text-blue-300/80 transition-colors">1 credit • Goal specific</div>
                                          </div>
                                          <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                          </svg>
                                        </div>
                                      </button>

                                      {/* Send to Canvas */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (onSendToCanvas) {
                                            const content = `# Strategic Goal ${index + 1}\n\n${goal}`;
                                            onSendToCanvas(content, `Strategic Goal ${index + 1}`);
                                          }
                                          setActiveGoalMenu(null);
                                        }}
                                        className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/10 to-violet-600/10 hover:from-purple-600/20 hover:to-violet-600/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 ease-out"
                                      >
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                          </div>
                                          <div className="flex-1 text-left">
                                            <div className="font-semibold text-white text-sm group-hover:text-purple-200 transition-colors">Send to Canvas</div>
                                            <div className="text-xs text-slate-400 group-hover:text-purple-300/80 transition-colors">Add to workspace</div>
                                          </div>
                                          <svg className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                          </svg>
                                        </div>
                                      </button>

                                      {/* Elegant Separator */}
                                      <div className="relative py-2">
                                        <div className="absolute inset-0 flex items-center">
                                          <div className="w-full border-t border-gradient-to-r from-transparent via-slate-600/40 to-transparent"></div>
                                        </div>
                                        <div className="relative flex justify-center">
                                          <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                                        </div>
                                      </div>

                                      {/* Copy Text */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigator.clipboard.writeText(goal);
                                          alert('Goal copied to clipboard!');
                                          setActiveGoalMenu(null);
                                        }}
                                        className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700/20 to-slate-600/20 hover:from-slate-600/30 hover:to-slate-500/30 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 ease-out"
                                      >
                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                          <div className="w-10 h-10 bg-gradient-to-br from-slate-600/20 to-slate-700/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                          </div>
                                          <div className="flex-1 text-left">
                                            <div className="font-semibold text-white text-sm group-hover:text-slate-200 transition-colors">Copy Text</div>
                                            <div className="text-xs text-slate-400 group-hover:text-slate-300/80 transition-colors">Copy to clipboard</div>
                                          </div>
                                          <svg className="w-4 h-4 text-slate-500 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                          </svg>
                                        </div>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Content Pillars */}
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
                      <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                              <Layers className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                Content Pillars
                              </h3>
                              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                {strategyPlan.contentPillars.length} strategic themes
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {strategyPlan.contentPillars.map((pillar, index) => (
                          <div
                            key={index}
                            className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] p-5 rounded-xl relative group hover:border-blue-300/40 transition-all duration-200"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                  <Lightbulb className="w-4 h-4 text-blue-600" />
                                </div>
                                <h5 className="font-bold text-[var(--text-primary)] text-lg">
                                  <SafeStrategyValue value={pillar.pillarName} />
                                </h5>
                              </div>

                              <div className="flex-shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActivePillarMenu(activePillarMenu === index ? null : index);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                                  title="Pillar actions"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {/* Premium 8-Figure Style Floating Menu */}
                                {activePillarMenu === index && (
                                  <div className="absolute right-0 top-full mt-3 w-64 bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98 backdrop-blur-2xl border border-slate-600/30 rounded-3xl shadow-2xl shadow-black/50 z-50 overflow-hidden ring-1 ring-white/5">
                                    {/* Menu Header */}
                                    <div className="px-4 py-3 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                        <span className="ml-2 text-xs font-medium text-slate-300">Pillar Actions</span>
                                      </div>
                                    </div>

                                    <div className="p-3 space-y-2">
                                      {/* Save to Content Pillars */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          saveContentPillar(pillar, index);
                                          setActivePillarMenu(null);
                                        }}
                                        disabled={!user || pillarActionStatus[index] === 'Saving...'}
                                        className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600/10 to-green-600/10 hover:from-emerald-600/20 hover:to-green-600/20 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                          </div>
                                          <div className="flex-1 text-left">
                                            <div className="font-semibold text-white text-sm group-hover:text-emerald-200 transition-colors">{pillarActionStatus[index] === 'Saving...' ? 'Saving...' : pillarActionStatus[index] === 'Saved!' ? 'Saved!' : 'Save Pillar'}</div>
                                            <div className="text-xs text-slate-400 group-hover:text-emerald-300/80 transition-colors">Add to Content Pillars tab</div>
                                          </div>
                                          <svg className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                          </svg>
                                        </div>
                                      </button>

                                      {/* Regenerate Pillar */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowRegenerateConfirm(index);
                                          setActivePillarMenu(null);
                                        }}
                                        disabled={regeneratingPillar === index || !canAfford(1)}
                                        className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            {regeneratingPillar === index ? (
                                              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                              </svg>
                                            )}
                                          </div>
                                          <div className="flex-1 text-left">
                                            <div className="font-semibold text-white text-sm group-hover:text-blue-200 transition-colors">{regeneratingPillar === index ? 'Regenerating...' : 'Regenerate'}</div>
                                            <div className="text-xs text-slate-400 group-hover:text-blue-300/80 transition-colors">1 credit • AI powered</div>
                                          </div>
                                          <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                          </svg>
                                        </div>
                                      </button>

                                      {/* Send to Canvas */}
                                      {onSendToCanvas && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            sendPillarToCanvas(pillar);
                                            setActivePillarMenu(null);
                                          }}
                                          className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/10 to-violet-600/10 hover:from-purple-600/20 hover:to-violet-600/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 ease-out"
                                        >
                                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                          <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                              </svg>
                                            </div>
                                            <div className="flex-1 text-left">
                                              <div className="font-semibold text-white text-sm group-hover:text-purple-200 transition-colors">Send to Canvas</div>
                                              <div className="text-xs text-slate-400 group-hover:text-purple-300/80 transition-colors">Add to workspace</div>
                                            </div>
                                            <svg className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                          </div>
                                        </button>
                                      )}

                                      {/* Elegant Separator */}
                                      <div className="relative py-2">
                                        <div className="absolute inset-0 flex items-center">
                                          <div className="w-full border-t border-gradient-to-r from-transparent via-slate-600/40 to-transparent"></div>
                                        </div>
                                        <div className="relative flex justify-center">
                                          <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                                        </div>
                                      </div>

                                      {/* Copy Text */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          copyContentPillar(pillar, index);
                                          setActivePillarMenu(null);
                                        }}
                                        disabled={pillarActionStatus[index] === 'Copying...'}
                                        className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700/20 to-slate-600/20 hover:from-slate-600/30 hover:to-slate-500/30 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                          <div className="w-10 h-10 bg-gradient-to-br from-slate-600/20 to-slate-700/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                          </div>
                                          <div className="flex-1 text-left">
                                            <div className="font-semibold text-white text-sm group-hover:text-slate-200 transition-colors">{pillarActionStatus[index] === 'Copying...' ? 'Copying...' : pillarActionStatus[index] === 'Copied!' ? 'Copied!' : 'Copy Text'}</div>
                                            <div className="text-xs text-slate-400 group-hover:text-slate-300/80 transition-colors">Copy to clipboard</div>
                                          </div>
                                          <svg className="w-4 h-4 text-slate-500 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                          </svg>
                                        </div>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Status indicator */}
                            {pillarActionStatus[index] && (
                              <div className="absolute top-2 left-2 px-2 py-1 bg-slate-800/80 text-xs rounded text-slate-200 border border-slate-600">
                                {pillarActionStatus[index]}
                              </div>
                            )}
                            <div className="mb-4">
                              <p className="text-[var(--text-primary)] leading-relaxed text-sm">
                                <SafeStrategyValue value={pillar.description} />
                              </p>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <Target className="w-3 h-3 text-blue-600" />
                                  <h6 className="font-semibold text-[var(--text-primary)] text-sm">
                                    Keywords
                                  </h6>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {pillar.keywords.map((keyword, kidx) => (
                                    <span
                                      key={kidx}
                                      className="px-2 py-1 bg-blue-500/10 text-blue-600 rounded-md text-xs border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                                    >
                                      <SafeStrategyValue value={keyword} />
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <Layers className="w-3 h-3 text-purple-600" />
                                  <h6 className="font-semibold text-[var(--text-primary)] text-sm">
                                    Content Types
                                  </h6>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {pillar.contentTypes.map((type, tidx) => (
                                    <span
                                      key={tidx}
                                      className="px-2 py-1 bg-purple-500/10 text-purple-600 rounded-md text-xs border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                                    >
                                      <SafeStrategyValue value={type} />
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="pt-3 border-t border-[var(--border-secondary)]">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="w-3 h-3 text-green-600" />
                                    <span className="text-xs font-semibold text-[var(--text-primary)]">Frequency:</span>
                                    <span className="text-xs text-[var(--text-secondary)]">
                                      <SafeStrategyValue value={pillar.postingFrequency} />
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Users className="w-3 h-3 text-emerald-600" />
                                    <span className="text-xs font-semibold text-[var(--text-primary)]">Engagement:</span>
                                    <span className="text-xs text-[var(--text-secondary)]">
                                      <SafeStrategyValue value={pillar.engagementStrategy} />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>


                    {/* Analytics & KPIs */}
                    {strategyPlan.analyticsAndKPIs && (
                      <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
                        <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-sm">
                          <div className="flex items-start justify-between mb-5">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                  Analytics & Performance
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                  KPIs and advanced metrics
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 hover:bg-[var(--surface-secondary)] rounded-lg transition-colors group">
                                <MoreVertical className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                  <BarChart3 className="w-4 h-4 text-white" />
                                </div>
                                <h5 className="font-semibold text-[var(--text-primary)]">
                                  Primary KPIs
                                </h5>
                              </div>
                              <div className="space-y-3">
                                {strategyPlan.analyticsAndKPIs.primaryMetrics.map(
                                  (metric, index) => (
                                    <div
                                      key={index}
                                      className="group/metric relative bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3 hover:border-blue-300/40 transition-all duration-200"
                                    >
                                      <div className="flex items-start justify-between">
                                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed pr-3">
                                          <SafeStrategyValue value={metric} />
                                        </p>

                                        <div className="flex-shrink-0">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setActivePrimaryMetricMenu(activePrimaryMetricMenu === index ? null : index);
                                            }}
                                            className="opacity-0 group-hover/metric:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                                            title="Metric actions"
                                          >
                                            <MoreVertical className="w-4 h-4" />
                                          </button>

                                          {/* Premium 8-Figure Style Floating Menu */}
                                          {activePrimaryMetricMenu === index && (
                                            <div className="absolute right-0 top-full mt-3 w-64 bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98 backdrop-blur-2xl border border-slate-600/30 rounded-3xl shadow-2xl shadow-black/50 z-50 overflow-hidden ring-1 ring-white/5">
                                              {/* Menu Header */}
                                              <div className="px-4 py-3 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
                                                <div className="flex items-center space-x-2">
                                                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                                  <span className="ml-2 text-xs font-medium text-slate-300">Analytics Actions</span>
                                                </div>
                                              </div>

                                              <div className="p-3 space-y-2">
                                                {/* Save to Analytics */}
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    saveAnalyticsMetric(metric, index, 'primary');
                                                    setActivePrimaryMetricMenu(null);
                                                  }}
                                                  className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600/10 to-green-600/10 hover:from-emerald-600/20 hover:to-green-600/20 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 ease-out"
                                                >
                                                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                  <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                      </svg>
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                      <div className="font-semibold text-white text-sm group-hover:text-emerald-200 transition-colors">
                                                        {analyticsActionStatus[`primary-${index}`] === 'Saving...' ? 'Saving...' : analyticsActionStatus[`primary-${index}`] === 'Saved!' ? 'Saved!' : 'Save Metric'}
                                                      </div>
                                                      <div className="text-xs text-slate-400 group-hover:text-emerald-300/80 transition-colors">Add to Analytics tab</div>
                                                    </div>
                                                    <svg className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                  </div>
                                                </button>

                                                {/* Regenerate Primary Metric */}
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    regeneratePrimaryMetric(index);
                                                    setActivePrimaryMetricMenu(null);
                                                  }}
                                                  disabled={regeneratingPrimaryMetric === index}
                                                  className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                  <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                      {regeneratingPrimaryMetric === index ? (
                                                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                                      ) : (
                                                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                      )}
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                      <div className="font-semibold text-white text-sm group-hover:text-blue-200 transition-colors">Regenerate</div>
                                                      <div className="text-xs text-slate-400 group-hover:text-blue-300/80 transition-colors">1 credit • Metric specific</div>
                                                    </div>
                                                    <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                  </div>
                                                </button>

                                                {/* Send to Canvas */}
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (onSendToCanvas) {
                                                      const content = `# Primary KPI ${index + 1}\n\n${metric}`;
                                                      onSendToCanvas(content, `Primary KPI ${index + 1}`);
                                                    }
                                                    setActivePrimaryMetricMenu(null);
                                                  }}
                                                  className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/10 to-violet-600/10 hover:from-purple-600/20 hover:to-violet-600/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 ease-out"
                                                >
                                                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                  <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                      </svg>
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                      <div className="font-semibold text-white text-sm group-hover:text-purple-200 transition-colors">Send to Canvas</div>
                                                      <div className="text-xs text-slate-400 group-hover:text-purple-300/80 transition-colors">Add to workspace</div>
                                                    </div>
                                                    <svg className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                  </div>
                                                </button>

                                                {/* Elegant Separator */}
                                                <div className="relative py-2">
                                                  <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-gradient-to-r from-transparent via-slate-600/40 to-transparent"></div>
                                                  </div>
                                                  <div className="relative flex justify-center">
                                                    <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                                                  </div>
                                                </div>

                                                {/* Copy Text */}
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(metric);
                                                    alert('Metric copied to clipboard!');
                                                    setActivePrimaryMetricMenu(null);
                                                  }}
                                                  className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700/20 to-slate-600/20 hover:from-slate-600/30 hover:to-slate-500/30 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 ease-out"
                                                >
                                                  <div className="absolute inset-0 bg-gradient-to-r from-slate-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                  <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-slate-600/20 to-slate-700/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                      <Clipboard className="w-5 h-5 text-slate-400" />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                      <div className="font-semibold text-white text-sm group-hover:text-slate-200 transition-colors">Copy Text</div>
                                                      <div className="text-xs text-slate-400 group-hover:text-slate-300/80 transition-colors">Copy to clipboard</div>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-300" />
                                                  </div>
                                                </button>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>

                          <div>
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                                  <TrendingUp className="w-4 h-4 text-white" />
                                </div>
                                <h5 className="font-semibold text-[var(--text-primary)]">
                                  Advanced Metrics
                                </h5>
                              </div>
                              <div className="space-y-3">
                              {strategyPlan.analyticsAndKPIs.advancedMetrics && Array.isArray(strategyPlan.analyticsAndKPIs.advancedMetrics)
                                ? strategyPlan.analyticsAndKPIs.advancedMetrics
                                    .slice(0, 4)
                                    .map((metric, index) => (
                                      <div
                                        key={index}
                                        className="group/metric relative bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3 hover:border-purple-300/40 transition-all duration-200"
                                      >
                                        <div className="flex items-start justify-between">
                                          <p className="text-[var(--text-secondary)] text-sm leading-relaxed pr-3">
                                            <SafeStrategyValue value={metric} />
                                          </p>

                                          <div className="flex-shrink-0">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveAdvancedMetricMenu(activeAdvancedMetricMenu === index ? null : index);
                                              }}
                                              className="opacity-0 group-hover/metric:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                                              title="Metric actions"
                                            >
                                              <MoreVertical className="w-4 h-4" />
                                            </button>

                                            {/* Premium 8-Figure Style Floating Menu */}
                                            {activeAdvancedMetricMenu === index && (
                                              <div className="absolute right-0 top-full mt-3 w-64 bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98 backdrop-blur-2xl border border-slate-600/30 rounded-3xl shadow-2xl shadow-black/50 z-50 overflow-hidden ring-1 ring-white/5">
                                                {/* Menu Header */}
                                                <div className="px-4 py-3 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
                                                  <div className="flex items-center space-x-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                                    <span className="ml-2 text-xs font-medium text-slate-300">Analytics Actions</span>
                                                  </div>
                                                </div>

                                                <div className="p-3 space-y-2">
                                                  {/* Save to Analytics */}
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      saveAnalyticsMetric(metric, index, 'advanced');
                                                      setActiveAdvancedMetricMenu(null);
                                                    }}
                                                    className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600/10 to-green-600/10 hover:from-emerald-600/20 hover:to-green-600/20 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 ease-out"
                                                  >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                      </div>
                                                      <div className="flex-1 text-left">
                                                        <div className="font-semibold text-white text-sm group-hover:text-emerald-200 transition-colors">
                                                        {analyticsActionStatus[`advanced-${index}`] === 'Saving...' ? 'Saving...' : analyticsActionStatus[`advanced-${index}`] === 'Saved!' ? 'Saved!' : 'Save Metric'}
                                                        </div>
                                                        <div className="text-xs text-slate-400 group-hover:text-emerald-300/80 transition-colors">Add to Analytics tab</div>
                                                      </div>
                                                      <svg className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                      </svg>
                                                    </div>
                                                  </button>

                                                  {/* Regenerate Advanced Metric */}
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      regenerateAdvancedMetric(index, `Advanced Metric ${index + 1}`, metric);
                                                      setActiveAdvancedMetricMenu(null);
                                                    }}
                                                    disabled={regeneratingAdvancedMetric === index}
                                                    className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                                                  >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                        {regeneratingAdvancedMetric === index ? (
                                                          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                          </svg>
                                                        )}
                                                      </div>
                                                      <div className="flex-1 text-left">
                                                        <div className="font-semibold text-white text-sm group-hover:text-blue-200 transition-colors">Regenerate</div>
                                                        <div className="text-xs text-slate-400 group-hover:text-blue-300/80 transition-colors">1 credit • Metric specific</div>
                                                      </div>
                                                      <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                      </svg>
                                                    </div>
                                                  </button>

                                                  {/* Send to Canvas */}
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      if (onSendToCanvas) {
                                                        const content = `# Advanced Metric ${index + 1}\n\n${metric}`;
                                                        onSendToCanvas(content, `Advanced Metric ${index + 1}`);
                                                      }
                                                      setActiveAdvancedMetricMenu(null);
                                                    }}
                                                    className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/10 to-violet-600/10 hover:from-purple-600/20 hover:to-violet-600/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 ease-out"
                                                  >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                      </div>
                                                      <div className="flex-1 text-left">
                                                        <div className="font-semibold text-white text-sm group-hover:text-purple-200 transition-colors">Send to Canvas</div>
                                                        <div className="text-xs text-slate-400 group-hover:text-purple-300/80 transition-colors">Add to workspace</div>
                                                      </div>
                                                      <svg className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                      </svg>
                                                    </div>
                                                  </button>

                                                  {/* Copy Text */}
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      navigator.clipboard.writeText(metric);
                                                      alert('Metric copied to clipboard!');
                                                      setActiveAdvancedMetricMenu(null);
                                                    }}
                                                    className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700/20 to-slate-600/20 hover:from-slate-600/30 hover:to-slate-500/30 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 ease-out"
                                                  >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                      <div className="w-10 h-10 bg-gradient-to-br from-slate-600/20 to-slate-700/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                        <Clipboard className="w-5 h-5 text-slate-400" />
                                                      </div>
                                                      <div className="flex-1 text-left">
                                                        <div className="font-semibold text-white text-sm group-hover:text-slate-200 transition-colors">Copy Text</div>
                                                        <div className="text-xs text-slate-400 group-hover:text-slate-300/80 transition-colors">Copy to clipboard</div>
                                                      </div>
                                                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-300" />
                                                    </div>
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                : strategyPlan.analyticsAndKPIs.advancedMetrics && typeof strategyPlan.analyticsAndKPIs.advancedMetrics === 'string'
                                ? (
                                    <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                        <SafeStrategyValue value={strategyPlan.analyticsAndKPIs.advancedMetrics} />
                                      </p>
                                    </div>
                                  )
                                : strategyPlan.analyticsAndKPIs.advancedMetrics && typeof strategyPlan.analyticsAndKPIs.advancedMetrics === 'object'
                                ? Object.entries(strategyPlan.analyticsAndKPIs.advancedMetrics as Record<string, any>)
                                    .slice(0, 4)
                                    .map(([key, value], index) => (
                                      <div
                                        key={index}
                                        className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3"
                                      >
                                        <h6 className="text-[var(--text-primary)] text-xs font-semibold mb-1 capitalize">
                                          {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </h6>
                                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                          <SafeStrategyValue value={value} />
                                        </p>
                                      </div>
                                    ))
                                : (
                                    // Default advanced metrics if none provided
                                    <div className="space-y-4">
                                      <div className="group/metric relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl opacity-50 group-hover/metric:opacity-75 transition-opacity blur-sm"></div>
                                        <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                                          <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                <TrendingUp className="w-4 h-4 text-white" />
                                              </div>
                                              <h6 className="text-[var(--text-primary)] text-sm font-semibold">Conversion Rate</h6>
                                            </div>

                                            <div className="flex-shrink-0">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setActiveAdvancedMetricMenu(activeAdvancedMetricMenu === 0 ? null : 0);
                                                }}
                                                className="opacity-0 group-hover/metric:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                                                title="Metric actions"
                                              >
                                                <MoreVertical className="w-4 h-4" />
                                              </button>

                                              {/* Premium 8-Figure Style Floating Menu */}
                                              {activeAdvancedMetricMenu === 0 && (
                                                <div className="absolute right-0 top-full mt-3 w-64 bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98 backdrop-blur-2xl border border-slate-600/30 rounded-3xl shadow-2xl shadow-black/50 z-50 overflow-hidden ring-1 ring-white/5">
                                                  {/* Menu Header */}
                                                  <div className="px-4 py-3 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
                                                    <div className="flex items-center space-x-2">
                                                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                      <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                                      <span className="ml-2 text-xs font-medium text-slate-300">Analytics Actions</span>
                                                    </div>
                                                  </div>

                                                  <div className="p-3 space-y-2">
                                                    {/* Save to Analytics */}
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        saveAnalyticsMetric('Track conversion from visitor to customer', 0, 'advanced', 'Conversion Rate');
                                                        setActiveAdvancedMetricMenu(null);
                                                      }}
                                                      className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600/10 to-green-600/10 hover:from-emerald-600/20 hover:to-green-600/20 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 ease-out"
                                                    >
                                                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                      <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                          </svg>
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                          <div className="font-semibold text-white text-sm group-hover:text-emerald-200 transition-colors">
                                                          {analyticsActionStatus[`advanced-0`] === 'Saving...' ? 'Saving...' : analyticsActionStatus[`advanced-0`] === 'Saved!' ? 'Saved!' : 'Save Metric'}
                                                          </div>
                                                          <div className="text-xs text-slate-400 group-hover:text-emerald-300/80 transition-colors">Add to Analytics tab</div>
                                                        </div>
                                                        <svg className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                      </div>
                                                    </button>

                                                    {/* Regenerate Conversion Rate */}
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        regenerateAdvancedMetric(0, 'Conversion Rate', 'Track conversion from visitor to customer');
                                                        setActiveAdvancedMetricMenu(null);
                                                      }}
                                                      disabled={regeneratingAdvancedMetric === 0}
                                                      className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                      <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                          {regeneratingAdvancedMetric === 0 ? (
                                                            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                                          ) : (
                                                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                            </svg>
                                                          )}
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                          <div className="font-semibold text-white text-sm group-hover:text-blue-200 transition-colors">Regenerate</div>
                                                          <div className="text-xs text-slate-400 group-hover:text-blue-300/80 transition-colors">1 credit • Metric specific</div>
                                                        </div>
                                                        <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                      </div>
                                                    </button>

                                                    {/* Send to Canvas */}
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onSendToCanvas) {
                                                          const content = `# Conversion Rate\n\nTrack conversion from visitor to customer`;
                                                          onSendToCanvas(content, 'Conversion Rate');
                                                        }
                                                        setActiveAdvancedMetricMenu(null);
                                                      }}
                                                      className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/10 to-violet-600/10 hover:from-purple-600/20 hover:to-violet-600/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 ease-out"
                                                    >
                                                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                      <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                          </svg>
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                          <div className="font-semibold text-white text-sm group-hover:text-purple-200 transition-colors">Send to Canvas</div>
                                                          <div className="text-xs text-slate-400 group-hover:text-purple-300/80 transition-colors">Add to workspace</div>
                                                        </div>
                                                        <svg className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                      </div>
                                                    </button>

                                                    {/* Copy Text */}
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigator.clipboard.writeText('Conversion Rate: Track conversion from visitor to customer');
                                                        alert('Metric copied to clipboard!');
                                                        setActiveAdvancedMetricMenu(null);
                                                      }}
                                                      className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700/20 to-slate-600/20 hover:from-slate-600/30 hover:to-slate-500/30 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 ease-out"
                                                    >
                                                      <div className="absolute inset-0 bg-gradient-to-r from-slate-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                      <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-slate-600/20 to-slate-700/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                          <Clipboard className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                          <div className="font-semibold text-white text-sm group-hover:text-slate-200 transition-colors">Copy Text</div>
                                                          <div className="text-xs text-slate-400 group-hover:text-slate-300/80 transition-colors">Copy to clipboard</div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-300" />
                                                      </div>
                                                    </button>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">Track conversion from visitor to customer</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="group/metric relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl opacity-50 group-hover/metric:opacity-75 transition-opacity blur-sm"></div>
                                        <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                                          <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                <Users className="w-4 h-4 text-white" />
                                              </div>
                                              <h6 className="text-[var(--text-primary)] text-sm font-semibold">Customer Lifetime Value</h6>
                                            </div>

                                            <div className="flex-shrink-0">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setActiveAdvancedMetricMenu(activeAdvancedMetricMenu === 1 ? null : 1);
                                                }}
                                                className="opacity-0 group-hover/metric:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                                                title="Metric actions"
                                              >
                                                <MoreVertical className="w-4 h-4" />
                                              </button>

                                              {/* Premium 8-Figure Style Floating Menu */}
                                              {activeAdvancedMetricMenu === 1 && (
                                                <div className="absolute right-0 top-full mt-3 w-64 bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98 backdrop-blur-2xl border border-slate-600/30 rounded-3xl shadow-2xl shadow-black/50 z-50 overflow-hidden ring-1 ring-white/5">
                                                  {/* Menu Header */}
                                                  <div className="px-4 py-3 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
                                                    <div className="flex items-center space-x-2">
                                                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                      <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                                      <span className="ml-2 text-xs font-medium text-slate-300">Analytics Actions</span>
                                                    </div>
                                                  </div>

                                                  <div className="p-3 space-y-2">
                                                    {/* Save to Analytics */}
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        saveAnalyticsMetric('Monitor long-term customer value', 1, 'advanced', 'Customer Lifetime Value');
                                                        setActiveAdvancedMetricMenu(null);
                                                      }}
                                                      className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600/10 to-green-600/10 hover:from-emerald-600/20 hover:to-green-600/20 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 ease-out"
                                                    >
                                                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                      <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                          </svg>
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                          <div className="font-semibold text-white text-sm group-hover:text-emerald-200 transition-colors">
                                                            {analyticsActionStatus[`advanced-1`] === 'Saving...' ? 'Saving...' : analyticsActionStatus[`advanced-1`] === 'Saved!' ? 'Saved!' : 'Save Metric'}
                                                          </div>
                                                          <div className="text-xs text-slate-400 group-hover:text-emerald-300/80 transition-colors">Add to Analytics tab</div>
                                                        </div>
                                                        <svg className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                      </div>
                                                    </button>

                                                    {/* Send to Canvas */}
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onSendToCanvas) {
                                                          const content = `# Customer Lifetime Value\n\nMonitor long-term customer value`;
                                                          onSendToCanvas(content, 'Customer Lifetime Value');
                                                        }
                                                        setActiveAdvancedMetricMenu(null);
                                                      }}
                                                      className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/10 to-violet-600/10 hover:from-purple-600/20 hover:to-violet-600/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 ease-out"
                                                    >
                                                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                      <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                          </svg>
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                          <div className="font-semibold text-white text-sm group-hover:text-purple-200 transition-colors">Send to Canvas</div>
                                                          <div className="text-xs text-slate-400 group-hover:text-purple-300/80 transition-colors">Add to workspace</div>
                                                        </div>
                                                        <svg className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                      </div>
                                                    </button>

                                                    {/* Copy Text */}
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigator.clipboard.writeText('Customer Lifetime Value: Monitor long-term customer value');
                                                        alert('Metric copied to clipboard!');
                                                        setActiveAdvancedMetricMenu(null);
                                                      }}
                                                      className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700/20 to-slate-600/20 hover:from-slate-600/30 hover:to-slate-500/30 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 ease-out"
                                                    >
                                                      <div className="absolute inset-0 bg-gradient-to-r from-slate-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                      <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-slate-600/20 to-slate-700/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                          <Clipboard className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                          <div className="font-semibold text-white text-sm group-hover:text-slate-200 transition-colors">Copy Text</div>
                                                          <div className="text-xs text-slate-400 group-hover:text-slate-300/80 transition-colors">Copy to clipboard</div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-300" />
                                                      </div>
                                                    </button>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">Monitor long-term customer value</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="group/metric relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl opacity-50 group-hover/metric:opacity-75 transition-opacity blur-sm"></div>
                                        <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                                          <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                <BarChart3 className="w-4 h-4 text-white" />
                                              </div>
                                              <h6 className="text-[var(--text-primary)] text-sm font-semibold">Return on Ad Spend</h6>
                                            </div>

                                            <div className="flex-shrink-0">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setActiveAdvancedMetricMenu(activeAdvancedMetricMenu === 2 ? null : 2);
                                                }}
                                                className="opacity-0 group-hover/metric:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                                                title="Metric actions"
                                              >
                                                <MoreVertical className="w-4 h-4" />
                                              </button>

                                              {/* Premium 8-Figure Style Floating Menu */}
                                              {activeAdvancedMetricMenu === 2 && (
                                                <div className="absolute right-0 top-full mt-3 w-64 bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98 backdrop-blur-2xl border border-slate-600/30 rounded-3xl shadow-2xl shadow-black/50 z-50 overflow-hidden ring-1 ring-white/5">
                                                  {/* Menu Header */}
                                                  <div className="px-4 py-3 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
                                                    <div className="flex items-center space-x-2">
                                                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                      <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                                      <span className="ml-2 text-xs font-medium text-slate-300">Analytics Actions</span>
                                                    </div>
                                                  </div>

                                                  <div className="p-3 space-y-2">
                                                    {/* Save to Analytics */}
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        saveAnalyticsMetric('Measure advertising effectiveness', 2, 'advanced', 'Return on Ad Spend');
                                                        setActiveAdvancedMetricMenu(null);
                                                      }}
                                                      className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600/10 to-green-600/10 hover:from-emerald-600/20 hover:to-green-600/20 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 ease-out"
                                                    >
                                                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                      <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                          </svg>
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                          <div className="font-semibold text-white text-sm group-hover:text-emerald-200 transition-colors">
                                                            {analyticsActionStatus[`advanced-2`] === 'Saving...' ? 'Saving...' : analyticsActionStatus[`advanced-2`] === 'Saved!' ? 'Saved!' : 'Save Metric'}
                                                          </div>
                                                          <div className="text-xs text-slate-400 group-hover:text-emerald-300/80 transition-colors">Add to Analytics tab</div>
                                                        </div>
                                                        <svg className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                      </div>
                                                    </button>

                                                    {/* Send to Canvas */}
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onSendToCanvas) {
                                                          const content = `# Return on Ad Spend\n\nMeasure advertising effectiveness`;
                                                          onSendToCanvas(content, 'Return on Ad Spend');
                                                        }
                                                        setActiveAdvancedMetricMenu(null);
                                                      }}
                                                      className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/10 to-violet-600/10 hover:from-purple-600/20 hover:to-violet-600/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 ease-out"
                                                    >
                                                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                      <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                          </svg>
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                          <div className="font-semibold text-white text-sm group-hover:text-purple-200 transition-colors">Send to Canvas</div>
                                                          <div className="text-xs text-slate-400 group-hover:text-purple-300/80 transition-colors">Add to workspace</div>
                                                        </div>
                                                        <svg className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                      </div>
                                                    </button>

                                                    {/* Copy Text */}
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigator.clipboard.writeText('Return on Ad Spend: Measure advertising effectiveness');
                                                        alert('Metric copied to clipboard!');
                                                        setActiveAdvancedMetricMenu(null);
                                                      }}
                                                      className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700/20 to-slate-600/20 hover:from-slate-600/30 hover:to-slate-500/30 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 ease-out"
                                                    >
                                                      <div className="absolute inset-0 bg-gradient-to-r from-slate-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                      <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-slate-600/20 to-slate-700/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                          <Clipboard className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                          <div className="font-semibold text-white text-sm group-hover:text-slate-200 transition-colors">Copy Text</div>
                                                          <div className="text-xs text-slate-400 group-hover:text-slate-300/80 transition-colors">Copy to clipboard</div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-300" />
                                                      </div>
                                                    </button>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">Measure advertising effectiveness</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="group/metric relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl opacity-50 group-hover/metric:opacity-75 transition-opacity blur-sm"></div>
                                        <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                                          <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                <Target className="w-4 h-4 text-white" />
                                              </div>
                                              <h6 className="text-[var(--text-primary)] text-sm font-semibold">Content Performance Index</h6>
                                            </div>

                                            <div className="flex-shrink-0">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setActiveAdvancedMetricMenu(activeAdvancedMetricMenu === 3 ? null : 3);
                                                }}
                                                className="opacity-0 group-hover/metric:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                                                title="Metric actions"
                                              >
                                                <MoreVertical className="w-4 h-4" />
                                              </button>

                                              {/* Premium 8-Figure Style Floating Menu */}
                                              {activeAdvancedMetricMenu === 3 && (
                                                <div className="absolute right-0 top-full mt-3 w-64 bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98 backdrop-blur-2xl border border-slate-600/30 rounded-3xl shadow-2xl shadow-black/50 z-50 overflow-hidden ring-1 ring-white/5">
                                                  {/* Menu Header */}
                                                  <div className="px-4 py-3 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
                                                    <div className="flex items-center space-x-2">
                                                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                      <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                                      <span className="ml-2 text-xs font-medium text-slate-300">Analytics Actions</span>
                                                    </div>
                                                  </div>

                                                  <div className="p-3 space-y-2">
                                                    {/* Save to Analytics */}
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        saveAnalyticsMetric('Evaluate content effectiveness across platforms', 3, 'advanced', 'Content Performance Index');
                                                        setActiveAdvancedMetricMenu(null);
                                                      }}
                                                      className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600/10 to-green-600/10 hover:from-emerald-600/20 hover:to-green-600/20 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 ease-out"
                                                    >
                                                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                      <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                          </svg>
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                          <div className="font-semibold text-white text-sm group-hover:text-emerald-200 transition-colors">
                                                            {analyticsActionStatus[`advanced-3`] === 'Saving...' ? 'Saving...' : analyticsActionStatus[`advanced-3`] === 'Saved!' ? 'Saved!' : 'Save Metric'}
                                                          </div>
                                                          <div className="text-xs text-slate-400 group-hover:text-emerald-300/80 transition-colors">Add to Analytics tab</div>
                                                        </div>
                                                        <svg className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                      </div>
                                                    </button>

                                                    {/* Send to Canvas */}
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onSendToCanvas) {
                                                          const content = `# Content Performance Index\n\nEvaluate content effectiveness across platforms`;
                                                          onSendToCanvas(content, 'Content Performance Index');
                                                        }
                                                        setActiveAdvancedMetricMenu(null);
                                                      }}
                                                      className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/10 to-violet-600/10 hover:from-purple-600/20 hover:to-violet-600/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 ease-out"
                                                    >
                                                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                      <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                          </svg>
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                          <div className="font-semibold text-white text-sm group-hover:text-purple-200 transition-colors">Send to Canvas</div>
                                                          <div className="text-xs text-slate-400 group-hover:text-purple-300/80 transition-colors">Add to workspace</div>
                                                        </div>
                                                        <svg className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                      </div>
                                                    </button>

                                                    {/* Copy Text */}
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigator.clipboard.writeText('Content Performance Index: Evaluate content effectiveness across platforms');
                                                        alert('Metric copied to clipboard!');
                                                        setActiveAdvancedMetricMenu(null);
                                                      }}
                                                      className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700/20 to-slate-600/20 hover:from-slate-600/30 hover:to-slate-500/30 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 ease-out"
                                                    >
                                                      <div className="absolute inset-0 bg-gradient-to-r from-slate-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                      <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-slate-600/20 to-slate-700/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                          <Clipboard className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                          <div className="font-semibold text-white text-sm group-hover:text-slate-200 transition-colors">Copy Text</div>
                                                          <div className="text-xs text-slate-400 group-hover:text-slate-300/80 transition-colors">Copy to clipboard</div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-300" />
                                                      </div>
                                                    </button>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">Evaluate content effectiveness across platforms</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Monetization Strategy */}
                    {strategyPlan.monetizationStrategy && (
                      <div className="bg-gradient-to-br from-yellow-900/30 to-green-900/30 p-6 rounded-xl border border-yellow-500/50">
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-500 to-green-600 rounded-lg flex items-center justify-center">
                              <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                Monetization Strategy
                              </h3>
                              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                Revenue generation & growth
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 hover:bg-[var(--surface-secondary)] rounded-lg transition-colors group">
                              <MoreVertical className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-white" />
                              </div>
                              <h5 className="font-semibold text-[var(--text-primary)]">
                                Revenue Streams
                              </h5>
                            </div>
                            <div className="space-y-3">
                              {strategyPlan.monetizationStrategy?.revenueStreams && Array.isArray(strategyPlan.monetizationStrategy.revenueStreams)
                                ? strategyPlan.monetizationStrategy.revenueStreams.map(
                                    (stream, index) => (
                                      <div
                                        key={index}
                                        className="group/revenue relative"
                                      >
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl opacity-50 group-hover/revenue:opacity-75 transition-opacity blur-sm"></div>
                                        <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                                          <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-3 flex-1">
                                              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                                <TrendingUp className="w-3 h-3 text-white" />
                                              </div>
                                              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                                {stream}
                                              </p>
                                            </div>

                                            <div className="flex-shrink-0">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setActiveMonetizationMenu(activeMonetizationMenu === `revenue-${index}` ? null : `revenue-${index}`);
                                                }}
                                                className="opacity-0 group-hover/revenue:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                                                title="Revenue stream actions"
                                              >
                                                <MoreVertical className="w-4 h-4" />
                                              </button>

                                              {/* Premium 8-Figure Style Floating Menu */}
                                              {activeMonetizationMenu === `revenue-${index}` && (
                                                <div className="absolute right-0 top-full mt-3 w-64 bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98 backdrop-blur-2xl border border-slate-600/30 rounded-3xl shadow-2xl shadow-black/50 z-50 overflow-hidden ring-1 ring-white/5">
                                                  {/* Menu Header */}
                                                  <div className="px-4 py-3 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
                                                    <div className="flex items-center space-x-2">
                                                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                      <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                                      <span className="ml-2 text-xs font-medium text-slate-300">Revenue Stream Actions</span>
                                                    </div>
                                                  </div>

                                                  <div className="p-3 space-y-2">
                                                    {/* Save to Revenue Streams */}
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        saveMonetizationItem(stream, 'revenue-stream', `Revenue Stream ${index + 1}`, index);
                                                        setActiveMonetizationMenu(null);
                                                      }}
                                                      className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600/10 to-green-600/10 hover:from-emerald-600/20 hover:to-green-600/20 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 ease-out"
                                                    >
                                                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                      <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                          </svg>
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                          <div className="font-semibold text-white text-sm group-hover:text-emerald-200 transition-colors">
                                                            {monetizationActionStatus[`revenue-stream-${index}`] === 'Saving...' ? 'Saving...' : monetizationActionStatus[`revenue-stream-${index}`] === 'Saved!' ? 'Saved!' : 'Save Revenue Stream'}
                                                          </div>
                                                          <div className="text-xs text-slate-400 group-hover:text-emerald-300/80 transition-colors">Add to Revenue Streams tab</div>
                                                        </div>
                                                        <svg className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                      </div>
                                                    </button>

                                                    {/* Send to Canvas */}
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onSendToCanvas) {
                                                          const content = `# Revenue Stream ${index + 1}\n\n${stream}`;
                                                          onSendToCanvas(content, `Revenue Stream ${index + 1}`);
                                                        }
                                                        setActiveMonetizationMenu(null);
                                                      }}
                                                      className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/10 to-violet-600/10 hover:from-purple-600/20 hover:to-violet-600/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 ease-out"
                                                    >
                                                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                      <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                          </svg>
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                          <div className="font-semibold text-white text-sm group-hover:text-purple-200 transition-colors">Send to Canvas</div>
                                                          <div className="text-xs text-slate-400 group-hover:text-purple-300/80 transition-colors">Add to workspace</div>
                                                        </div>
                                                        <svg className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                      </div>
                                                    </button>

                                                    {/* Regenerate Revenue Stream */}
                                                    <button
                                                      onClick={async (e) => {
                                                        e.stopPropagation();
                                                        setMonetizationActionStatus(prev => ({ ...prev, [`revenue-stream-regenerate-${index}`]: 'Regenerating...' }));
                                                        try {
                                                          const strategyConfig = {
                                                            niche: 'Content Creation & Marketing',
                                                            targetAudience: 'Content creators and digital marketers',
                                                            platforms: ['YouTube', 'TikTok', 'Instagram'],
                                                            timeframe: '6-12 months',
                                                            budget: 'Medium'
                                                          };
                                                          const regeneratedStream = await monetizationRegenerationService.regenerateRevenueStream(
                                                            strategyPlan,
                                                            stream,
                                                            index,
                                                            strategyConfig
                                                          );

                                                          // Update the strategy plan with regenerated content
                                                          const updatedStreams = [...(strategyPlan.monetizationStrategy?.revenueStreams as string[] || [])];
                                                          updatedStreams[index] = regeneratedStream;

                                                          // Trigger refresh event
                                                          window.dispatchEvent(new CustomEvent('strategyContentUpdate', {
                                                            detail: {
                                                              type: 'revenue-stream-regenerated',
                                                              index,
                                                              content: regeneratedStream
                                                            }
                                                          }));

                                                          setMonetizationActionStatus(prev => ({ ...prev, [`revenue-stream-regenerate-${index}`]: 'Regenerated!' }));
                                                          setTimeout(() => {
                                                            setMonetizationActionStatus(prev => ({ ...prev, [`revenue-stream-regenerate-${index}`]: '' }));
                                                          }, 2000);
                                                        } catch (error) {
                                                          console.error('Failed to regenerate revenue stream:', error);
                                                          setMonetizationActionStatus(prev => ({ ...prev, [`revenue-stream-regenerate-${index}`]: 'Failed' }));
                                                          setTimeout(() => {
                                                            setMonetizationActionStatus(prev => ({ ...prev, [`revenue-stream-regenerate-${index}`]: '' }));
                                                          }, 2000);
                                                        }
                                                        setActiveMonetizationMenu(null);
                                                      }}
                                                      className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 ease-out"
                                                    >
                                                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                      <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                          <RefreshCw className={`w-5 h-5 text-blue-400 ${monetizationActionStatus[`revenue-stream-regenerate-${index}`] === 'Regenerating...' ? 'animate-spin' : ''}`} />
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                          <div className="font-semibold text-white text-sm group-hover:text-blue-200 transition-colors">
                                                            {monetizationActionStatus[`revenue-stream-regenerate-${index}`] === 'Regenerating...' ? 'Regenerating...' :
                                                             monetizationActionStatus[`revenue-stream-regenerate-${index}`] === 'Regenerated!' ? 'Regenerated!' :
                                                             monetizationActionStatus[`revenue-stream-regenerate-${index}`] === 'Failed' ? 'Failed' : 'Regenerate with AI'}
                                                          </div>
                                                          <div className="text-xs text-slate-400 group-hover:text-blue-300/80 transition-colors">Generate new content</div>
                                                        </div>
                                                        <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                      </div>
                                                    </button>

                                                    {/* Copy Text */}
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigator.clipboard.writeText(stream);
                                                        alert('Revenue stream copied to clipboard!');
                                                        setActiveMonetizationMenu(null);
                                                      }}
                                                      className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700/20 to-slate-600/20 hover:from-slate-600/30 hover:to-slate-500/30 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 ease-out"
                                                    >
                                                      <div className="absolute inset-0 bg-gradient-to-r from-slate-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                      <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-slate-600/20 to-slate-700/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                          <Clipboard className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                          <div className="font-semibold text-white text-sm group-hover:text-slate-200 transition-colors">Copy Text</div>
                                                          <div className="text-xs text-slate-400 group-hover:text-slate-300/80 transition-colors">Copy to clipboard</div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-300" />
                                                      </div>
                                                    </button>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ),
                                  )
                                : strategyPlan.monetizationStrategy?.revenueStreams && typeof strategyPlan.monetizationStrategy.revenueStreams === 'string'
                                ? (
                                    <div className="bg-slate-800/50 p-4 rounded-lg border border-green-500/30">
                                      <p className="text-slate-300 leading-relaxed">
                                        <SafeStrategyValue value={strategyPlan.monetizationStrategy.revenueStreams} />
                                      </p>
                                    </div>
                                  )
                                : strategyPlan.monetizationStrategy?.revenueStreams && typeof strategyPlan.monetizationStrategy.revenueStreams === 'object'
                                ? Object.entries(strategyPlan.monetizationStrategy.revenueStreams as Record<string, any>).map(
                                    ([key, value], index) => (
                                      <div
                                        key={index}
                                        className="bg-slate-800/50 p-4 rounded-lg border border-green-500/30"
                                      >
                                        <h6 className="text-green-400 text-sm font-semibold mb-2 capitalize">
                                          {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </h6>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                          <SafeStrategyValue value={value} />
                                        </p>
                                      </div>
                                    ),
                                  )
                                : strategyPlan.monetizationStrategy
                                ? (
                                    // Generate default revenue streams if we have monetization strategy but no specific streams
                                    <div className="space-y-3">
                                      <div className="bg-slate-800/50 p-4 rounded-lg border border-green-500/30">
                                        <h6 className="text-green-400 text-sm font-semibold mb-2">Primary Revenue</h6>
                                        <p className="text-slate-300 text-sm">
                                          Core monetization through direct sales and services
                                        </p>
                                      </div>
                                      <div className="bg-slate-800/50 p-4 rounded-lg border border-green-500/30">
                                        <h6 className="text-green-400 text-sm font-semibold mb-2">Affiliate Marketing</h6>
                                        <p className="text-slate-300 text-sm">
                                          Commission-based revenue from strategic partnerships
                                        </p>
                                      </div>
                                      <div className="bg-slate-800/50 p-4 rounded-lg border border-green-500/30">
                                        <h6 className="text-green-400 text-sm font-semibold mb-2">Content Monetization</h6>
                                        <p className="text-slate-300 text-sm">
                                          Revenue from premium content and exclusive access
                                        </p>
                                      </div>
                                    </div>
                                  )
                                : (
                                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                      <p className="text-slate-400 text-sm">Revenue streams not available</p>
                                    </div>
                                  )}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="group/pricing relative">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl opacity-50 group-hover/pricing:opacity-75 transition-opacity blur-sm"></div>
                              <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                                      <BarChart3 className="w-4 h-4 text-white" />
                                    </div>
                                    <h6 className="font-semibold text-[var(--text-primary)]">
                                      Pricing Strategy
                                    </h6>
                                  </div>

                                  <div className="flex-shrink-0">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMonetizationMenu(activeMonetizationMenu === 'pricing-strategy' ? null : 'pricing-strategy');
                                      }}
                                      className="opacity-0 group-hover/pricing:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                                      title="Pricing strategy actions"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>

                                    {/* Premium 8-Figure Style Floating Menu */}
                                    {activeMonetizationMenu === 'pricing-strategy' && (
                                      <div className="absolute right-0 top-full mt-3 w-64 bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98 backdrop-blur-2xl border border-slate-600/30 rounded-3xl shadow-2xl shadow-black/50 z-50 overflow-hidden ring-1 ring-white/5">
                                        {/* Menu Header */}
                                        <div className="px-4 py-3 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
                                          <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                            <span className="ml-2 text-xs font-medium text-slate-300">Pricing Strategy Actions</span>
                                          </div>
                                        </div>

                                        <div className="p-3 space-y-2">
                                          {/* Save to Pricing Strategy */}
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const pricingStrategy = strategyPlan.monetizationStrategy?.pricingStrategy || "Pricing strategy not specified";
                                              saveMonetizationItem(pricingStrategy, 'pricing-strategy', 'Pricing Strategy', 0);
                                              setActiveMonetizationMenu(null);
                                            }}
                                            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-600/10 to-orange-600/10 hover:from-yellow-600/20 hover:to-orange-600/20 border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300 ease-out"
                                          >
                                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                              </div>
                                              <div className="flex-1 text-left">
                                                <div className="font-semibold text-white text-sm group-hover:text-yellow-200 transition-colors">
                                                  {monetizationActionStatus['pricing-strategy-0'] === 'Saving...' ? 'Saving...' : monetizationActionStatus['pricing-strategy-0'] === 'Saved!' ? 'Saved!' : 'Save Pricing Strategy'}
                                                </div>
                                                <div className="text-xs text-slate-400 group-hover:text-yellow-300/80 transition-colors">Add to Monetization tab</div>
                                              </div>
                                              <svg className="w-4 h-4 text-slate-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                              </svg>
                                            </div>
                                          </button>

                                          {/* Regenerate Pricing Strategy */}
                                          <button
                                            onClick={async (e) => {
                                              e.stopPropagation();
                                              setMonetizationActionStatus(prev => ({ ...prev, 'pricing-strategy-regenerate': 'Regenerating...' }));
                                              try {
                                                const strategyConfig = {
                                                  niche: 'Content Creation & Marketing',
                                                  targetAudience: 'Content creators and digital marketers',
                                                  platforms: ['YouTube', 'TikTok', 'Instagram'],
                                                  timeframe: '6-12 months',
                                                  budget: 'Medium'
                                                };
                                                const regeneratedStrategy = await monetizationRegenerationService.regeneratePricingStrategy(
                                                  strategyPlan,
                                                  strategyPlan.monetizationStrategy?.pricingStrategy || "Pricing strategy not specified",
                                                  strategyConfig
                                                );

                                                // Update the strategy plan with regenerated content
                                                if (strategyPlan.monetizationStrategy) {
                                                  strategyPlan.monetizationStrategy.pricingStrategy = regeneratedStrategy;
                                                }

                                                // Trigger refresh event
                                                window.dispatchEvent(new CustomEvent('strategyContentUpdate', {
                                                  detail: {
                                                    type: 'pricing-strategy-regenerated',
                                                    content: regeneratedStrategy
                                                  }
                                                }));

                                                setMonetizationActionStatus(prev => ({ ...prev, 'pricing-strategy-regenerate': 'Regenerated!' }));
                                                setTimeout(() => {
                                                  setMonetizationActionStatus(prev => ({ ...prev, 'pricing-strategy-regenerate': '' }));
                                                }, 2000);
                                              } catch (error) {
                                                console.error('Failed to regenerate pricing strategy:', error);
                                                setMonetizationActionStatus(prev => ({ ...prev, 'pricing-strategy-regenerate': 'Failed' }));
                                                setTimeout(() => {
                                                  setMonetizationActionStatus(prev => ({ ...prev, 'pricing-strategy-regenerate': '' }));
                                                }, 2000);
                                              }
                                              setActiveMonetizationMenu(null);
                                            }}
                                            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 ease-out"
                                          >
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <RefreshCw className={`w-5 h-5 text-blue-400 ${monetizationActionStatus['pricing-strategy-regenerate'] === 'Regenerating...' ? 'animate-spin' : ''}`} />
                                              </div>
                                              <div className="flex-1 text-left">
                                                <div className="font-semibold text-white text-sm group-hover:text-blue-200 transition-colors">
                                                  {monetizationActionStatus['pricing-strategy-regenerate'] === 'Regenerating...' ? 'Regenerating...' :
                                                   monetizationActionStatus['pricing-strategy-regenerate'] === 'Regenerated!' ? 'Regenerated!' :
                                                   monetizationActionStatus['pricing-strategy-regenerate'] === 'Failed' ? 'Failed' : 'Regenerate with AI'}
                                                </div>
                                                <div className="text-xs text-slate-400 group-hover:text-blue-300/80 transition-colors">Generate new content</div>
                                              </div>
                                              <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                              </svg>
                                            </div>
                                          </button>

                                          {/* Send to Canvas */}
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (onSendToCanvas) {
                                                const content = `# Pricing Strategy\n\n${strategyPlan.monetizationStrategy?.pricingStrategy || "Pricing strategy not specified"}`;
                                                onSendToCanvas(content, 'Pricing Strategy');
                                              }
                                              setActiveMonetizationMenu(null);
                                            }}
                                            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/10 to-violet-600/10 hover:from-purple-600/20 hover:to-violet-600/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 ease-out"
                                          >
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                              </div>
                                              <div className="flex-1 text-left">
                                                <div className="font-semibold text-white text-sm group-hover:text-purple-200 transition-colors">Send to Canvas</div>
                                                <div className="text-xs text-slate-400 group-hover:text-purple-300/80 transition-colors">Add to workspace</div>
                                              </div>
                                              <svg className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                              </svg>
                                            </div>
                                          </button>

                                          {/* Copy Text */}
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              navigator.clipboard.writeText(strategyPlan.monetizationStrategy?.pricingStrategy || "Pricing strategy not specified");
                                              alert('Pricing strategy copied to clipboard!');
                                              setActiveMonetizationMenu(null);
                                            }}
                                            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700/20 to-slate-600/20 hover:from-slate-600/30 hover:to-slate-500/30 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 ease-out"
                                          >
                                            <div className="absolute inset-0 bg-gradient-to-r from-slate-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                              <div className="w-10 h-10 bg-gradient-to-br from-slate-600/20 to-slate-700/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Clipboard className="w-5 h-5 text-slate-400" />
                                              </div>
                                              <div className="flex-1 text-left">
                                                <div className="font-semibold text-white text-sm group-hover:text-slate-200 transition-colors">Copy Text</div>
                                                <div className="text-xs text-slate-400 group-hover:text-slate-300/80 transition-colors">Copy to clipboard</div>
                                              </div>
                                              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-300" />
                                            </div>
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                    <SafeStrategyValue value={strategyPlan.monetizationStrategy?.pricingStrategy || "Pricing strategy not specified"} />
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="group/conversion relative">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-50 group-hover/conversion:opacity-75 transition-opacity blur-sm"></div>
                              <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                      <Target className="w-4 h-4 text-white" />
                                    </div>
                                    <h6 className="font-semibold text-[var(--text-primary)]">
                                      Conversion Funnel
                                    </h6>
                                  </div>

                                  <div className="flex-shrink-0">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMonetizationMenu(activeMonetizationMenu === 'conversion-funnel' ? null : 'conversion-funnel');
                                      }}
                                      className="opacity-0 group-hover/conversion:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                                      title="Conversion funnel actions"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>

                                    {/* Premium 8-Figure Style Floating Menu */}
                                    {activeMonetizationMenu === 'conversion-funnel' && (
                                      <div className="absolute right-0 top-full mt-3 w-64 bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98 backdrop-blur-2xl border border-slate-600/30 rounded-3xl shadow-2xl shadow-black/50 z-50 overflow-hidden ring-1 ring-white/5">
                                        {/* Menu Header */}
                                        <div className="px-4 py-3 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
                                          <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                            <span className="ml-2 text-xs font-medium text-slate-300">Conversion Funnel Actions</span>
                                          </div>
                                        </div>

                                        <div className="p-3 space-y-2">
                                          {/* Save to Conversion Funnel */}
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const conversionFunnel = strategyPlan.monetizationStrategy?.conversionFunnels || "Conversion funnel not specified";
                                              saveMonetizationItem(conversionFunnel, 'conversion-funnel', 'Conversion Funnel', 0);
                                              setActiveMonetizationMenu(null);
                                            }}
                                            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/10 to-pink-600/10 hover:from-purple-600/20 hover:to-pink-600/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 ease-out"
                                          >
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                              </div>
                                              <div className="flex-1 text-left">
                                                <div className="font-semibold text-white text-sm group-hover:text-purple-200 transition-colors">
                                                  {monetizationActionStatus['conversion-funnel-0'] === 'Saving...' ? 'Saving...' : monetizationActionStatus['conversion-funnel-0'] === 'Saved!' ? 'Saved!' : 'Save Conversion Funnel'}
                                                </div>
                                                <div className="text-xs text-slate-400 group-hover:text-purple-300/80 transition-colors">Add to Monetization tab</div>
                                              </div>
                                              <svg className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                              </svg>
                                            </div>
                                          </button>

                                          {/* Regenerate Conversion Funnel */}
                                          <button
                                            onClick={async (e) => {
                                              e.stopPropagation();
                                              setMonetizationActionStatus(prev => ({ ...prev, 'conversion-funnel-regenerate': 'Regenerating...' }));
                                              try {
                                                const strategyConfig = {
                                                  niche: 'Content Creation & Marketing',
                                                  targetAudience: 'Content creators and digital marketers',
                                                  platforms: ['YouTube', 'TikTok', 'Instagram'],
                                                  timeframe: '6-12 months',
                                                  budget: 'Medium'
                                                };
                                                const regeneratedFunnel = await monetizationRegenerationService.regenerateConversionFunnel(
                                                  strategyPlan,
                                                  strategyPlan.monetizationStrategy?.conversionFunnels || "Conversion funnel not specified",
                                                  strategyConfig
                                                );

                                                // Update the strategy plan with regenerated content
                                                if (strategyPlan.monetizationStrategy) {
                                                  strategyPlan.monetizationStrategy.conversionFunnels = regeneratedFunnel;
                                                }

                                                // Trigger refresh event
                                                window.dispatchEvent(new CustomEvent('strategyContentUpdate', {
                                                  detail: {
                                                    type: 'conversion-funnel-regenerated',
                                                    content: regeneratedFunnel
                                                  }
                                                }));

                                                setMonetizationActionStatus(prev => ({ ...prev, 'conversion-funnel-regenerate': 'Regenerated!' }));
                                                setTimeout(() => {
                                                  setMonetizationActionStatus(prev => ({ ...prev, 'conversion-funnel-regenerate': '' }));
                                                }, 2000);
                                              } catch (error) {
                                                console.error('Failed to regenerate conversion funnel:', error);
                                                setMonetizationActionStatus(prev => ({ ...prev, 'conversion-funnel-regenerate': 'Failed' }));
                                                setTimeout(() => {
                                                  setMonetizationActionStatus(prev => ({ ...prev, 'conversion-funnel-regenerate': '' }));
                                                }, 2000);
                                              }
                                              setActiveMonetizationMenu(null);
                                            }}
                                            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 ease-out"
                                          >
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <RefreshCw className={`w-5 h-5 text-blue-400 ${monetizationActionStatus['conversion-funnel-regenerate'] === 'Regenerating...' ? 'animate-spin' : ''}`} />
                                              </div>
                                              <div className="flex-1 text-left">
                                                <div className="font-semibold text-white text-sm group-hover:text-blue-200 transition-colors">
                                                  {monetizationActionStatus['conversion-funnel-regenerate'] === 'Regenerating...' ? 'Regenerating...' :
                                                   monetizationActionStatus['conversion-funnel-regenerate'] === 'Regenerated!' ? 'Regenerated!' :
                                                   monetizationActionStatus['conversion-funnel-regenerate'] === 'Failed' ? 'Failed' : 'Regenerate with AI'}
                                                </div>
                                                <div className="text-xs text-slate-400 group-hover:text-blue-300/80 transition-colors">Generate new content</div>
                                              </div>
                                              <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                              </svg>
                                            </div>
                                          </button>

                                          {/* Send to Canvas */}
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (onSendToCanvas) {
                                                const content = `# Conversion Funnel\n\n${strategyPlan.monetizationStrategy?.conversionFunnels || "Conversion funnel not specified"}`;
                                                onSendToCanvas(content, 'Conversion Funnel');
                                              }
                                              setActiveMonetizationMenu(null);
                                            }}
                                            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600/10 to-emerald-600/10 hover:from-green-600/20 hover:to-emerald-600/20 border border-green-500/20 hover:border-green-400/40 transition-all duration-300 ease-out"
                                          >
                                            <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                              <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                              </div>
                                              <div className="flex-1 text-left">
                                                <div className="font-semibold text-white text-sm group-hover:text-green-200 transition-colors">Send to Canvas</div>
                                                <div className="text-xs text-slate-400 group-hover:text-green-300/80 transition-colors">Add to workspace</div>
                                              </div>
                                              <svg className="w-4 h-4 text-slate-500 group-hover:text-green-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                              </svg>
                                            </div>
                                          </button>

                                          {/* Copy Text */}
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              navigator.clipboard.writeText(strategyPlan.monetizationStrategy?.conversionFunnels || "Conversion funnel not specified");
                                              alert('Conversion funnel copied to clipboard!');
                                              setActiveMonetizationMenu(null);
                                            }}
                                            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700/20 to-slate-600/20 hover:from-slate-600/30 hover:to-slate-500/30 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 ease-out"
                                          >
                                            <div className="absolute inset-0 bg-gradient-to-r from-slate-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                              <div className="w-10 h-10 bg-gradient-to-br from-slate-600/20 to-slate-700/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Clipboard className="w-5 h-5 text-slate-400" />
                                              </div>
                                              <div className="flex-1 text-left">
                                                <div className="font-semibold text-white text-sm group-hover:text-slate-200 transition-colors">Copy Text</div>
                                                <div className="text-xs text-slate-400 group-hover:text-slate-300/80 transition-colors">Copy to clipboard</div>
                                              </div>
                                              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-300" />
                                            </div>
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                    <SafeStrategyValue value={strategyPlan.monetizationStrategy?.conversionFunnels || "Conversion funnel not specified"} />
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Scalability Planning */}
                    {strategyPlan.scalabilityPlanning && (
                      <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
                        <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-sm">
                          <div className="flex items-start justify-between mb-5">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                  Growth & Scalability Roadmap
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                  Strategic growth phases & infrastructure
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 hover:bg-[var(--surface-secondary)] rounded-lg transition-colors group">
                                <MoreVertical className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-white" />
                              </div>
                              <h5 className="font-semibold text-[var(--text-primary)]">
                                Growth Phases
                              </h5>
                            </div>
                            <div className="space-y-3">
                              {strategyPlan.scalabilityPlanning?.growthPhases && Array.isArray(strategyPlan.scalabilityPlanning.growthPhases)
                                ? strategyPlan.scalabilityPlanning.growthPhases.map(
                                    (phase, index) => (
                                      <div
                                        key={index}
                                        className="group relative"
                                      >
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                                        <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                                          <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                                              <span className="text-xs font-semibold text-white">{index + 1}</span>
                                            </div>
                                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{phase}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ),
                                  )
                                : strategyPlan.scalabilityPlanning?.growthPhases && typeof strategyPlan.scalabilityPlanning.growthPhases === 'string'
                                ? (
                                    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-4 rounded-lg border border-purple-500/30">
                                      <p className="text-slate-300">
                                        <SafeStrategyValue value={strategyPlan.scalabilityPlanning.growthPhases} />
                                      </p>
                                    </div>
                                  )
                                : strategyPlan.scalabilityPlanning?.growthPhases && typeof strategyPlan.scalabilityPlanning.growthPhases === 'object'
                                ? Object.entries(strategyPlan.scalabilityPlanning.growthPhases as Record<string, any>).map(
                                    ([phase, details], index) => (
                                      <div
                                        key={index}
                                        className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-4 rounded-lg border border-purple-500/30"
                                      >
                                        <h6 className="text-purple-400 text-sm font-semibold mb-2 capitalize">
                                          {phase.replace(/([A-Z])/g, ' $1').trim()}
                                        </h6>
                                        <p className="text-slate-300 text-sm">
                                          <SafeStrategyValue value={details} />
                                        </p>
                                      </div>
                                    ),
                                  )
                                : strategyPlan.scalabilityPlanning
                                ? (
                                    // Generate default growth phases if we have scalability planning but no specific phases
                                    <div className="space-y-3">
                                      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-4 rounded-lg border border-purple-500/30">
                                        <h6 className="text-purple-400 text-sm font-semibold mb-2">Phase 1: Foundation</h6>
                                        <p className="text-slate-300 text-sm">
                                          Establish core systems, team structure, and initial market presence
                                        </p>
                                      </div>
                                      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-4 rounded-lg border border-purple-500/30">
                                        <h6 className="text-purple-400 text-sm font-semibold mb-2">Phase 2: Growth</h6>
                                        <p className="text-slate-300 text-sm">
                                          Scale operations, expand team, and increase market share
                                        </p>
                                      </div>
                                      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-4 rounded-lg border border-purple-500/30">
                                        <h6 className="text-purple-400 text-sm font-semibold mb-2">Phase 3: Optimization</h6>
                                        <p className="text-slate-300 text-sm">
                                          Refine processes, enhance efficiency, and maximize profitability
                                        </p>
                                      </div>
                                      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-4 rounded-lg border border-purple-500/30">
                                        <h6 className="text-purple-400 text-sm font-semibold mb-2">Phase 4: Expansion</h6>
                                        <p className="text-slate-300 text-sm">
                                          Enter new markets, diversify offerings, and establish market leadership
                                        </p>
                                      </div>
                                    </div>
                                  )
                                : (
                                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                      <p className="text-slate-400 text-sm">Growth phases data not available</p>
                                    </div>
                                  )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="group relative">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                              <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                    <Users className="w-4 h-4 text-white" />
                                  </div>
                                  <h6 className="font-semibold text-[var(--text-primary)]">
                                    Team Structure
                                  </h6>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                    <SafeStrategyValue value={strategyPlan.scalabilityPlanning?.teamStructure || "Team structure not specified"} />
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="group relative">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                              <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                    <Layers className="w-4 h-4 text-white" />
                                  </div>
                                  <h6 className="font-semibold text-[var(--text-primary)]">
                                    Technology Stack
                                  </h6>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                    <SafeStrategyValue value={strategyPlan.scalabilityPlanning?.technologyStack || "Technology stack not specified"} />
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Risk Mitigation */}
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
                      <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                              <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                Risk Management & Crisis Planning
                              </h3>
                              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                Comprehensive risk mitigation strategies
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 hover:bg-[var(--surface-secondary)] rounded-lg transition-colors group">
                              <MoreVertical className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Object.entries(strategyPlan.riskMitigation).map(
                          ([key, value], index) => (
                            <div
                              key={key}
                              className="group/risk relative"
                            >
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl opacity-50 group-hover/risk:opacity-75 transition-opacity blur-sm"></div>
                              <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                                      <Zap className="w-4 h-4 text-white" />
                                    </div>
                                    <h5 className="font-semibold text-[var(--text-primary)] capitalize">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </h5>
                                  </div>

                                  <div className="flex-shrink-0">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveRiskMenu(activeRiskMenu === `risk-${index}` ? null : `risk-${index}`);
                                      }}
                                      className="opacity-0 group-hover/risk:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                                      title="Risk management actions"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>

                                    {/* Premium 8-Figure Style Floating Menu */}
                                    {activeRiskMenu === `risk-${index}` && (
                                      <div className="absolute right-0 top-full mt-3 w-64 bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98 backdrop-blur-2xl border border-slate-600/30 rounded-3xl shadow-2xl shadow-black/50 z-50 overflow-hidden ring-1 ring-white/5">
                                        {/* Menu Header */}
                                        <div className="px-4 py-3 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
                                          <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                            <span className="ml-2 text-xs font-medium text-slate-300">Risk Management Actions</span>
                                          </div>
                                        </div>

                                        <div className="p-3 space-y-2">
                                          {/* Save to Risk Management */}
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              saveRiskManagementItem(String(value), key, key.replace(/([A-Z])/g, " $1").trim(), index);
                                              setActiveRiskMenu(null);
                                            }}
                                            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600/10 to-orange-600/10 hover:from-red-600/20 hover:to-orange-600/20 border border-red-500/20 hover:border-red-400/40 transition-all duration-300 ease-out"
                                          >
                                            <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                              <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-orange-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                              </div>
                                              <div className="flex-1 text-left">
                                                <div className="font-semibold text-white text-sm group-hover:text-red-200 transition-colors">
                                                  {riskActionStatus[`risk-${key}-${index}`] === 'Saving...' ? 'Saving...' : riskActionStatus[`risk-${key}-${index}`] === 'Saved!' ? 'Saved!' : 'Save Risk Strategy'}
                                                </div>
                                                <div className="text-xs text-slate-400 group-hover:text-red-300/80 transition-colors">Add to Risk Management tab</div>
                                              </div>
                                              <svg className="w-4 h-4 text-slate-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                              </svg>
                                            </div>
                                          </button>

                                          {/* Regenerate Risk Strategy */}
                                          <button
                                            onClick={async (e) => {
                                              e.stopPropagation();
                                              setRiskActionStatus(prev => ({ ...prev, [`risk-regenerate-${key}-${index}`]: 'Regenerating...' }));
                                              try {
                                                const strategyConfig = {
                                                  niche: 'Content Creation & Marketing',
                                                  targetAudience: 'Content creators and digital marketers',
                                                  platforms: ['YouTube', 'TikTok', 'Instagram'],
                                                  timeframe: '6-12 months',
                                                  budget: 'Medium'
                                                };
                                                const regeneratedStrategy = await riskManagementRegenerationService.regenerateRiskItem(
                                                  strategyPlan,
                                                  String(value),
                                                  key,
                                                  strategyConfig
                                                );

                                                // Update the strategy plan with regenerated content
                                                if (strategyPlan.riskMitigation) {
                                                  strategyPlan.riskMitigation[key] = regeneratedStrategy;
                                                }

                                                // Trigger refresh event
                                                window.dispatchEvent(new CustomEvent('strategyContentUpdate', {
                                                  detail: {
                                                    type: 'risk-management-regenerated',
                                                    riskType: key,
                                                    content: regeneratedStrategy
                                                  }
                                                }));

                                                setRiskActionStatus(prev => ({ ...prev, [`risk-regenerate-${key}-${index}`]: 'Regenerated!' }));
                                                setTimeout(() => {
                                                  setRiskActionStatus(prev => ({ ...prev, [`risk-regenerate-${key}-${index}`]: '' }));
                                                }, 2000);
                                              } catch (error) {
                                                console.error('Failed to regenerate risk strategy:', error);
                                                setRiskActionStatus(prev => ({ ...prev, [`risk-regenerate-${key}-${index}`]: 'Failed' }));
                                                setTimeout(() => {
                                                  setRiskActionStatus(prev => ({ ...prev, [`risk-regenerate-${key}-${index}`]: '' }));
                                                }, 2000);
                                              }
                                              setActiveRiskMenu(null);
                                            }}
                                            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 ease-out"
                                          >
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <RefreshCw className={`w-5 h-5 text-blue-400 ${riskActionStatus[`risk-regenerate-${key}-${index}`] === 'Regenerating...' ? 'animate-spin' : ''}`} />
                                              </div>
                                              <div className="flex-1 text-left">
                                                <div className="font-semibold text-white text-sm group-hover:text-blue-200 transition-colors">
                                                  {riskActionStatus[`risk-regenerate-${key}-${index}`] === 'Regenerating...' ? 'Regenerating...' :
                                                   riskActionStatus[`risk-regenerate-${key}-${index}`] === 'Regenerated!' ? 'Regenerated!' :
                                                   riskActionStatus[`risk-regenerate-${key}-${index}`] === 'Failed' ? 'Failed' : 'Regenerate with AI'}
                                                </div>
                                                <div className="text-xs text-slate-400 group-hover:text-blue-300/80 transition-colors">Generate new strategy</div>
                                              </div>
                                              <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                              </svg>
                                            </div>
                                          </button>

                                          {/* Send to Canvas */}
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (onSendToCanvas) {
                                                const content = `# ${key.replace(/([A-Z])/g, " $1").trim()}\n\n${value}`;
                                                onSendToCanvas(content, key.replace(/([A-Z])/g, " $1").trim());
                                              }
                                              setActiveRiskMenu(null);
                                            }}
                                            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/10 to-violet-600/10 hover:from-purple-600/20 hover:to-violet-600/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 ease-out"
                                          >
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                              </div>
                                              <div className="flex-1 text-left">
                                                <div className="font-semibold text-white text-sm group-hover:text-purple-200 transition-colors">Send to Canvas</div>
                                                <div className="text-xs text-slate-400 group-hover:text-purple-300/80 transition-colors">Add to workspace</div>
                                              </div>
                                              <svg className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                              </svg>
                                            </div>
                                          </button>

                                          {/* Copy Text */}
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              navigator.clipboard.writeText(String(value));
                                              alert('Risk management strategy copied to clipboard!');
                                              setActiveRiskMenu(null);
                                            }}
                                            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700/20 to-slate-600/20 hover:from-slate-600/30 hover:to-slate-500/30 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 ease-out"
                                          >
                                            <div className="absolute inset-0 bg-gradient-to-r from-slate-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-4 px-4 py-3.5">
                                              <div className="w-10 h-10 bg-gradient-to-br from-slate-600/20 to-slate-700/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Clipboard className="w-5 h-5 text-slate-400" />
                                              </div>
                                              <div className="flex-1 text-left">
                                                <div className="font-semibold text-white text-sm group-hover:text-slate-200 transition-colors">Copy Text</div>
                                                <div className="text-xs text-slate-400 group-hover:text-slate-300/80 transition-colors">Copy to clipboard</div>
                                              </div>
                                              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-300" />
                                            </div>
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                    <SafeStrategyValue value={value} />
                                  </p>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>


                    {/* Platform Strategy Section */}
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-green-500/20 to-purple-500/20 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
                      <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-green-600 rounded-lg flex items-center justify-center">
                              <Share2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                Platform Strategy
                              </h3>
                              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                Platform-specific content & growth strategies
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                          onClick={() => savePlatformStrategy({
                            platform: 'YouTube, TikTok, Instagram',
                            focus: 'Multi-platform content strategy',
                            contentTypes: ['Long-form videos', 'Shorts', 'Stories', 'Posts'],
                            postingFrequency: 'Daily on primary platforms',
                            bestTimes: ['9 AM EST', '2 PM EST', '7 PM EST'],
                            engagementStrategy: 'Interactive content with strong CTAs',
                            monetizationApproach: 'Diversified revenue streams',
                            keyMetrics: ['Reach', 'Engagement', 'Conversion'],
                            audienceTargeting: 'Content creators and marketers',
                            contentMix: { educational: 40, entertainment: 30, promotional: 20, personal: 10 }
                          })}
                          className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg text-sm border border-blue-500/30 transition-colors flex items-center space-x-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save to Platforms Tab</span>
                        </button>
                            <button className="p-2 hover:bg-[var(--surface-secondary)] rounded-lg transition-colors group">
                              <MoreVertical className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* YouTube Strategy */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                                  <Play className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">YouTube Strategy</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Content Formats</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Long-form tutorials (60%), YouTube Shorts (30%), Live streams (10%)</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Upload Schedule</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Long-form: Tuesday & Friday 2PM EST, Shorts: Daily 6PM EST</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">SEO & Thumbnails</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Keyword-optimized titles, A/B test thumbnails, custom end screens</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Community Engagement</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Community posts, premieres, comment engagement, subscriber perks</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Monetization</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Ad revenue, memberships, Super Chat, affiliate marketing, sponsorships</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* TikTok Strategy */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-black/10 to-gray-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-black to-gray-600 rounded-lg flex items-center justify-center">
                                  <TrendingUp className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">TikTok Strategy</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Trending Formats</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Quick tips (40%), Trending audio (25%), Behind-scenes (20%), Tutorials (15%)</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Hashtag Strategy</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Mix of trending, niche, and branded hashtags (3-5 per post)</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Posting Schedule</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Daily posts at 6AM, 12PM, and 7PM EST for maximum reach</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Algorithm Optimization</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Hook in first 3 seconds, 15-30 second videos, high completion rate</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Instagram Strategy */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                                  <Camera className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Instagram Strategy</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Content Mix</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Reels (50%), Feed posts (30%), Stories (15%), IGTV (5%)</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Visual Branding</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Consistent color palette, branded templates, cohesive feed aesthetic</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Stories Strategy</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Daily stories, highlights organization, polls & questions for engagement</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Bio Optimization</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Clear value prop, link in bio tool, branded hashtag, call-to-action</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Platform Integration */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                                  <Layers className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Cross-Platform Integration</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Content Repurposing</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">YouTube → TikTok clips ��� Instagram Reels → Twitter threads</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Audience Migration</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Cross-promote channels, exclusive content teasers, platform-specific CTAs</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Platform KPIs</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">YouTube: Watch time, TikTok: Completion rate, Instagram: Reach & saves</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Campaign Strategy Section */}
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
                      <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                              <Target className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                Campaign Strategy
                              </h3>
                              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                Strategic campaign frameworks & execution plans
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                          onClick={() => saveCampaignStrategy({
                            campaignName: 'Launch Campaign Strategy',
                            campaignType: 'launch',
                            objective: 'Maximize reach and engagement for new content series',
                            targetAudience: 'Content creators and digital marketers',
                            timeline: '4-week campaign',
                            platforms: ['YouTube', 'TikTok', 'Instagram', 'Twitter'],
                            contentTypes: ['Videos', 'Stories', 'Posts', 'Live streams'],
                            keyMessages: ['Innovation', 'Expertise', 'Community'],
                            callsToAction: ['Subscribe', 'Share', 'Comment', 'Visit website'],
                            successMetrics: ['Reach', 'Engagement rate', 'Conversion rate'],
                            budget: 'Medium',
                            launchStrategy: 'Coordinated multi-platform launch',
                            engagementTactics: ['Interactive content', 'User-generated content', 'Contests']
                          })}
                          className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg text-sm border border-purple-500/30 transition-colors flex items-center space-x-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save to Campaigns Tab</span>
                        </button>
                            <button className="p-2 hover:bg-[var(--surface-secondary)] rounded-lg transition-colors group">
                              <MoreVertical className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Launch Campaigns */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                  <Rocket className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Launch Campaigns</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Pre-Launch (30 days)</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Teasers, behind-scenes, early access, influencer outreach</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Launch Day</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Coordinated multi-platform push, live events, real-time engagement</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Post-Launch</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">User testimonials, case studies, momentum content, feedback collection</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Success Metrics</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Reach, conversion rate, brand mention increase, customer acquisition</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Seasonal Campaigns */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center">
                                  <Calendar className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Seasonal Campaigns</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Holiday Content</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Christmas, Halloween, New Year themed content with timely hooks</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Industry Events</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Conference coverage, award seasons, industry milestone celebrations</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Trending Hijacking</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Capitalize on viral moments, news events, cultural phenomena</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Hashtag Strategy</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Seasonal hashtags, event-specific tags, trending topic integration</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Engagement Campaigns */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                  <Users className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Engagement Campaigns</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Community Challenges</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">30-day challenges, skill-building competitions, branded hashtag campaigns</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">User-Generated Content</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Feature customer stories, before/after showcases, community spotlights</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Contests & Giveaways</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Product giveaways, collaborative contests, milestone celebrations</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Interactive Content</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Polls, Q&As, live streams, AMA sessions, collaborative content</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Growth Campaigns */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                  <TrendingUp className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Growth Campaigns</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Viral Content Templates</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Proven formats, trending audio usage, optimal posting times</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Influencer Partnerships</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Micro-influencer collaborations, cross-promotion strategies</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Cross-Promotion</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Guest appearances, podcast interviews, collaboration content</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Paid Promotion</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Targeted ads, boosted posts, sponsored content integration</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Competitor Analysis Section */}
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
                      <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                              <Eye className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                Competitor Analysis
                              </h3>
                              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                Competitive intelligence & market positioning
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                          onClick={() => saveCompetitorAnalysis({
                            competitorName: 'TechReview Pro',
                            competitorType: 'Direct',
                            industry: 'Content Creation & Marketing',
                            platforms: ['YouTube', 'Instagram', 'TikTok'],
                            audienceSize: '500K+ followers',
                            engagementRate: '8.5%',
                            contentStrategy: 'Educational content with product reviews',
                            strengthsWeaknesses: ['Strong SEO', 'Consistent posting', 'Limited platform diversity'],
                            contentGaps: ['Live streaming', 'Interactive content', 'Community building'],
                            opportunities: ['Trending topics', 'Collaboration potential', 'New platform adoption'],
                            keyTakeaways: ['Focus on consistency', 'Leverage trending topics', 'Improve community engagement'],
                            competitiveAdvantages: ['Higher engagement rate', 'Better content variety', 'Stronger community'],
                            monitoringFrequency: 'Weekly'
                          })}
                          className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm border border-red-500/30 transition-colors flex items-center space-x-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save to Competitors Tab</span>
                        </button>
                            <button className="p-2 hover:bg-[var(--surface-secondary)] rounded-lg transition-colors group">
                              <MoreVertical className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Direct Competitor Profiles */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                                  <Users className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Direct Competitor Profiles</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Competitor #1: TechReview Pro</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">2M subscribers, tech reviews, strong YouTube presence, weekly upload schedule</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Competitor #2: GadgetGuru</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">850K followers, Instagram focus, unboxing content, high engagement rate</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Competitor #3: NextGen Tech</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">500K TikTok, emerging trends, younger audience, viral content strategy</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Content Gap Analysis */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                  <BarChart3 className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Content Gap Analysis</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Underserved Topics</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">AI productivity tools, budget tech alternatives, accessibility features</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Format Opportunities</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Live comparison streams, long-form tutorials, interactive Q&As</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Platform Gaps</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Limited LinkedIn presence, underutilized Twitter threads, missing podcasts</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Performance Benchmarking */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                  <TrendingUp className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Performance Benchmarking</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Engagement Rates</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Industry avg: 3.2%, top competitor: 5.8%, target: 4.5%</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Content Performance</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Best-performing: How-to videos, Worst: News updates, Trending: Comparisons</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Growth Metrics</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Follower growth rate: 8.2% monthly, industry benchmark: 5.5%</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Competitive Advantages */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                  <Target className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Competitive Advantages</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Unique Positioning</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Focus on accessibility, budget-conscious content, real-world testing</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Content Differentiation</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">In-depth tutorials, community involvement, transparent reviews</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Strategic Opportunities</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Fill content gaps, target underserved demographics, platform expansion</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer Journey Section */}
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
                      <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                Customer Journey Mapping
                              </h3>
                              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                Strategic touchpoints & conversion optimization
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                          onClick={() => saveCustomerJourney({
                            journeyName: 'Content Creator Journey',
                            targetPersona: 'Aspiring content creators',
                            industry: 'Digital Content & Marketing',
                            overallObjective: 'Convert viewers into engaged community members',
                            stages: [
                              {
                                stage: 'Awareness',
                                touchpoints: ['Social media', 'Search', 'Recommendations'],
                                content: ['Educational videos', 'Blog posts', 'Social posts'],
                                goals: ['Brand recognition', 'Interest generation'],
                                metrics: ['Reach', 'Impressions', 'Discovery rate'],
                                challenges: ['Standing out', 'Building trust'],
                                solutions: ['Consistent branding', 'Value-first content']
                              }
                            ],
                            conversionPath: ['Discovery', 'Engagement', 'Subscribe', 'Community', 'Advocate'],
                            keyTouchpoints: ['YouTube', 'Instagram', 'Email', 'Community platform'],
                            contentRequirements: ['Educational content', 'Behind-the-scenes', 'Tutorials'],
                            automationOpportunities: ['Email sequences', 'Social posting', 'Community onboarding'],
                            optimizationRecommendations: ['A/B testing', 'Personalization', 'Retargeting'],
                            expectedTimeline: '6-month journey optimization',
                            successMetrics: ['Conversion rate', 'Customer lifetime value', 'Retention rate']
                          })}
                          className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg text-sm border border-indigo-500/30 transition-colors flex items-center space-x-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save to Journey Tab</span>
                        </button>
                            <button className="p-2 hover:bg-[var(--surface-secondary)] rounded-lg transition-colors group">
                              <MoreVertical className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Awareness Stage */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                                  <Eye className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Awareness Stage</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Discovery Content</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">SEO-optimized tutorials, trending topic coverage, problem-solving guides</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Social Presence</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Engaging social media posts, viral content, community participation</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Pain Point Solutions</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Address common problems, provide immediate value, establish expertise</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">First Impression Goals</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Build trust, demonstrate value, encourage exploration of more content</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Consideration Stage */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                  <Compass className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Consideration Stage</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Educational Content</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">In-depth guides, comparison videos, detailed reviews, expert insights</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Social Proof</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Customer testimonials, case studies, community feedback, success stories</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Interactive Touchpoints</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Live Q&As, community discussions, direct messaging, email sequences</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Value Demonstration</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Free tools, templates, mini-courses, behind-the-scenes content</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Decision Stage */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Decision Stage</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Conversion Content</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Clear CTAs, limited-time offers, product demos, final comparisons</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Trust Signals</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Money-back guarantees, certifications, expert endorsements, reviews</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Urgency & Scarcity</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Limited availability, time-sensitive bonuses, exclusive access</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Purchase Support</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Live chat, onboarding guides, welcome sequences, immediate value delivery</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Retention & Advocacy */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                  <Users className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Retention & Advocacy</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Ongoing Value</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Regular updates, new features, advanced content, exclusive access</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Community Building</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Private groups, user forums, events, networking opportunities</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Referral Programs</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Incentivized sharing, affiliate programs, word-of-mouth campaigns</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Success Tracking</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Customer success metrics, satisfaction surveys, improvement feedback</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resource Planning Section */}
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
                      <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                              <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                Resource Planning
                              </h3>
                              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                Team, budget & infrastructure planning
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                          onClick={() => saveResourcePlan({
                            planName: 'Content Strategy Resource Plan',
                            projectScope: 'Multi-platform content creation and marketing',
                            timeline: '12-month implementation',
                            totalBudget: '$50,000 - $100,000',
                            teamStructure: [
                              { role: 'Content Manager', skillLevel: 'Senior', responsibilities: ['Strategy', 'Planning', 'Quality control'], timeAllocation: 'Full-time', hirePriority: 'High' },
                              { role: 'Video Editor', skillLevel: 'Intermediate', responsibilities: ['Video editing', 'Motion graphics'], timeAllocation: 'Part-time', hirePriority: 'Medium' }
                            ],
                            budgetAllocations: [
                              { category: 'Content Production', budgetAmount: '$30,000', percentage: 60, priority: 'High', notes: 'Equipment and software' },
                              { category: 'Marketing & Advertising', budgetAmount: '$15,000', percentage: 30, priority: 'Medium', notes: 'Paid promotion' }
                            ],
                            toolStack: [
                              { toolName: 'Adobe Creative Suite', category: 'Content Creation', purpose: 'Video and graphic design', cost: '$60/month', alternatives: ['DaVinci Resolve', 'Canva'], priority: 'High' }
                            ],
                            skillGaps: ['Advanced video editing', 'SEO optimization', 'Data analytics'],
                            trainingNeeds: ['Video editing masterclass', 'SEO certification', 'Analytics training'],
                            milestones: ['Month 1: Team setup', 'Month 3: First campaign', 'Month 6: Mid-year review'],
                            riskFactors: ['Budget constraints', 'Skill availability', 'Technology changes'],
                            scalingConsiderations: ['Additional team members', 'Advanced tools', 'Expanded platforms']
                          })}
                          className="px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg text-sm border border-green-500/30 transition-colors flex items-center space-x-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save to Resources Tab</span>
                        </button>
                            <button className="p-2 hover:bg-[var(--surface-secondary)] rounded-lg transition-colors group">
                              <MoreVertical className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Team Planning */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                  <Users className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Team Planning & Hiring</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Current Team (Month 0-3)</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Content creator, video editor, social media manager (3 people)</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Growth Phase (Month 4-8)</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Add: Graphic designer, copywriter, community manager (6 people)</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Scale Phase (Month 9-12)</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Add: Data analyst, partnerships manager, additional editors (10 people)</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Key Skill Requirements</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Video production, SEO, analytics, community management, brand strategy</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Budget Allocation */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                  <BarChart3 className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Budget Allocation</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Personnel (60%)</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Salaries, freelancers, contractors - $18,000/month</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Tools & Software (15%)</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Editing software, analytics tools, automation - $4,500/month</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Equipment (10%)</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Cameras, lighting, computers, storage - $3,000/month</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Marketing & Ads (15%)</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Paid promotion, influencer collaborations - $4,500/month</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Tool Stack */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                  <Layers className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Tool Stack Management</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Content Creation</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Adobe Creative Suite, Canva Pro, Final Cut Pro, Figma</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Analytics & Management</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Google Analytics, Hootsuite, Buffer, TubeBuddy, Social Blade</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Productivity & Collaboration</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Notion, Slack, Asana, Google Workspace, Loom</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Automation & AI</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Zapier, ChatGPT, Midjourney, Buffer AI Assistant</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Skill Development */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                                  <Lightbulb className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Skill Development Plans</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Technical Skills</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Advanced video editing, motion graphics, SEO optimization, data analysis</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Content Skills</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Storytelling, scriptwriting, visual design, brand voice development</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Business Skills</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Project management, client relations, negotiation, strategic planning</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Training Resources</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Online courses, workshops, conferences, certifications, mentorship</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Legal & Compliance Section */}
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-blue-500/20 to-cyan-500/20 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
                      <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <Scale className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                Legal & Compliance
                              </h3>
                              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                Legal requirements & brand safety protocols
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                          onClick={() => saveCompliancePlan({
                            planName: 'Content Compliance & Legal Plan',
                            industry: 'Digital Content & Marketing',
                            applicableRegulations: ['GDPR', 'COPPA', 'FTC Guidelines', 'Platform TOS'],
                            platformGuidelines: [
                              { platform: 'YouTube', guidelines: ['Community guidelines', 'Monetization policies'], lastUpdated: new Date(), complianceStatus: 'compliant', notes: 'Regular review scheduled' },
                              { platform: 'Instagram', guidelines: ['Content policies', 'Commerce guidelines'], lastUpdated: new Date(), complianceStatus: 'compliant', notes: 'Updated recently' }
                            ],
                            legalTemplates: [
                              { templateName: 'Sponsored Content Disclosure', templateType: 'Disclosure', content: '#ad #sponsored', applicablePlatforms: ['Instagram', 'TikTok'], lastReviewed: new Date(), status: 'active' }
                            ],
                            copyrightPolicies: ['Music licensing', 'Image rights clearance', 'Fair use guidelines'],
                            dataPrivacyMeasures: ['Data minimization', 'Consent management', 'Privacy policy updates'],
                            disclosureRequirements: ['Sponsored content', 'Affiliate links', 'Gifted products'],
                            contentReviewProcess: ['Pre-publication review', 'Legal compliance check', 'Brand safety verification'],
                            crisisManagementPlan: ['Response team activation', 'Communication protocols', 'Damage control measures'],
                            trainingRequirements: ['Legal compliance training', 'Platform policy updates', 'Crisis response training'],
                            auditSchedule: 'Quarterly'
                          })}
                          className="px-3 py-1.5 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg text-sm border border-yellow-500/30 transition-colors flex items-center space-x-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save to Compliance Tab</span>
                        </button>
                            <button className="p-2 hover:bg-[var(--surface-secondary)] rounded-lg transition-colors group">
                              <MoreVertical className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Platform Guidelines */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                  <Shield className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Platform Guidelines Tracker</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">YouTube Compliance</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Community guidelines, monetization policies, copyright rules</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">TikTok Guidelines</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Content policies, music usage, branded content rules</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Instagram Policies</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Community standards, business account requirements, sponsored content</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Update Monitoring</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Regular policy updates, algorithm changes, new compliance requirements</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Copyright & Legal */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                                  <Gavel className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Copyright Clearance System</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Music Licensing</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Epidemic Sound, Artlist, YouTube Audio Library, custom compositions</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Image & Video Rights</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Stock footage licenses, fair use guidelines, original content creation</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Product Review Policies</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">FTC disclosure requirements, honest review standards, conflict of interest</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Legal Documentation</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Contracts, NDAs, partnership agreements, release forms</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Disclosure Templates */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                  <AlertTriangle className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Disclosure Template Library</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Sponsored Content</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">"This video is sponsored by [Brand]. All opinions are my own."</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Affiliate Links</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">"Links in description may be affiliate links that support the channel."</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Gifted Products</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">"This product was provided free for review. Review is honest and unbiased."</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Partnerships</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">"Created in partnership with [Brand]. #Partnership #Collaboration"</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Brand Safety */}
                          <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                  <Shield className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">Brand Safety Checklist</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Content Review Process</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Pre-publish review, fact-checking, tone assessment, brand alignment check</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Crisis Management Protocol</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Response templates, escalation procedures, damage control strategies</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Community Guidelines</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Comment moderation, community standards, engagement policies</p>
                                </div>
                                <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                                  <h5 className="text-[var(--text-primary)] text-sm font-semibold mb-1">Reputation Monitoring</h5>
                                  <p className="text-[var(--text-secondary)] text-xs">Brand mention tracking, sentiment analysis, proactive issue detection</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Weekly Content Schedule - Moved to the end */}
                    {strategyPlan.suggestedWeeklySchedule && strategyPlan.suggestedWeeklySchedule.length > 0 && (
                      <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
                        <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-sm">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                  Weekly Content Schedule
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                  Select content ideas to add to your calendar
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 hover:bg-[var(--surface-secondary)] rounded-lg transition-colors group">
                                <MoreVertical className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                              </button>
                            </div>
                          </div>

                          {onAddToCalendar && (
                            <div className="flex items-center space-x-3 mb-6">
                              <button
                                onClick={handleAddAllToCalendar}
                                className="px-4 py-2 bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg text-sm transition-colors flex items-center space-x-2"
                              >
                                <Calendar className="w-4 h-4" />
                                <span>Add All to Calendar</span>
                              </button>

                              {selectedCalendarItems.size > 0 && (
                                <button
                                  onClick={handleAddSelectedToCalendar}
                                  className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg text-sm border border-emerald-500/30 transition-colors flex items-center space-x-2"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Add Selected ({selectedCalendarItems.size})</span>
                                </button>
                              )}
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {strategyPlan.suggestedWeeklySchedule.map((item, index) => (
                              <div
                                key={index}
                                className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                                  selectedCalendarItems.has(index)
                                    ? 'bg-emerald-600/20 border-emerald-500 shadow-lg'
                                    : 'bg-[var(--surface-primary)] border-[var(--border-primary)] hover:border-indigo-500/50 hover:bg-indigo-900/20'
                                }`}
                                onClick={() => handleCalendarItemToggle(index)}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 text-indigo-400" />
                                    <span className="text-lg font-semibold text-[var(--text-primary)]">
                                      <SafeStrategyValue value={item.dayOfWeek} />
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {selectedCalendarItems.has(index) && (
                                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    )}
                                    <span className="text-xs px-2 py-1 bg-[var(--surface-secondary)] border border-[var(--border-secondary)] text-[var(--text-secondary)] rounded-full">
                                      <SafeStrategyValue value={item.platform || 'Multi-Platform'} />
                                    </span>
                                  </div>
                                </div>

                                <h5 className="font-medium text-[var(--text-primary)] mb-3">
                                  <SafeStrategyValue value={item.contentType} />: <SafeStrategyValue value={item.topicHint} />
                                </h5>

                                {item.optimalTime && (
                                  <div className="flex items-center space-x-2 text-[var(--text-secondary)] text-sm mb-2">
                                    <Clock className="w-3 h-3" />
                                    <span>Optimal time: <SafeStrategyValue value={item.optimalTime} /></span>
                                  </div>
                                )}

                                {item.cta && (
                                  <div className="flex items-center space-x-2 text-[var(--text-secondary)] text-sm">
                                    <Lightbulb className="w-3 h-3" />
                                    <span>CTA: <SafeStrategyValue value={item.cta} /></span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {selectedCalendarItems.size === 0 && onAddToCalendar && (
                            <div className="mt-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                              <p className="text-slate-400 text-sm text-center">
                                💡 Click on content ideas to select them, then add to your calendar. Or use "Add All" to schedule the entire week.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Send Everything to Canvas */}
                    {onSendToCanvas && (
                      <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 p-6 rounded-xl border border-emerald-500/50 text-center space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <button
                            onClick={sendEntireStrategyToCanvas}
                            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white rounded-xl text-lg font-semibold transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl"
                          >
                            <Send className="w-5 h-5" />
                            <span>Send as Text</span>
                          </button>

                          {onSendStrategyMindMap && (
                            <button
                              onClick={sendStrategyAsMindMap}
                              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-lg font-semibold transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl"
                            >
                              <GitBranch className="w-5 h-5" />
                              <span>Send as Mind Map</span>
                              <Brain className="w-5 h-5" />
                            </button>
                          )}
                        </div>

                        <div className="text-center">
                          <p className="text-slate-400 text-sm">
                            Choose how to send your strategy to canvas:
                          </p>
                          <p className="text-slate-400 text-xs mt-1 flex items-center justify-center gap-4">
                            <span className="flex items-center gap-1">
                              <Send className="w-3 h-3" />
                              <strong>Text:</strong> Complete strategy as formatted text
                            </span>
                            <span className="flex items-center gap-1">
                              <GitBranch className="w-3 h-3" />
                              <strong>Mind Map:</strong> Visual mind map with niche, pillars & keywords
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Analytics View */}
          {activeView === "analyze" && isPremium && (
            <div className="space-y-6">
              {/* Analytics Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-300 mb-1">
                    Strategy Analytics Dashboard
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Track trending topics and monitor their performance
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 text-sm"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="365d">Last year</option>
                  </select>
                  <button
                    onClick={() => updateAnalyticsData(trackedTopics)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm flex items-center space-x-2"
                  >
                    <span>🔄</span>
                    <span>Refresh</span>
                  </button>
                  {analyticsData && (
                    <button
                      onClick={exportAnalyticsData}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm flex items-center space-x-2"
                    >
                      <span>📤</span>
                      <span>Export</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Add Topic to Track */}
              <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <h4 className="text-lg font-semibold text-slate-300 mb-4">
                  Track New Topic or Trend
                </h4>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={newTopicInput}
                      onChange={(e) => setNewTopicInput(e.target.value)}
                      placeholder="Enter a topic or trend to track (e.g., 'AI automation', 'remote work trends')"
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-100 placeholder-slate-400"
                      onKeyPress={(e) => e.key === "Enter" && addTopicToTrack()}
                    />
                  </div>
                  <button
                    onClick={addTopicToTrack}
                    disabled={isTrackingTopic || !newTopicInput.trim()}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center space-x-2"
                  >
                    {isTrackingTopic ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>Tracking...</span>
                      </>
                    ) : (
                      <>
                        <span>🎯</span>
                        <span>Track Topic</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-slate-400 text-sm mt-2">
                  Add topics related to your strategy to track their performance
                  and trending status across platforms
                </p>

                {/* Suggested Topics from Strategy */}
                {strategyPlan && getSuggestedTopics().length > 0 && (
                  <div className="mt-4 p-4 bg-slate-700/30 rounded-lg border border-emerald-500/30">
                    <h5 className="text-sm font-medium text-emerald-400 mb-3">
                      💡 Suggested from your strategy:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {getSuggestedTopics().map((topic, i) => (
                        <button
                          key={i}
                          onClick={() => addSuggestedTopic(topic)}
                          disabled={isTrackingTopic}
                          className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-full text-sm border border-emerald-500/30 transition-colors disabled:opacity-50"
                        >
                          + {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tracked Topics */}
              {trackedTopics.length > 0 && (
                <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <h4 className="text-lg font-semibold text-slate-300 mb-4">
                    Currently Tracking ({trackedTopics.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trackedTopics.map((topic) => (
                      <div
                        key={topic.id}
                        className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-slate-300 truncate">
                            {topic.name}
                          </h5>
                          <button
                            onClick={() => removeTrackedTopic(topic.id)}
                            className="text-slate-400 hover:text-red-400 text-sm"
                          >
                            ×
                          </button>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Category:</span>
                            <span className="text-slate-300">
                              {topic.category}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Trend Score:</span>
                            <span
                              className={`font-medium ${topic.metrics.trendScore > 70 ? "text-green-400" : topic.metrics.trendScore > 40 ? "text-yellow-400" : "text-red-400"}`}
                            >
                              {topic.metrics.trendScore}/100
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Reach:</span>
                            <span className="text-slate-300">
                              {(topic.metrics.reach / 1000).toFixed(1)}K
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Sentiment:</span>
                            <span
                              className={`capitalize ${
                                topic.metrics.sentiment === "positive"
                                  ? "text-green-400"
                                  : topic.metrics.sentiment === "neutral"
                                    ? "text-yellow-400"
                                    : "text-red-400"
                              }`}
                            >
                              {topic.metrics.sentiment}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Metrics Grid */}
              {analyticsData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">
                        Total Reach
                      </span>
                      <TrendingUpIcon className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {(analyticsData.totalReach / 1000).toFixed(1)}K
                    </div>
                    <div className="text-green-400 text-sm">
                      Across all topics
                    </div>
                  </div>

                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">
                        Avg Engagement
                      </span>
                      <span className="text-blue-400">💙</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {analyticsData.totalEngagement.toFixed(1)}%
                    </div>
                    <div className="text-blue-400 text-sm">Engagement rate</div>
                  </div>

                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">
                        Trend Score
                      </span>
                      <TargetIcon className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {analyticsData.averageScore.toFixed(1)}/100
                    </div>
                    <div
                      className={`text-sm ${analyticsData.averageScore > 70 ? "text-green-400" : analyticsData.averageScore > 40 ? "text-yellow-400" : "text-red-400"}`}
                    >
                      {analyticsData.averageScore > 70
                        ? "Trending well"
                        : analyticsData.averageScore > 40
                          ? "Moderate trend"
                          : "Low trend"}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">
                        Tracked Topics
                      </span>
                      <span className="text-amber-400">📊</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {trackedTopics.length}
                    </div>
                    <div className="text-slate-400 text-sm">
                      Active monitoring
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-slate-800/30 rounded-xl border border-slate-700/50 text-center">
                  <ChartBarIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-slate-300 mb-2">
                    No Data Yet
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Start tracking topics to see analytics data here
                  </p>
                </div>
              )}

              {/* Charts Section */}
              {analyticsData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Performance Chart */}
                  <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <h4 className="text-lg font-semibold text-slate-300 mb-4">
                      Topic Performance Trends
                    </h4>
                    {trackedTopics.length > 0 ? (
                      <div className="h-64 flex items-end justify-between space-x-2">
                        {trackedTopics[0]?.historicalData
                          .slice(-14)
                          .map((data, i) => {
                            const height = (data.engagement / 10) * 100;
                            return (
                              <div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t"
                                style={{ height: `${Math.min(height, 100)}%` }}
                              ></div>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-slate-400">
                        <div className="text-center">
                          <ChartBarIcon className="w-8 h-8 mx-auto mb-2" />
                          <p>Add topics to see trends</p>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>2 weeks ago</span>
                      <span>Today</span>
                    </div>
                  </div>

                  {/* Platform Breakdown */}
                  <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <h4 className="text-lg font-semibold text-slate-300 mb-4">
                      Platform Performance
                    </h4>
                    <div className="space-y-4">
                      {analyticsData.platformBreakdown.map((platform, i) => {
                        const colors = [
                          "bg-red-500",
                          "bg-blue-500",
                          "bg-purple-500",
                          "bg-green-500",
                        ];
                        const isPositive = platform.growth > 0;
                        return (
                          <div
                            key={platform.platform}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-3 h-3 ${colors[i]} rounded-full`}
                              ></div>
                              <span className="text-slate-300">
                                {platform.platform}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold">
                                {(platform.reach / 1000).toFixed(1)}K
                              </div>
                              <div
                                className={`text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}
                              >
                                {isPositive ? "+" : ""}
                                {platform.growth.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Content Analysis */}
              {analyticsData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Top Performing Topics */}
                  <div className="lg:col-span-2 p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <h4 className="text-lg font-semibold text-slate-300 mb-4">
                      Top Performing Topics
                    </h4>
                    {analyticsData.topPerformingTopics.length > 0 ? (
                      <div className="space-y-3">
                        {analyticsData.topPerformingTopics.map((topic, i) => (
                          <div
                            key={topic.id}
                            className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="text-slate-300 font-medium">
                                {topic.name}
                              </div>
                              <div className="text-slate-400 text-sm">
                                Category: {topic.category} �� Sentiment:{" "}
                                {topic.metrics.sentiment}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold">
                                {topic.metrics.trendScore}/100
                              </div>
                              <div className="text-slate-400 text-sm">
                                trend score
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-400">
                        <p>
                          No topics tracked yet. Add some topics to see
                          performance data.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* AI-Powered Insights */}
                  <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <h4 className="text-lg font-semibold text-slate-300 mb-4">
                      🤖 AI Insights
                    </h4>
                    <div className="space-y-4">
                      {generateAIInsights(trackedTopics, analyticsData).map(
                        (insight, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg border ${
                              insight.type === "opportunity"
                                ? "bg-emerald-900/20 border-emerald-500/30"
                                : insight.type === "warning"
                                  ? "bg-red-900/20 border-red-500/30"
                                  : insight.type === "trend"
                                    ? "bg-purple-900/20 border-purple-500/30"
                                    : insight.type === "optimization"
                                      ? "bg-blue-900/20 border-blue-500/30"
                                      : "bg-yellow-900/20 border-yellow-500/30"
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <span
                                className={`w-4 h-4 ${
                                  insight.type === "opportunity"
                                    ? "text-emerald-400"
                                    : insight.type === "warning"
                                      ? "text-red-400"
                                      : insight.type === "trend"
                                        ? "text-purple-400"
                                        : insight.type === "optimization"
                                          ? "text-blue-400"
                                          : "text-yellow-400"
                                }`}
                              >
                                {insight.icon}
                              </span>
                              <span
                                className={`font-medium ${
                                  insight.type === "opportunity"
                                    ? "text-emerald-400"
                                    : insight.type === "warning"
                                      ? "text-red-400"
                                      : insight.type === "trend"
                                        ? "text-purple-400"
                                        : insight.type === "optimization"
                                          ? "text-blue-400"
                                          : "text-yellow-400"
                                }`}
                              >
                                {insight.title}
                              </span>
                              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                                {insight.confidence}% confidence
                              </span>
                            </div>
                            <p className="text-slate-300 text-sm">
                              {insight.message}
                            </p>
                            {insight.action && (
                              <button className="mt-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-colors">
                                {insight.action}
                              </button>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Competitor Analysis */}
              {analyticsData && (
                <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <h4 className="text-lg font-semibold text-slate-300 mb-4">
                    Competitor Benchmarking
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 text-slate-400">
                            Competitor
                          </th>
                          <th className="text-left py-3 text-slate-400">
                            Followers
                          </th>
                          <th className="text-left py-3 text-slate-400">
                            Avg. Engagement
                          </th>
                          <th className="text-left py-3 text-slate-400">
                            Post Frequency
                          </th>
                          <th className="text-left py-3 text-slate-400">
                            Top Content Type
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-3 text-slate-300">TechCrunch</td>
                          <td className="py-3 text-white">2.4M</td>
                          <td className="py-3 text-green-400">8.2%</td>
                          <td className="py-3 text-slate-300">12/day</td>
                          <td className="py-3 text-slate-300">News Articles</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-3 text-slate-300">The Verge</td>
                          <td className="py-3 text-white">1.8M</td>
                          <td className="py-3 text-green-400">7.9%</td>
                          <td className="py-3 text-slate-300">8/day</td>
                          <td className="py-3 text-slate-300">Video Reviews</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-slate-300">AI Explained</td>
                          <td className="py-3 text-white">485K</td>
                          <td className="py-3 text-yellow-400">6.1%</td>
                          <td className="py-3 text-slate-300">3/day</td>
                          <td className="py-3 text-slate-300">Educational</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Calendar View */}
          {activeView === "calendar" && isPremium && (
            <div className="space-y-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-300 mb-1">
                    Content Calendar
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Plan, schedule, and track your content strategy execution
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    value={calendarView}
                    onChange={(e) =>
                      setCalendarView(
                        e.target.value as "month" | "quarter" | "year",
                      )
                    }
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 text-sm"
                  >
                    <option value="month">This Month</option>
                    <option value="quarter">Quarter View</option>
                    <option value="year">Year View</option>
                  </select>
                  <button
                    onClick={handleNewContent}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm flex items-center space-x-2 transition-colors"
                  >
                    <span>➕</span>
                    <span>New Content</span>
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="text-slate-400 text-sm mb-1">
                    Scheduled This Month
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {scheduledContent.length}
                  </div>
                  <div className="text-green-400 text-sm">
                    {scheduledContent.length > 5 ? "+" : ""}
                    {Math.max(0, scheduledContent.length - 5)} from last month
                  </div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="text-slate-400 text-sm mb-1">Published</div>
                  <div className="text-2xl font-bold text-white">
                    {
                      scheduledContent.filter((c) => c.status === "published")
                        .length
                    }
                  </div>
                  <div className="text-blue-400 text-sm">
                    {scheduledContent.length > 0
                      ? Math.round(
                          (scheduledContent.filter(
                            (c) => c.status === "published",
                          ).length /
                            scheduledContent.length) *
                            100,
                        )
                      : 0}
                    % completion rate
                  </div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="text-slate-400 text-sm mb-1">In Review</div>
                  <div className="text-2xl font-bold text-white">
                    {
                      scheduledContent.filter(
                        (c) =>
                          c.status === "in-review" || c.status === "planned",
                      ).length
                    }
                  </div>
                  <div className="text-yellow-400 text-sm">Needs attention</div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="text-slate-400 text-sm mb-1">
                    Avg Engagement
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {scheduledContent.filter((c) => c.performance).length > 0
                      ? (
                          scheduledContent
                            .filter((c) => c.performance)
                            .reduce(
                              (sum, c) =>
                                sum + (c.performance?.engagement || 0),
                              0,
                            ) /
                          scheduledContent.filter((c) => c.performance).length
                        ).toFixed(1)
                      : "0.0"}
                  </div>
                  <div className="text-green-400 text-sm">
                    Performance score
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
                {/* Calendar Header */}
                <div className="p-4 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-slate-300">
                      {formatMonthYear(currentDate)}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigateCalendar("prev")}
                        className="p-2 hover:bg-slate-700 rounded transition-colors"
                      >
                        <span className="text-slate-400">←</span>
                      </button>
                      <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
                      >
                        Today
                      </button>
                      <button
                        onClick={() => navigateCalendar("next")}
                        className="p-2 hover:bg-slate-700 rounded transition-colors"
                      >
                        <span className="text-slate-400">�������</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 border-b border-slate-700/50">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-3 text-center text-slate-400 text-sm font-medium border-r border-slate-700/50 last:border-r-0"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                  {getCalendarDays().map((dayData, index) => {
                    const platformIcons = {
                      YouTube: "📹",
                      Instagram: "📱",
                      LinkedIn: "💼",
                      TikTok: "🎥",
                      Twitter: "🐦",
                      Blog: "📝",
                    };

                    const statusColors = {
                      planned:
                        "bg-yellow-900/30 border-yellow-500/30 text-yellow-300",
                      "in-review":
                        "bg-blue-900/30 border-blue-500/30 text-blue-300",
                      ready:
                        "bg-green-900/30 border-green-500/30 text-green-300",
                      published:
                        "bg-purple-900/30 border-purple-500/30 text-purple-300",
                    };

                    return (
                      <div
                        key={index}
                        className={`min-h-[120px] p-2 border-r border-b border-slate-700/50 last:border-r-0 hover:bg-slate-700/20 transition-colors cursor-pointer ${dayData.isToday ? "bg-emerald-900/20" : ""}`}
                        onClick={() => {
                          const newDate = new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            dayData.date,
                          );
                          setNewContentForm((prev) => ({
                            ...prev,
                            date: newDate.toISOString().split("T")[0],
                          }));
                          handleNewContent();
                        }}
                      >
                        <div
                          className={`text-sm font-medium mb-2 ${dayData.isToday ? "text-emerald-400" : "text-slate-300"}`}
                        >
                          {dayData.date}
                        </div>

                        {dayData.content.length > 0 && (
                          <div className="space-y-1">
                            {dayData.content.slice(0, 3).map((content) => (
                              <div
                                key={content.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditContent(content);
                                }}
                                className={`p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${statusColors[content.status]}`}
                              >
                                {platformIcons[content.platform] || "📄"}{" "}
                                {content.platform}:{" "}
                                {content.title.length > 15
                                  ? content.title.substring(0, 15) + "..."
                                  : content.title}
                              </div>
                            ))}
                            {dayData.content.length > 3 && (
                              <div className="text-xs text-slate-400 p-1">
                                +{dayData.content.length - 3} more
                              </div>
                            )}
                          </div>
                        )}

                        {dayData.content.length === 0 && (
                          <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-slate-500 text-xs">
                              + Add content
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Content Pipeline */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Content */}
                <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-slate-300">
                      Upcoming Content
                    </h4>
                    <button
                      onClick={handleNewContent}
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {scheduledContent
                      .filter((content) => content.status !== "published")
                      .sort(
                        (a, b) =>
                          new Date(a.date).getTime() -
                          new Date(b.date).getTime(),
                      )
                      .slice(0, 4)
                      .map((content) => {
                        const statusColors = {
                          planned:
                            "bg-yellow-900/30 text-yellow-300 border border-yellow-500/30",
                          "in-review":
                            "bg-blue-900/30 text-blue-300 border border-blue-500/30",
                          ready:
                            "bg-green-900/30 text-green-300 border border-green-500/30",
                          published:
                            "bg-purple-900/30 text-purple-300 border border-purple-500/30",
                        };

                        return (
                          <div
                            key={content.id}
                            className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="text-slate-300 font-medium">
                                {content.title}
                              </div>
                              <div className="text-slate-400 text-sm">
                                {content.platform} •{" "}
                                {new Date(content.date).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-2 py-1 rounded text-xs ${statusColors[content.status]}`}
                              >
                                {content.status.charAt(0).toUpperCase() +
                                  content.status.slice(1).replace("-", " ")}
                              </span>
                              <button
                                onClick={() => handleEditContent(content)}
                                className="p-1 hover:bg-slate-600 rounded transition-colors"
                              >
                                <span className="text-slate-400">���</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    {scheduledContent.filter((c) => c.status !== "published")
                      .length === 0 && (
                      <div className="text-center py-8 text-slate-400">
                        <p>No upcoming content scheduled</p>
                        <button
                          onClick={handleNewContent}
                          className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded transition-colors"
                        >
                          Schedule First Content
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Ideas Bank */}
                <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-slate-300">
                      Content Ideas Bank
                    </h4>
                    <button
                      onClick={generateContentIdea}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded transition-colors"
                    >
                      🤖 AI Idea
                    </button>
                  </div>
                  <div className="space-y-3">
                    {contentIdeas.slice(0, 4).map((idea) => {
                      const priorityColors = {
                        high: "bg-red-900/30 text-red-300 border border-red-500/30",
                        medium:
                          "bg-yellow-900/30 text-yellow-300 border border-yellow-500/30",
                        low: "bg-slate-600/30 text-slate-400 border border-slate-500/30",
                      };

                      return (
                        <div
                          key={idea.id}
                          className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="text-slate-300 font-medium">
                              {idea.title}
                            </div>
                            <div className="text-slate-400 text-sm">
                              {idea.pillar} ��� Est. {idea.estimatedEngagement}%
                              engagement
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${priorityColors[idea.priority]}`}
                            >
                              {idea.priority.charAt(0).toUpperCase() +
                                idea.priority.slice(1)}
                            </span>
                            <button
                              onClick={() => handleScheduleIdea(idea)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded transition-colors"
                            >
                              Schedule
                            </button>
                            <button
                              onClick={() => handleDeleteIdea(idea.id)}
                              className="p-1 hover:bg-red-600/20 rounded transition-colors"
                            >
                              <span className="text-red-400 text-xs">×</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {contentIdeas.length === 0 && (
                      <div className="text-center py-8 text-slate-400">
                        <p>No content ideas yet</p>
                        <button
                          onClick={generateContentIdea}
                          className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded transition-colors"
                        >
                          Generate AI Ideas
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Performance Tracking */}
              <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-slate-300">
                    Recent Content Performance
                  </h4>
                  <button
                    onClick={() => {
                      // Simulate updating performance data
                      setScheduledContent((prev) =>
                        prev.map((content) => ({
                          ...content,
                          performance: content.performance
                            ? {
                                ...content.performance,
                                views:
                                  content.performance.views +
                                  Math.floor(Math.random() * 1000),
                                engagement:
                                  Math.round(
                                    (content.performance.engagement +
                                      (Math.random() - 0.5)) *
                                      10,
                                  ) / 10,
                              }
                            : undefined,
                        })),
                      );
                    }}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-colors"
                  >
                    ������� Refresh
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 text-slate-400">
                          Content
                        </th>
                        <th className="text-left py-3 text-slate-400">
                          Platform
                        </th>
                        <th className="text-left py-3 text-slate-400">
                          Published
                        </th>
                        <th className="text-left py-3 text-slate-400">Views</th>
                        <th className="text-left py-3 text-slate-400">
                          Engagement
                        </th>
                        <th className="text-left py-3 text-slate-400">Score</th>
                        <th className="text-left py-3 text-slate-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduledContent
                        .filter(
                          (content) =>
                            content.status === "published" &&
                            content.performance,
                        )
                        .slice(0, 5)
                        .map((content) => (
                          <tr
                            key={content.id}
                            className="border-b border-slate-700/50 hover:bg-slate-700/20"
                          >
                            <td className="py-3 text-slate-300 font-medium">
                              {content.title}
                            </td>
                            <td className="py-3 text-slate-300">
                              {content.platform}
                            </td>
                            <td className="py-3 text-slate-400">
                              {new Date(content.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 text-white font-semibold">
                              {content.performance
                                ? (content.performance.views / 1000).toFixed(
                                    1,
                                  ) + "K"
                                : "-"}
                            </td>
                            <td className="py-3">
                              <span
                                className={`font-medium ${
                                  content.performance &&
                                  content.performance.engagement > 7
                                    ? "text-green-400"
                                    : content.performance &&
                                        content.performance.engagement > 5
                                      ? "text-yellow-400"
                                      : "text-red-400"
                                }`}
                              >
                                {content.performance
                                  ? content.performance.engagement.toFixed(1) +
                                    "%"
                                  : "-"}
                              </span>
                            </td>
                            <td className="py-3">
                              <span
                                className={`font-medium ${
                                  content.performance &&
                                  content.performance.score > 8
                                    ? "text-green-400"
                                    : content.performance &&
                                        content.performance.score > 6
                                      ? "text-yellow-400"
                                      : "text-red-400"
                                }`}
                              >
                                {content.performance
                                  ? content.performance.score.toFixed(1) + "/10"
                                  : "-"}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditContent(content)}
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded transition-colors"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => {
                                    // Create similar content
                                    setNewContentForm({
                                      title: "Similar to: " + content.title,
                                      platform: content.platform,
                                      contentType: content.contentType,
                                      date: "",
                                      time: content.time,
                                      description:
                                        "Based on successful content: " +
                                        content.description,
                                      pillar: content.pillar,
                                      status: "planned",
                                    });
                                    setShowNewContentModal(true);
                                  }}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded transition-colors"
                                >
                                  Replicate
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      {scheduledContent.filter(
                        (c) => c.status === "published" && c.performance,
                      ).length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="py-8 text-center text-slate-400"
                          >
                            No published content with performance data yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Content Suggestions */}
              <div className="p-6 bg-gradient-to-r from-emerald-900/20 to-blue-900/20 rounded-xl border border-emerald-500/30">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-300">
                      AI Content Suggestions
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Based on your strategy and current trends
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-emerald-400">💡</span>
                      <span className="text-emerald-400 font-medium">
                        Trending Topic
                      </span>
                    </div>
                    <h5 className="text-slate-300 font-medium mb-2">
                      "AI Ethics in Content Creation"
                    </h5>
                    <p className="text-slate-400 text-sm mb-3">
                      This topic is trending 45% above average in your niche
                    </p>
                    <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded">
                      Add to Calendar
                    </button>
                  </div>

                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-blue-400">⚡</span>
                      <span className="text-blue-400 font-medium">
                        Content Gap
                      </span>
                    </div>
                    <h5 className="text-slate-300 font-medium mb-2">
                      "Beginner-Friendly AI Tutorials"
                    </h5>
                    <p className="text-slate-400 text-sm mb-3">
                      Your audience is asking for more beginner content
                    </p>
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded">
                      Generate Ideas
                    </button>
                  </div>
                </div>
              </div>

              {/* New Content Modal */}
              {showNewContentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-slate-300">
                          Schedule New Content
                        </h3>
                        <button
                          onClick={() => setShowNewContentModal(false)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Title */}
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Content Title
                          </label>
                          <input
                            type="text"
                            value={newContentForm.title}
                            onChange={(e) =>
                              setNewContentForm((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            placeholder="Enter content title..."
                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-100 placeholder-slate-400"
                          />
                        </div>

                        {/* Platform & Content Type */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Platform
                            </label>
                            <select
                              value={newContentForm.platform}
                              onChange={(e) =>
                                setNewContentForm((prev) => ({
                                  ...prev,
                                  platform: e.target.value,
                                }))
                              }
                              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
                            >
                              <option value="YouTube">YouTube</option>
                              <option value="Instagram">Instagram</option>
                              <option value="LinkedIn">LinkedIn</option>
                              <option value="TikTok">TikTok</option>
                              <option value="Twitter">Twitter</option>
                              <option value="Blog">Blog</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Content Type
                            </label>
                            <select
                              value={newContentForm.contentType}
                              onChange={(e) =>
                                setNewContentForm((prev) => ({
                                  ...prev,
                                  contentType: e.target.value,
                                }))
                              }
                              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
                            >
                              <option value="Video">Video</option>
                              <option value="Article">Article</option>
                              <option value="Story">Story</option>
                              <option value="Post">Post</option>
                              <option value="Live Stream">Live Stream</option>
                              <option value="Reel">Reel</option>
                            </select>
                          </div>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Date
                            </label>
                            <input
                              type="date"
                              value={newContentForm.date}
                              onChange={(e) =>
                                setNewContentForm((prev) => ({
                                  ...prev,
                                  date: e.target.value,
                                }))
                              }
                              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Time
                            </label>
                            <input
                              type="time"
                              value={newContentForm.time}
                              onChange={(e) =>
                                setNewContentForm((prev) => ({
                                  ...prev,
                                  time: e.target.value,
                                }))
                              }
                              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
                            />
                          </div>
                        </div>

                        {/* Pillar & Status */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Content Pillar
                            </label>
                            <select
                              value={newContentForm.pillar}
                              onChange={(e) =>
                                setNewContentForm((prev) => ({
                                  ...prev,
                                  pillar: e.target.value,
                                }))
                              }
                              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
                            >
                              <option value="">Select pillar...</option>
                              <option value="AI Education">AI Education</option>
                              <option value="Thought Leadership">
                                Thought Leadership
                              </option>
                              <option value="Personal Brand">
                                Personal Brand
                              </option>
                              <option value="Industry Trends">
                                Industry Trends
                              </option>
                              <option value="Educational">Educational</option>
                              <option value="Entertainment">
                                Entertainment
                              </option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Status
                            </label>
                            <select
                              value={newContentForm.status}
                              onChange={(e) =>
                                setNewContentForm((prev) => ({
                                  ...prev,
                                  status: e.target.value as any,
                                }))
                              }
                              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
                            >
                              <option value="planned">Planned</option>
                              <option value="in-review">In Review</option>
                              <option value="ready">Ready</option>
                              <option value="published">Published</option>
                            </select>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Description
                          </label>
                          <textarea
                            value={newContentForm.description}
                            onChange={(e) =>
                              setNewContentForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Describe your content idea..."
                            rows={3}
                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-100 placeholder-slate-400 resize-none"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end space-x-3 pt-4">
                          <button
                            onClick={() => setShowNewContentModal(false)}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveContent}
                            disabled={
                              !newContentForm.title || !newContentForm.date
                            }
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                          >
                            Schedule Content
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Details Modal */}
              {showContentDetailsModal && selectedContentItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-slate-300">
                          Content Details
                        </h3>
                        <button
                          onClick={() => setShowContentDetailsModal(false)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Title */}
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Content Title
                          </label>
                          <input
                            type="text"
                            value={newContentForm.title}
                            onChange={(e) =>
                              setNewContentForm((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
                          />
                        </div>

                        {/* Platform & Content Type */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Platform
                            </label>
                            <select
                              value={newContentForm.platform}
                              onChange={(e) =>
                                setNewContentForm((prev) => ({
                                  ...prev,
                                  platform: e.target.value,
                                }))
                              }
                              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
                            >
                              <option value="YouTube">YouTube</option>
                              <option value="Instagram">Instagram</option>
                              <option value="LinkedIn">LinkedIn</option>
                              <option value="TikTok">TikTok</option>
                              <option value="Twitter">Twitter</option>
                              <option value="Blog">Blog</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Content Type
                            </label>
                            <select
                              value={newContentForm.contentType}
                              onChange={(e) =>
                                setNewContentForm((prev) => ({
                                  ...prev,
                                  contentType: e.target.value,
                                }))
                              }
                              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-100"
                            >
                              <option value="Video">Video</option>
                              <option value="Article">Article</option>
                              <option value="Story">Story</option>
                              <option value="Post">Post</option>
                              <option value="Live Stream">Live Stream</option>
                              <option value="Reel">Reel</option>
                            </select>
                          </div>
                        </div>

                        {/* Performance Data (if available) */}
                        {selectedContentItem.performance && (
                          <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                            <h4 className="text-sm font-medium text-slate-300 mb-3">
                              Performance Data
                            </h4>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center">
                                <div className="text-lg font-bold text-white">
                                  {(
                                    selectedContentItem.performance.views / 1000
                                  ).toFixed(1)}
                                  K
                                </div>
                                <div className="text-xs text-slate-400">
                                  Views
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-green-400">
                                  {selectedContentItem.performance.engagement.toFixed(
                                    1,
                                  )}
                                  %
                                </div>
                                <div className="text-xs text-slate-400">
                                  Engagement
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-purple-400">
                                  {selectedContentItem.performance.score.toFixed(
                                    1,
                                  )}
                                  /10
                                </div>
                                <div className="text-xs text-slate-400">
                                  Score
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Description
                          </label>
                          <textarea
                            value={newContentForm.description}
                            onChange={(e) =>
                              setNewContentForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            rows={3}
                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-100 resize-none"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-4">
                          <button
                            onClick={() =>
                              handleDeleteContent(selectedContentItem.id)
                            }
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                          >
                            Delete Content
                          </button>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => setShowContentDetailsModal(false)}
                              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleUpdateContent}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                            >
                              Update Content
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Templates View */}
          {activeView === "templates" && (
            <div className="space-y-6">
              {/* Templates Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    Strategy Templates
                  </h2>
                  <p className="text-slate-400">
                    Pre-built strategies for different business goals and
                    industries
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                    {strategyTemplates.filter((t) => !t.isPremium).length} Free
                  </span>
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                    {strategyTemplates.filter((t) => t.isPremium && !t.isUltimate).length} Pro
                  </span>
                  <span className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded border border-purple-500/30">
                    {strategyTemplates.filter((t) => t.isUltimate).length} Ultimate
                  </span>
                </div>
              </div>

              {/* Free Templates Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-[var(--color-success-background)] border border-[var(--color-success-border)]">
                    <CheckCircleIcon className="w-5 h-5 text-[var(--color-success)]" />
                  </div>
                  <div>
                    <h3 className="heading-4 text-[var(--color-success)]">
                      Free Templates
                    </h3>
                    <p className="body-small text-[var(--text-tertiary)]">
                      Perfect for getting started with content strategy
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {strategyTemplates
                    .filter((template) => !template.isPremium)
                    .map((template) => (
                      <Card
                        key={template.id}
                        variant="hover"
                        className={`group h-full flex flex-col transition-all duration-200 ${
                          isLoadingTemplate ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'
                        }`}
                        onClick={() => {
                          if (!isLoadingTemplate) {
                            loadTemplate(template.id);
                            setActiveView("create");
                          }
                        }}
                      >
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="heading-5 group-hover:text-[var(--color-success)] transition-colors">
                                  {template.name}
                                </h4>
                                <Badge variant="success" size="sm">
                                  FREE
                                </Badge>
                              </div>
                              <p className="body-small text-[var(--text-secondary)] line-clamp-3">
                                {template.description}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <span className="label-small text-[var(--text-tertiary)] block mb-2">
                                Platforms
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {template.platforms.map((platform, idx) => (
                                  <Badge key={idx} variant="neutral" size="sm">
                                    {platform}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="label-small text-[var(--text-tertiary)] block mb-2">
                                Content Pillars
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {template.pillars
                                  .slice(0, 2)
                                  .map((pillar, idx) => (
                                    <Badge key={idx} variant="success" size="sm">
                                      {pillar}
                                    </Badge>
                                  ))}
                                {template.pillars.length > 2 && (
                                  <Badge variant="neutral" size="sm">
                                    +{template.pillars.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[var(--border-secondary)]">
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full"
                            loading={isLoadingTemplate}
                            disabled={isLoadingTemplate}
                          >
                            {isLoadingTemplate ? "Loading..." : "Use Template"}
                          </Button>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Premium Templates Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-[var(--color-warning-background)] border border-[var(--color-warning-border)]">
                    <StarIcon className="w-5 h-5 text-[var(--color-warning)]" />
                  </div>
                  <div>
                    <h3 className="heading-4 text-[var(--color-warning)]">
                      Premium Templates
                    </h3>
                    <p className="body-small text-[var(--text-tertiary)]">
                      Advanced strategies with detailed implementation guides
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {strategyTemplates
                    .filter((template) => template.isPremium && !template.isUltimate)
                    .map((template) => (
                      <Card
                        key={template.id}
                        variant={isPremium ? "hover" : "default"}
                        className={`group h-full flex flex-col relative transition-all duration-200 ${
                          !isPremium ? "opacity-75" : ""
                        } ${
                          isLoadingTemplate ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                        }`}
                        onClick={() => {
                          if (isLoadingTemplate) return;
                          if (!isPremium) {
                            onUpgrade?.();
                            return;
                          }
                          loadTemplate(template.id);
                          setActiveView("create");
                        }}
                      >
                        {!isPremium && (
                          <div className="absolute top-3 right-3">
                            <div className="p-1 rounded bg-[var(--color-warning-background)] border border-[var(--color-warning-border)]">
                              <LockClosedIcon className="w-4 h-4 text-[var(--color-warning)]" />
                            </div>
                          </div>
                        )}

                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-8">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className={`heading-5 transition-colors ${
                                  isPremium
                                    ? "group-hover:text-[var(--color-warning)]"
                                    : "text-[var(--text-tertiary)]"
                                }`}>
                                  {template.name}
                                </h4>
                                <Badge variant="warning" size="sm">
                                  PRO
                                </Badge>
                              </div>
                              <p className={`body-small line-clamp-3 ${
                                isPremium ? "text-[var(--text-secondary)]" : "text-[var(--text-tertiary)]"
                              }`}>
                                {template.description}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <span className="label-small text-[var(--text-tertiary)] block mb-2">
                                Platforms
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {template.platforms.map((platform, idx) => (
                                  <Badge
                                    key={idx}
                                    variant={isPremium ? "neutral" : "disabled"}
                                    size="sm"
                                  >
                                    {platform}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="label-small text-[var(--text-tertiary)] block mb-2">
                                Content Pillars
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {template.pillars
                                  .slice(0, 2)
                                  .map((pillar, idx) => (
                                    <Badge
                                      key={idx}
                                      variant={isPremium ? "warning" : "disabled"}
                                      size="sm"
                                    >
                                      {pillar}
                                    </Badge>
                                  ))}
                                {template.pillars.length > 2 && (
                                  <Badge
                                    variant={isPremium ? "neutral" : "disabled"}
                                    size="sm"
                                  >
                                    +{template.pillars.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Premium Features Preview */}
                            {template.advanced && (
                              <div className="pt-3 border-t border-[var(--border-secondary)]">
                                <span className="label-small text-[var(--color-warning)] block mb-2">
                                  Advanced Features
                                </span>
                                <div className="space-y-2">
                                  {Object.keys(template.advanced)
                                    .slice(0, 2)
                                    .map((feature, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center space-x-2"
                                      >
                                        <div className="w-1.5 h-1.5 bg-[var(--color-warning)] rounded-full flex-shrink-0" />
                                        <span className={`body-small capitalize ${
                                          isPremium ? "text-[var(--text-secondary)]" : "text-[var(--text-tertiary)]"
                                        }`}>
                                          {feature
                                            .replace(/([A-Z])/g, " $1")
                                            .trim()}
                                        </span>
                                      </div>
                                    ))}
                                  {Object.keys(template.advanced).length > 2 && (
                                    <div className="flex items-center space-x-2">
                                      <div className="w-1.5 h-1.5 bg-[var(--color-warning)] rounded-full flex-shrink-0" />
                                      <span className={`body-small ${
                                        isPremium ? "text-[var(--text-secondary)]" : "text-[var(--text-tertiary)]"
                                      }`}>
                                        +{Object.keys(template.advanced).length - 2} more features
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[var(--border-secondary)]">
                          <Button
                            variant={isPremium ? "warning" : "disabled"}
                            size="sm"
                            className="w-full"
                            loading={isLoadingTemplate}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isPremium) {
                                onUpgrade?.();
                              }
                            }}
                            disabled={!isPremium || isLoadingTemplate}
                          >
                            {isLoadingTemplate
                              ? "Loading..."
                              : (isPremium ? "Use Template" : "Upgrade to Use")}
                          </Button>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Ultimate Templates Section (Agency Pro only) */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--brand-primary-background)] to-[var(--brand-secondary-background)] border border-[var(--brand-primary-border)]">
                    <span className="text-2xl">���</span>
                  </div>
                  <div>
                    <h3 className="heading-4">
                      <GradientText>Ultimate Templates</GradientText>
                    </h3>
                    <p className="body-small text-[var(--text-tertiary)]">
                      Enterprise-grade strategies for maximum impact
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {strategyTemplates
                    .filter((template) => template.isUltimate)
                    .map((template) => (
                      <div
                        key={template.id}
                        className={`group rounded-xl transition-all duration-200 ${
                          isLoadingTemplate ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        } ${
                          !hasUltimateAccess()
                            ? "bg-slate-800/30 border border-purple-700/50 hover:border-purple-500/50"
                            : "bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/50 hover:border-purple-400/70 hover:shadow-lg hover:shadow-purple-500/20"
                        }`}
                        onClick={() => {
                          if (isLoadingTemplate) return;
                          if (!hasUltimateAccess()) {
                            onUpgrade();
                            return;
                          }
                          loadTemplate(template.id);
                          setActiveView("create");
                        }}
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <h3
                                className={`font-semibold transition-colors ${
                                  hasUltimateAccess()
                                    ? "text-white group-hover:text-purple-300"
                                    : "text-slate-400"
                                }`}
                              >
                                {template.name}
                              </h3>
                              <span className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded text-xs border border-purple-500/30">
                                ULTIMATE
                              </span>
                            </div>
                            {!hasUltimateAccess() && (
                              <LockClosedIcon className="h-4 w-4 text-purple-400" />
                            )}
                          </div>
                          <p
                            className={`text-sm mb-4 ${
                              hasUltimateAccess()
                                ? "text-slate-400"
                                : "text-slate-500"
                            }`}
                          >
                            {template.description}
                          </p>

                          <div className="space-y-3 mb-4">
                            <div>
                              <span className="text-xs font-medium text-slate-500">
                                Enterprise Features:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {template.pillars.slice(0, 3).map((pillar, idx) => (
                                  <span
                                    key={idx}
                                    className={`px-2 py-1 text-xs rounded ${
                                      hasUltimateAccess()
                                        ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                                        : "bg-slate-700 text-slate-500"
                                    }`}
                                  >
                                    {pillar}
                                  </span>
                                ))}
                                {template.pillars.length > 3 && (
                                  <span
                                    className={`px-2 py-1 text-xs rounded ${
                                      hasUltimateAccess()
                                        ? "bg-slate-600 text-slate-400"
                                        : "bg-slate-700 text-slate-500"
                                    }`}
                                  >
                                    +{template.pillars.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Ultimate Features Preview */}
                            {template.advanced && (
                              <div className="pt-2 border-t border-purple-700/30">
                                <span className="text-xs font-medium text-purple-400">
                                  Ultimate Capabilities:
                                </span>
                                <div className="mt-1 space-y-1">
                                  {Object.keys(template.advanced)
                                    .slice(0, 3)
                                    .map((feature, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center space-x-2"
                                      >
                                        <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                                        <span
                                          className={`text-xs capitalize ${
                                            hasUltimateAccess()
                                              ? "text-slate-400"
                                              : "text-slate-500"
                                          }`}
                                        >
                                          {feature
                                            .replace(/([A-Z])/g, " $1")
                                            .trim()}
                                        </span>
                                      </div>
                                    ))}
                                  {Object.keys(template.advanced).length > 3 && (
                                    <div className="flex items-center space-x-2">
                                      <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                                      <span
                                        className={`text-xs ${
                                          hasUltimateAccess()
                                            ? "text-slate-400"
                                            : "text-slate-500"
                                        }`}
                                      >
                                        +{Object.keys(template.advanced).length - 3} more capabilities
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <button
                            className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              hasUltimateAccess() && !isLoadingTemplate
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/25"
                                : "bg-slate-700 text-slate-400 cursor-not-allowed"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!hasUltimateAccess()) {
                                onUpgrade();
                              }
                            }}
                            disabled={!hasUltimateAccess() || isLoadingTemplate}
                          >
                            {isLoadingTemplate
                              ? "Loading..."
                              : (hasUltimateAccess()
                                  ? "Use Ultimate Template"
                                  : "Upgrade to Agency Pro")}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Agency Pro Upsell for Ultimate Templates */}
              {!hasUltimateAccess() && (
                <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30">
                  <div className="text-center">
                    <span className="text-4xl mb-4 block">💎</span>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Unlock Ultimate Strategy Templates
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Access enterprise-level strategy templates designed for global expansion,
                      AI transformation, and sustainability leadership.
                    </p>
                    <div className="flex items-center justify-between gap-4 mb-6 text-sm max-w-2xl mx-auto">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                        <span>Global Market Strategies</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-300">
                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                        <span>AI Transformation</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-300">
                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                        <span>ESG Leadership</span>
                      </div>
                    </div>
                    <button
                      onClick={onUpgrade}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-semibold text-white shadow-lg"
                    >
                      Upgrade to Agency Pro
                    </button>
                  </div>
                </div>
              )}

              {/* Premium Upsell for Template Section */}
              {!isPremium && (
                <div className="mt-8 p-6 bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-xl border border-amber-500/30">
                  <div className="text-center">
                    <StarIcon className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      Unlock Premium Strategy Templates
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Get access to advanced templates with comprehensive
                      strategies, competitor analysis, and detailed
                      implementation guides.
                    </p>
                    <div className="flex items-center justify-between gap-4 mb-6 text-sm max-w-2xl mx-auto">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <ChartBarIcon className="w-4 h-4 text-amber-400" />
                        <span>Advanced Analytics</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-300">
                        <UsersIcon className="w-4 h-4 text-amber-400" />
                        <span>Competitor Research</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-300">
                        <DocumentTextIcon className="w-4 h-4 text-amber-400" />
                        <span>Implementation Guides</span>
                      </div>
                    </div>
                    <button
                      onClick={onUpgrade}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl font-semibold text-white shadow-lg"
                    >
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Premium Upsell for Free Users */}
          {!isPremium && (
            <div className="mt-8 p-6 bg-gradient-to-r from-emerald-900/20 to-blue-900/20 rounded-xl border border-emerald-500/30">
              <div className="text-center">
                <CrownIcon className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Unlock Premium Strategy Features
                </h3>
                <p className="text-slate-300 mb-4">
                  Access premium strategy templates, advanced AI insights, and
                  advanced customization options.
                </p>
                <div className="flex items-center justify-between gap-4 mb-6 text-sm max-w-2xl mx-auto">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <DocumentTextIcon className="w-4 h-4 text-amber-400" />
                    <span>Premium Templates</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <BrainIcon className="w-4 h-4 text-purple-400" />
                    <span>Advanced AI Insights</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <FilterIcon className="w-4 h-4 text-emerald-400" />
                    <span>Advanced Options</span>
                  </div>
                </div>
                <button
                  onClick={onUpgrade}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 rounded-xl font-semibold text-white shadow-lg"
                >
                  Upgrade to Premium
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Regenerate Confirmation Modal */}
      {showRegenerateConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-600/50 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Regenerate this pillar?</h3>
              <p className="text-slate-400 mb-6">This will cost 1 credit.</p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRegenerateConfirm(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white rounded-xl transition-colors border border-slate-600/50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const pillarIndex = showRegenerateConfirm;
                    setShowRegenerateConfirm(null);
                    regenerateContentPillar(pillarIndex);
                  }}
                  disabled={regeneratingPillar === showRegenerateConfirm}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {regeneratingPillar === showRegenerateConfirm ? 'Regenerating...' : 'OK'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
