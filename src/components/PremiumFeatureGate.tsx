import React, { useState, useEffect } from "react";
import { useSubscription } from "../context/SubscriptionContext";
import {
  SparklesIcon,
  LockClosedIcon,
  StarIcon,
  CheckCircleIcon,
  BoltIcon,
} from "./IconComponents";
import Paywall from "./Paywall";

interface PremiumFeatureGateProps {
  feature: string;
  featureName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradeButton?: boolean;
  upgradeMessage?: string;
}

// Feature details mapping
const FEATURE_DETAILS = {
  templates: {
    icon: "📝",
    title: "Premium Templates",
    subtitle: "High-Converting Content Patterns",
    description: "Access our exclusive library of viral content templates",
    features: [
      "50 proven high-converting templates",
      "Performance analytics for each template",
      "Platform-specific optimizations",
      "Custom template creation tools",
      "A/B testing insights",
      "Engagement prediction scores",
    ],
    value: "Used by top creators to 10x their engagement",
  },
  batchGeneration: {
    icon: "⚡",
    title: "Batch Generation",
    subtitle: "Scale Your Content Creation",
    description: "Generate multiple variations instantly",
    features: [
      "Generate 10+ variations at once",
      "Smart A/B testing suggestions",
      "Multiple tone variations",
      "Length optimization options",
      "Performance predictions",
      "Export all formats",
    ],
    value: "Save 10+ hours per week on content creation",
  },
  customPersonas: {
    icon: "🎭",
    title: "AI Personas",
    subtitle: "Custom Brand Voices",
    description: "Create consistent brand personalities",
    features: [
      "Custom brand voice personas",
      "Industry-specific language models",
      "Personality consistency across content",
      "Advanced training capabilities",
      "Voice tone analysis",
      "Brand guideline enforcement",
    ],
    value: "Maintain perfect brand voice across all content",
  },
  analytics: {
    icon: "📊",
    title: "Performance Analytics",
    subtitle: "AI-Powered Insights",
    description: "Predict and optimize content performance",
    features: [
      "Engagement score predictions",
      "Best posting time analysis",
      "Hashtag optimization",
      "Competitor benchmarking",
      "Trend forecasting",
      "ROI tracking",
    ],
    value: "Increase engagement by up to 300%",
  },
  canvas: {
    icon: "🎨",
    title: "Advanced Canvas",
    subtitle: "Professional Design Suite",
    description: "Create stunning visual content",
    features: [
      "Professional design tools",
      "Advanced layer management",
      "Custom animations",
      "Brand asset library",
      "Collaboration features",
      "Export in all formats",
    ],
    value: "Design like a pro without hiring designers",
  },
  seoOptimization: {
    icon: "🚀",
    title: "SEO Optimization",
    subtitle: "Search Engine Domination",
    description: "Optimize content for maximum reach",
    features: [
      "Keyword research and optimization",
      "Competitor content analysis",
      "Meta tag generation",
      "Search ranking predictions",
      "Content gap analysis",
      "SERP tracking",
    ],
    value: "Rank higher and get discovered by millions",
  },
};

const PremiumModal: React.FC<{
  feature: string;
  onClose: () => void;
  onUpgrade: () => void;
}> = ({ feature, onClose, onUpgrade }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  const details = FEATURE_DETAILS[feature] || FEATURE_DETAILS.templates;

  useEffect(() => {
    setIsVisible(true);

    // Cycle through features for visual appeal
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % details.features.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [details.features.length]);

  return (
    <div
      className={`fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-sky-400 to-purple-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div
        className={`relative max-w-4xl w-full transform transition-all duration-700 ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-8"}`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-20 w-12 h-12 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 border border-slate-600"
        >
          ✕
        </button>

        {/* Main modal */}
        <div className="bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl border border-slate-600/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative p-8 bg-gradient-to-r from-sky-500/20 via-purple-500/20 to-pink-500/20">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-purple-500 rounded-3xl flex items-center justify-center text-4xl shadow-2xl animate-pulse">
                {details.icon}
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-sky-300 to-purple-300 bg-clip-text text-transparent">
                {details.title}
              </h2>
              <p className="text-xl text-sky-300 font-semibold mb-3">
                {details.subtitle}
              </p>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                {details.description}
              </p>
            </div>

            {/* Value proposition badge */}
            <div className="mt-6 flex justify-center">
              <div className="px-6 py-3 bg-gradient-to-r from-emerald-500/30 to-green-500/30 border border-emerald-400/50 rounded-full">
                <p className="text-emerald-300 font-semibold text-sm flex items-center">
                  <StarIcon className="h-4 w-4 mr-2" />
                  {details.value}
                </p>
              </div>
            </div>
          </div>

          {/* Features grid */}
          <div className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              What You Get With Pro Access
            </h3>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {details.features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center p-4 rounded-xl transition-all duration-500 ${
                    index === currentFeatureIndex
                      ? "bg-gradient-to-r from-sky-500/20 to-purple-500/20 border border-sky-400/50 scale-105"
                      : "bg-slate-700/30 border border-slate-600/30"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 transition-all duration-300 ${
                      index === currentFeatureIndex
                        ? "bg-gradient-to-r from-sky-500 to-purple-500 scale-110"
                        : "bg-slate-600"
                    }`}
                  >
                    <CheckCircleIcon className="h-5 w-5 text-white" />
                  </div>
                  <span
                    className={`font-medium transition-colors duration-300 ${
                      index === currentFeatureIndex
                        ? "text-sky-300"
                        : "text-slate-300"
                    }`}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing preview */}
            <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-2xl p-6 border border-slate-600/50 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold text-xl">Creator Pro</h4>
                  <p className="text-slate-400">Unlock all premium features</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-white">$29</div>
                  <div className="text-slate-400">per month</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-4 px-6 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-semibold transition-all hover:scale-105"
              >
                Maybe Later
              </button>
              <button
                onClick={onUpgrade}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white rounded-2xl font-bold transition-all hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <BoltIcon className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                Upgrade to Pro Now
                <SparklesIcon className="h-5 w-5 ml-2 group-hover:animate-pulse" />
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-6 flex items-center justify-center space-x-6 text-slate-400 text-sm">
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-emerald-400 mr-1" />
                Cancel anytime
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-emerald-400 mr-1" />
                30-day money back
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-emerald-400 mr-1" />
                Instant access
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PremiumFeatureGate: React.FC<PremiumFeatureGateProps> = ({
  feature,
  featureName,
  children,
  fallback,
  showUpgradeButton = true,
  upgradeMessage,
}) => {
  const { canUseFeature, billingInfo } = useSubscription();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const hasAccess = canUseFeature(feature) || billingInfo?.status === "active";

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const details = FEATURE_DETAILS[feature] || FEATURE_DETAILS.templates;

  return (
    <>
      <div className="relative overflow-hidden rounded-xl">
        {/* Blurred/disabled content */}
        <div className="pointer-events-none opacity-50 filter blur-[2px] transition-all duration-300">
          {children}
        </div>

        {/* Premium overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-xl border border-slate-600/50">
          <div className="text-center p-6 max-w-sm">
            {/* Animated icon */}
            <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">{details.icon}</span>
            </div>

            {/* Premium badge */}
            <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-amber-500/30 to-yellow-500/30 border border-amber-400/50 rounded-full mb-3">
              <span className="text-amber-300 text-xs font-bold">
                👑 PREMIUM FEATURE
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {details.title}
            </h3>

            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              {upgradeMessage || details.description}
            </p>

            {showUpgradeButton && (
              <button
                onClick={() => setShowPremiumModal(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                Unlock Premium
                <BoltIcon className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Premium modal */}
      {showPremiumModal && (
        <PremiumModal
          feature={feature}
          onClose={() => setShowPremiumModal(false)}
          onUpgrade={() => {
            setShowPremiumModal(false);
            // Trigger actual upgrade flow - use proper navigation
            if (typeof window !== "undefined") {
              window.location.href = "/billing";
            }
          }}
        />
      )}
    </>
  );
};

// Convenience components for specific features
export const TemplatesGate: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <PremiumFeatureGate
    feature="templates"
    featureName="Premium Templates"
    upgradeMessage="Access 50 high-converting templates with Pro"
  >
    {children}
  </PremiumFeatureGate>
);

export const BatchGenerationGate: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <PremiumFeatureGate
    feature="batchGeneration"
    featureName="Batch Generation"
    upgradeMessage="Generate 10+ variations at once with Pro"
  >
    {children}
  </PremiumFeatureGate>
);

export const AnalyticsGate: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <PremiumFeatureGate
    feature="analytics"
    featureName="Performance Analytics"
    upgradeMessage="Get AI-powered performance predictions with Pro"
  >
    {children}
  </PremiumFeatureGate>
);

export const CustomPersonasGate: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <PremiumFeatureGate
    feature="customPersonas"
    featureName="AI Personas"
    upgradeMessage="Create custom brand voices with Pro"
  >
    {children}
  </PremiumFeatureGate>
);

export const CanvasGate: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <PremiumFeatureGate
    feature="canvas"
    featureName="Advanced Canvas"
    upgradeMessage="Unlock professional design tools with Pro"
  >
    {children}
  </PremiumFeatureGate>
);

export default PremiumFeatureGate;
