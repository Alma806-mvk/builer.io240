import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders,
  DollarSign,
  User,
  Target,
  Calendar,
  TrendingUp,
  Settings,
  Clock,
  Zap,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Rocket,
  Star,
  Users,
  Eye,
  Play
} from 'lucide-react';

import { Button, Card, Badge, GradientText, ProgressBar } from './ui/WorldClassComponents';
import { ComprehensiveNicheTemplate } from '../data/comprehensiveNicheTemplates';

interface UserProfile {
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  monthlyBudget: number;
  primaryGoal: 'growth' | 'monetization' | 'authority' | 'automation';
  timeCommitment: number; // hours per week
  currentSubscribers: number;
  preferredPlatforms: string[];
  hasTeam: boolean;
}

interface ConfiguratorProps {
  template: ComprehensiveNicheTemplate;
  onConfigurationChange: (config: TemplateConfiguration) => void;
  onApplyTemplate: (config: TemplateConfiguration) => void;
}

export interface TemplateConfiguration {
  userProfile: UserProfile;
  customizedRoadmap: CustomizedPhase[];
  recommendedTools: ToolRecommendation[];
  projectedOutcomes: ProjectedOutcome[];
  estimatedTimeline: number; // days
  estimatedCost: number; // monthly
  successProbability: number; // percentage
}

interface CustomizedPhase {
  id: string;
  name: string;
  duration: number; // days
  tasks: string[];
  milestones: string[];
  tools: string[];
  estimatedCost: number;
  priority: 'high' | 'medium' | 'low';
  canSkip: boolean;
  dependencies: string[];
}

interface ToolRecommendation {
  name: string;
  category: string;
  cost: number;
  priority: 'essential' | 'recommended' | 'optional';
  alternatives: string[];
  reason: string;
}

interface ProjectedOutcome {
  metric: string;
  timeframe: string;
  value: number;
  confidence: number; // percentage
  comparedToAverage: number; // percentage difference
}

const InteractiveTemplateConfigurator: React.FC<ConfiguratorProps> = ({
  template,
  onConfigurationChange,
  onApplyTemplate,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    experienceLevel: 'beginner',
    monthlyBudget: 100,
    primaryGoal: 'growth',
    timeCommitment: 10,
    currentSubscribers: 0,
    preferredPlatforms: ['YouTube'],
    hasTeam: false,
  });

  const [customizedPhases, setCustomizedPhases] = useState<CustomizedPhase[]>([]);
  const [isDragMode, setIsDragMode] = useState(false);

  // Smart Configuration Logic
  const generateCustomizedConfiguration = useMemo((): TemplateConfiguration => {
    // Adapt phases based on user profile
    const basePhases = [
      {
        id: 'setup',
        name: template.implementationRoadmap.phase1_setup.title,
        duration: template.implementationRoadmap.phase1_setup.days,
        tasks: template.implementationRoadmap.phase1_setup.dailyTasks,
        milestones: template.implementationRoadmap.phase1_setup.milestones,
        tools: ['Basic tools'],
        estimatedCost: 50,
        priority: 'high' as const,
        canSkip: false,
        dependencies: [],
      },
      {
        id: 'launch',
        name: template.implementationRoadmap.phase2_launch.title,
        duration: template.implementationRoadmap.phase2_launch.days,
        tasks: template.implementationRoadmap.phase2_launch.dailyTasks,
        milestones: template.implementationRoadmap.phase2_launch.milestones,
        tools: ['Content creation tools'],
        estimatedCost: 100,
        priority: 'high' as const,
        canSkip: false,
        dependencies: ['setup'],
      },
      {
        id: 'growth',
        name: template.implementationRoadmap.phase3_growth.title,
        duration: template.implementationRoadmap.phase3_growth.days,
        tasks: template.implementationRoadmap.phase3_growth.dailyTasks,
        milestones: template.implementationRoadmap.phase3_growth.milestones,
        tools: ['Analytics tools'],
        estimatedCost: 150,
        priority: 'medium' as const,
        canSkip: userProfile.primaryGoal !== 'growth',
        dependencies: ['launch'],
      },
      {
        id: 'scale',
        name: template.implementationRoadmap.phase4_scale.title,
        duration: template.implementationRoadmap.phase4_scale.days,
        tasks: template.implementationRoadmap.phase4_scale.dailyTasks,
        milestones: template.implementationRoadmap.phase4_scale.milestones,
        tools: ['Automation tools'],
        estimatedCost: 200,
        priority: 'low' as const,
        canSkip: userProfile.primaryGoal !== 'automation',
        dependencies: ['growth'],
      },
    ];

    // Adjust durations based on experience and time commitment
    const experienceMultiplier = {
      beginner: 1.5,
      intermediate: 1.0,
      advanced: 0.7,
    };

    const timeMultiplier = userProfile.timeCommitment >= 20 ? 0.8 : userProfile.timeCommitment >= 10 ? 1.0 : 1.3;

    const adjustedPhases = basePhases.map(phase => ({
      ...phase,
      duration: Math.round(phase.duration * experienceMultiplier[userProfile.experienceLevel] * timeMultiplier),
    }));

    // Generate tool recommendations based on budget
    const budgetTier = userProfile.monthlyBudget <= 50 ? 'starter' : 
                      userProfile.monthlyBudget <= 200 ? 'professional' : 'enterprise';

    const toolRecommendations: ToolRecommendation[] = template.toolsAndSoftware.essential.flatMap(category =>
      category.tools.map(tool => ({
        name: tool.name,
        category: category.category,
        cost: parseFloat(tool.pricing.replace(/[^0-9.]/g, '')) || 0,
        priority: userProfile.monthlyBudget >= 100 ? 'essential' as const : 'recommended' as const,
        alternatives: tool.alternatives,
        reason: `Optimal for ${userProfile.experienceLevel} level in ${category.category}`,
      }))
    ).filter(tool => 
      budgetTier === 'starter' ? tool.cost <= 50 :
      budgetTier === 'professional' ? tool.cost <= 200 : true
    );

    // Generate projected outcomes based on template and user profile
    const baseProjections = template.financialFramework.revenueProjections;
    const experienceFactor = {
      beginner: 0.7,
      intermediate: 1.0,
      advanced: 1.3,
    };

    const projectedOutcomes: ProjectedOutcome[] = [
      {
        metric: 'Subscribers',
        timeframe: '6 months',
        value: Math.round(baseProjections[1]?.subscribers * experienceFactor[userProfile.experienceLevel] || 10000),
        confidence: userProfile.experienceLevel === 'advanced' ? 85 : 
                   userProfile.experienceLevel === 'intermediate' ? 75 : 65,
        comparedToAverage: userProfile.experienceLevel === 'advanced' ? 30 : 
                          userProfile.experienceLevel === 'intermediate' ? 10 : -10,
      },
      {
        metric: 'Monthly Revenue',
        timeframe: '6 months',
        value: Math.round((baseProjections[1]?.estimatedRevenue || 1000) * experienceFactor[userProfile.experienceLevel]),
        confidence: userProfile.experienceLevel === 'advanced' ? 80 : 
                   userProfile.experienceLevel === 'intermediate' ? 70 : 60,
        comparedToAverage: userProfile.experienceLevel === 'advanced' ? 25 : 
                          userProfile.experienceLevel === 'intermediate' ? 5 : -15,
      }
    ];

    const totalDuration = adjustedPhases.reduce((sum, phase) => sum + phase.duration, 0);
    const totalCost = toolRecommendations.reduce((sum, tool) => sum + tool.cost, 0);
    const successProbability = Math.min(95, 
      (userProfile.experienceLevel === 'advanced' ? 85 : 
       userProfile.experienceLevel === 'intermediate' ? 75 : 65) +
      (userProfile.timeCommitment >= 20 ? 10 : userProfile.timeCommitment >= 10 ? 5 : 0) +
      (userProfile.monthlyBudget >= 200 ? 5 : 0)
    );

    return {
      userProfile,
      customizedRoadmap: adjustedPhases,
      recommendedTools: toolRecommendations,
      projectedOutcomes,
      estimatedTimeline: totalDuration,
      estimatedCost: totalCost,
      successProbability,
    };
  }, [template, userProfile]);

  // Update customized phases when profile changes
  useEffect(() => {
    setCustomizedPhases(generateCustomizedConfiguration.customizedRoadmap);
  }, [generateCustomizedConfiguration]);

  // Notify parent of configuration changes
  useEffect(() => {
    onConfigurationChange(generateCustomizedConfiguration);
  }, [generateCustomizedConfiguration, onConfigurationChange]);

  const steps = [
    { id: 'profile', title: 'Your Profile', icon: <User className="w-5 h-5" /> },
    { id: 'goals', title: 'Goals & Budget', icon: <Target className="w-5 h-5" /> },
    { id: 'timeline', title: 'Timeline', icon: <Calendar className="w-5 h-5" /> },
    { id: 'preview', title: 'Preview', icon: <Eye className="w-5 h-5" /> },
  ];

  // Drag and drop functionality for timeline adjustment
  const handlePhaseDrag = (draggedId: string, targetId: string) => {
    const draggedIndex = customizedPhases.findIndex(p => p.id === draggedId);
    const targetIndex = customizedPhases.findIndex(p => p.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newPhases = [...customizedPhases];
    const [draggedPhase] = newPhases.splice(draggedIndex, 1);
    newPhases.splice(targetIndex, 0, draggedPhase);
    
    setCustomizedPhases(newPhases);
  };

  const handleDurationChange = (phaseId: string, newDuration: number) => {
    setCustomizedPhases(phases =>
      phases.map(phase =>
        phase.id === phaseId ? { ...phase, duration: newDuration } : phase
      )
    );
  };

  const getSuccessColor = (probability: number) => {
    if (probability >= 80) return 'text-[var(--color-success)]';
    if (probability >= 60) return 'text-[var(--color-warning)]';
    return 'text-[var(--color-danger)]';
  };

  const getSuccessIcon = (probability: number) => {
    if (probability >= 80) return <CheckCircle className="w-4 h-4" />;
    if (probability >= 60) return <AlertCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <motion.div
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${
                index === currentStep
                  ? 'bg-[var(--brand-primary)] text-white'
                  : index < currentStep
                  ? 'bg-[var(--color-success)]20 text-[var(--color-success)]'
                  : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)]'
              }`}
              onClick={() => setCurrentStep(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {step.icon}
              <span className="font-medium text-sm">{step.title}</span>
              {index < currentStep && <CheckCircle className="w-4 h-4" />}
            </motion.div>
            {index < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] mx-2" />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Profile */}
        {currentStep === 0 && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                Tell us about yourself
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                This helps us customize the template to your specific situation and maximize your success.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="space-y-4">
                  <h4 className="font-semibold text-[var(--text-primary)]">Experience Level</h4>
                  <div className="space-y-2">
                    {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                      <label key={level} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="experience"
                          value={level}
                          checked={userProfile.experienceLevel === level}
                          onChange={(e) => setUserProfile(prev => ({ 
                            ...prev, 
                            experienceLevel: e.target.value as any 
                          }))}
                          className="text-[var(--brand-primary)]"
                        />
                        <div>
                          <div className="font-medium text-[var(--text-primary)] capitalize">{level}</div>
                          <div className="text-sm text-[var(--text-secondary)]">
                            {level === 'beginner' && 'New to content creation'}
                            {level === 'intermediate' && 'Some experience, growing'}
                            {level === 'advanced' && 'Experienced creator'}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </Card>

              <Card>
                <div className="space-y-4">
                  <h4 className="font-semibold text-[var(--text-primary)]">Current Status</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Current Subscribers/Followers
                      </label>
                      <input
                        type="number"
                        value={userProfile.currentSubscribers}
                        onChange={(e) => setUserProfile(prev => ({ 
                          ...prev, 
                          currentSubscribers: parseInt(e.target.value) || 0 
                        }))}
                        className="w-full px-3 py-2 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={userProfile.hasTeam}
                          onChange={(e) => setUserProfile(prev => ({ 
                            ...prev, 
                            hasTeam: e.target.checked 
                          }))}
                        />
                        <span className="text-sm text-[var(--text-primary)]">I have a team or plan to hire</span>
                      </label>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Step 2: Goals & Budget */}
        {currentStep === 1 && (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                Goals & Budget
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                What's your primary focus, and what's your monthly budget for tools and growth?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="space-y-4">
                  <h4 className="font-semibold text-[var(--text-primary)]">Primary Goal</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { id: 'growth', label: 'Audience Growth', icon: <TrendingUp className="w-4 h-4" /> },
                      { id: 'monetization', label: 'Make Money', icon: <DollarSign className="w-4 h-4" /> },
                      { id: 'authority', label: 'Build Authority', icon: <Star className="w-4 h-4" /> },
                      { id: 'automation', label: 'Automation', icon: <Zap className="w-4 h-4" /> },
                    ] as const).map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => setUserProfile(prev => ({ ...prev, primaryGoal: goal.id }))}
                        className={`flex items-center space-x-2 p-3 rounded-lg border transition-all ${
                          userProfile.primaryGoal === goal.id
                            ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]'
                            : 'bg-[var(--surface-secondary)] border-[var(--border-primary)] hover:bg-[var(--surface-tertiary)]'
                        }`}
                      >
                        {goal.icon}
                        <span className="text-sm font-medium">{goal.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              <Card>
                <div className="space-y-4">
                  <h4 className="font-semibold text-[var(--text-primary)]">Monthly Budget</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-[var(--text-secondary)]">Budget Slider</span>
                        <span className="font-bold text-[var(--brand-primary)]">${userProfile.monthlyBudget}/month</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="25"
                        value={userProfile.monthlyBudget}
                        onChange={(e) => setUserProfile(prev => ({ 
                          ...prev, 
                          monthlyBudget: parseInt(e.target.value) 
                        }))}
                        className="w-full h-2 bg-[var(--surface-secondary)] rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
                        <span>$0</span>
                        <span>$250</span>
                        <span>$500</span>
                        <span>$1000+</span>
                      </div>
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      {userProfile.monthlyBudget <= 50 && 'Starter budget - We\'ll focus on free tools'}
                      {userProfile.monthlyBudget > 50 && userProfile.monthlyBudget <= 200 && 'Professional budget - Good tool selection'}
                      {userProfile.monthlyBudget > 200 && 'Premium budget - Best-in-class tools'}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <div className="space-y-4">
                <h4 className="font-semibold text-[var(--text-primary)]">Time Commitment</h4>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[var(--text-secondary)]">Hours per week</span>
                    <span className="font-bold text-[var(--brand-primary)]">{userProfile.timeCommitment} hours/week</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={userProfile.timeCommitment}
                    onChange={(e) => setUserProfile(prev => ({ 
                      ...prev, 
                      timeCommitment: parseInt(e.target.value) 
                    }))}
                    className="w-full h-2 bg-[var(--surface-secondary)] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
                    <span>1h</span>
                    <span>10h</span>
                    <span>20h</span>
                    <span>40h</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Timeline Adjustment */}
        {currentStep === 2 && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                  Customize Your Timeline
                </h3>
                <p className="text-[var(--text-secondary)]">
                  Drag to reorder phases or adjust durations to fit your schedule
                </p>
              </div>
              <Button
                variant={isDragMode ? "primary" : "secondary"}
                size="sm"
                onClick={() => setIsDragMode(!isDragMode)}
              >
                <Settings className="w-4 h-4" />
                {isDragMode ? "Done Editing" : "Edit Timeline"}
              </Button>
            </div>

            <div className="space-y-4">
              {customizedPhases.map((phase, index) => (
                <motion.div
                  key={phase.id}
                  layout
                  drag={isDragMode ? "y" : false}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  whileDrag={{ scale: 1.05 }}
                  className={`bg-[var(--surface-secondary)] rounded-xl p-6 border ${
                    isDragMode ? 'cursor-move border-[var(--brand-primary)]' : 'border-[var(--border-primary)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[var(--brand-primary)]20 rounded-lg flex items-center justify-center text-[var(--brand-primary)] font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)]">{phase.name}</h4>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {phase.duration} days • {phase.tasks.length} tasks
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge 
                        variant={phase.priority === 'high' ? 'primary' : phase.priority === 'medium' ? 'warning' : 'neutral'}
                      >
                        {phase.priority} priority
                      </Badge>
                      {phase.canSkip && (
                        <Badge variant="neutral">Optional</Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Duration (days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="180"
                        value={phase.duration}
                        onChange={(e) => handleDurationChange(phase.id, parseInt(e.target.value) || 1)}
                        className="w-20 px-3 py-1 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Estimated Cost
                      </label>
                      <span className="text-[var(--color-success)] font-semibold">${phase.estimatedCost}/month</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-[var(--text-primary)] mb-2">Key Milestones:</p>
                    <div className="space-y-1">
                      {phase.milestones.slice(0, 2).map((milestone, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-[var(--color-success)]" />
                          <span className="text-[var(--text-secondary)]">{milestone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Card>
              <div className="text-center space-y-2">
                <h4 className="font-semibold text-[var(--text-primary)]">Total Timeline</h4>
                <div className="text-3xl font-bold text-[var(--brand-primary)]">
                  {customizedPhases.reduce((sum, phase) => sum + phase.duration, 0)} days
                </div>
                <p className="text-[var(--text-secondary)]">
                  Approximately {Math.round(customizedPhases.reduce((sum, phase) => sum + phase.duration, 0) / 30)} months
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Preview */}
        {currentStep === 3 && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                Your Customized Blueprint
              </h3>
              <p className="text-[var(--text-secondary)]">
                Here's your personalized roadmap based on your profile and preferences
              </p>
            </div>

            {/* Success Probability */}
            <Card variant="glow">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  {getSuccessIcon(generateCustomizedConfiguration.successProbability)}
                  <span className={`text-2xl font-bold ${getSuccessColor(generateCustomizedConfiguration.successProbability)}`}>
                    {generateCustomizedConfiguration.successProbability}% Success Probability
                  </span>
                </div>
                <p className="text-[var(--text-secondary)]">
                  Based on your experience level, budget, and time commitment
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--brand-primary)]">
                      {generateCustomizedConfiguration.estimatedTimeline} days
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">Estimated Timeline</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--color-success)]">
                      ${generateCustomizedConfiguration.estimatedCost}/mo
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">Monthly Investment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--color-warning)]">
                      {generateCustomizedConfiguration.recommendedTools.length} tools
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">Recommended Tools</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Projected Outcomes */}
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-4">Projected Outcomes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generateCustomizedConfiguration.projectedOutcomes.map((outcome, index) => (
                  <Card key={index}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-[var(--text-primary)]">{outcome.metric}</h5>
                        <span className="text-xs text-[var(--text-secondary)]">{outcome.timeframe}</span>
                      </div>
                      <div className="text-2xl font-bold text-[var(--brand-primary)]">
                        {outcome.metric.includes('Revenue') ? '$' : ''}{outcome.value.toLocaleString()}
                        {outcome.metric.includes('Revenue') ? '/mo' : ''}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">
                          {outcome.confidence}% confidence
                        </span>
                        <span className={outcome.comparedToAverage >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}>
                          {outcome.comparedToAverage >= 0 ? '+' : ''}{outcome.comparedToAverage}% vs average
                        </span>
                      </div>
                      <ProgressBar 
                        value={outcome.confidence} 
                        color="var(--brand-primary)" 
                        size="sm" 
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recommended Tools Preview */}
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-4">Your Tool Stack</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generateCustomizedConfiguration.recommendedTools.slice(0, 6).map((tool, index) => (
                  <Card key={index}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-[var(--text-primary)]">{tool.name}</h5>
                        <Badge 
                          variant={tool.priority === 'essential' ? 'primary' : tool.priority === 'recommended' ? 'warning' : 'neutral'}
                          className="text-xs"
                        >
                          {tool.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{tool.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[var(--color-success)]">
                          ${tool.cost}/mo
                        </span>
                        <span className="text-xs text-[var(--text-tertiary)]">
                          {tool.alternatives.length} alternatives
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {generateCustomizedConfiguration.recommendedTools.length > 6 && (
                <p className="text-center text-sm text-[var(--text-secondary)] mt-4">
                  +{generateCustomizedConfiguration.recommendedTools.length - 6} more tools included
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-[var(--border-primary)]">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep ? 'bg-[var(--brand-primary)] w-6' :
                index < currentStep ? 'bg-[var(--color-success)]' : 'bg-[var(--surface-tertiary)]'
              }`}
            />
          ))}
        </div>

        {currentStep < steps.length - 1 ? (
          <Button
            variant="primary"
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                // Save configuration to localStorage
                localStorage.setItem('savedTemplateConfiguration', JSON.stringify({
                  templateId: template.id,
                  configuration: generateCustomizedConfiguration,
                  savedAt: new Date().toISOString()
                }));

                // Show notification
                const notification = {
                  id: Date.now().toString(),
                  type: 'success' as const,
                  title: 'Configuration Saved! 💾',
                  message: 'Your template configuration has been saved. You can continue editing or apply it anytime.',
                  timestamp: new Date(),
                  read: false
                };

                // Add notification (would need to be passed from parent)
                console.log('Configuration saved:', notification);
              }}
            >
              <CheckCircle className="w-4 h-4" />
              Save Configuration
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(0)}
            >
              <Settings className="w-4 h-4" />
              Change Setup
            </Button>
            <Button
              variant="primary"
              onClick={() => onApplyTemplate(generateCustomizedConfiguration)}
            >
              <Rocket className="w-4 h-4" />
              Apply Template
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveTemplateConfigurator;
