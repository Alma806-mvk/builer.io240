import React, { useState, useEffect } from "react";
import {
  SparklesIcon,
  LockClosedIcon,
  TrendingUpIcon,
  ClockIcon,
  StarIcon,
  BoltIcon,
  ChartBarIcon,
  PenToolIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "./IconComponents";

interface UpgradePromptProps {
  trigger:
    | "generation_limit"
    | "premium_feature"
    | "analytics"
    | "export"
    | "templates";
  currentUsage?: number;
  limit?: number;
  onUpgrade: () => void;
  onDismiss: () => void;
}

interface FeatureShowcase {
  title: string;
  description: string;
  value: string;
  icon: React.ReactNode;
  preview?: string;
}

export const SmartUpgradePrompt: React.FC<UpgradePromptProps> = ({
  trigger,
  currentUsage = 0,
  limit = 25,
  onUpgrade,
  onDismiss,
}) => {
  const [showDemo, setShowDemo] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const usagePercentage = (currentUsage / limit) * 100;

  const getPromptContent = () => {
    switch (trigger) {
      case "generation_limit":
        return {
          title: "You're almost out of generations! 🔥",
          subtitle: `${currentUsage}/${limit} used this month`,
          description:
            "Upgrade to Pro for unlimited AI generations and advanced features",
          urgency:
            usagePercentage >= 90
              ? "high"
              : usagePercentage >= 70
                ? "medium"
                : "low",
          features: [
            {
              title: "Unlimited AI Generations",
              description: "Create as much content as you want, when you want",
              value: "∞ generations/month",
              icon: <BoltIcon className="h-6 w-6" />,
              preview: "No more limits - create freely",
            },
            {
              title: "Premium Templates",
              description: "Access 500+ professionally designed templates",
              value: "500+ templates",
              icon: <PenToolIcon className="h-6 w-6" />,
              preview: "High-converting designs",
            },
            {
              title: "Advanced Analytics",
              description:
                "Track performance and optimize your content strategy",
              value: "Detailed insights",
              icon: <ChartBarIcon className="h-6 w-6" />,
              preview: "See what works best",
            },
          ],
        };

      case "premium_feature":
        return {
          title: "Unlock Premium Features 🚀",
          subtitle: "Take your content to the next level",
          description: "Access advanced AI tools used by top content creators",
          urgency: "medium",
          features: [
            {
              title: "AI Content Optimization",
              description:
                "Automatically improve your content for maximum engagement",
              value: "40% more engagement",
              icon: <TrendingUpIcon className="h-6 w-6" />,
              preview: "AI-powered improvements",
            },
            {
              title: "Batch Generation",
              description:
                "Create multiple variations of content simultaneously",
              value: "10x faster creation",
              icon: <ClockIcon className="h-6 w-6" />,
              preview: "Save hours of work",
            },
            {
              title: "Brand Voice Training",
              description:
                "Train AI to match your unique brand voice perfectly",
              value: "Consistent branding",
              icon: <SparklesIcon className="h-6 w-6" />,
              preview: "Perfect brand consistency",
            },
          ],
        };

      case "analytics":
        return {
          title: "See What's Working 📊",
          subtitle: "Unlock detailed performance insights",
          description:
            "Make data-driven decisions to grow your audience faster",
          urgency: "medium",
          features: [
            {
              title: "Performance Tracking",
              description: "Track views, engagement, and conversion rates",
              value: "Real-time metrics",
              icon: <ChartBarIcon className="h-6 w-6" />,
              preview: "Live performance data",
            },
            {
              title: "Audience Insights",
              description: "Understand your audience demographics and behavior",
              value: "Deep audience data",
              icon: <StarIcon className="h-6 w-6" />,
              preview: "Know your audience better",
            },
            {
              title: "Optimization Recommendations",
              description: "Get AI-powered suggestions to improve performance",
              value: "Smart recommendations",
              icon: <BoltIcon className="h-6 w-6" />,
              preview: "Actionable insights",
            },
          ],
        };

      case "export":
        return {
          title: "Export in Any Format 📁",
          subtitle: "Professional file formats for any platform",
          description: "Get your content in the exact format you need",
          urgency: "low",
          features: [
            {
              title: "Multiple Formats",
              description: "Export as PNG, JPG, PDF, MP4, and more",
              value: "15+ formats",
              icon: <PenToolIcon className="h-6 w-6" />,
              preview: "Any format you need",
            },
            {
              title: "High Resolution",
              description: "4K quality for professional use",
              value: "4K resolution",
              icon: <SparklesIcon className="h-6 w-6" />,
              preview: "Crystal clear quality",
            },
            {
              title: "Bulk Export",
              description: "Export multiple files at once",
              value: "Time-saving bulk export",
              icon: <ClockIcon className="h-6 w-6" />,
              preview: "Export everything at once",
            },
          ],
        };

      case "templates":
        return {
          title: "500+ Premium Templates 🎨",
          subtitle: "Professional designs that convert",
          description: "Access templates used by top brands and influencers",
          urgency: "medium",
          features: [
            {
              title: "Trending Templates",
              description: "Always updated with the latest design trends",
              value: "Fresh designs weekly",
              icon: <TrendingUpIcon className="h-6 w-6" />,
              preview: "Stay ahead of trends",
            },
            {
              title: "Industry-Specific",
              description: "Templates for every niche and industry",
              value: "50+ categories",
              icon: <StarIcon className="h-6 w-6" />,
              preview: "Perfect for your niche",
            },
            {
              title: "Customizable",
              description: "Fully editable to match your brand",
              value: "Complete customization",
              icon: <PenToolIcon className="h-6 w-6" />,
              preview: "Make it yours",
            },
          ],
        };

      default:
        return {
          title: "Upgrade to Pro",
          subtitle: "Unlock all features",
          description: "Get unlimited access to all premium features",
          urgency: "low" as const,
          features: [],
        };
    }
  };

  const content = getPromptContent();

  const getUrgencyStyles = () => {
    switch (content.urgency) {
      case "high":
        return {
          border: "border-red-500/50",
          bg: "bg-red-500/10",
          accent: "text-red-400",
          button:
            "bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-red-500/25",
        };
      case "medium":
        return {
          border: "border-orange-500/50",
          bg: "bg-orange-500/10",
          accent: "text-orange-400",
          button:
            "bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-orange-500/25",
        };
      default:
        return {
          border: "border-sky-500/50",
          bg: "bg-sky-500/10",
          accent: "text-sky-400",
          button:
            "bg-gradient-to-r from-sky-500 to-indigo-600 hover:shadow-sky-500/25",
        };
    }
  };

  const styles = getUrgencyStyles();

  useEffect(() => {
    if (content.features.length > 1) {
      const interval = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % content.features.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [content.features.length]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-2xl ${styles.bg} border ${styles.border} rounded-3xl shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className="relative p-6 pb-0">
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

          {/* Usage Progress Bar (for generation limit) */}
          {trigger === "generation_limit" && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-300">Monthly Usage</span>
                <span className={`text-sm font-semibold ${styles.accent}`}>
                  {currentUsage}/{limit}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    usagePercentage >= 90
                      ? "bg-gradient-to-r from-red-500 to-pink-600"
                      : usagePercentage >= 70
                        ? "bg-gradient-to-r from-orange-500 to-red-500"
                        : "bg-gradient-to-r from-sky-500 to-indigo-600"
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {content.title}
            </h2>
            <p className={`text-lg ${styles.accent} mb-2`}>
              {content.subtitle}
            </p>
            <p className="text-slate-300 max-w-md mx-auto">
              {content.description}
            </p>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="p-6">
          {content.features.length > 0 && (
            <div className="mb-6">
              <div className="bg-slate-900/50 rounded-2xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div
                    className={`p-3 ${styles.bg} rounded-lg ${styles.accent}`}
                  >
                    {content.features[currentFeature]?.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {content.features[currentFeature]?.title}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {content.features[currentFeature]?.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${styles.accent}`}>
                      {content.features[currentFeature]?.value}
                    </p>
                    {content.features[currentFeature]?.preview && (
                      <p className="text-slate-500 text-xs">
                        {content.features[currentFeature]?.preview}
                      </p>
                    )}
                  </div>
                </div>

                {/* Feature indicators */}
                {content.features.length > 1 && (
                  <div className="flex justify-center space-x-2">
                    {content.features.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentFeature
                            ? styles.accent.replace("text-", "bg-")
                            : "bg-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Social Proof */}
          <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="text-center">
                <p className="font-semibold text-white">50K+</p>
                <p className="text-slate-400">Happy Users</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-white">4.9★</p>
                <p className="text-slate-400">Rating</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-white">300%</p>
                <p className="text-slate-400">Avg Engagement Boost</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onUpgrade}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg ${styles.button} flex items-center justify-center space-x-2`}
            >
              <span>Upgrade to Pro - $29/month</span>
              <ArrowRightIcon className="h-4 w-4" />
            </button>
            <button
              onClick={onDismiss}
              className="px-6 py-4 rounded-xl font-semibold text-slate-300 hover:text-white transition-colors border border-slate-600 hover:border-slate-500"
            >
              Maybe Later
            </button>
          </div>

          {/* Limited Time Offer */}
          {content.urgency === "high" && (
            <div className="mt-4 text-center">
              <p className="text-red-400 text-sm font-medium">
                🔥 Limited Time: 50% off your first month!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Usage Tracking Component
export const UsageTracker: React.FC<{
  currentUsage: number;
  limit: number;
  onUpgradePrompt: () => void;
}> = ({ currentUsage, limit, onUpgradePrompt }) => {
  const percentage = (currentUsage / limit) * 100;

  useEffect(() => {
    // Show upgrade prompt at 80% usage
    if (percentage >= 80) {
      onUpgradePrompt();
    }
  }, [percentage, onUpgradePrompt]);

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg z-40">
      <div className="flex items-center space-x-3">
        <BoltIcon className="h-5 w-5 text-sky-400" />
        <div>
          <p className="text-white text-sm font-medium">
            {currentUsage}/{limit} generations used
          </p>
          <div className="w-32 bg-slate-700 rounded-full h-2 mt-1">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                percentage >= 90
                  ? "bg-red-500"
                  : percentage >= 70
                    ? "bg-orange-500"
                    : "bg-sky-500"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
        </div>
        {percentage >= 70 && (
          <button
            onClick={onUpgradePrompt}
            className="text-sky-400 hover:text-sky-300 text-xs transition-colors whitespace-nowrap"
          >
            Upgrade →
          </button>
        )}
      </div>
    </div>
  );
};

export default SmartUpgradePrompt;
