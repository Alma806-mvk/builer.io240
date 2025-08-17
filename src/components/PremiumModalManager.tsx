import React, { useState, useEffect } from "react";
import {
  SparklesIcon,
  CheckCircleIcon,
  BoltIcon,
  StarIcon,
} from "./IconComponents";
import {
  createStripeCheckout,
  STRIPE_PRICE_IDS,
} from "../services/stripeCheckout";
import { auth } from "../config/firebase";
import {
  validateStripeKey,
  testStripeConnection,
} from "../utils/stripeKeyValidator";

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

interface PremiumModalProps {
  feature: string;
  isVisible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  feature,
  isVisible,
  onClose,
  onUpgrade,
}) => {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const details = FEATURE_DETAILS[feature] || FEATURE_DETAILS.templates;

  useEffect(() => {
    if (isVisible) {
      setMounted(true);
      const interval = setInterval(() => {
        setCurrentFeatureIndex((prev) => (prev + 1) % details.features.length);
      }, 2500);
      return () => clearInterval(interval);
    } else {
      setMounted(false);
    }
  }, [isVisible, details.features.length]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/90 backdrop-blur-xl z-[9999] transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-sky-400 to-purple-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite ${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Modal - Perfect viewport fit */}
      <div className="fixed inset-0 p-3 sm:p-4 flex items-center justify-center">
        <div
          className={`relative w-full max-w-4xl h-full max-h-[95vh] transform transition-all duration-500 ${mounted ? "scale-100" : "scale-95"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-slate-800/90 hover:bg-slate-700 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 border border-slate-600 shadow-xl text-lg font-bold"
          >
            ×
          </button>

          {/* Main modal with scrollable content */}
          <div className="bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-600/50 shadow-2xl h-full flex flex-col overflow-hidden">
            {/* Fixed header */}
            <div className="flex-shrink-0 p-4 sm:p-6 bg-gradient-to-r from-sky-500/20 via-purple-500/20 to-pink-500/20">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-sky-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-2xl animate-pulse">
                  {details.icon}
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-1 sm:mb-2 bg-gradient-to-r from-sky-300 to-purple-300 bg-clip-text text-transparent">
                  {details.title}
                </h2>
                <p className="text-sm sm:text-lg text-sky-300 font-semibold mb-2">
                  {details.subtitle}
                </p>
                <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto">
                  {details.description}
                </p>
              </div>

              {/* Value badge */}
              <div className="mt-3 sm:mt-4 flex justify-center">
                <div className="px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500/30 to-green-500/30 border border-emerald-400/50 rounded-full">
                  <p className="text-emerald-300 font-semibold text-xs sm:text-sm flex items-center">
                    <StarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {details.value}
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 text-center">
                  What You Get With Pro Access
                </h3>

                {/* Compact features grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 sm:mb-6">
                  {details.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-2 sm:p-3 rounded-lg transition-all duration-300 ${
                        index === currentFeatureIndex
                          ? "bg-gradient-to-r from-sky-500/20 to-purple-500/20 border border-sky-400/50"
                          : "bg-slate-700/30 border border-slate-600/30"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 transition-all duration-300 ${
                          index === currentFeatureIndex
                            ? "bg-gradient-to-r from-sky-500 to-purple-500"
                            : "bg-slate-600"
                        }`}
                      >
                        <CheckCircleIcon className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
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

                {/* Pricing */}
                <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-xl p-4 sm:p-5 border border-slate-600/50 mb-4 sm:mb-5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold text-base sm:text-lg flex items-center">
                        <span className="mr-2">👑</span>
                        Creator Pro
                      </h4>
                      <p className="text-slate-400 text-xs sm:text-sm">
                        Unlock all premium features instantly
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl md:text-3xl font-black text-white bg-gradient-to-r from-sky-300 to-purple-300 bg-clip-text text-transparent">
                        $29
                      </div>
                      <div className="text-slate-400 text-xs sm:text-sm">
                        per month
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed footer */}
            <div className="flex-shrink-0 p-4 sm:p-6 border-t border-slate-600/30">
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-3 sm:mb-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all hover:scale-105 text-sm sm:text-base"
                >
                  Maybe Later
                </button>
                <button
                  onClick={onUpgrade}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group text-sm sm:text-base"
                >
                  <BoltIcon className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                  Upgrade to Pro Now
                  <SparklesIcon className="h-4 w-4 ml-2 group-hover:animate-pulse" />
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-slate-400 text-xs">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-3 w-3 text-emerald-400 mr-1" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-3 w-3 text-emerald-400 mr-1" />
                  <span>30-day money back</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-3 w-3 text-emerald-400 mr-1" />
                  <span>Instant access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        `}
      </style>
    </div>
  );
};

// Global premium modal manager and navigation
let globalPremiumModal: {
  show: (feature: string) => void;
  hide: () => void;
} | null = null;

let globalNavigateToBilling: (() => void) | null = null;

// Function to set the billing navigation function from the main app
export const setGlobalNavigateToBilling = (navigateFn: () => void) => {
  globalNavigateToBilling = navigateFn;
};

export const PremiumModalManager: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState("templates");

  useEffect(() => {
    console.log("🚀 Initializing Premium Modal Manager...");

    const validation = validateStripeKey();

    testStripeConnection()
      .then(() => {
        console.log("✅ Stripe integration ready!");
      })
      .catch((error) => {
        console.warn("⚠️ Stripe integration issue:", error.message);
      });

    globalPremiumModal = {
      show: (feature: string) => {
        console.log("Showing premium modal for feature:", feature);
        setCurrentFeature(feature);
        setIsVisible(true);
      },
      hide: () => {
        setIsVisible(false);
      },
    };

    return () => {
      globalPremiumModal = null;
    };
  }, []);

  const handleUpgrade = () => {
    console.log("🔄 Navigating to billing page for plan selection...");

    // Close the modal first
    setIsVisible(false);

    // Navigate to billing page using the global navigation function
    if (globalNavigateToBilling) {
      globalNavigateToBilling();
    } else {
      // Fallback: try window.location as backup
      console.warn("Global navigation not available, using fallback");
      if (typeof window !== "undefined") {
        window.location.href = "/billing";
      }
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <PremiumModal
      feature={currentFeature}
      isVisible={isVisible}
      onClose={handleClose}
      onUpgrade={handleUpgrade}
    />
  );
};

// Helper function to show premium modal from anywhere
export const showPremiumModal = (feature: string) => {
  try {
    console.log("showPremiumModal called with feature:", feature);

    if (globalPremiumModal) {
      console.log("Global modal found, showing...");
      globalPremiumModal.show(feature);
    } else {
      console.warn(
        "Global premium modal not initialized yet, creating fallback...",
      );

      createFallbackModal(feature);
    }
  } catch (error) {
    console.error("Error showing premium modal:", error);

    alert(
      `🚀 Upgrade to Pro to unlock ${feature}!\n\nThis feature requires a premium subscription. Click OK to learn more about our plans.`,
    );
  }
};

// Create a simple fallback modal
function createFallbackModal(feature: string) {
  console.log("Creating fallback modal for:", feature);

  try {
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      font-family: system-ui, sans-serif;
    `;

    modal.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #1e293b, #334155);
        color: white;
        padding: 32px;
        border-radius: 16px;
        max-width: 400px;
        margin: 20px;
        text-align: center;
        border: 1px solid rgba(255,255,255,0.2);
        box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      ">
        <div style="font-size: 48px; margin-bottom: 16px;">👑</div>
        <h2 style="margin: 0 0 16px 0; color: #60a5fa; font-size: 24px;">Premium Feature</h2>
        <p style="margin: 0 0 24px 0; opacity: 0.9;">
          ${feature} requires a Pro subscription to unlock advanced AI capabilities.
        </p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
            background: #475569;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
          ">
            Maybe Later
          </button>
          <button onclick="window.location.href='/billing'" style="
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
          ">
            Upgrade to Pro
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    console.log("Fallback modal created successfully");
  } catch (modalError) {
    console.error("Failed to create fallback modal:", modalError);
    alert(`🚀 Upgrade to Pro to unlock ${feature}!`);
  }
}

export default PremiumModalManager;
