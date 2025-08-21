import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Users,
  TrendingUp,
  Calendar,
  Brain,
  Lightbulb,
  BarChart3,
  Zap,
  CheckCircle,
  Circle,
  Plus,
  Edit3,
  Save,
  X,
  RefreshCw,
  Download,
  Share2,
  Layers,
  Settings,
  Award,
  Rocket,
  FileText,
  Clock,
  Eye,
  Trash2,
  Megaphone,
  Play,
  Calendar as CalendarIcon,
  BarChart2,
  ChevronRight,
  Shield,
  TrendingDown,
  MapPin,
  AlertTriangle,
  Scale,
  Briefcase,
  Filter,
  FolderOpen,
  Grid3X3,
} from "lucide-react";

// Import our world-class components
import {
  Button,
  Card,
  Input,
  Badge,
  QuickActionCard,
  ProgressBar,
  TabHeader,
  GradientText,
  EmptyState,
} from "./ui/WorldClassComponents";

// Import types
import { ContentStrategyPlanOutput } from "../types";
import { PremiumContentStrategy } from "./PremiumContentStrategy";
import { useAuth } from "../context/AuthContext";
import { goalsService, StrategyGoal } from "../services/goalsService";
import { contentPillarsService, SavedContentPillar } from "../services/contentPillarsService";
import { platformStrategiesService, SavedPlatformStrategy } from "../services/platformStrategiesService";
import { campaignStrategiesService, SavedCampaignStrategy } from "../services/campaignStrategiesService";
import { competitorAnalysisService, SavedCompetitorAnalysis } from "../services/competitorAnalysisService";
import { customerJourneyService, SavedCustomerJourney } from "../services/customerJourneyService";
import { resourcePlanningService, SavedResourcePlan } from "../services/resourcePlanningService";
import { complianceService, SavedCompliancePlan } from "../services/complianceService";
import { riskManagementService, RiskManagementItem } from "../services/riskManagementService";
import { analyticsService, SavedAnalyticsMetric } from "../services/analyticsService";
import { monetizationService, SavedMonetizationItem } from "../services/monetizationService";

interface ContentPillar {
  id: string;
  name: string;
  description: string;
  color: string;
  percentage: number;
  topics: string[];
}

interface PlatformStrategy {
  platform: string;
  focus: string;
  postFrequency: string;
  audienceSize: string;
  engagementRate: string;
  topContentTypes: string[];
}

interface GeneratedStrategy {
  id: string;
  name: string;
  createdAt: Date;
  strategy: ContentStrategyPlanOutput;
  niche?: string;
  config?: any;
}

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'calendar' | 'platform' | 'content-pillars' | 'posting-schedule';
  tier: 'free' | 'pro' | 'agency';
  duration: string;
  platforms: string[];
  contentPillars: { name: string; percentage: number; color: string }[];
  postingSchedule: { platform: string; frequency: string; bestTimes: string[] }[];
  contentTypes: { type: string; percentage: number }[];
  keyFeatures: string[];
  monthlyGoals: { metric: string; target: string }[];
}

interface StrategyWorldClassProps {
  onCreateStrategy?: () => void;
  onEditStrategy?: (strategyId: string) => void;
  onExportStrategy?: () => void;
  generatedStrategies?: GeneratedStrategy[];
  onViewStrategy?: (strategy: GeneratedStrategy) => void;
  onDeleteStrategy?: (strategyId: string) => void;
  onExportStrategyData?: (strategy: GeneratedStrategy) => void;
  onSendToCanvas?: (content: string, title: string) => void;
  onSendStrategyMindMap?: (content: string, strategyPlan: ContentStrategyPlanOutput) => void;
  onAddToCalendar?: (selectedItems?: any[]) => void;
  onApplyTemplate?: (template: ContentTemplate) => void;
  isPremium?: boolean;
  subscriptionPlan?: string;
  onUpgrade?: () => void;
  sidebarExpanded?: boolean;
}

const StrategyWorldClass: React.FC<StrategyWorldClassProps> = ({
  onCreateStrategy,
  onEditStrategy,
  onExportStrategy,
  generatedStrategies = [],
  onViewStrategy,
  onDeleteStrategy,
  onExportStrategyData,
  onSendToCanvas,
  onSendStrategyMindMap,
  onAddToCalendar,
  onApplyTemplate,
  isPremium = false,
  subscriptionPlan = "free",
  onUpgrade,
  sidebarExpanded = true,
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'goals' | 'pillars' | 'platforms' | 'campaigns' | 'analytics' | 'monetization' | 'risk' | 'competitors' | 'journey' | 'resources' | 'compliance' | 'generated'>('overview');
  const [selectedStrategy, setSelectedStrategy] = useState<GeneratedStrategy | null>(null);
  const [strategyView, setStrategyView] = useState<'list' | 'details'>('list');
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState<'strategy' | 'content' | 'growth' | 'engagement'>('strategy');
  const [newGoalPriority, setNewGoalPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [strategyGoals, setStrategyGoals] = useState<StrategyGoal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [savedContentPillars, setSavedContentPillars] = useState<SavedContentPillar[]>([]);
  const [pillarsLoading, setPillarsLoading] = useState(true);
  const [savedPlatformStrategies, setSavedPlatformStrategies] = useState<SavedPlatformStrategy[]>([]);
  const [platformsLoading, setPlatformsLoading] = useState(true);
  const [savedCampaignStrategies, setSavedCampaignStrategies] = useState<SavedCampaignStrategy[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [savedCompetitorAnalyses, setSavedCompetitorAnalyses] = useState<SavedCompetitorAnalysis[]>([]);
  const [competitorsLoading, setCompetitorsLoading] = useState(true);
  const [savedCustomerJourneys, setSavedCustomerJourneys] = useState<SavedCustomerJourney[]>([]);
  const [journeysLoading, setJourneysLoading] = useState(true);
  const [savedResourcePlans, setSavedResourcePlans] = useState<SavedResourcePlan[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [savedCompliancePlans, setSavedCompliancePlans] = useState<SavedCompliancePlan[]>([]);
  const [complianceLoading, setComplianceLoading] = useState(true);
  const [savedRiskManagementItems, setSavedRiskManagementItems] = useState<RiskManagementItem[]>([]);
  const [riskManagementLoading, setRiskManagementLoading] = useState(true);
  const [savedAnalyticsMetrics, setSavedAnalyticsMetrics] = useState<SavedAnalyticsMetric[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [savedMonetizationItems, setSavedMonetizationItems] = useState<SavedMonetizationItem[]>([]);
  const [monetizationLoading, setMonetizationLoading] = useState(true);
  const [activeMonetizationSubTab, setActiveMonetizationSubTab] = useState<'revenue-streams' | 'pricing-strategy' | 'conversion-funnel'>('revenue-streams');

  // Grouping system state
  const [availableGroups, setAvailableGroups] = useState<string[]>(['All', 'Ungrouped']);
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showManageGroups, setShowManageGroups] = useState(false);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState('');

  // Creation modal states
  const [showCreatePillar, setShowCreatePillar] = useState(false);
  const [showCreatePlatformStrategy, setShowCreatePlatformStrategy] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showCreateMetric, setShowCreateMetric] = useState(false);

  // Form states for creation
  const [newPillar, setNewPillar] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    percentage: 25,
    topics: [] as string[],
    group: 'Ungrouped'
  });
  const [newPlatformStrategy, setNewPlatformStrategy] = useState({
    platform: '',
    focus: '',
    contentTypes: [] as string[],
    postingFrequency: '',
    bestTimes: [] as string[],
    engagementStrategy: '',
    monetizationApproach: '',
    keyMetrics: [] as string[],
    audienceTargeting: '',
    group: 'Ungrouped'
  });
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    targetAudience: '',
    channels: [] as string[],
    goals: [] as string[],
    group: 'Ungrouped'
  });
  const [newMetric, setNewMetric] = useState({
    title: '',
    description: '',
    type: 'primary' as 'primary' | 'advanced',
    category: '',
    target: '',
    group: 'Ungrouped'
  });

  const { user } = useAuth();

  // Group management functions
  const handleCreateGroup = () => {
    if (newGroupName.trim() && !availableGroups.includes(newGroupName.trim())) {
      setAvailableGroups([...availableGroups, newGroupName.trim()]);
      setSelectedGroup(newGroupName.trim());
      setShowCreateGroup(false);
      setNewGroupName('');
    }
  };

  const handleRenameGroup = (oldName: string, newName: string) => {
    if (newName.trim() && !availableGroups.includes(newName.trim()) && oldName !== 'All' && oldName !== 'Ungrouped') {
      const updatedGroups = availableGroups.map(group => group === oldName ? newName.trim() : group);
      setAvailableGroups(updatedGroups);
      if (selectedGroup === oldName) {
        setSelectedGroup(newName.trim());
      }
      setEditingGroup(null);
      setEditGroupName('');
    }
  };

  const handleDeleteGroup = (groupName: string) => {
    if (groupName !== 'All' && groupName !== 'Ungrouped') {
      const updatedGroups = availableGroups.filter(group => group !== groupName);
      setAvailableGroups(updatedGroups);
      if (selectedGroup === groupName) {
        setSelectedGroup('All');
      }
    }
  };

  // Save functions for creation modals
  const handleSavePillar = async () => {
    if (!user || !newPillar.name.trim()) return;

    try {
      const pillarData = {
        ...newPillar,
        topics: newPillar.topics.filter(topic => topic.trim()),
        source: 'manual-creation'
      };

      await contentPillarsService.saveContentPillar(user.uid, pillarData);

      // Refresh the pillars list
      const updatedPillars = await contentPillarsService.getUserContentPillars(user.uid);
      setSavedContentPillars(updatedPillars);

      // Reset form and close modal
      setNewPillar({
        name: '',
        description: '',
        color: '#3b82f6',
        percentage: 25,
        topics: [],
        group: 'Ungrouped'
      });
      setShowCreatePillar(false);
    } catch (error) {
      console.error('Failed to save content pillar:', error);
      alert('Failed to save content pillar. Please try again.');
    }
  };

  const handleSavePlatformStrategy = async () => {
    if (!user || !newPlatformStrategy.platform.trim()) return;

    try {
      const strategyData = {
        ...newPlatformStrategy,
        contentTypes: newPlatformStrategy.contentTypes.filter(type => type.trim()),
        bestTimes: newPlatformStrategy.bestTimes.filter(time => time.trim()),
        keyMetrics: newPlatformStrategy.keyMetrics.filter(metric => metric.trim()),
        source: 'manual-creation'
      };

      await platformStrategiesService.savePlatformStrategy(user.uid, strategyData);

      // Refresh the strategies list
      const updatedStrategies = await platformStrategiesService.getUserPlatformStrategies(user.uid);
      setSavedPlatformStrategies(updatedStrategies);

      // Reset form and close modal
      setNewPlatformStrategy({
        platform: '',
        focus: '',
        contentTypes: [],
        postingFrequency: '',
        bestTimes: [],
        engagementStrategy: '',
        monetizationApproach: '',
        keyMetrics: [],
        audienceTargeting: '',
        group: 'Ungrouped'
      });
      setShowCreatePlatformStrategy(false);
    } catch (error) {
      console.error('Failed to save platform strategy:', error);
      alert('Failed to save platform strategy. Please try again.');
    }
  };

  const handleSaveCampaign = async () => {
    if (!user || !newCampaign.name.trim()) return;

    try {
      const campaignData = {
        ...newCampaign,
        channels: newCampaign.channels.filter(channel => channel.trim()),
        goals: newCampaign.goals.filter(goal => goal.trim()),
        source: 'manual-creation'
      };

      await campaignStrategiesService.saveCampaignStrategy(user.uid, campaignData);

      // Refresh the campaigns list
      const updatedCampaigns = await campaignStrategiesService.getUserCampaignStrategies(user.uid);
      setSavedCampaignStrategies(updatedCampaigns);

      // Reset form and close modal
      setNewCampaign({
        name: '',
        type: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
        targetAudience: '',
        channels: [],
        goals: [],
        group: 'Ungrouped'
      });
      setShowCreateCampaign(false);
    } catch (error) {
      console.error('Failed to save campaign strategy:', error);
      alert('Failed to save campaign strategy. Please try again.');
    }
  };

  const handleSaveMetric = async () => {
    if (!user || !newMetric.title.trim()) return;

    try {
      const metricData = {
        ...newMetric,
        source: 'manual-creation'
      };

      await analyticsService.saveAnalyticsMetric(user.uid, metricData);

      // Refresh the metrics list
      const updatedMetrics = await analyticsService.getUserAnalyticsMetrics(user.uid);
      setSavedAnalyticsMetrics(updatedMetrics);

      // Reset form and close modal
      setNewMetric({
        title: '',
        description: '',
        type: 'primary',
        category: '',
        target: '',
        group: 'Ungrouped'
      });
      setShowCreateMetric(false);
    } catch (error) {
      console.error('Failed to save analytics metric:', error);
      alert('Failed to save analytics metric. Please try again.');
    }
  };

  // Load goals from Firebase/localStorage
  React.useEffect(() => {
    const loadGoals = async () => {
      if (!user) {
        setGoalsLoading(false);
        return;
      }

      try {
        setGoalsLoading(true);
        const goals = await goalsService.getUserGoals(user.uid);
        setStrategyGoals(goals);
      } catch (error) {
        console.error('Failed to load goals:', error);
        // Fallback to localStorage only
        try {
          const localGoals = JSON.parse(localStorage.getItem('studioHub:progressGoals') || '[]');
          setStrategyGoals(localGoals);
        } catch (localError) {
          console.error('Failed to load local goals:', localError);
          setStrategyGoals([]);
        }
      } finally {
        setGoalsLoading(false);
      }
    };

    loadGoals();
  }, [user]);

  // Load content pillars from Firebase/localStorage
  React.useEffect(() => {
    const loadContentPillars = async () => {
      if (!user) {
        setPillarsLoading(false);
        return;
      }

      try {
        setPillarsLoading(true);
        console.log('🔄 Loading content pillars for user:', user.uid);
        const pillars = await contentPillarsService.getUserContentPillars(user.uid);
        console.log('✅ Loaded content pillars:', pillars);
        setSavedContentPillars(pillars);
      } catch (error) {
        console.error('Failed to load content pillars:', error);
        // Fallback to localStorage only
        try {
          const localPillars = JSON.parse(localStorage.getItem('studioHub:contentPillars') || '[]');
          console.log('📁 Loaded content pillars from localStorage:', localPillars);
          setSavedContentPillars(localPillars);
        } catch (localError) {
          console.error('Failed to load local content pillars:', localError);
          setSavedContentPillars([]);
        }
      } finally {
        setPillarsLoading(false);
      }
    };

    loadContentPillars();
  }, [user]);

  // Load platform strategies from Firebase/localStorage
  React.useEffect(() => {
    const loadPlatformStrategies = async () => {
      if (!user) {
        setPlatformsLoading(false);
        return;
      }

      try {
        setPlatformsLoading(true);
        const strategies = await platformStrategiesService.getUserPlatformStrategies(user.uid);
        setSavedPlatformStrategies(strategies);
      } catch (error) {
        console.error('Failed to load platform strategies:', error);
        setSavedPlatformStrategies([]);
      } finally {
        setPlatformsLoading(false);
      }
    };

    loadPlatformStrategies();
  }, [user]);

  // Load campaign strategies from Firebase/localStorage
  React.useEffect(() => {
    const loadCampaignStrategies = async () => {
      if (!user) {
        setCampaignsLoading(false);
        return;
      }

      try {
        setCampaignsLoading(true);
        const campaigns = await campaignStrategiesService.getUserCampaignStrategies(user.uid);
        setSavedCampaignStrategies(campaigns);
      } catch (error) {
        console.error('Failed to load campaign strategies:', error);
        setSavedCampaignStrategies([]);
      } finally {
        setCampaignsLoading(false);
      }
    };

    loadCampaignStrategies();
  }, [user]);

  // Load competitor analyses from Firebase/localStorage
  React.useEffect(() => {
    const loadCompetitorAnalyses = async () => {
      if (!user) {
        setCompetitorsLoading(false);
        return;
      }

      try {
        setCompetitorsLoading(true);
        const analyses = await competitorAnalysisService.getUserCompetitorAnalyses(user.uid);
        setSavedCompetitorAnalyses(analyses);
      } catch (error) {
        console.error('Failed to load competitor analyses:', error);
        setSavedCompetitorAnalyses([]);
      } finally {
        setCompetitorsLoading(false);
      }
    };

    loadCompetitorAnalyses();
  }, [user]);

  // Load customer journeys from Firebase/localStorage
  React.useEffect(() => {
    const loadCustomerJourneys = async () => {
      if (!user) {
        setJourneysLoading(false);
        return;
      }

      try {
        setJourneysLoading(true);
        const journeys = await customerJourneyService.getUserCustomerJourneys(user.uid);
        setSavedCustomerJourneys(journeys);
      } catch (error) {
        console.error('Failed to load customer journeys:', error);
        setSavedCustomerJourneys([]);
      } finally {
        setJourneysLoading(false);
      }
    };

    loadCustomerJourneys();
  }, [user]);

  // Load resource plans from Firebase/localStorage
  React.useEffect(() => {
    const loadResourcePlans = async () => {
      if (!user) {
        setResourcesLoading(false);
        return;
      }

      try {
        setResourcesLoading(true);
        const plans = await resourcePlanningService.getUserResourcePlans(user.uid);
        setSavedResourcePlans(plans);
      } catch (error) {
        console.error('Failed to load resource plans:', error);
        setSavedResourcePlans([]);
      } finally {
        setResourcesLoading(false);
      }
    };

    loadResourcePlans();
  }, [user]);

  // Load compliance plans from Firebase/localStorage
  React.useEffect(() => {
    const loadCompliancePlans = async () => {
      if (!user) {
        setComplianceLoading(false);
        return;
      }

      try {
        setComplianceLoading(true);
        const plans = await complianceService.getUserCompliancePlans(user.uid);
        setSavedCompliancePlans(plans);
      } catch (error) {
        console.error('Failed to load compliance plans:', error);
        setSavedCompliancePlans([]);
      } finally {
        setComplianceLoading(false);
      }
    };

    loadCompliancePlans();
  }, [user]);

  // Load risk management items from Firebase/localStorage
  React.useEffect(() => {
    const loadRiskManagementItems = async () => {
      if (!user) {
        setRiskManagementLoading(false);
        return;
      }

      try {
        setRiskManagementLoading(true);
        const items = await riskManagementService.getRiskManagementItems(user.uid);
        setSavedRiskManagementItems(items);
      } catch (error) {
        console.error('Failed to load risk management items:', error);
        setSavedRiskManagementItems([]);
      } finally {
        setRiskManagementLoading(false);
      }
    };

    loadRiskManagementItems();
  }, [user]);

  // Load analytics metrics from Firebase/localStorage
  React.useEffect(() => {
    const loadAnalyticsMetrics = async () => {
      if (!user) {
        setAnalyticsLoading(false);
        return;
      }

      try {
        setAnalyticsLoading(true);
        const metrics = await analyticsService.getAnalyticsMetrics(user.uid);
        setSavedAnalyticsMetrics(metrics);
      } catch (error) {
        console.error('Failed to load analytics metrics:', error);
        setSavedAnalyticsMetrics([]);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    loadAnalyticsMetrics();
  }, [user]);

  // Load monetization items from Firebase/localStorage
  React.useEffect(() => {
    const loadMonetizationItems = async () => {
      if (!user) {
        setMonetizationLoading(false);
        return;
      }

      try {
        setMonetizationLoading(true);
        const items = await monetizationService.getMonetizationItems(user.uid);
        setSavedMonetizationItems(items);
      } catch (error) {
        console.error('Failed to load monetization items:', error);
        setSavedMonetizationItems([]);
      } finally {
        setMonetizationLoading(false);
      }
    };

    loadMonetizationItems();
  }, [user]);

  // Listen for content pillar saved events to auto-refresh
  React.useEffect(() => {
    const handleContentPillarSaved = async (event: CustomEvent) => {
      console.log('🔔 Content pillar saved event received:', event.detail);
      if (user) {
        try {
          const pillars = await contentPillarsService.getUserContentPillars(user.uid);
          setSavedContentPillars(pillars);
          console.log('🔄 Content pillars refreshed automatically');
        } catch (error) {
          console.error('Failed to auto-refresh content pillars:', error);
        }
      }
    };

    const handleStrategySaved = async () => {
      console.log('🔔 Strategy saved event received');
      if (user) {
        try {
          // Refresh all strategy data
          const [platforms, campaigns, competitors, journeys, resources, compliance, riskItems, analytics, monetization] = await Promise.all([
            platformStrategiesService.getUserPlatformStrategies(user.uid),
            campaignStrategiesService.getUserCampaignStrategies(user.uid),
            competitorAnalysisService.getUserCompetitorAnalyses(user.uid),
            customerJourneyService.getUserCustomerJourneys(user.uid),
            resourcePlanningService.getUserResourcePlans(user.uid),
            complianceService.getUserCompliancePlans(user.uid),
            riskManagementService.getRiskManagementItems(user.uid),
            analyticsService.getAnalyticsMetrics(user.uid),
            monetizationService.getMonetizationItems(user.uid)
          ]);

          setSavedPlatformStrategies(platforms);
          setSavedCampaignStrategies(campaigns);
          setSavedCompetitorAnalyses(competitors);
          setSavedCustomerJourneys(journeys);
          setSavedResourcePlans(resources);
          setSavedCompliancePlans(compliance);
          setSavedRiskManagementItems(riskItems);
          setSavedAnalyticsMetrics(analytics);
          setSavedMonetizationItems(monetization);

          console.log('🔄 All strategy data refreshed automatically');
        } catch (error) {
          console.error('Failed to auto-refresh strategy data:', error);
        }
      }
    };

    window.addEventListener('contentPillarSaved', handleContentPillarSaved as EventListener);
    window.addEventListener('strategySaved', handleStrategySaved as EventListener);

    return () => {
      window.removeEventListener('contentPillarSaved', handleContentPillarSaved as EventListener);
      window.removeEventListener('strategySaved', handleStrategySaved as EventListener);
    };
  }, [user]);

  // Content pillars should come from user's saved pillars or generated strategies
  // No hardcoded placeholder content pillars

  // Platform strategies will be populated from saved strategy data
  const platformStrategies: PlatformStrategy[] = [];

  // Content Strategy Templates
  const contentTemplates: ContentTemplate[] = [
    {
      id: "youtube-growth-30",
      name: "30-Day YouTube Growth",
      description: "Comprehensive strategy for rapid YouTube channel growth with consistent content calendar",
      category: "calendar",
      tier: "free",
      duration: "30 days",
      platforms: ["YouTube", "YouTube Shorts"],
      contentPillars: [
        { name: "Educational", percentage: 40, color: "#3b82f6" },
        { name: "Entertainment", percentage: 30, color: "#ef4444" },
        { name: "Behind-the-Scenes", percentage: 20, color: "#f59e0b" },
        { name: "Trending", percentage: 10, color: "#10b981" }
      ],
      postingSchedule: [
        { platform: "YouTube", frequency: "3x/week", bestTimes: ["2 PM EST", "7 PM EST"] },
        { platform: "YouTube Shorts", frequency: "Daily", bestTimes: ["12 PM EST", "6 PM EST"] }
      ],
      contentTypes: [
        { type: "Long-form videos", percentage: 60 },
        { type: "YouTube Shorts", percentage: 30 },
        { type: "Live streams", percentage: 10 }
      ],
      keyFeatures: [
        "SEO-optimized titles and descriptions",
        "Viral Shorts strategy",
        "Community engagement plan",
        "Thumbnail A/B testing framework"
      ],
      monthlyGoals: [
        { metric: "Subscribers", target: "+1,000" },
        { metric: "Watch time", target: "10,000 hours" },
        { metric: "Engagement rate", target: "8%" }
      ]
    },
    {
      id: "multi-platform-creator",
      name: "Multi-Platform Creator",
      description: "Unified content strategy across YouTube, TikTok, and Instagram for maximum reach",
      category: "platform",
      tier: "pro",
      duration: "60 days",
      platforms: ["YouTube", "TikTok", "Instagram", "Twitter"],
      contentPillars: [
        { name: "Educational", percentage: 35, color: "#3b82f6" },
        { name: "Trending Content", percentage: 25, color: "#ef4444" },
        { name: "Personal Branding", percentage: 25, color: "#f59e0b" },
        { name: "Community", percentage: 15, color: "#10b981" }
      ],
      postingSchedule: [
        { platform: "YouTube", frequency: "2x/week", bestTimes: ["2 PM EST", "7 PM EST"] },
        { platform: "TikTok", frequency: "Daily", bestTimes: ["6 AM EST", "7 PM EST", "9 PM EST"] },
        { platform: "Instagram", frequency: "5x/week", bestTimes: ["11 AM EST", "2 PM EST", "5 PM EST"] },
        { platform: "Twitter", frequency: "3x/day", bestTimes: ["9 AM EST", "1 PM EST", "6 PM EST"] }
      ],
      contentTypes: [
        { type: "Short-form videos", percentage: 50 },
        { type: "Long-form content", percentage: 25 },
        { type: "Stories/Posts", percentage: 20 },
        { type: "Live content", percentage: 5 }
      ],
      keyFeatures: [
        "Cross-platform content repurposing",
        "Platform-specific optimization",
        "Trend monitoring and adaptation",
        "Audience growth tracking"
      ],
      monthlyGoals: [
        { metric: "Total followers", target: "+5,000" },
        { metric: "Cross-platform engagement", target: "12%" },
        { metric: "Brand partnerships", target: "2-3 deals" }
      ]
    },
    {
      id: "tiktok-viral-strategy",
      name: "TikTok Viral Blueprint",
      description: "Proven framework for creating viral TikTok content with trend-based approach",
      category: "content-pillars",
      tier: "free",
      duration: "21 days",
      platforms: ["TikTok", "Instagram Reels", "YouTube Shorts"],
      contentPillars: [
        { name: "Trending Sounds", percentage: 30, color: "#ef4444" },
        { name: "Educational Quick Tips", percentage: 25, color: "#3b82f6" },
        { name: "Entertainment/Humor", percentage: 25, color: "#f59e0b" },
        { name: "Behind-the-Scenes", percentage: 20, color: "#10b981" }
      ],
      postingSchedule: [
        { platform: "TikTok", frequency: "2-3x/day", bestTimes: ["6 AM EST", "12 PM EST", "7 PM EST"] },
        { platform: "Instagram Reels", frequency: "Daily", bestTimes: ["11 AM EST", "7 PM EST"] },
        { platform: "YouTube Shorts", frequency: "Daily", bestTimes: ["12 PM EST", "6 PM EST"] }
      ],
      contentTypes: [
        { type: "Trend-based videos", percentage: 40 },
        { type: "Original concepts", percentage: 35 },
        { type: "Educational content", percentage: 25 }
      ],
      keyFeatures: [
        "Daily trend monitoring",
        "Hashtag optimization strategy",
        "Sound selection guide",
        "Viral timing predictions"
      ],
      monthlyGoals: [
        { metric: "Views", target: "1M+ total" },
        { metric: "Followers", target: "+10,000" },
        { metric: "Engagement rate", target: "15%" }
      ]
    },
    {
      id: "business-authority-builder",
      name: "Business Authority Builder",
      description: "Professional content strategy for B2B leaders and industry experts",
      category: "content-pillars",
      tier: "pro",
      duration: "90 days",
      platforms: ["LinkedIn", "YouTube", "Twitter", "Email"],
      contentPillars: [
        { name: "Industry Insights", percentage: 40, color: "#3b82f6" },
        { name: "Thought Leadership", percentage: 30, color: "#ef4444" },
        { name: "Case Studies", percentage: 20, color: "#f59e0b" },
        { name: "Personal Stories", percentage: 10, color: "#10b981" }
      ],
      postingSchedule: [
        { platform: "LinkedIn", frequency: "5x/week", bestTimes: ["9 AM EST", "12 PM EST", "3 PM EST"] },
        { platform: "YouTube", frequency: "Weekly", bestTimes: ["10 AM EST Tuesday"] },
        { platform: "Twitter", frequency: "Daily", bestTimes: ["8 AM EST", "1 PM EST", "5 PM EST"] },
        { platform: "Email", frequency: "Weekly", bestTimes: ["Tuesday 10 AM EST"] }
      ],
      contentTypes: [
        { type: "Professional articles", percentage: 40 },
        { type: "Video content", percentage: 30 },
        { type: "Industry reports", percentage: 20 },
        { type: "Networking posts", percentage: 10 }
      ],
      keyFeatures: [
        "Industry trend analysis",
        "Professional networking strategy",
        "Thought leadership positioning",
        "Lead generation optimization"
      ],
      monthlyGoals: [
        { metric: "LinkedIn connections", target: "+500" },
        { metric: "Email subscribers", target: "+200" },
        { metric: "Speaking opportunities", target: "1-2" }
      ]
    },
    {
      id: "content-creator-starter",
      name: "Content Creator Starter Pack",
      description: "Perfect for beginners starting their content creation journey",
      category: "posting-schedule",
      tier: "free",
      duration: "14 days",
      platforms: ["Instagram", "TikTok", "YouTube"],
      contentPillars: [
        { name: "Entertainment", percentage: 40, color: "#ef4444" },
        { name: "Education", percentage: 35, color: "#3b82f6" },
        { name: "Personal", percentage: 25, color: "#f59e0b" }
      ],
      postingSchedule: [
        { platform: "Instagram", frequency: "4x/week", bestTimes: ["11 AM EST", "7 PM EST"] },
        { platform: "TikTok", frequency: "5x/week", bestTimes: ["6 PM EST", "9 PM EST"] },
        { platform: "YouTube", frequency: "1x/week", bestTimes: ["Saturday 2 PM EST"] }
      ],
      contentTypes: [
        { type: "Short videos", percentage: 60 },
        { type: "Photos/Graphics", percentage: 25 },
        { type: "Long-form videos", percentage: 15 }
      ],
      keyFeatures: [
        "Beginner-friendly posting schedule",
        "Content idea bank (50+ ideas)",
        "Basic engagement strategies",
        "Growth tracking templates"
      ],
      monthlyGoals: [
        { metric: "Total followers", target: "+500" },
        { metric: "Engagement rate", target: "5%" },
        { metric: "Content consistency", target: "90%" }
      ]
    },
    {
      id: "seasonal-marketing-calendar",
      name: "Seasonal Marketing Calendar",
      description: "Year-round content calendar aligned with holidays, events, and seasonal trends",
      category: "calendar",
      tier: "pro",
      duration: "365 days",
      platforms: ["Multi-platform", "Instagram", "Facebook", "TikTok"],
      contentPillars: [
        { name: "Seasonal Content", percentage: 40, color: "#ef4444" },
        { name: "Holiday Marketing", percentage: 30, color: "#3b82f6" },
        { name: "Industry Events", percentage: 20, color: "#f59e0b" },
        { name: "Evergreen Content", percentage: 10, color: "#10b981" }
      ],
      postingSchedule: [
        { platform: "Instagram", frequency: "Daily", bestTimes: ["11 AM EST", "2 PM EST", "7 PM EST"] },
        { platform: "Facebook", frequency: "5x/week", bestTimes: ["10 AM EST", "3 PM EST"] },
        { platform: "TikTok", frequency: "Daily", bestTimes: ["6 PM EST", "9 PM EST"] }
      ],
      contentTypes: [
        { type: "Seasonal campaigns", percentage: 50 },
        { type: "Event-based content", percentage: 30 },
        { type: "Evergreen posts", percentage: 20 }
      ],
      keyFeatures: [
        "12-month content calendar",
        "Holiday marketing strategies",
        "Seasonal trend predictions",
        "Event-based content planning"
      ],
      monthlyGoals: [
        { metric: "Seasonal engagement", target: "+25%" },
        { metric: "Holiday sales", target: "+50%" },
        { metric: "Brand awareness", target: "+30%" }
      ]
    },
    {
      id: "enterprise-transformation-masterpiece",
      name: "���� Enterprise Transformation Masterpiece",
      description: "The ultimate comprehensive transformation framework - the crown jewel of strategic consulting",
      category: "platform",
      tier: "agency",
      duration: "365 days",
      platforms: ["Multi-platform", "LinkedIn", "YouTube", "Blog", "Email", "Podcast"],
      contentPillars: [
        { name: "Strategic Vision", percentage: 30, color: "#3b82f6" },
        { name: "Innovation Leadership", percentage: 25, color: "#ef4444" },
        { name: "Market Disruption", percentage: 25, color: "#f59e0b" },
        { name: "Thought Leadership", percentage: 20, color: "#10b981" }
      ],
      postingSchedule: [
        { platform: "LinkedIn", frequency: "Daily", bestTimes: ["9 AM EST", "1 PM EST", "5 PM EST"] },
        { platform: "YouTube", frequency: "2x/week", bestTimes: ["Tuesday 10 AM EST", "Friday 2 PM EST"] },
        { platform: "Blog", frequency: "Weekly", bestTimes: ["Wednesday 11 AM EST"] },
        { platform: "Email", frequency: "Bi-weekly", bestTimes: ["Tuesday 10 AM EST"] },
        { platform: "Podcast", frequency: "Weekly", bestTimes: ["Thursday 12 PM EST"] }
      ],
      contentTypes: [
        { type: "Strategic insights", percentage: 35 },
        { type: "Case studies", percentage: 25 },
        { type: "Innovation reports", percentage: 20 },
        { type: "Executive interviews", percentage: 20 }
      ],
      keyFeatures: [
        "Complete digital transformation framework",
        "Multi-channel executive presence",
        "Industry thought leadership positioning",
        "C-suite networking strategy",
        "Innovation pipeline development",
        "Market disruption analysis"
      ],
      monthlyGoals: [
        { metric: "Executive connections", target: "+200" },
        { metric: "Industry recognition", target: "Top 1%" },
        { metric: "Speaking opportunities", target: "5+ events" },
        { metric: "Media mentions", target: "50+ articles" }
      ]
    },
    {
      id: "ultimate-course-creation-empire",
      name: "🎓 Ultimate Course Creation Empire",
      description: "The complete monetizable course creation framework for building 7-figure education businesses",
      category: "content-pillars",
      tier: "agency",
      duration: "180 days",
      platforms: ["YouTube", "LinkedIn", "Email", "Course Platform", "Social Media"],
      contentPillars: [
        { name: "Educational Excellence", percentage: 40, color: "#3b82f6" },
        { name: "Business Development", percentage: 30, color: "#ef4444" },
        { name: "Community Building", percentage: 20, color: "#f59e0b" },
        { name: "Success Stories", percentage: 10, color: "#10b981" }
      ],
      postingSchedule: [
        { platform: "YouTube", frequency: "3x/week", bestTimes: ["Tuesday 2 PM EST", "Thursday 2 PM EST", "Saturday 11 AM EST"] },
        { platform: "LinkedIn", frequency: "Daily", bestTimes: ["9 AM EST", "3 PM EST"] },
        { platform: "Email", frequency: "3x/week", bestTimes: ["Tuesday 9 AM EST", "Thursday 9 AM EST", "Saturday 10 AM EST"] },
        { platform: "Course Platform", frequency: "Weekly", bestTimes: ["Sunday 6 PM EST"] }
      ],
      contentTypes: [
        { type: "Course modules", percentage: 50 },
        { type: "Marketing content", percentage: 25 },
        { type: "Community engagement", percentage: 15 },
        { type: "Success showcases", percentage: 10 }
      ],
      keyFeatures: [
        "7-figure course monetization strategy",
        "Advanced learning experience design",
        "Automated sales funnel system",
        "Community-driven growth engine",
        "Premium pricing optimization",
        "Scalable delivery framework"
      ],
      monthlyGoals: [
        { metric: "Course revenue", target: "$100K+" },
        { metric: "Student enrollment", target: "500+ students" },
        { metric: "Completion rate", target: "85%" },
        { metric: "Student satisfaction", target: "4.9/5 rating" }
      ]
    }
  ];

  // Helper function to check if user can access a template based on subscription tier
  const canAccessTemplate = (template: ContentTemplate): boolean => {
    if (template.tier === 'free') return true;
    if (template.tier === 'pro') return isPremium;
    if (template.tier === 'agency') {
      return subscriptionPlan === 'agency pro' || subscriptionPlan === 'enterprise';
    }
    return false;
  };

  const completedGoals = strategyGoals.filter(goal => goal.completed).length;
  const totalGoals = strategyGoals.length;
  const overallProgress = totalGoals > 0 && !isNaN(completedGoals) && !isNaN(totalGoals) ?
    Math.round((completedGoals / totalGoals) * 100) : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "var(--color-error)";
      case "medium": return "var(--color-warning)";
      case "low": return "var(--color-success)";
      default: return "var(--text-tertiary)";
    }
  };

  const formatDeadline = (date: Date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "No deadline";
    }

    const diffInDays = Math.ceil((date.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    if (isNaN(diffInDays)) return "Invalid date";
    if (diffInDays < 0) return "Overdue";
    if (diffInDays === 0) return "Due today";
    if (diffInDays === 1) return "Due tomorrow";
    if (diffInDays < 7) return `${diffInDays} days left`;
    if (diffInDays < 30) return `${Math.ceil(diffInDays / 7)} weeks left`;
    return `${Math.ceil(diffInDays / 30)} months left`;
  };

  return (
    <div className="space-y-8">
      <TabHeader
        title="Content Strategy Planner"
        subtitle="AI-powered strategic planning with competitive insights"
        icon={<Target />}
        badge="Pro Planning"
        actions={
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowTemplatesModal(true)}
            >
              <Settings className="w-4 h-4" />
              Templates
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                console.log("🎯 StrategyWorldClass: Create Strategy button clicked!");
                console.log("onCreateStrategy prop:", onCreateStrategy);
                if (onCreateStrategy) {
                  console.log("📞 Calling onCreateStrategy...");
                  onCreateStrategy();
                } else {
                  console.error("❌ onCreateStrategy prop is missing!");
                }
              }}
            >
              <Plus className="w-4 h-4" />
              Create Strategy
            </Button>
          </div>
        }
      />

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-[var(--surface-tertiary)] p-1 rounded-xl overflow-x-auto">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "goals", label: "Goals", icon: Target },
          { id: "pillars", label: "Content Pillars", icon: Layers },
          { id: "platforms", label: "Platforms", icon: Share2 },
          { id: "campaigns", label: "Campaigns", icon: Megaphone },
          { id: "analytics", label: "Analytics", icon: TrendingUp },
          { id: "monetization", label: "Monetization", icon: TrendingUp },
          { id: "risk", label: "Risk Management", icon: Shield },
          { id: "competitors", label: "Competitors", icon: TrendingDown },
          { id: "journey", label: "Customer Journey", icon: MapPin },
          { id: "resources", label: "Resources", icon: Briefcase },
          { id: "compliance", label: "Compliance", icon: Scale },
          { id: "generated", label: "Generated Strategies", icon: FileText },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id as any)}
            className={`flex items-center space-x-2 py-[0.626rem] px-[0.842rem] rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              sidebarExpanded
                ? "text-[0.8em]" // 5% smaller when sidebar is open
                : "text-[0.958em]" // 13.8% bigger when sidebar is closed (14% - 0.2%)
            } ${
              activeSection === id
                ? "bg-[var(--brand-primary)] text-white shadow-lg"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-quaternary)]"
            }`}
          >
            <Icon className={`${
              sidebarExpanded
                ? "w-[0.89rem] h-[0.89rem]" // 5% smaller when sidebar is open
                : "w-[1.068rem] h-[1.068rem]" // 13.8% bigger when sidebar is closed (14% - 0.2%)
            }`} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Content based on active section */}
      <AnimatePresence mode="wait">
        {activeSection === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Strategy Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white mx-auto w-fit mb-4">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="heading-4 mb-2">
                  <GradientText>{String(overallProgress || 0)}%</GradientText>
                </h3>
                <p className="body-base mb-3">Goals Completed</p>
                <ProgressBar value={overallProgress || 0} color="var(--brand-primary)" />
              </Card>

              <Card className="text-center">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--color-success)] to-[var(--accent-cyan)] text-white mx-auto w-fit mb-4">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="heading-4 mb-2">
                  <GradientText>+24%</GradientText>
                </h3>
                <p className="body-base mb-3">Growth This Month</p>
                <Badge variant="success">On Track</Badge>
              </Card>

              <Card className="text-center">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--brand-secondary)] to-[var(--color-warning)] text-white mx-auto w-fit mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="heading-4 mb-2">
                  <GradientText>563K</GradientText>
                </h3>
                <p className="body-base mb-3">Total Reach</p>
                <Badge variant="info">Cross-Platform</Badge>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <QuickActionCard
                title="Create Strategy"
                description="Generate a new content strategy"
                icon={<Brain />}
                color="var(--brand-primary)"
                onClick={() => onCreateStrategy?.()}
                badge="AI-Powered"
              />
              <QuickActionCard
                title="Competitor Analysis"
                description="Analyze competitor strategies"
                icon={<BarChart3 />}
                color="var(--brand-secondary)"
                onClick={() => {}}
                badge="Pro"
              />
              <QuickActionCard
                title="Content Calendar"
                description="Plan your content schedule"
                icon={<Calendar />}
                color="var(--accent-cyan)"
                onClick={() => setActiveSection("calendar")}
              />
              <QuickActionCard
                title="Performance Report"
                description="View strategy performance"
                icon={<Award />}
                color="var(--color-success)"
                onClick={() => {}}
                badge="Analytics"
              />
            </div>

            {/* Recent Goals */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="heading-4">Active Goals</h3>
                  <p className="body-base">Track your strategic objectives</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveSection("goals")}>
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {strategyGoals.slice(0, 3).map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center space-x-4 p-4 rounded-xl bg-[var(--surface-tertiary)] hover:bg-[var(--surface-quaternary)] transition-all duration-200"
                  >
                    <div className="flex-shrink-0">
                      {goal.completed ? (
                        <CheckCircle className="w-6 h-6 text-[var(--color-success)]" />
                      ) : (
                        <Circle className="w-6 h-6 text-[var(--text-tertiary)]" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--text-primary)] mb-1">
                        {goal.title}
                      </h4>
                      <div className="flex items-center space-x-4">
                        <ProgressBar
                          value={goal.progress || 0}
                          size="sm"
                          color={
                            (goal.progress || 0) >= 80 ? "var(--color-success)" :
                            (goal.progress || 0) >= 50 ? "var(--color-warning)" :
                            "var(--color-error)"
                          }
                        />
                        <span className="text-sm text-[var(--text-secondary)]">
                          {goal.progress || 0}%
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <Badge
                        variant={
                          goal.priority === "high" ? "error" :
                          goal.priority === "medium" ? "warning" :
                          "success"
                        }
                      >
                        {goal.priority}
                      </Badge>
                      {goal.deadline && (
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">
                          {formatDeadline(goal.deadline)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {activeSection === "goals" && (
          <motion.div
            key="goals"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="heading-3">Strategic Goals</h3>
                <p className="body-base">Manage and track your content strategy objectives</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (!user) return;
                    try {
                      setGoalsLoading(true);
                      const goals = await goalsService.getUserGoals(user.uid);
                      setStrategyGoals(goals);
                    } catch (error) {
                      console.error('Failed to refresh goals:', error);
                    } finally {
                      setGoalsLoading(false);
                    }
                  }}
                  disabled={goalsLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${goalsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowAddGoal(true)}
                >
                  <Plus className="w-4 h-4" />
                  Start from Scratch
                </Button>
              </div>
            </div>

            {/* Add Goal Form */}
            <AnimatePresence>
              {showAddGoal && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card>
                    <h4 className="heading-4 mb-4">Create New Goal</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Goal Title"
                          placeholder="e.g., Increase YouTube subscribers by 50K"
                          value={newGoalTitle}
                          onChange={setNewGoalTitle}
                        />
                        <div>
                          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                            Category
                          </label>
                          <select
                            className="input-base"
                            value={newGoalCategory}
                            onChange={(e) => setNewGoalCategory(e.target.value as 'strategy' | 'content' | 'growth' | 'engagement')}
                          >
                            <option value="strategy">Strategy</option>
                            <option value="content">Content</option>
                            <option value="growth">Growth</option>
                            <option value="engagement">Engagement</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Description"
                          placeholder="Describe your goal in detail..."
                          value={newGoalDescription}
                          onChange={setNewGoalDescription}
                        />
                        <div>
                          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                            Priority
                          </label>
                          <select
                            className="input-base"
                            value={newGoalPriority}
                            onChange={(e) => setNewGoalPriority(e.target.value as 'low' | 'medium' | 'high')}
                          >
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-4">
                      <Button
                        variant="primary"
                        onClick={async () => {
                          if (!user || !newGoalTitle.trim()) return;

                          try {
                            const newGoal = {
                              title: newGoalTitle.trim(),
                              description: newGoalDescription.trim() || 'No description provided',
                              category: newGoalCategory,
                              priority: newGoalPriority,
                              completed: false,
                              progress: 0,
                              createdAt: new Date().toISOString(),
                              source: 'manual',
                              dueDate: null
                            };

                            const savedGoal = await goalsService.saveGoal(user.uid, newGoal);
                            setStrategyGoals(prev => [savedGoal, ...prev]);

                            // Reset form
                            setNewGoalTitle('');
                            setNewGoalDescription('');
                            setNewGoalCategory('strategy');
                            setNewGoalPriority('medium');
                            setShowAddGoal(false);
                          } catch (error) {
                            console.error('Failed to save goal:', error);
                          }
                        }}
                        disabled={!newGoalTitle.trim()}
                      >
                        <Save className="w-4 h-4" />
                        Save Goal
                      </Button>
                      <Button variant="ghost" onClick={() => setShowAddGoal(false)}>
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Goals List */}
            <div className="space-y-4">
              {goalsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-[var(--text-secondary)]">Loading goals...</span>
                </div>
              ) : strategyGoals.length === 0 ? (
                <Card>
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Strategic Goals Yet</h3>
                    <p className="text-[var(--text-secondary)] mb-4">
                      Save goals from the Content Strategy Planner to track your progress.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => setActiveSection('generated')}
                      className="mx-auto"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Strategy Plan
                    </Button>
                  </div>
                </Card>
              ) : (
                strategyGoals.map((goal) => (
                  <Card key={goal.id} variant="hover">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 pt-1">
                        {goal.completed ? (
                          <CheckCircle className="w-6 h-6 text-[var(--color-success)]" />
                        ) : (
                          <Circle className="w-6 h-6 text-[var(--text-tertiary)]" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className={`font-semibold text-lg ${
                              goal.completed ? "line-through text-[var(--text-tertiary)]" : "text-[var(--text-primary)]"
                            }`}>
                              {goal.title}
                            </h4>
                            <p className="text-[var(--text-secondary)] mt-1">
                              {goal.description}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                goal.priority === "high" ? "error" :
                                goal.priority === "medium" ? "warning" :
                                "success"
                              }
                            >
                              {goal.priority}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {!goal.completed && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-[var(--text-secondary)]">Progress</span>
                              <span className="text-sm font-medium text-[var(--text-primary)]">
                                {goal.progress || 0}%
                              </span>
                            </div>
                            <ProgressBar
                              value={goal.progress || 0}
                              color={
                                (goal.progress || 0) >= 80 ? "var(--color-success)" :
                                (goal.progress || 0) >= 50 ? "var(--color-warning)" :
                                "var(--color-error)"
                              }
                            />
                            {goal.deadline && (
                              <p className="text-sm text-[var(--text-tertiary)]">
                                Due: {formatDeadline(goal.deadline)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeSection === "pillars" && (
          <motion.div
            key="pillars"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="heading-3">Content Pillars</h3>
                <p className="body-base">Save and manage content pillars from your generated strategies</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="info">{savedContentPillars.length} pillars</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (!user) return;
                    try {
                      setPillarsLoading(true);
                      const pillars = await contentPillarsService.getUserContentPillars(user.uid);
                      setSavedContentPillars(pillars);
                    } catch (error) {
                      console.error('Failed to refresh content pillars:', error);
                    } finally {
                      setPillarsLoading(false);
                    }
                  }}
                  disabled={pillarsLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${pillarsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowCreatePillar(true)}
                >
                  <Plus className="w-4 h-4" />
                  Start from Scratch
                </Button>
              </div>
            </div>

            {/* Grouping Controls */}
            {!pillarsLoading && savedContentPillars.length > 0 && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-sm font-medium text-[var(--text-secondary)]">Group:</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {availableGroups.map((group) => (
                      <Button
                        key={group}
                        variant={selectedGroup === group ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedGroup(group)}
                      >
                        {group}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateGroup(true)}
                  >
                    <Plus className="w-4 h-4" />
                    New Group
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowManageGroups(true)}
                  >
                    <Settings className="w-4 h-4" />
                    Manage
                  </Button>
                </div>
              </div>
            )}

            {pillarsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-[var(--text-secondary)]">Loading content pillars...</span>
              </div>
            ) : savedContentPillars.length === 0 ? (
              <EmptyState
                icon={<Layers className="w-8 h-8" />}
                title="No Content Pillars Yet"
                description="Create individual content pillars to build your content strategy foundation"
                actionLabel="Create Strategy Plan"
                actionIcon={<Plus className="w-4 h-4" />}
                onAction={() => setActiveSection("generated")}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {savedContentPillars.map((pillar) => (
                  <Card key={pillar.id} variant="hover">
                    <div className="flex items-start space-x-4">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                        style={{ backgroundColor: `hsl(${pillar.id.charCodeAt(0) * 137.5 % 360}, 70%, 50%)` }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="heading-4">{pillar.pillarName}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="neutral" className="text-xs">
                              {pillar.source || 'Strategy'}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="body-base mb-4">{pillar.description}</p>

                        {pillar.keywords && pillar.keywords.length > 0 && (
                          <div className="mb-3">
                            <span className="text-sm text-[var(--text-tertiary)] block mb-2">Keywords</span>
                            <div className="flex flex-wrap gap-2">
                              {pillar.keywords.slice(0, 3).map((keyword) => (
                                <Badge key={keyword} variant="neutral" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                              {pillar.keywords.length > 3 && (
                                <Badge variant="neutral" className="text-xs">
                                  +{pillar.keywords.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-[var(--text-tertiary)]">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(pillar.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span>{pillar.postingFrequency}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeSection === "platforms" && (
          <motion.div
            key="platforms"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="heading-3">Platform Strategies</h3>
                <p className="body-base">Save and manage platform-specific strategies</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="info">{savedPlatformStrategies.length} strategies</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (!user) return;
                    try {
                      setPlatformsLoading(true);
                      const strategies = await platformStrategiesService.getUserPlatformStrategies(user.uid);
                      setSavedPlatformStrategies(strategies);
                    } catch (error) {
                      console.error('Failed to refresh platform strategies:', error);
                    } finally {
                      setPlatformsLoading(false);
                    }
                  }}
                  disabled={platformsLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${platformsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowCreatePlatformStrategy(true)}
                >
                  <Plus className="w-4 h-4" />
                  Start from Scratch
                </Button>
              </div>
            </div>

            {/* Grouping Controls */}
            {!platformsLoading && savedPlatformStrategies.length > 0 && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-sm font-medium text-[var(--text-secondary)]">Group:</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {availableGroups.map((group) => (
                      <Button
                        key={group}
                        variant={selectedGroup === group ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedGroup(group)}
                      >
                        {group}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateGroup(true)}
                >
                  <Plus className="w-4 h-4" />
                  New Group
                </Button>
              </div>
            )}

            {platformsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-[var(--text-secondary)]">Loading platform strategies...</span>
              </div>
            ) : savedPlatformStrategies.length === 0 ? (
              <EmptyState
                icon={<Share2 className="w-8 h-8" />}
                title="No Platform Strategies Yet"
                description="Create platform-specific strategies to optimize your content for each social media platform"
                actionLabel="Create Strategy Plan"
                actionIcon={<Plus className="w-4 h-4" />}
                onAction={() => setActiveSection("generated")}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {savedPlatformStrategies.map((strategy) => (
                  <Card key={strategy.id} variant="hover">
                    <div className="flex items-start space-x-4">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 mt-1 bg-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="heading-4">{strategy.platform}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="neutral" className="text-xs">
                              {strategy.source || 'Strategy'}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="body-base mb-4">{strategy.focus}</p>

                        <div className="mb-3">
                          <span className="text-sm text-[var(--text-tertiary)] block mb-2">Content Types</span>
                          <div className="flex flex-wrap gap-2">
                            {strategy.contentTypes.slice(0, 3).map((type) => (
                              <Badge key={type} variant="neutral" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                            {strategy.contentTypes.length > 3 && (
                              <Badge variant="neutral" className="text-xs">
                                +{strategy.contentTypes.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-[var(--text-tertiary)]">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(strategy.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span>{strategy.postingFrequency}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeSection === "campaigns" && (
          <motion.div
            key="campaigns"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="heading-3">Campaign Strategies</h3>
                <p className="body-base">Save and manage campaign frameworks</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="info">{savedCampaignStrategies.length} campaigns</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (!user) return;
                    try {
                      setCampaignsLoading(true);
                      const campaigns = await campaignStrategiesService.getUserCampaignStrategies(user.uid);
                      setSavedCampaignStrategies(campaigns);
                    } catch (error) {
                      console.error('Failed to refresh campaign strategies:', error);
                    } finally {
                      setCampaignsLoading(false);
                    }
                  }}
                  disabled={campaignsLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${campaignsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateCampaign(true)}
                >
                  <Plus className="w-4 h-4" />
                  Start from Scratch
                </Button>
              </div>
            </div>

            {/* Grouping Controls */}
            {!campaignsLoading && savedCampaignStrategies.length > 0 && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-sm font-medium text-[var(--text-secondary)]">Group:</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {availableGroups.map((group) => (
                      <Button
                        key={group}
                        variant={selectedGroup === group ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedGroup(group)}
                      >
                        {group}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateGroup(true)}
                >
                  <Plus className="w-4 h-4" />
                  New Group
                </Button>
              </div>
            )}

            {campaignsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-[var(--text-secondary)]">Loading campaign strategies...</span>
              </div>
            ) : savedCampaignStrategies.length === 0 ? (
              <EmptyState
                icon={<Megaphone className="w-8 h-8" />}
                title="No Campaign Strategies Yet"
                description="Create campaign frameworks to organize and plan your marketing campaigns effectively"
                actionLabel="Create Strategy Plan"
                actionIcon={<Plus className="w-4 h-4" />}
                onAction={() => setActiveSection("generated")}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {savedCampaignStrategies.map((campaign) => (
                  <Card key={campaign.id} variant="hover">
                    <div className="flex items-start space-x-4">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 mt-1 bg-purple-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="heading-4">{campaign.campaignName}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                campaign.status === 'active' ? 'success' :
                                campaign.status === 'completed' ? 'neutral' :
                                campaign.status === 'paused' ? 'warning' :
                                'info'
                              }
                              className="text-xs"
                            >
                              {campaign.status}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="body-base mb-4">{campaign.objective}</p>

                        <div className="mb-3">
                          <span className="text-sm text-[var(--text-tertiary)] block mb-2">Platforms</span>
                          <div className="flex flex-wrap gap-2">
                            {campaign.platforms.slice(0, 3).map((platform) => (
                              <Badge key={platform} variant="neutral" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                            {campaign.platforms.length > 3 && (
                              <Badge variant="neutral" className="text-xs">
                                +{campaign.platforms.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-[var(--text-tertiary)]">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span>{campaign.timeline}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeSection === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2 text-[var(--brand-primary)]" />
                  Analytics & Performance Metrics
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Saved KPIs and performance metrics from content strategies
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {savedAnalyticsMetrics.length} saved
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (!user) return;
                    try {
                      setAnalyticsLoading(true);
                      const metrics = await analyticsService.getAnalyticsMetrics(user.uid);
                      setSavedAnalyticsMetrics(metrics);
                    } catch (error) {
                      console.error('Failed to refresh analytics:', error);
                    } finally {
                      setAnalyticsLoading(false);
                    }
                  }}
                  disabled={analyticsLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${analyticsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateMetric(true)}
                >
                  <Plus className="w-4 h-4" />
                  Start from Scratch
                </Button>
              </div>
            </div>

            {/* Grouping Controls */}
            {!analyticsLoading && savedAnalyticsMetrics.length > 0 && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-sm font-medium text-[var(--text-secondary)]">Group:</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {availableGroups.map((group) => (
                      <Button
                        key={group}
                        variant={selectedGroup === group ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedGroup(group)}
                      >
                        {group}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateGroup(true)}
                >
                  <Plus className="w-4 h-4" />
                  New Group
                </Button>
              </div>
            )}

            {analyticsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]"></div>
                <span className="ml-3 text-[var(--text-secondary)]">Loading analytics metrics...</span>
              </div>
            ) : savedAnalyticsMetrics.length === 0 ? (
              <EmptyState
                icon={<BarChart3 className="w-8 h-8" />}
                title="No Analytics Metrics Yet"
                description="Create custom analytics metrics to track your content performance and strategy success"
                actionLabel="Create Strategy Plan"
                actionIcon={<Plus className="w-4 h-4" />}
                onAction={() => setActiveSection("generated")}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {savedAnalyticsMetrics.map((metric) => (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                    <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            {metric.type === 'primary' ? (
                              <BarChart3 className="w-4 h-4 text-white" />
                            ) : (
                              <TrendingUp className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div>
                            <h5 className="font-semibold text-[var(--text-primary)] text-lg">{metric.title}</h5>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={metric.type === 'primary' ? 'success' : 'warning'} className="text-xs">
                                {metric.type === 'primary' ? 'Primary KPI' : 'Advanced Metric'}
                              </Badge>
                              <span className="text-xs text-[var(--text-tertiary)]">
                                {metric.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3 mb-3">
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                          {metric.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                        <span>Created: {new Date(metric.createdAt).toLocaleDateString()}</span>
                        {metric.source && (
                          <span className="bg-[var(--surface-tertiary)] px-2 py-1 rounded-full">
                            {metric.source}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeSection === "monetization" && (
          <motion.div
            key="monetization"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-[var(--brand-primary)]" />
                  Monetization Strategy
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Revenue generation and monetization strategies
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {savedMonetizationItems.length} saved
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (!user) return;
                    try {
                      setMonetizationLoading(true);
                      const items = await monetizationService.getMonetizationItems(user.uid);
                      setSavedMonetizationItems(items);
                    } catch (error) {
                      console.error('Failed to refresh monetization:', error);
                    } finally {
                      setMonetizationLoading(false);
                    }
                  }}
                  disabled={monetizationLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${monetizationLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Sub-sub-tabs for monetization */}
            <div className="flex space-x-1 bg-[var(--surface-tertiary)] p-1 rounded-xl overflow-x-auto">
              {[
                { id: "revenue-streams", label: "Revenue Streams", icon: TrendingUp },
                { id: "pricing-strategy", label: "Pricing Strategy", icon: Target },
                { id: "conversion-funnel", label: "Conversion Funnel", icon: BarChart3 },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveMonetizationSubTab(id as any)}
                  className={`flex items-center space-x-2 py-2 px-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap text-sm ${
                    activeMonetizationSubTab === id
                      ? "bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-primary)]/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {monetizationLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]"></div>
                <span className="ml-3 text-[var(--text-secondary)]">Loading monetization items...</span>
              </div>
            ) : (
              <>
                {/* Revenue Streams Sub-sub-tab */}
                {activeMonetizationSubTab === 'revenue-streams' && (
                  <div className="space-y-4">
                    {savedMonetizationItems.filter(item => item.type === 'revenue-stream').length === 0 ? (
                      <div className="text-center py-8">
                        <TrendingUp className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3" />
                        <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                          No Revenue Streams Yet
                        </h4>
                        <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-sm mx-auto">
                          Generate monetization strategies and save revenue streams using the 3-dot menu.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {savedMonetizationItems.filter(item => item.type === 'revenue-stream').map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative"
                          >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-white" />
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-[var(--text-primary)] text-lg">{item.title}</h5>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge variant="success" className="text-xs">Revenue Stream</Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button variant="ghost" size="sm">
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3 mb-3">
                                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                              <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                                <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                                {item.source && (
                                  <span className="bg-[var(--surface-tertiary)] px-2 py-1 rounded-full">
                                    {item.source}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Pricing Strategy Sub-sub-tab */}
                {activeMonetizationSubTab === 'pricing-strategy' && (
                  <div className="space-y-4">
                    {savedMonetizationItems.filter(item => item.type === 'pricing-strategy').length === 0 ? (
                      <div className="text-center py-8">
                        <Target className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3" />
                        <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                          No Pricing Strategies Yet
                        </h4>
                        <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-sm mx-auto">
                          Generate monetization strategies and save pricing strategies using the 3-dot menu.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {savedMonetizationItems.filter(item => item.type === 'pricing-strategy').map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative"
                          >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center">
                                    <Target className="w-4 h-4 text-white" />
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-[var(--text-primary)] text-lg">{item.title}</h5>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge variant="warning" className="text-xs">Pricing Strategy</Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button variant="ghost" size="sm">
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3 mb-3">
                                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                              <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                                <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                                {item.source && (
                                  <span className="bg-[var(--surface-tertiary)] px-2 py-1 rounded-full">
                                    {item.source}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Conversion Funnel Sub-sub-tab */}
                {activeMonetizationSubTab === 'conversion-funnel' && (
                  <div className="space-y-4">
                    {savedMonetizationItems.filter(item => item.type === 'conversion-funnel').length === 0 ? (
                      <div className="text-center py-8">
                        <BarChart3 className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3" />
                        <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                          No Conversion Funnels Yet
                        </h4>
                        <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-sm mx-auto">
                          Generate monetization strategies and save conversion funnels using the 3-dot menu.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {savedMonetizationItems.filter(item => item.type === 'conversion-funnel').map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative"
                          >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                            <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <BarChart3 className="w-4 h-4 text-white" />
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-[var(--text-primary)] text-lg">{item.title}</h5>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge variant="primary" className="text-xs">Conversion Funnel</Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button variant="ghost" size="sm">
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3 mb-3">
                                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                              <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                                <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                                {item.source && (
                                  <span className="bg-[var(--surface-tertiary)] px-2 py-1 rounded-full">
                                    {item.source}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {activeSection === "risk" && (
          <motion.div
            key="risk"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-[var(--brand-primary)]" />
                  Risk Management Plans
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Saved risk mitigation and crisis management strategies
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {savedRiskManagementItems.length} saved
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (!user) return;
                    try {
                      setRiskManagementLoading(true);
                      const items = await riskManagementService.getUserRiskManagementItems(user.uid);
                      setSavedRiskManagementItems(items);
                    } catch (error) {
                      console.error('Failed to refresh risk management items:', error);
                    } finally {
                      setRiskManagementLoading(false);
                    }
                  }}
                  disabled={riskManagementLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${riskManagementLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setActiveSection("generated")}
                >
                  <Plus className="w-4 h-4" />
                  Start from Scratch
                </Button>
              </div>
            </div>

            {riskManagementLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]"></div>
                <span className="ml-3 text-[var(--text-secondary)]">Loading risk management plans...</span>
              </div>
            ) : savedRiskManagementItems.length === 0 ? (
              <EmptyState
                icon={<AlertTriangle className="w-8 h-8" />}
                title="No Risk Management Plans Yet"
                description="Generate content strategies and save risk management plans using the 3-dot menu on risk management sections."
                actionLabel="Create Strategy Plan"
                actionIcon={<Plus className="w-4 h-4" />}
                onAction={() => setActiveSection("generated")}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {savedRiskManagementItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity blur-sm"></div>
                    <div className="relative bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                            {item.type === 'Crisis Management' && <AlertTriangle className="w-4 h-4 text-white" />}
                            {item.type === 'Content Backups' && <Save className="w-4 h-4 text-white" />}
                            {item.type === 'Platform Changes' && <RefreshCw className="w-4 h-4 text-white" />}
                            {item.type === 'Burnout Prevention' && <Users className="w-4 h-4 text-white" />}
                          </div>
                          <div>
                            <h5 className="font-semibold text-[var(--text-primary)] text-lg">{item.name}</h5>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {item.type}
                              </Badge>
                              {item.priority && (
                                <Badge
                                  variant={item.priority === 'critical' ? 'destructive' : item.priority === 'high' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {item.priority}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={async () => {
                              try {
                                await riskManagementService.deleteRiskManagementItem(item.id, user?.uid || 'local');
                                setSavedRiskManagementItems(prev => prev.filter(i => i.id !== item.id));
                              } catch (error) {
                                console.error('Failed to delete risk management item:', error);
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-600"
                            title="Delete risk plan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg p-3">
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-3">
                          {item.content}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3 text-xs text-[var(--text-tertiary)]">
                        <span>Created {new Date(item.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeSection === "competitors" && (
          <motion.div
            key="competitors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="heading-3">Competitor Analysis</h3>
                <p className="body-base">Save and manage competitor intelligence</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="info">{savedCompetitorAnalyses.length} analyses</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (!user) return;
                    try {
                      setCompetitorsLoading(true);
                      const analyses = await competitorAnalysisService.getUserCompetitorAnalyses(user.uid);
                      setSavedCompetitorAnalyses(analyses);
                    } catch (error) {
                      console.error('Failed to refresh competitor analyses:', error);
                    } finally {
                      setCompetitorsLoading(false);
                    }
                  }}
                  disabled={competitorsLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${competitorsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setActiveSection("generated")}
                >
                  <Plus className="w-4 h-4" />
                  Start from Scratch
                </Button>
              </div>
            </div>

            {competitorsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-[var(--text-secondary)]">Loading competitor analyses...</span>
              </div>
            ) : savedCompetitorAnalyses.length === 0 ? (
              <EmptyState
                icon={<TrendingDown className="w-8 h-8" />}
                title="No Competitor Analyses Yet"
                description="Generate competitor analysis from content strategies to build your competitive intelligence"
                actionLabel="Create Strategy Plan"
                actionIcon={<Plus className="w-4 h-4" />}
                onAction={() => setActiveSection("generated")}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {savedCompetitorAnalyses.map((analysis) => (
                  <Card key={analysis.id} variant="hover">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="heading-4">{analysis.competitorName}</h4>
                      <Badge variant="neutral" className="text-xs">{analysis.competitorType}</Badge>
                    </div>
                    <p className="body-base mb-3">{analysis.industry}</p>
                    <div className="flex items-center justify-between text-sm text-[var(--text-tertiary)]">
                      <span>Audience: {analysis.audienceSize}</span>
                      <span>Engagement: {analysis.engagementRate}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeSection === "journey" && (
          <motion.div
            key="journey"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="heading-3">Customer Journey</h3>
                <p className="body-base">Save and manage customer journey maps</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="info">{savedCustomerJourneys.length} journeys</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (!user) return;
                    try {
                      setJourneysLoading(true);
                      const journeys = await customerJourneyService.getUserCustomerJourneys(user.uid);
                      setSavedCustomerJourneys(journeys);
                    } catch (error) {
                      console.error('Failed to refresh customer journeys:', error);
                    } finally {
                      setJourneysLoading(false);
                    }
                  }}
                  disabled={journeysLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${journeysLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setActiveSection("generated")}
                >
                  <Plus className="w-4 h-4" />
                  Start from Scratch
                </Button>
              </div>
            </div>

            {journeysLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-[var(--text-secondary)]">Loading customer journeys...</span>
              </div>
            ) : savedCustomerJourneys.length === 0 ? (
              <Card className="text-center py-8">
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white mx-auto w-fit mb-4">
                  <MapPin className="w-12 h-12" />
                </div>
                <h3 className="heading-4 mb-2">No Customer Journeys Yet</h3>
                <p className="body-base mb-4 text-[var(--text-secondary)]">
                  Generate customer journey maps from content strategies to understand your audience path
                </p>
                <Button variant="primary" onClick={() => setActiveSection("generated")}>
                  <Plus className="w-4 h-4" />
                  Generate Content Strategy
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {savedCustomerJourneys.map((journey) => (
                  <Card key={journey.id} variant="hover">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="heading-4">{journey.journeyName}</h4>
                      <Badge variant="neutral" className="text-xs">{journey.industry}</Badge>
                    </div>
                    <p className="body-base mb-3">{journey.overallObjective}</p>
                    <div className="flex items-center justify-between text-sm text-[var(--text-tertiary)]">
                      <span>Persona: {journey.targetPersona}</span>
                      <span>{journey.stages.length} stages</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeSection === "resources" && (
          <motion.div
            key="resources"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="heading-3">Resource Planning</h3>
                <p className="body-base">Save and manage resource plans and budgets</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="info">{savedResourcePlans.length} plans</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (!user) return;
                    try {
                      setResourcesLoading(true);
                      const plans = await resourcePlanningService.getUserResourcePlans(user.uid);
                      setSavedResourcePlans(plans);
                    } catch (error) {
                      console.error('Failed to refresh resource plans:', error);
                    } finally {
                      setResourcesLoading(false);
                    }
                  }}
                  disabled={resourcesLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${resourcesLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setActiveSection("generated")}
                >
                  <Plus className="w-4 h-4" />
                  Start from Scratch
                </Button>
              </div>
            </div>

            {resourcesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-[var(--text-secondary)]">Loading resource plans...</span>
              </div>
            ) : savedResourcePlans.length === 0 ? (
              <Card className="text-center py-8">
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-600 to-green-700 text-white mx-auto w-fit mb-4">
                  <Briefcase className="w-12 h-12" />
                </div>
                <h3 className="heading-4 mb-2">No Resource Plans Yet</h3>
                <p className="body-base mb-4 text-[var(--text-secondary)]">
                  Generate resource planning from content strategies to organize team and budget allocation
                </p>
                <Button variant="primary" onClick={() => setActiveSection("generated")}>
                  <Plus className="w-4 h-4" />
                  Generate Content Strategy
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {savedResourcePlans.map((plan) => (
                  <Card key={plan.id} variant="hover">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="heading-4">{plan.planName}</h4>
                      <Badge variant="neutral" className="text-xs">{plan.timeline}</Badge>
                    </div>
                    <p className="body-base mb-3">{plan.projectScope}</p>
                    <div className="flex items-center justify-between text-sm text-[var(--text-tertiary)]">
                      <span>Budget: {plan.totalBudget}</span>
                      <span>{plan.teamStructure.length} roles</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeSection === "compliance" && (
          <motion.div
            key="compliance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="heading-3">Legal & Compliance</h3>
                <p className="body-base">Save and manage compliance plans and legal guidelines</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="info">{savedCompliancePlans.length} plans</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (!user) return;
                    try {
                      setComplianceLoading(true);
                      const plans = await complianceService.getUserCompliancePlans(user.uid);
                      setSavedCompliancePlans(plans);
                    } catch (error) {
                      console.error('Failed to refresh compliance plans:', error);
                    } finally {
                      setComplianceLoading(false);
                    }
                  }}
                  disabled={complianceLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${complianceLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setActiveSection("generated")}
                >
                  <Plus className="w-4 h-4" />
                  Start from Scratch
                </Button>
              </div>
            </div>

            {complianceLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-[var(--text-secondary)]">Loading compliance plans...</span>
              </div>
            ) : savedCompliancePlans.length === 0 ? (
              <Card className="text-center py-8">
                <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-600 to-yellow-700 text-white mx-auto w-fit mb-4">
                  <Scale className="w-12 h-12" />
                </div>
                <h3 className="heading-4 mb-2">No Compliance Plans Yet</h3>
                <p className="body-base mb-4 text-[var(--text-secondary)]">
                  Generate compliance planning from content strategies to ensure legal and platform compliance
                </p>
                <Button variant="primary" onClick={() => setActiveSection("generated")}>
                  <Plus className="w-4 h-4" />
                  Generate Content Strategy
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {savedCompliancePlans.map((plan) => (
                  <Card key={plan.id} variant="hover">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="heading-4">{plan.planName}</h4>
                      <Badge variant="neutral" className="text-xs">{plan.auditSchedule}</Badge>
                    </div>
                    <p className="body-base mb-3">{plan.industry}</p>
                    <div className="flex items-center justify-between text-sm text-[var(--text-tertiary)]">
                      <span>Regulations: {plan.applicableRegulations.length}</span>
                      <span>Review: {new Date(plan.nextReviewDate).toLocaleDateString()}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeSection === "generated" && (
          <motion.div
            key="generated"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {strategyView === 'list' ? (
              // Generated Strategies List View
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="heading-3">Generated Strategies</h3>
                    <p className="body-base">View and manage your AI-generated content strategies</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="info">{generatedStrategies?.length || 0} strategies</Badge>
                    <Button
                      variant="primary"
                      onClick={() => onCreateStrategy?.()}
                    >
                      <Plus className="w-4 h-4" />
                      Generate New Strategy
                    </Button>
                  </div>
                </div>

                {generatedStrategies.length === 0 ? (
                  <Card className="text-center py-12">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white mx-auto w-fit mb-4">
                      <Brain className="w-12 h-12" />
                    </div>
                    <h3 className="heading-4 mb-2">No Strategies Generated Yet</h3>
                    <p className="body-base mb-4 text-[var(--text-secondary)]">
                      Create your first AI-powered content strategy to get started
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => onCreateStrategy?.()}
                    >
                      <Plus className="w-4 h-4" />
                      Generate Your First Strategy
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {generatedStrategies.map((strategy) => (
                      <Card key={strategy.id} variant="hover" className="group">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="heading-4 group-hover:text-[var(--brand-primary)] transition-colors">
                                {strategy.name}
                              </h4>
                              {strategy.niche && (
                                <Badge variant="secondary" className="mt-1">
                                  {strategy.niche}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedStrategy(strategy);
                                  setStrategyView('details');
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onExportStrategyData?.(strategy)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteStrategy?.(strategy.id)}
                                className="text-[var(--color-error)] hover:text-[var(--color-error)] hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <span className="text-sm text-[var(--text-tertiary)] block mb-1">Target Audience</span>
                              <p className="text-sm text-[var(--text-primary)] line-clamp-2">
                                {strategy.strategy.targetAudienceOverview}
                              </p>
                            </div>

                            <div>
                              <span className="text-sm text-[var(--text-tertiary)] block mb-2">Content Pillars</span>
                              <div className="flex flex-wrap gap-2">
                                {strategy.strategy.contentPillars.slice(0, 3).map((pillar, index) => (
                                  <Badge key={index} variant="neutral" className="text-xs">
                                    {pillar.pillarName}
                                  </Badge>
                                ))}
                                {strategy.strategy.contentPillars.length > 3 && (
                                  <Badge variant="neutral" className="text-xs">
                                    +{String(Math.max(0, (strategy.strategy.contentPillars?.length || 0) - 3))} more
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-[var(--text-tertiary)]">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{strategy.createdAt.toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span>{strategy.strategy.goals?.length || 0} goals</span>
                                <span>{strategy.strategy.contentPillars?.length || 0} pillars</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[var(--border-secondary)]">
                            <Button
                              variant="primary"
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                setSelectedStrategy(strategy);
                                setStrategyView('details');
                              }}
                            >
                              <Eye className="w-4 h-4" />
                              View Full Strategy
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            ) : (
              // Strategy Details View - Full PremiumContentStrategy Component
              selectedStrategy && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        onClick={() => setStrategyView('list')}
                      >
                        ← Back to Strategies
                      </Button>
                      <div>
                        <h3 className="heading-3">{selectedStrategy.name}</h3>
                        <p className="body-base text-[var(--text-secondary)]">
                          Generated on {selectedStrategy.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="secondary"
                        onClick={() => onExportStrategyData?.(selectedStrategy)}
                      >
                        <Download className="w-4 h-4" />
                        Export
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => onViewStrategy?.(selectedStrategy)}
                      >
                        <Eye className="w-4 h-4" />
                        Open in Strategy Planner
                      </Button>
                    </div>
                  </div>

                  {/* Full PremiumContentStrategy Component */}
                  <PremiumContentStrategy
                    strategyPlan={selectedStrategy.strategy}
                    isLoading={false}
                    error={null}
                    onGenerateStrategy={() => {}}
                    savedStrategies={[]}
                    isPremium={isPremium}
                    onUpgrade={onUpgrade}
                    onSendToCanvas={onSendToCanvas}
                    onSendStrategyMindMap={onSendStrategyMindMap}
                    onAddToCalendar={onAddToCalendar}
                  />
                </div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Templates Modal */}
      <AnimatePresence>
        {showTemplatesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTemplatesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-secondary)]">
                <div>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)]">Content Strategy Templates</h3>
                  <p className="text-[var(--text-secondary)] mt-1">
                    Choose from proven frameworks to kickstart your content strategy
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTemplatesModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Template Categories Filter */}
              <div className="p-6 border-b border-[var(--border-secondary)]">
                <div className="flex flex-wrap gap-3">
                  {['all', 'calendar', 'platform', 'content-pillars', 'posting-schedule'].map((category) => (
                    <Button
                      key={category}
                      variant={selectedTemplate?.category === category || (category === 'all' && !selectedTemplate) ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedTemplate(category === 'all' ? null : contentTemplates.find(t => t.category === category) || null)}
                    >
                      {category === 'all' ? 'All Templates' :
                       category === 'content-pillars' ? 'Content Pillars' :
                       category === 'posting-schedule' ? 'Posting Schedules' :
                       category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Templates Grid */}
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contentTemplates
                    .filter(template => !selectedTemplate || template.category === selectedTemplate.category)
                    .map((template) => (
                    <motion.div
                      key={template.id}
                      layout
                      className="group relative"
                    >
                      <Card variant="hover" className="h-full flex flex-col">
                        {/* Template Header */}
                        <div className="space-y-3 flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                                  {template.name}
                                </h4>
                                <Badge variant={
                                  template.tier === 'agency' ? 'error' :
                                  template.tier === 'pro' ? 'primary' : 'success'
                                }>
                                  {template.tier === 'agency' ? 'AGENCY' :
                                   template.tier === 'pro' ? 'PRO' : 'FREE'}
                                </Badge>
                              </div>
                              <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                                {template.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-[var(--text-tertiary)]">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{template.duration}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Share2 className="w-3 h-3" />
                                  <span>{template.platforms?.length || 0} platforms</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Content Pillars Preview */}
                          <div>
                            <span className="text-xs font-medium text-[var(--text-tertiary)] block mb-2">Content Mix</span>
                            <div className="flex space-x-1 h-2 rounded-full overflow-hidden bg-[var(--surface-tertiary)]">
                              {template.contentPillars.map((pillar, index) => (
                                <div
                                  key={index}
                                  style={{
                                    backgroundColor: pillar.color,
                                    width: `${pillar.percentage || 0}%`
                                  }}
                                  title={`${pillar.name}: ${pillar.percentage || 0}%`}
                                />
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {template.contentPillars.slice(0, 2).map((pillar, index) => (
                                <span key={index} className="text-xs text-[var(--text-tertiary)]">
                                  {pillar.name} {pillar.percentage || 0}%
                                </span>
                              ))}
                              {template.contentPillars.length > 2 && (
                                <span className="text-xs text-[var(--text-tertiary)]">
                                  +{String(Math.max(0, (template.contentPillars?.length || 0) - 2))} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Key Features */}
                          <div>
                            <span className="text-xs font-medium text-[var(--text-tertiary)] block mb-2">Key Features</span>
                            <div className="space-y-1">
                              {template.keyFeatures.slice(0, 3).map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <CheckCircle className="w-3 h-3 text-[var(--color-success)] flex-shrink-0" />
                                  <span className="text-xs text-[var(--text-secondary)]">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Goals Preview */}
                          <div>
                            <span className="text-xs font-medium text-[var(--text-tertiary)] block mb-2">Monthly Goals</span>
                            <div className="grid grid-cols-2 gap-2">
                              {template.monthlyGoals.slice(0, 2).map((goal, index) => (
                                <div key={index} className="text-center p-2 bg-[var(--surface-tertiary)] rounded-lg">
                                  <div className="text-xs font-medium text-[var(--brand-primary)]">
                                    {goal.target}
                                  </div>
                                  <div className="text-xs text-[var(--text-tertiary)]">
                                    {goal.metric}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Template Actions */}
                        <div className="pt-4 border-t border-[var(--border-secondary)] mt-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="primary"
                              size="sm"
                              className="flex-1"
                              disabled={!canAccessTemplate(template)}
                              onClick={() => {
                                if (!canAccessTemplate(template)) {
                                  onUpgrade?.();
                                } else {
                                  // Apply the template
                                  onApplyTemplate?.(template);
                                  setShowTemplatesModal(false);
                                }
                              }}
                            >
                              {!canAccessTemplate(template) ? (
                                <>
                                  <Rocket className="w-4 h-4" />
                                  Upgrade to Use
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4" />
                                  Use Template
                                </>
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Preview template logic
                                console.log('Previewing template:', template.name);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>

                      {/* Locked template overlay */}
                      {!canAccessTemplate(template) && (
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                          <div className="text-center p-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-full flex items-center justify-center mx-auto mb-2">
                              <Rocket className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-sm font-medium text-white">
                              {template.tier === 'agency' ? 'AGENCY Template' :
                               template.tier === 'pro' ? 'PRO Template' : 'Locked Template'}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-[var(--border-secondary)] bg-[var(--surface-secondary)]">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-[var(--text-secondary)]">
                    {(contentTemplates?.filter(t => t.tier === 'free')?.length || 0)} free templates • {(contentTemplates?.filter(t => t.tier === 'pro')?.length || 0)} pro templates
                  </div>
                  <div className="flex items-center space-x-3">
                    {!isPremium && (
                      <Button variant="secondary" onClick={onUpgrade}>
                        <Rocket className="w-4 h-4" />
                        Upgrade for Pro Templates
                      </Button>
                    )}
                    <Button variant="ghost" onClick={() => setShowTemplatesModal(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Group Management Modal */}
      <AnimatePresence>
        {showManageGroups && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowManageGroups(false)}
          >
            <motion.div
              className="bg-[var(--card-background)] border border-[var(--border-primary)] rounded-xl p-6 w-full max-w-md mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-4 flex items-center space-x-2">
                  <Grid3X3 className="w-5 h-5" />
                  <span>Manage Groups</span>
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowManageGroups(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableGroups.filter(group => group !== 'All' && group !== 'Ungrouped').map((group) => (
                  <div key={group} className="flex items-center justify-between p-3 bg-[var(--surface-tertiary)] rounded-lg">
                    {editingGroup === group ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <Input
                          value={editGroupName}
                          onChange={(e) => setEditGroupName(e.target.value)}
                          placeholder="Group name..."
                          className="flex-1"
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRenameGroup(group, editGroupName)}
                          disabled={!editGroupName.trim() || availableGroups.includes(editGroupName.trim())}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingGroup(null);
                            setEditGroupName('');
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-medium text-[var(--text-primary)]">{group}</span>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingGroup(group);
                              setEditGroupName(group);
                            }}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteGroup(group)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {availableGroups.filter(group => group !== 'All' && group !== 'Ungrouped').length === 0 && (
                  <div className="text-center py-8 text-[var(--text-secondary)]">
                    <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No custom groups yet</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end mt-6">
                <Button variant="ghost" onClick={() => setShowManageGroups(false)}>
                  Done
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Group Creation Modal */}
      <AnimatePresence>
        {showCreateGroup && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateGroup(false)}
          >
            <motion.div
              className="bg-[var(--card-background)] border border-[var(--border-primary)] rounded-xl p-6 w-full max-w-md mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-4 flex items-center space-x-2">
                  <FolderOpen className="w-5 h-5" />
                  <span>Create New Group</span>
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateGroup(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Group Name
                  </label>
                  <Input
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Enter group name..."
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <Button variant="ghost" onClick={() => {
                    setShowCreateGroup(false);
                    setNewGroupName('');
                  }}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleCreateGroup}
                    disabled={!newGroupName.trim() || availableGroups.includes(newGroupName.trim())}
                  >
                    Create Group
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Pillar Creation Modal */}
      <AnimatePresence>
        {showCreatePillar && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreatePillar(false)}
          >
            <motion.div
              className="bg-[var(--card-background)] border border-[var(--border-primary)] rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-4 flex items-center space-x-2">
                  <Layers className="w-5 h-5" />
                  <span>Create Content Pillar</span>
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCreatePillar(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Pillar Name *
                  </label>
                  <Input
                    value={newPillar.name}
                    onChange={(e) => setNewPillar(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Educational Content, Behind the Scenes..."
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Description
                  </label>
                  <Input
                    value={newPillar.description}
                    onChange={(e) => setNewPillar(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this pillar covers..."
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                      Color
                    </label>
                    <input
                      type="color"
                      value={newPillar.color}
                      onChange={(e) => setNewPillar(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full h-10 rounded-lg border border-[var(--border-primary)] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                      Percentage (%)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={newPillar.percentage}
                      onChange={(e) => setNewPillar(prev => ({ ...prev, percentage: parseInt(e.target.value) || 25 }))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Group
                  </label>
                  <select
                    value={newPillar.group}
                    onChange={(e) => setNewPillar(prev => ({ ...prev, group: e.target.value }))}
                    className="w-full p-2 border border-[var(--border-primary)] rounded-lg bg-[var(--surface-secondary)] text-[var(--text-primary)]"
                  >
                    {availableGroups.filter(g => g !== 'All').map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <Button variant="ghost" onClick={() => setShowCreatePillar(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSavePillar}
                    disabled={!newPillar.name.trim()}
                  >
                    Create Pillar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Platform Strategy Creation Modal */}
      <AnimatePresence>
        {showCreatePlatformStrategy && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreatePlatformStrategy(false)}
          >
            <motion.div
              className="bg-[var(--card-background)] border border-[var(--border-primary)] rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-4 flex items-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span>Create Platform Strategy</span>
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCreatePlatformStrategy(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Platform *
                  </label>
                  <select
                    value={newPlatformStrategy.platform}
                    onChange={(e) => setNewPlatformStrategy(prev => ({ ...prev, platform: e.target.value }))}
                    className="w-full p-2 border border-[var(--border-primary)] rounded-lg bg-[var(--surface-secondary)] text-[var(--text-primary)]"
                  >
                    <option value="">Select a platform...</option>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Pinterest">Pinterest</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Focus Area
                  </label>
                  <Input
                    value={newPlatformStrategy.focus}
                    onChange={(e) => setNewPlatformStrategy(prev => ({ ...prev, focus: e.target.value }))}
                    placeholder="e.g., Brand awareness, Lead generation..."
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Posting Frequency
                  </label>
                  <select
                    value={newPlatformStrategy.postingFrequency}
                    onChange={(e) => setNewPlatformStrategy(prev => ({ ...prev, postingFrequency: e.target.value }))}
                    className="w-full p-2 border border-[var(--border-primary)] rounded-lg bg-[var(--surface-secondary)] text-[var(--text-primary)]"
                  >
                    <option value="">Select frequency...</option>
                    <option value="Daily">Daily</option>
                    <option value="3-4x/week">3-4x per week</option>
                    <option value="2-3x/week">2-3x per week</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-weekly">Bi-weekly</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Engagement Strategy
                  </label>
                  <Input
                    value={newPlatformStrategy.engagementStrategy}
                    onChange={(e) => setNewPlatformStrategy(prev => ({ ...prev, engagementStrategy: e.target.value }))}
                    placeholder="How will you engage your audience..."
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Target Audience
                  </label>
                  <Input
                    value={newPlatformStrategy.audienceTargeting}
                    onChange={(e) => setNewPlatformStrategy(prev => ({ ...prev, audienceTargeting: e.target.value }))}
                    placeholder="Describe your target audience..."
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Group
                  </label>
                  <select
                    value={newPlatformStrategy.group}
                    onChange={(e) => setNewPlatformStrategy(prev => ({ ...prev, group: e.target.value }))}
                    className="w-full p-2 border border-[var(--border-primary)] rounded-lg bg-[var(--surface-secondary)] text-[var(--text-primary)]"
                  >
                    {availableGroups.filter(g => g !== 'All').map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <Button variant="ghost" onClick={() => setShowCreatePlatformStrategy(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSavePlatformStrategy}
                    disabled={!newPlatformStrategy.platform.trim()}
                  >
                    Create Strategy
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campaign Strategy Creation Modal */}
      <AnimatePresence>
        {showCreateCampaign && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateCampaign(false)}
          >
            <motion.div
              className="bg-[var(--card-background)] border border-[var(--border-primary)] rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-4 flex items-center space-x-2">
                  <Megaphone className="w-5 h-5" />
                  <span>Create Campaign Strategy</span>
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateCampaign(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Campaign Name *
                  </label>
                  <Input
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Summer Product Launch..."
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Campaign Type
                  </label>
                  <select
                    value={newCampaign.type}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-2 border border-[var(--border-primary)] rounded-lg bg-[var(--surface-secondary)] text-[var(--text-primary)]"
                  >
                    <option value="">Select type...</option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="Brand Awareness">Brand Awareness</option>
                    <option value="Lead Generation">Lead Generation</option>
                    <option value="Seasonal">Seasonal</option>
                    <option value="Event Promotion">Event Promotion</option>
                    <option value="User Generated Content">User Generated Content</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Description
                  </label>
                  <Input
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the campaign..."
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={newCampaign.startDate}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={newCampaign.endDate}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Budget
                  </label>
                  <select
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full p-2 border border-[var(--border-primary)] rounded-lg bg-[var(--surface-secondary)] text-[var(--text-primary)]"
                  >
                    <option value="">Select budget range...</option>
                    <option value="Under $1,000">Under $1,000</option>
                    <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000+">$10,000+</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Target Audience
                  </label>
                  <Input
                    value={newCampaign.targetAudience}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, targetAudience: e.target.value }))}
                    placeholder="Who is this campaign targeting..."
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Group
                  </label>
                  <select
                    value={newCampaign.group}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, group: e.target.value }))}
                    className="w-full p-2 border border-[var(--border-primary)] rounded-lg bg-[var(--surface-secondary)] text-[var(--text-primary)]"
                  >
                    {availableGroups.filter(g => g !== 'All').map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <Button variant="ghost" onClick={() => setShowCreateCampaign(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSaveCampaign}
                    disabled={!newCampaign.name.trim()}
                  >
                    Create Campaign
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analytics Metric Creation Modal */}
      <AnimatePresence>
        {showCreateMetric && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateMetric(false)}
          >
            <motion.div
              className="bg-[var(--card-background)] border border-[var(--border-primary)] rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-4 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Create Analytics Metric</span>
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateMetric(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Metric Title *
                  </label>
                  <Input
                    value={newMetric.title}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Monthly Engagement Rate..."
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Description
                  </label>
                  <Input
                    value={newMetric.description}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What does this metric measure..."
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                      Type
                    </label>
                    <select
                      value={newMetric.type}
                      onChange={(e) => setNewMetric(prev => ({ ...prev, type: e.target.value as 'primary' | 'advanced' }))}
                      className="w-full p-2 border border-[var(--border-primary)] rounded-lg bg-[var(--surface-secondary)] text-[var(--text-primary)]"
                    >
                      <option value="primary">Primary</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                      Category
                    </label>
                    <select
                      value={newMetric.category}
                      onChange={(e) => setNewMetric(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 border border-[var(--border-primary)] rounded-lg bg-[var(--surface-secondary)] text-[var(--text-primary)]"
                    >
                      <option value="">Select category...</option>
                      <option value="Engagement">Engagement</option>
                      <option value="Reach">Reach</option>
                      <option value="Conversion">Conversion</option>
                      <option value="Growth">Growth</option>
                      <option value="Revenue">Revenue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Target/Goal
                  </label>
                  <Input
                    value={newMetric.target}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, target: e.target.value }))}
                    placeholder="e.g., 5%, 1000 followers, $10,000..."
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Group
                  </label>
                  <select
                    value={newMetric.group}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, group: e.target.value }))}
                    className="w-full p-2 border border-[var(--border-primary)] rounded-lg bg-[var(--surface-secondary)] text-[var(--text-primary)]"
                  >
                    {availableGroups.filter(g => g !== 'All').map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <Button variant="ghost" onClick={() => setShowCreateMetric(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSaveMetric}
                    disabled={!newMetric.title.trim()}
                  >
                    Create Metric
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StrategyWorldClass;
