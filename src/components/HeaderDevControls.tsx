import React, { useState } from "react";
import { useOnboarding } from "../context/OnboardingContext";
import { PlayIcon, RefreshIcon, DevToolsIcon, ChevronDownIcon } from "./ProfessionalIcons";
import { AppNotifications } from "../utils/appNotifications";

interface HeaderDevControlsProps {
  className?: string;
  userPlan?: string;
  setUserPlan?: (plan: string) => void;
  refreshBilling?: () => void;
}

export const HeaderDevControls: React.FC<HeaderDevControlsProps> = ({
  className = "",
  userPlan = "free",
  setUserPlan,
  refreshBilling,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    needsOnboarding,
    showWelcome,
    showTour,
    resetOnboarding,
    completeWelcome,
    completeTour,
  } = useOnboarding();

  // Only show in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  const startOnboardingTour = () => {
    console.log("🚀 Dev: Starting onboarding tour");
    resetOnboarding();
    setIsExpanded(false);
  };

  const startTourOnly = () => {
    console.log("🎯 Dev: Starting tour only");
    completeWelcome();
    setIsExpanded(false);
  };

  const skipToEnd = () => {
    console.log("⏭️ Dev: Skipping to end");
    completeTour();
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleSubscription = () => {
    if (!setUserPlan) return;

    const plans = ["free", "creator pro", "agency pro", "enterprise"];
    const currentIndex = plans.indexOf(userPlan);
    const nextIndex = (currentIndex + 1) % plans.length;
    const nextPlan = plans[nextIndex] as "free" | "creator pro" | "agency pro" | "enterprise";
    setUserPlan(nextPlan);

    // Enable ALL premium features for any paid plan
    if (nextPlan !== "free") {
      localStorage.setItem("dev_force_premium", "true");
      localStorage.setItem("emergency_premium", "true");
    } else {
      localStorage.removeItem("dev_force_premium");
      localStorage.removeItem("emergency_premium");
    }

    // Show visual feedback
    alert(
      `⚙ Developer Mode: Switched to ${nextPlan.toUpperCase()} plan\n\nAll premium features ${nextPlan !== "free" ? "ENABLED" : "DISABLED"} across the entire app.`
    );
  };

  const testNotifications = () => {
    const testNotifications = [
      () => AppNotifications.networkError(),
      () => AppNotifications.authError(),
      () => AppNotifications.serviceUnavailable("AI Generation"),
      () => AppNotifications.quotaExceeded(),
      () => AppNotifications.operationSuccess("Content generated"),
      () => AppNotifications.creditsRunningLow(5),
      () => AppNotifications.updateAvailable(),
    ];

    // Show random notification for testing
    const randomNotification = testNotifications[Math.floor(Math.random() * testNotifications.length)];
    randomNotification();
  };

  const togglePremium = () => {
    const currentState = localStorage.getItem("dev_force_premium") === "true";
    if (currentState) {
      localStorage.removeItem("dev_force_premium");
      console.log("🔧 Premium override DISABLED");
    } else {
      localStorage.setItem("dev_force_premium", "true");
      console.log("🔧 Premium override ENABLED");
    }
    // Force refresh by triggering a re-render
    if (refreshBilling) refreshBilling();
    setTimeout(() => window.location.reload(), 100);
  };

  const forceRefresh = async () => {
    console.log("🔧 Force refreshing all premium features...");
    if (refreshBilling) await refreshBilling();
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={toggleExpanded}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/80 hover:bg-slate-600/80 border border-slate-600/50 hover:border-slate-500/70 rounded-lg text-white transition-all duration-200 text-sm font-medium backdrop-blur-sm"
        title="Developer Controls"
      >
        <DevToolsIcon size="sm" />
        <span className="hidden md:inline">Dev</span>
        <ChevronDownIcon size="sm" className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsExpanded(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-slate-300 font-semibold">
                  🔧 Dev Onboarding Controls
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-slate-400 hover:text-white text-xs"
                  title="Close"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <button
                  onClick={startOnboardingTour}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors"
                >
                  <PlayIcon className="h-4 w-4" />
                  Start Full Onboarding
                </button>

                <button
                  onClick={startTourOnly}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                >
                  <PlayIcon className="h-4 w-4" />
                  Tour Only
                </button>

                <button
                  onClick={skipToEnd}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
                >
                  <RefreshIcon className="h-4 w-4" />
                  Complete
                </button>

                {/* Orange Subscription Toggle */}
                <button
                  onClick={toggleSubscription}
                  onDoubleClick={testNotifications}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                  title="Developer: Toggle Subscription Plan (Double-click for notification tests)"
                >
                  <span className="text-base">⚙</span>
                  <span className="capitalize">
                    {userPlan === "free" ? "Free" :
                     userPlan === "creator pro" ? "Creator" :
                     userPlan === "agency pro" ? "Agency" :
                     userPlan === "enterprise" ? "Enterprise" : userPlan}
                  </span>
                  {userPlan !== "free" && <span className="text-xs opacity-75 ml-1">✨ALL</span>}
                </button>

                {/* Purple Premium Toggle Button */}
                <button
                  onClick={togglePremium}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    localStorage.getItem("dev_force_premium") === "true"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  <span className="text-base">
                    {localStorage.getItem("dev_force_premium") === "true" ? "🔓" : "🔒"}
                  </span>
                  {localStorage.getItem("dev_force_premium") === "true" ? "Premium ENABLED" : "Enable Premium"}
                </button>

                {/* Purple Notification Test Button */}
                <button
                  onClick={testNotifications}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                >
                  <span className="text-base">🔔</span>
                  Test Notifications
                </button>

                {/* Orange Force Refresh Button */}
                <button
                  onClick={forceRefresh}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm transition-colors"
                >
                  <span className="text-base">🔄</span>
                  Force Refresh
                </button>

                {/* Production Mode Button */}
                <button
                  onClick={() => {
                    const isProduction = localStorage.getItem("enable_production") === "true";
                    if (isProduction) {
                      localStorage.removeItem("enable_production");
                      console.log("🔧 Production mode DISABLED");
                    } else {
                      localStorage.setItem("enable_production", "true");
                      console.log("🔧 Production mode ENABLED");
                    }
                    setTimeout(() => window.location.reload(), 100);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    localStorage.getItem("enable_production") === "true"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <span className="text-base">
                    {localStorage.getItem("enable_production") === "true" ? "🏭" : "🚀"}
                  </span>
                  {localStorage.getItem("enable_production") === "true" ? "Production ENABLED" : "Enable Production"}
                </button>
              </div>

              <div className="border-t border-slate-700 pt-3">
                <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                  <div className="text-center">
                    <div className={showWelcome ? "text-green-400" : "text-red-400"}>
                      {showWelcome ? "🟢" : "🔴"}
                    </div>
                    <div>Welcome</div>
                  </div>
                  <div className="text-center">
                    <div className={showTour ? "text-green-400" : "text-red-400"}>
                      {showTour ? "🟢" : "🔴"}
                    </div>
                    <div>Tour</div>
                  </div>
                  <div className="text-center">
                    <div className={needsOnboarding ? "text-green-400" : "text-red-400"}>
                      {needsOnboarding ? "🟢" : "🔴"}
                    </div>
                    <div>Needs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HeaderDevControls;
