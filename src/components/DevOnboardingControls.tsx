import React, { useState } from "react";
import { useOnboarding } from "../context/OnboardingContext";
import { PlayCircleIcon, RefreshCwIcon } from "./IconComponents";

interface DevOnboardingControlsProps {
  className?: string;
}

export const DevOnboardingControls: React.FC<DevOnboardingControlsProps> = ({
  className = "",
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
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
  };

  const startTourOnly = () => {
    console.log("🎯 Dev: Starting tour only");
    completeWelcome();
  };

  const skipToEnd = () => {
    console.log("⏭️ Dev: Skipping to end");
    completeTour();
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`fixed left-4 bottom-4 z-50 ${className}`}>
      {/* Toggle Button - Always visible */}
      <div className="flex items-end gap-2">
        <button
          onClick={toggleMinimize}
          className={`p-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center ${
            isMinimized ? "mb-0" : "mb-2"
          }`}
          title={isMinimized ? "Expand Dev Controls" : "Minimize Dev Controls"}
        >
          <span className="text-xs">{isMinimized ? "🔧" : "◀"}</span>
        </button>

        {/* Main Panel */}
        <div
          className={`bg-slate-800 border border-slate-600 rounded-lg shadow-lg transition-all duration-300 ${
            isMinimized ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100"
          }`}
        >
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-slate-400 font-semibold">
                🔧 Dev Onboarding Controls
              </div>
              <button
                onClick={toggleMinimize}
                className="text-slate-400 hover:text-white text-xs ml-2"
                title="Minimize"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={startOnboardingTour}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs transition-colors"
              >
                <PlayCircleIcon className="h-3 w-3" />
                Start Full Onboarding
              </button>

              <button
                onClick={startTourOnly}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs transition-colors"
              >
                <PlayCircleIcon className="h-3 w-3" />
                Tour Only
              </button>

              <button
                onClick={skipToEnd}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded text-xs transition-colors"
              >
                <RefreshCwIcon className="h-3 w-3" />
                Complete
              </button>
            </div>

            <div className="mt-2 text-xs text-slate-500">
              <div>Welcome: {showWelcome ? "🟢" : "🔴"}</div>
              <div>Tour: {showTour ? "🟢" : "🔴"}</div>
              <div>Needs: {needsOnboarding ? "🟢" : "🔴"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevOnboardingControls;
