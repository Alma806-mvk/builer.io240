import React, { useState, useEffect } from "react";
import {
  MobileIcon,
  VideoContentIcon,
  BlogPostIcon,
  TargetIcon,
  EmailIcon,
  ImageIcon,
  AIIcon,
  ChartIcon,
  TrendsIcon,
  UserIcon,
  BuildingIcon,
  TeamIcon,
  HelpCircleIcon,
} from './ProfessionalIcons';
import {
  SparklesIcon,
  TrendingUpIcon,
  PenToolIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  UsersIcon,
  ClockIcon,
  BrainIcon,
} from "./IconComponents";

interface Step {
  id: number;
  title: string;
  description: string;
  value: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface EnhancedOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const EnhancedOnboarding: React.FC<EnhancedOnboardingProps> = ({
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(
    [],
  );
  const [userRole, setUserRole] = useState("");

  const steps: Step[] = [
    {
      id: 1,
      title: "Welcome to CreateGen Studio! 🎉",
      description: "Let's personalize your content creation journey",
      value: "personalization",
      icon: <SparklesIcon className="h-8 w-8" />,
      completed: false,
    },
    {
      id: 2,
      title: "What's your primary goal?",
      description: "This helps us recommend the best features for you",
      value: "goals",
      icon: <TrendingUpIcon className="h-8 w-8" />,
      completed: selectedGoals.length > 0,
    },
    {
      id: 3,
      title: "What content do you create?",
      description: "We'll customize your dashboard accordingly",
      value: "content",
      icon: <PenToolIcon className="h-8 w-8" />,
      completed: selectedContentTypes.length > 0,
    },
    {
      id: 4,
      title: "You're all set! 🚀",
      description: "Start creating amazing content with AI",
      value: "complete",
      icon: <CheckCircleIcon className="h-8 w-8" />,
      completed: true,
    },
  ];

  const goals = [
    { id: "engagement", label: "Increase Engagement", icon: TrendsIcon },
    { id: "followers", label: "Grow Followers", icon: TeamIcon },
    { id: "sales", label: "Drive Sales", icon: TargetIcon },
    { id: "brand", label: "Build Brand", icon: BuildingIcon },
    { id: "content", label: "Create Better Content", icon: AIIcon },
  ];

  const contentTypes = [
    { id: "social", label: "Social Media Posts", icon: MobileIcon },
    { id: "video", label: "Video Content", icon: VideoContentIcon },
    { id: "blog", label: "Blog Articles", icon: BlogPostIcon },
    { id: "ads", label: "Ad Campaigns", icon: TargetIcon },
    { id: "email", label: "Email Marketing", icon: EmailIcon },
    { id: "thumbnails", label: "Thumbnails", icon: ImageIcon },
  ];

  const roles = [
    { id: "creator", label: "Content Creator", icon: AIIcon },
    { id: "marketer", label: "Digital Marketer", icon: ChartIcon },
    { id: "business", label: "Business Owner", icon: BuildingIcon },
    { id: "agency", label: "Agency/Team", icon: TeamIcon },
    { id: "other", label: "Other", icon: HelpCircleIcon },
  ];

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId],
    );
  };

  const handleContentTypeToggle = (typeId: string) => {
    setSelectedContentTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId],
    );
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return selectedGoals.length > 0;
      case 2:
        return selectedContentTypes.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-sky-500 to-indigo-600 rounded-full flex items-center justify-center mb-6">
                <SparklesIcon className="h-16 w-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to CreateGen Studio!
            </h2>
            <p className="text-slate-300 text-lg max-w-md mx-auto leading-relaxed">
              Join 50,000+ creators who've boosted their content performance by{" "}
              <span className="text-sky-400 font-semibold">300%</span> with our
              AI-powered tools.
            </p>
            <div className="flex justify-center space-x-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-2">
                  <ClockIcon className="h-6 w-6 text-green-400" />
                </div>
                <p className="text-sm text-slate-400">2 min setup</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-2">
                  <BrainIcon className="h-6 w-6 text-blue-400" />
                </div>
                <p className="text-sm text-slate-400">AI-Powered</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-2">
                  <StarIcon className="h-6 w-6 text-purple-400" />
                </div>
                <p className="text-sm text-slate-400">5-star rated</p>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                What's your primary goal?
              </h2>
              <p className="text-slate-400">
                Select all that apply - we'll customize your experience
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalToggle(goal.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                    selectedGoals.includes(goal.id)
                      ? "border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/20"
                      : "border-slate-600 bg-slate-800/50 hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {React.createElement(goal.icon, { className: 'w-6 h-6' })}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{goal.label}</h3>
                    </div>
                    {selectedGoals.includes(goal.id) && (
                      <CheckCircleIcon className="h-6 w-6 text-sky-400 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                What content do you create?
              </h2>
              <p className="text-slate-400">
                We'll show you relevant templates and features
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleContentTypeToggle(type.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                    selectedContentTypes.includes(type.id)
                      ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20"
                      : "border-slate-600 bg-slate-800/50 hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {React.createElement(type.icon, { className: 'w-6 h-6' })}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{type.label}</h3>
                    </div>
                    {selectedContentTypes.includes(type.id) && (
                      <CheckCircleIcon className="h-6 w-6 text-indigo-400 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircleIcon className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              You're all set! 🚀
            </h2>
            <p className="text-slate-300 text-lg max-w-md mx-auto">
              Your personalized dashboard is ready. Start creating amazing
              content with AI in seconds!
            </p>
            <div className="bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-sky-300 font-semibold mb-2">
                🎁 Welcome Bonus
              </h3>
              <p className="text-slate-400 text-sm">
                You get 25 free AI generations to start with. Need more? Upgrade
                to Pro for unlimited access!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-700/50 shadow-2xl">
        {/* Progress Bar */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-white">Getting Started</h1>
            <button
              onClick={onSkip}
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Skip setup
            </button>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-sky-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <span
                key={step.id}
                className={`text-xs ${
                  index <= currentStep ? "text-sky-400" : "text-slate-500"
                }`}
              >
                {step.title.split(" ")[0]}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[400px] flex flex-col justify-center">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="p-6 border-t border-slate-700/50 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              currentStep === 0
                ? "text-slate-500 cursor-not-allowed"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            disabled={!isStepComplete()}
            className={`px-8 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
              isStepComplete()
                ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-sky-500/25"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            <span>
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            </span>
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOnboarding;
